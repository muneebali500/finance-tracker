"use strict";
var monthEl = document.getElementById("month");
var balanceEl = document.getElementById("balance-total");
var inputTextEl = document.getElementById("input-text");
var inputAmountEl = document.getElementById("input-amount");
var addBtn = document.getElementById("input-btn");
var incTotalEl = document.getElementById("income-total");
var expTotalEl = document.getElementById("expense-total");
var incomeEl = document.getElementById("inc-summary");
var expenseEl = document.getElementById("exp-summary");
var clearBtn = document.getElementById("clear");
/* **************** GET TRANSACTIONS FROM LOCAL STORAGE ******************** */
var transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
/* **************** EVENT LISTENERS ******************** */
addBtn.addEventListener("click", addTransaction);
clearBtn.addEventListener("click", clearDOM);
/* **************** DEFINING FUNCTIONS ******************** */
/* //////////// FUNCTION TO UPDATE MONTH AND YEAR /////////////// */
function updateMonth() {
    var date = new Date();
    var month = date.toLocaleString("en-us", {
        month: "long",
        year: "numeric",
    });
    monthEl.textContent = month;
}
/* //////////// FUNCTION TO ADD TRANSACTION /////////////// */
function addTransaction(e) {
    e.preventDefault();
    var transaction = {
        id: generateID(),
        text: inputTextEl.value,
        amount: +inputAmountEl.value,
    };
    if (inputTextEl.value.trim() === "" || inputAmountEl.value.trim() === "") {
        alert("Please add a text and amount");
    }
    else {
        transactions.push(transaction);
        addTransactionToDOM(transaction);
        updateAmounts();
        updateLocalStorage();
        inputTextEl.value = "";
        inputAmountEl.value = "";
        inputTextEl.focus();
    }
}
/* //////////// FUNCTION THAT GENERATES RANDOM ID FOR EVERY TRANSACTION /////////////// */
function generateID() {
    var char = "123456789abcdef";
    var id = "";
    for (var i = 0; i < char.length; i++) {
        var index = Math.floor(Math.random() * char.length);
        id += char[index];
    }
    return id;
}
/* //////////// FUNCTION TO CREATE NEW ENTRY AND ADD TO DOM /////////////// */
function addTransactionToDOM(transaction) {
    var entry = document.createElement("div");
    entry.className = "entry";
    entry.innerHTML = "\n  <span>".concat(transaction.text, "</span> <span>").concat(transaction.amount
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,"), "</span> <button class=\"delete-btn\" onclick=\"removeTransaction('").concat(transaction.id, "')\"><i class=\"fas fa-trash-alt\"></i></button>\n    ");
    if (transaction.amount > 0) {
        incomeEl.appendChild(entry);
    }
    else if (transaction.amount < 0) {
        expenseEl.appendChild(entry);
    }
}
/* ///////// FUNCTION TO UPDATE AMOUNTS FOR BALANCE, INCOME AND EXPENSE/////////// */
function updateAmounts() {
    var amounts = transactions.map(function (transaction) { return transaction.amount; });
    var balance = amounts
        .reduce(function (acc, amount) { return (acc += amount); }, 0)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    var income = amounts
        .filter(function (amount) { return amount > 0; })
        .reduce(function (acc, amount) { return (acc += amount); }, 0)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    var expense = amounts
        .filter(function (amount) { return amount < 0; })
        .reduce(function (acc, amount) { return (acc += amount); }, 0)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    balanceEl.innerText = "\uD83D\uDCB0 ".concat(balance);
    incTotalEl.innerText = "\uD83E\uDD11 ".concat(income);
    expTotalEl.innerText = "\uD83D\uDCB8 ".concat(expense);
}
/* //////////// FUNCTION TO REMOVE TRANSACTION /////////////// */
function removeTransaction(id) {
    transactions = transactions.filter(function (transaction) { return transaction.id !== id; });
    updateLocalStorage();
    updateDOM();
}
/* //////////// FUNCTION TO UPDATE LOCAL STORAGE ON EVERY NEW TRANSACTION AND DELETION OF A TRANSACTION /////////////// */
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}
/* //////////// FUNCTION TO CLEAR DOM /////////////// */
function clearDOM() {
    localStorage.clear();
    transactions = [];
    updateDOM();
}
/* //////////// FUNCTION TO UPDATE DOM /////////////// */
function updateDOM() {
    incomeEl.innerHTML = "";
    expenseEl.innerHTML = "";
    transactions.forEach(addTransactionToDOM);
    updateAmounts();
    updateMonth();
}
updateDOM();
