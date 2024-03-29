const monthEl = document.getElementById(`month`) as HTMLElement;
const balanceEl = document.getElementById(`balance-total`) as HTMLElement;
const inputTextEl = document.getElementById(`input-text`) as HTMLInputElement;
const inputAmountEl = document.getElementById(
  `input-amount`
) as HTMLInputElement;
const addBtn = document.getElementById(`input-btn`) as HTMLButtonElement;
const incTotalEl = document.getElementById(`income-total`) as HTMLElement;
const expTotalEl = document.getElementById(`expense-total`) as HTMLElement;
const incomeEl = document.getElementById(`inc-summary`) as HTMLElement;
const expenseEl = document.getElementById(`exp-summary`) as HTMLElement;
const clearBtn = document.getElementById(`clear`) as HTMLButtonElement;

/* **************** GET TRANSACTIONS FROM LOCAL STORAGE ******************** */
let transactions: { id: string; text: string; amount: number }[] = JSON.parse(
  localStorage.getItem("transactions") || "[]"
);

/* **************** EVENT LISTENERS ******************** */
addBtn.addEventListener(`click`, addTransaction);
clearBtn.addEventListener(`click`, clearDOM);

/* **************** DEFINING FUNCTIONS ******************** */

/* //////////// FUNCTION TO UPDATE MONTH AND YEAR /////////////// */
function updateMonth() {
  const date = new Date();
  const month = date.toLocaleString(`en-us`, {
    month: `long`,
    year: `numeric`,
  });

  monthEl.textContent = month;
}

/* //////////// FUNCTION TO ADD TRANSACTION /////////////// */
function addTransaction(e: MouseEvent) {
  e.preventDefault();

  const transaction = {
    id: generateID(),
    text: inputTextEl.value,
    amount: +inputAmountEl.value,
  };

  if (inputTextEl.value.trim() === `` || inputAmountEl.value.trim() === ``) {
    alert(`Please add a text and amount`);
  } else {
    transactions.push(transaction);

    addTransactionToDOM(transaction);

    updateAmounts();

    updateLocalStorage();

    inputTextEl.value = ``;
    inputAmountEl.value = ``;
    inputTextEl.focus();
  }
}

/* //////////// FUNCTION THAT GENERATES RANDOM ID FOR EVERY TRANSACTION /////////////// */
function generateID() {
  const char = `123456789abcdef`;
  let id = ``;

  for (let i = 0; i < char.length; i++) {
    const index = Math.floor(Math.random() * char.length);
    id += char[index];
  }

  return id;
}

/* //////////// FUNCTION TO CREATE NEW ENTRY AND ADD TO DOM /////////////// */
function addTransactionToDOM(transaction: {
  id: string;
  text: string;
  amount: number;
}) {
  const entry = document.createElement(`div`);
  entry.className = `entry`;

  entry.innerHTML = `
  <span>${transaction.text}</span> <span>${transaction.amount
    .toFixed(2)
    .replace(
      /\d(?=(\d{3})+\.)/g,
      `$&,`
    )}</span> <button class="delete-btn" onclick="removeTransaction('${
    transaction.id
  }')"><i class="fas fa-trash-alt"></i></button>
    `;

  if (transaction.amount > 0) {
    incomeEl.appendChild(entry);
  } else if (transaction.amount < 0) {
    expenseEl.appendChild(entry);
  }
}

/* ///////// FUNCTION TO UPDATE AMOUNTS FOR BALANCE, INCOME AND EXPENSE/////////// */
function updateAmounts() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const balance = amounts
    .reduce((acc, amount) => (acc += amount), 0)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, `$&,`);

  const income = amounts
    .filter((amount) => amount > 0)
    .reduce((acc, amount) => (acc += amount), 0)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, `$&,`);

  const expense = amounts
    .filter((amount) => amount < 0)
    .reduce((acc, amount) => (acc += amount), 0)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, `$&,`);

  balanceEl.innerText = `💰 ${balance}`;
  incTotalEl.innerText = `🤑 ${income}`;
  expTotalEl.innerText = `💸 ${expense}`;
}

/* //////////// FUNCTION TO REMOVE TRANSACTION /////////////// */
function removeTransaction(id: string) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

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
  incomeEl.innerHTML = ``;
  expenseEl.innerHTML = ``;

  transactions.forEach(addTransactionToDOM);
  updateAmounts();

  updateMonth();
}

updateDOM();
