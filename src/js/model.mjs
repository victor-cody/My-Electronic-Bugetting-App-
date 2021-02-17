//This file contains functions that define,store and control data and object models for the app. 

export const appModel = (function () {  
  //object constructor for the Input Data
    class Income { // Income Class
      constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
      }
    }

    class Expense { // Expense Class
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

  //Calculate total value of each type of input in db i.e expense or income 
  const calculateTotals = async (type) => {
    const data = await readData(type);
    let sum = [];

    for (var i = 0; i < data.length; i++) {
      sum.push(parseInt(data[i].value));
    }
    
    let result = sum.reduce(function (prev, next) {
      return prev + next;
    }, 0)

    console.log(result);
    localStorage.setItem(type, result);
  };

//Function to model new input and add to db
const addNewData = async (type, desc, val) => {
  try {
    const data = await readData(type);
    let newData, newId;
    if (data.length === 0) {
      newId = 0;
      newData = new Input(newId, desc, val);
    } else {
      //0,3,5,6,8 ,9
      newId = data[data.length - 1].id + 1;
      newData = new Input(newId, desc, val);
    }
    //adding our newItem into the data Structure
    await writeData(type,newData)
    console.log(newData);
    //returning our new budget item
    return newData;

  } catch (error) {
    console.error(error);
  }
}

  return {
    async addToDB (type, desc, val) {
        if (type === "income") {
            return await addNewData("income", desc, val);
          } else {
            return await addNewData("expense", desc, val);
          }
    }, 
    //deleting an item from the budget and the data structure
    deleteFromDB (type, Id ) {
      deleteData(type,Id)
    },
    //our function to Recalculate the Budget
    async CalculateBalance () {
      let percentage;
      //calculate the total income and expenses
      await calculateTotals("income");
      await calculateTotals("expenses");

      //Retrieving the total income and expenses from the localStorage
      const totalIncome = parseFloat(localStorage.getItem("income"));
      const totalExpense = parseFloat(localStorage.getItem("expense"));

      //then calculate the available balance: Total Income - Total Expenses
      const balance = totalIncome - totalExpense;
      localStorage.setItem("Balance",balance);

      //Then calculate the percentage of the income spent if income is greater than zero
      if (totalIncome > 0) {
          percentage = Math.round((totalExpense / totalIncome)) * 100 ;
      } else {
        percentage = -1;
      }
      localStorage.setItem("Percentage", percentage);
    },

    //Initializing the localStorage items when the window loads and if the are not set, sets them to zero 
    initializeLocalStorage () {
      if (!((localStorage.hasOwnProperty('Balance')) && (localStorage.hasOwnProperty('income')) && (localStorage.hasOwnProperty('expense')) && (localStorage.hasOwnProperty('Percentage')))) {
        localStorage.setItem("Balance", 0);
        localStorage.setItem("income", 0);
        localStorage.setItem("expense", 0);
        localStorage.setItem("Percentage", 0);
        localStorage.setItem('userCurrency', '&#8358;');
    }
  },

  getBudgetItems () {
    return {
      budget:parseFloat(localStorage.getItem("Balance")),
      totalIncome: parseFloat(localStorage.getItem("income")),
      totalExpense: parseFloat(localStorage.getItem("expense")),
      percentage: parseFloat(localStorage.getItem("Percentage")),
      userCurrency: localStorage.getItem("userCurrency")
    };
  },

  resetLocalStorage () {
    localStorage.setItem("Balance", 0);
    localStorage.setItem("income", 0);
    localStorage.setItem("expense", 0);
    localStorage.setItem("Percentage", 0);
  },
  testing() {
    console.log("works");
  },

};
})();
