let form = document.querySelector("form");
let formDataArray = [];
var sr = 0;

const today = new Date();
const formattedDate = today.toISOString().split('T')[0];

// Set the default value of the input field to today's date
document.getElementById('date').value = formattedDate;

const itemsWithRates = {
    "MILK": 70,            // Rate in your preferred currency (e.g., INR)
    "COW MILK": 60,
    "DAHI": 100,
    "PANEER": 380,
    "MAKHAN": 560,
    "CREAM": 400,
    "KHOYA": 460,
    "LASSI": 30,
    "DESI GHEE": 640,
    "COW DESI GHEE": 750
};

// calculate and set the total amount
function setTotal() {
    let qty = document.getElementById('QTY').value;
    let rate = document.getElementById('rate').value;
    let amount = document.getElementById('amount');
    amount.value = qty * rate;
    console.log(qty, rate, qty * rate)
}

// it will update the value in the rate input as the item name changes
function handleChangeItem(e) {
    let rate = document.getElementById("rate");
    let value = e.target.value
    itemRate = itemsWithRates[value]
    rate.value = itemRate;
    console.log(value, itemRate)
    setTotal();
}

// it will add the all entry in the array and will display on then screen as the form of the table
function addvalue() {
    let date = document.getElementById('date').value;
    let item = document.getElementById('item').value;
    let QTY = document.getElementById('QTY').value;
    let rate = document.getElementById('rate').value;
    let amount = document.getElementById('amount').value;
    let chk = document.getElementById('chk').checked;

    let tableBody = document.getElementById('tableBody');

    // Create a new row element
    let newRow = document.createElement('tr');

    // Add columns (cells) to the row
    newRow.innerHTML = `
    <td>${date}</td>
    <td>${item}</td>
    <td>${QTY}</td>
    <td>${rate}</td>
    <td>${amount}</td>
    <td>${chk}</td>
    <td><button class="delete-btn" onclick="handleDelete(${sr})">Delete</button></td>`;

    // Append the new row to the table body
    tableBody.appendChild(newRow);

    // Add an event listener to the "Delete" button
    const deleteButton = newRow.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        tableBody.removeChild(newRow); // Remove the row from the table body
    });

    formDataArray.push({ sr: sr, date: date, item: item, qty: QTY, rate: rate, amount: amount, returnItem: chk });
    console.log(formDataArray);
    sr++;
    console.log("here")
    document.getElementById('item').value = '------------NONE------------';
    document.getElementById('QTY').value = null;
    document.getElementById('chk').checked = false;
}

function handleDelete(s) {
    let temp = formDataArray.filter(ele => {
        return ele.sr !== s
    })
    formDataArray = temp;
    console.log(formDataArray)
}

function submit() {
    let con = confirm("Are you sure to submit the form?");
    if (!con) return
    let pass = prompt('ID');
    if(pass!=121) return alert("Wrong ID")
    console.log("submitting")
    let submitBtn = document.getElementById('submitBtn');
    submitBtn.value = "Submitting..."
    fetch('https://script.google.com/macros/s/AKfycbysVC71RjpJCNjFzOCSGY7yLA6ovykUbKFmUiRZqKifsp2hlxM4E7UnIhIArhY09Iyw/exec', {
        method: "POST",
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            "Content-Type": "application/json"
        },
        redirect: 'follow',
        body: JSON.stringify(formDataArray)  // Send the array as JSON
    })
        .then(res => res.text())
        .then(dt => {
            submitBtn.value = "Submit";
            alert("The Data has been stored...");
            window.location.reload();  // Reload the page to reset the form
        })
        .catch(error => {
            alert('Error submitting form');
            console.error('Error:', error);
        });
}


document.addEventListener('DOMContentLoaded', function () {

           
    const addInput = document.getElementById('addInput');
    let inputs = []

    addInput.addEventListener('click', () => {
        let qtyInputBox = document.getElementById("qtyInputBox");
        let addQTY = document.getElementById('addQTY');
        let idValue = 0;

        if(qtyInputBox.value == '') return

        console.log(qtyInputBox.value)

        let newinput = document.createElement('li')
        newinput.setAttribute('id', idValue);
        newinput.innerHTML = qtyInputBox.value
        addQTY.appendChild(newinput)
        inputs.push(newinput)

        idValue++;

        qtyInputBox.value = null

    })


    // ------------------------ initial section
    const dialog = document.getElementById('myDialog');
    const openDialogButton = document.getElementById('openDialog');
    const closeDialogButton = document.getElementById('closeDialog');

    

    openDialogButton.addEventListener('click', function () {
        dialog.showModal();
    });
    closeDialogButton.addEventListener('click', function () {
        let QTY = document.getElementById('QTY');
        let result = 0;
        inputs.forEach(ele => {
            result += parseFloat(ele.innerHTML)
            console.log(ele)
            addQTY.removeChild(ele)
        })
        inputs = []
        QTY.value = result;
        setTotal()
        dialog.close();
    });
});