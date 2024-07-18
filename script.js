document.addEventListener('DOMContentLoaded', () => {
    const balance = document.getElementById('balance');
    const income = document.getElementById('income');
    const expense = document.getElementById('expense');
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const text = document.getElementById('text');
    const amount = document.getElementById('amount');
    const expenseChart = document.getElementById('expense-chart').getContext('2d');

    let transactions = [];

    // Add transaction
    function addTransaction(e) {
        e.preventDefault();

        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateChart();

        text.value = '';
        amount.value = '';
    }

    // Generate random ID
    function generateID() {
        return Math.floor(Math.random() * 100000000);
    }

    // Add transactions to DOM list
    function addTransactionDOM(transaction) {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');

        item.classList.add(transaction.amount < 0 ? 'expense' : 'income');

        item.innerHTML = `
            ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;

        transactionList.appendChild(item);
    }

    // Update the balance, income and expense
    function updateValues() {
        const amounts = transactions.map(transaction => transaction.amount);
        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
        const incomeTotal = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
        const expenseTotal = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

        balance.innerText = `$${total}`;
        income.innerText = `$${incomeTotal}`;
        expense.innerText = `$${expenseTotal}`;
    }

    // Remove transaction by ID
    window.removeTransaction = function (id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        init();
        updateChart();
    }

    // Initialize app
    function init() {
        transactionList.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateValues();
    }

    // Update chart
    function updateChart() {
        const incomeTotal = transactions.filter(t => t.amount > 0).reduce((acc, t) => (acc += t.amount), 0);
        const expenseTotal = transactions.filter(t => t.amount < 0).reduce((acc, t) => (acc += t.amount), 0) * -1;

        new Chart(expenseChart, {
            type: 'doughnut',
            data: {
                labels: ['Income', 'Expense'],
                datasets: [{
                    data: [incomeTotal, expenseTotal],
                    backgroundColor: ['#2ecc71', '#e74c3c']
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    transactionForm.addEventListener('submit', addTransaction);
    init();
});
