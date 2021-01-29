 //This file contains functions that define DOM Interactions for the app , It Controls the UI And UX that entreats with the User

import { domElements } from "./base.mjs";

export const appView = (function () {
  //Private function to format numbers
  const formatNumber = function (num) {
    let numSplit, integer, decimal;

    //Make the number an absolute one i.e remove any sign, fixed to a decimal point of two
    num = Math.abs(num).toFixed(2); //returns a string
    //Spilt number into 2 parts from the decimal point, one for interger, the for the decimal part
    numSplit = num.split(".");
    //Assign the integer and decimal sides to variables. format integer to add commas
    integer = parseInt(numSplit[0]).toLocaleString();

    //  appending exactly 2 decimal points after each no
    //   and a comma separating the thousands
    if (integer.length > 3) {
      integer = `${integer.substr(0, integer.length - 3)},${integer.substr(
        integer.length - 3,
        integer.length
      )}`; //2354000 => 23,540//
    } else if (integer.length > 7) {
      integer = `${integer.substr(0, integer.length - 7)},${integer.substr(
        integer.length - 7,
        integer.length
      )}`; //2354000 => 23,540//
    }

    decimal = `.${numSplit[1]}`;
    return `${integer}.${decimal}`;
  };

  return {
    getInput() {
      return {
        inputType: domElements.selectType.value, //will be either income or expenses,
        inputDescription: domElements.descriptionInput.value,
        amount: parseFloat(domElements.valueInput.value),
      };
    },
    //Publicly accessible method which accepts the resulting object; newItem and its type
    async addItemToUI(obj, type) {
      let newItem, element;
      //Create html templates with placeholder text and replacing them with actual data based on each input type i.e income or expenses
      const data = await obj;
      if (type === "inc") {
        element = domElements.incomeContainer;
        newItem = `<li class="item clearfix" id="${type}-${data.id}">
        <span class="item_description"> ${data.description} 
        </span>
        <div class="right clearfix">
           <span class="item_value"> ${formatNumber(data.value)} 
           </span>
           <span class="item_delete">
               <button class="item_delete-btn" title="delete item">
                <i class="ion-ios-close-outline"></i>
               </button>
           </span>
       </div>
           </li> `;
      } else if (type === "exp") {
        element = domElements.expenseContainer;
        newItem = `<li class="item clearfix" id="${type}-${data.id}">
         <span class="item_description"> ${data.description} 
         </span>
         <div class="right clearfix">
            <span class="item_value"> ${formatNumber(data.value)} 
            </span>
            <span class="item_percentage"> 21% </span>
            <span class="item_delete">
                <button class="item_delete-btn" title="delete item">
                 <i class="ion-ios-close-outline"></i>
                </button>
            </span>
        </div>
            </li>`;
      }
      //Insert newItem element into either the expense list or income list
      element.insertAdjacentHTML("beforeend", newItem);
    },

    //Calculate percentage for all expenses
    calculateAndDisplayPercentages() {
      let totalIncome = parseInt(localStorage.getItem("income"));
      console.log("totalincome :", totalIncome);

      //get all the lis in expenses ul
      let expenses = domElements.expenseContainer.getElementsByTagName("li");

      for (let i = 0; i < expenses.length; i++) {
        //get string in span and remove spaces from the string
        let string = expenses[i]
          .getElementsByTagName("span")[2]
          .textContent.trim();
        let stringSplit = string.split(" ");
        let amount = parseInt(stringSplit[1].split(",").join(""));
        console.log(amount);
        let percentage;

        if (totalIncome > 0) {
          percentage = Math.round((amount / totalIncome) * 100);
        } else {
          percentage = -1;
        }

        expenses[i].getElementsByTagName(
          "span"
        )[2].textContent = `- ${percentage}%`;
      }
    },

    updateTotalsAndBalance(input) {
      let totalIncome;
      //if input is income, calculate and update total incomes
      if (input.inputType === "income") {
        let income = parseInt(localStorage.getItem("income"));
        totalIncome = income + parseInt(input.inputValue);
        domElements.totalIncome.textContent = formatNumber(totalIncome);
        localStorage.setItem("income", totalIncome);
      }
      //if input is expense, calculate update total expenses
      else {
        let expense = parseInt(localStorage.getItem("expenses"));
        let totalExpense = expense + parseInt(input.inputValue);
        domElements.totalExpense.textContent = formatNumber(totalExpense);
        localStorage.setItem("expense", totalExpense);
      }

      let totalExpenses = parseInt(localStorage.getItem("expense"));
      let totalIncomes = parseInt(localStorage.getItem("income"));
      let percentage;

      //Calculate, update and store budget in localStorage
      let balance = totalIncomes - totalExpenses;
      domElements.availableBalance.textContent = balance;
      localStorage.setItem("Balance", balance);

      //Determining and displaying the sign , using Ternary operators
      balance > 0
        ? (domElements.sign.textContent = "+")
        : (domElements.sign.textContent = "-");

      //Determine and display expense percentage
      if (totalIncomes > 0) {
        percentage = Math.round((totalExpenses / totalIncomes) * 100);
      } else {
        percentage = -1;
      }

      domElements.totalPercentage.textContent = `${percentage}%`;
      localStorage.setItem("Percentage", percentage);
    },

    loadIncomeFromIDB: function () {
      let newIncome;
      readData("income").then((data) => {
        if (data) {
          for (var i = 0; i < data.length; i++) {
            newIncome = `<li id="income-${data[i].id}">
                  <span class="add_remove">&times</span>
                  <span class="add_description">${data[i].description}</span>
                  <span class="add_amount"> + ${formatNumber(
                    data[i].value
                  )}</span>
                </li>`;

            domElements.incomeList.insertAdjacentHTML("afterbegin", newIncome);
          }
        }
      });
    },

    loadExpenseFromIDB: function () {
      readData("expense").then((data) => {
        if (data) {
          for (var i = 0; i < data.length; i++) {
            let newExpense = `<li id="expense-${data[i].id}">
                  <span class="add_remove">&times</span>
                  <span class="add_description">${data[i].description}</span>
                  <span class="add_amount"> - ${formatNumber(
                    data[i].value
                  )}</span>
                  <span class="add_percentage">- %per%</span>
                </li>`;

            domElements.expenseList.insertAdjacentHTML(
              "afterbegin",
              newExpense
            );
          }
        }
      });
    },

    //Displaying the budget on the UI
    loadTotalsFromLocalStorage: function (obj) {
      let sign;
      obj.balance > 0 ? sign = '+' : sign = '-';

      domElements.sign.textContent = sign;
      domElements.availableBalance.textContent = formatNumber(obj.budget);
      domElements.totalIncome.textContent = formatNumber(obj.totalIncome);
      domElements.totalExpense.textContent = formatNumber(obj.totalExpense);
      domElements.userCurrency.innerHTML = obj.userCurrency;
      //applying Ternary operations
      obj.percentage > 0 ? domElements.totalPercentage.textContent = obj.percentage + '%' : domElements.totalPercentage.textContent = '--';
    
    },

    //Display or Hide settings panel on click
    showSettingsBody: function () {
      domElements.settingsBody.classList.remove("hidden");
      domElements.settingsBody.classList.toggle("close");
      domElements.settingsBody.classList.toggle("open");
      domElements.settingsBodyContent.classList.toggle("hidden");
    },

    displayDate: function () {
      let now, month, months;
      now = new Date();
      //get month
      month = now.getMonth(); //returns an integer of a zero based array representing respective months
      months = [
        "January",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];

      domElements.date.textContent = `${months[month]}, ${now.getFullYear()}`;
    },
    //delete input items from ui
    deleteFromUI: (selectorID) => {
      document.getElementById(selectorID).remove();
    },

    clearFormFields: function () {
      const formFields = [
        ...domElements.descriptionInput,
        domElements.valueInput,
      ];
      formFields.forEach((field) => {
        field.value = " ";
      });
      //giving our input fields focus back
      formFields[0].focus();
    },

    displayType() {
      [
        domElements.selectType,
        domElements.descriptionInput,
        domElements.valueInput,
      ].forEach((element) => element.classList.toggle("red-focus"));
      domElements.addBudgetItem.classList.toggle("red");
    },

    setUserCurrency: () => {
      localStorage.setItem("userCurrency", domElements.selectCurrency.value);
      domElements.userCurrency.innerHTML = localStorage.getItem("userCurrency");
    },
  };
})();
