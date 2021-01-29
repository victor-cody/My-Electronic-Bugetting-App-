//the Budget Module
const BudgetController = (() => {
    
  class Income {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }

  class Expense {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
    calcPercentage(totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
    }

    getPercentage() {
      return this.percentage;
    }
  }

  //our central data Structure
  const DataStructure = {
    allItem: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
    // percentages: []
  };

  const calculateTotals = (type) => {
    let sum = 0;
    DataStructure.allItem[type].forEach((data) => (sum += data.value));
    DataStructure.totals[type] = sum;
  };

  return {
    addBudgetItem(type, des, val) {
      let newItem, ID;
      //0,3,5,6,8 ,9
      if (DataStructure.allItem[type].length > 0) {
        ID = Number(
          DataStructure.allItem[type][DataStructure.allItem[type].length - 1]
            .id + 1
        );
      } else {
        ID = 0;
      }
      //Creating a new budget item based on the 'inc' or 'exp' type
      if (type === "inc") {
        newItem = new Income(ID, des, val);
      } else if (type === "exp") {
        newItem = new Expense(ID, des, val);
      }
      //adding our newItem into the data Structure
      DataStructure.allItem[type].push(newItem);
      //returning our new budget item
      return newItem;
    },
    //deleting an item from the budget and the data structure
    deleteBudgetItem(type, id) {
      //retrieving the id of each element in our array inc or exp
      const ids = DataStructure.allItem[type].map((item) => item.id);
      let index = ids.indexOf(id);
      //deleting the element with the specified id from our array if it is greater than -1
      if (index > -1) DataStructure.allItem[type].splice(index, 1);
    },
    //our function to calculate the Budget
    calculateBudget() {
      //calculate the total expenses and income
      calculateTotals("inc");
      calculateTotals("exp");
      //Calculate the budget: inc - exp
      DataStructure.budget =
        DataStructure.totals.inc - DataStructure.totals.exp;
      //calculate the total percentage of the income spent
      if (DataStructure.totals.inc > 0)
        DataStructure.percentage = Math.round(
          (DataStructure.totals.exp / DataStructure.totals.inc) * 100
        );
      else DataStructure.percentage = -1;
    },
    getBudget() {
      return {
        budget: DataStructure.budget,
        totalIncome: DataStructure.totals.inc,
        totalExpense: DataStructure.totals.exp,
        percentage: DataStructure.percentage,
      };
    },
    // calcPercentages() {
    //     let percentage = DataStructure.allItem.exp.map(exp => {
    //         let value = Math.round((exp.value / DataStructure.totals.inc) * 100);
    //         return value
    //     });
    //     DataStructure.percentages = percentage;
    // },
    // getPercentage() {
    //     return DataStructure.percentages;
    // },
    calculatePercentages() {
      DataStructure.allItem.exp.forEach((cur) => {
        cur.calcPercentage(DataStructure.totals.inc);
      });
    },
    getPercentages() {
      let allPerc = DataStructure.allItem.exp.map((cur) => cur.getPercentage());
      return allPerc;
    },
    testing() {
      console.log(DataStructure);
    },
  };
})();

//the UI Module
const UIController = (() => {
  //an object that contains all the stings will use to select our elements
  const DomStrings = {
    //header & budget elements
    date: ".budget_title_month",
    totalIncome: ".budget_income-value",
    totalExpense: ".budget_expenses-value",
    totalPercentage: ".budget_expenses-percentage",
    totalBudget: ".budget_value",
    container: ".container",
    //input fields
    budgetField: ".add_field",
    descriptionInput: "add_description",
    valueInput: "add_value",
    selectType: "add_type",
    addBudgetItem: "add_btn",
    //Budget Items
    incomeContainer: "income-list",
    expenseContainer: "expenses-list",
    //
    itemPercentage: ".item_percentage",
    deleteBtn: ".item_delete-btn",
  };

  const formatNumber = function (num, type) {
    let numSplit, integer, sign, decimal;
    /**
     * 1.prepend + or - before the num depending the type inc or exp
     * appending exactly 2 decimal points after each no
     * and a comma separating the thousands
     */
    //applying Ternary operations
    type === "exp" ? (sign = "-") : (sign = "+");

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");
    integer = numSplit[0];
    if (integer.length > 3) {
      integer = `${integer.substr(0, integer.length - 3)},${integer.substr(
        integer.length - 3,
        integer.length
      )}`; //2354000 => 23,540//
    }
    if (integer.length > 7) {
      integer = `${integer.substr(0, integer.length - 7)},${integer.substr(
        integer.length - 7,
        integer.length
      )}`; //2354000 => 23,540//
    }

    decimal = `.${numSplit[1]}`;
    return `${sign}  ${integer + decimal}`;
  };

  return {
    DomStrings,
    getInputs() {
      return {
        type: document.getElementById(DomStrings.selectType).value, //will be either inc or exp
        description: document.getElementById(DomStrings.descriptionInput).value,
        value: parseFloat(document.getElementById(DomStrings.valueInput).value),
      };
    },
    addItem(obj, type) {
      let item, element;
      //Creating html template strings with placeholder text and replacing them with actual data
      if (type === "inc") {
        element = DomStrings.incomeContainer;
        item = `
                <div class="item clearfix" id="inc-${obj.id}">
                    <div class="item_description"> ${obj.description} </div>
                    <div class="right clearfix">
                    <div class="item_value"> ${formatNumber(
                      obj.value,
                      type
                    )} </div>
                    <div class="item_delete">
                    <button class="item_delete-btn" title="delete item">
                    <i class="ion-ios-close-outline"></i>
                    </button>
                    </div>
                    </div>
                    </div> `;
      } else if (type === "exp") {
        element = DomStrings.expenseContainer;
        item = `
                <div class="item clearfix" id="exp-${obj.id}">
                <div class="item_description"> ${obj.description} </div>
                    <div class="right clearfix">
                    <div class="item_value"> ${formatNumber(
                      obj.value,
                      type
                    )} </div>
                    <div class="item_percentage"> 21% </div>
                    <div class="item_delete">
                    <button class="item_delete-btn" title="delete item">
                    <i class="ion-ios-close-outline"></i>
                        </button>
                        </div>
                        </div>
                        </div>`;
      }
      //inserting the element into the DOM
      const container = document.getElementById(element);
      container.insertAdjacentHTML("beforeend", item);
    },
    deleteItem(selectorID) {
      let element = document.getElementById(selectorID);
      const container = element.parentNode;
      container.removeChild(element);
    },
    //clearing our input fields
    clearFields() {
      const inputFields = document.querySelectorAll(
        `#${DomStrings.descriptionInput},#${DomStrings.valueInput}`
      );
      inputFields.forEach((field) => (field.value = ""));
      //giving our input fields focus back
      inputFields[0].focus();
    },
    //Displaying the budget on the UI
    displayBudget(obj) {
      document.querySelector(
        DomStrings.totalIncome
      ).textContent = `${formatNumber(obj.totalIncome, "inc")}`;
      document.querySelector(
        DomStrings.totalExpense
      ).textContent = `${formatNumber(obj.totalExpense, "exp")}`;
      if (obj.percentage > 0) {
        document.querySelector(
          DomStrings.totalPercentage
        ).textContent = `${parseInt(Math.round(obj.percentage))}%`;
      } else {
        document.querySelector(DomStrings.totalPercentage).textContent = "--";
      }
      document.querySelector(DomStrings.totalBudget).textContent = obj.budget;
      //applying Ternary operations
      document.querySelector(DomStrings.totalBudget).textContent =
        obj.budget > 0
          ? formatNumber(obj.budget, "inc")
          : formatNumber(obj.budget, "exp");
    },
    displayType() {
      document
        .querySelectorAll("input,select")
        .forEach((element) => element.classList.toggle("red-focus"));
      document
        .getElementById(`${DomStrings.addBudgetItem}`)
        .classList.toggle("red");
    },
    displayPercentages(percentageArray = []) {
      const Fields = document.querySelectorAll(DomStrings.itemPercentage);
      Fields.forEach((element, index) => {
        if (percentageArray[index] > 0 && percentageArray[index] <= 100)
          element.textContent = `${percentageArray[index]}%`;
        else {
          element.textContent = "--";
        }
      });
    },
    displayTime() {
      let date = new Date();
      const months = [
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
      let month = date.getMonth();
      document.querySelector(DomStrings.date).textContent = `${
        months[month]
      } of ${date.getFullYear()}`;
    },
  };
})();

//the GLOBAL App Module
const AppIController = ((BudgetCtrl, UICtrl) => {
  //getting our DomStrings values
  const DOM = UICtrl.DomStrings;

  const updateBudget = () => {
    //1.calculate the budget
    BudgetCtrl.calculateBudget();
    //2.return the new budget
    const budget = BudgetCtrl.getBudget();
    //3.Displaying the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentage = () => {
    //1.Calculate the percentage
    BudgetCtrl.calculatePercentages();
    //2.Return the budget
    let percentage = BudgetCtrl.getPercentages();
    //3.Update the Budget and UI with the new percentages
    UICtrl.displayPercentages(percentage);
  };

  const CtrlAddBudgetItem = () => {
    if (
      !isNaN(document.getElementById(DOM.valueInput).value) &&
      document.getElementById(DOM.valueInput).value > 0
    ) {
      // 1. Getting the input fields value
      const input = UICtrl.getInputs();
      // 2. Adding the item to the Budget Controller
      const newBudgetItem = BudgetCtrl.addBudgetItem(
        input.type,
        input.description,
        input.value
      );
      // console.log(newBudgetItem);
      // 3. Adding the item to the UI
      UICtrl.addItem(newBudgetItem, input.type);
      //4.clearing our input field
      UICtrl.clearFields();
      // 5.Calculating and Displaying the budget on the UI
      updateBudget();
      // 6. calculate and update the percentages
      updatePercentage();
    }
  };

  const CtrlDeleteItem = (event) => {
    let itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = Number(splitID[1]);
      // 1. delete an item from the data structure
      BudgetCtrl.deleteBudgetItem(type, ID);
      // 2.deleting the item the UI
      UICtrl.deleteItem(itemID);
      // 3. updating the Budget
      updateBudget();
      // 4. calculate and update the percentages
      updatePercentage();
    }
  };

  const budgetField = document.querySelector(DOM.budgetField);
  
  budgetField.addEventListener("submit", (e) => {
    e.preventDefault();
    CtrlAddBudgetItem();
  });

  const selectType = document.getElementById(DOM.selectType);
  selectType.addEventListener("change", () => UICtrl.displayType());

  const container = document.querySelector(DOM.container);
  container.addEventListener("click", (e) => CtrlDeleteItem(e));

  return {
    init() {
      window.addEventListener("load", () => {
        UICtrl.displayTime();
        UICtrl.displayBudget(BudgetCtrl.getBudget());
        console.log(`Application has started`);
      });
    },
  };
})(BudgetController, UIController);

AppIController.init();
