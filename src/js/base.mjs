export const domElements = {
    //header & budget elements
    date: document.querySelector(".budget_title_month"),
    totalIncome: document.querySelector(".budget_income-value"),
    totalExpense: document.querySelector(".budget_expenses-value"),
    totalPercentage: document.querySelector(".budget_expenses-percentage"),
    totalBudget: document.querySelector(".budget_value"),
    sign:document.querySelector(".sign"),
    userCurrency:document.querySelector(".currency"),
    availableBalance:document.querySelector(".available_funds"),
    errMsg: document.querySelector('.err_msg'),
    container: document.querySelector(".container"),
    //input fields
    budgetField: document.querySelector(".add_field"),
    descriptionInput: document.querySelector("#add_description"),
    valueInput: document.querySelector("#add_value"),
    selectType: document.querySelector("#add_type"),
    addBudgetItem: document.querySelector("#add_btn"),
    //Budget Items
    incomeContainer: document.querySelector("#income-list"),
    expenseContainer: document.querySelector("#expenses-list"),
    //
    itemPercentage: document.querySelectorAll(".item_percentage"),
    deleteBtn: document.querySelectorAll(".item_delete-btn"),
    settingsBody: document.querySelector('.settings_body'),
    settingsIcon: document.querySelector('.settings_icon'),
    settingsBodyContent: document.querySelector('.settings_body_content'),
    userCurrency: document.querySelector('.currency'),
    selectCurrency: document.querySelector('#currency'),
    notifications: document.querySelector('#notification')
}