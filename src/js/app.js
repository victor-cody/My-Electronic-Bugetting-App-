import { domElements } from "./base.mjs";
import { appModel } from './model.mjs';
import { appView } from "./view.mjs";
//The Global app Controller. Combines functions from the view and model
//
//----------------------------------------------------------
 const appController = (function (modelCtl, viewCtl) {
	//function contains all event listners to keep things organized.

	const setupEventListeners = function () {  
		//Event listener for the desktop addInput button
		domElements.addBudgetItem.addEventListener('click',addInputAndUpdateUI);

		// event listener for the enter key
		domElements.budgetField.addEventListener('submit', (event) => {
			event.preventDefault();
			addInputAndUpdateUI()
		});

		//update user currency symbol on click
		domElements.selectCurrency.addEventListener('change',viewCtl.setUserCurrency);

		//delete Budget Item
		domElements.container.addEventListener("click",(e) => deleteItem(e)) 
	}; 


	const addInputAndUpdateUI = async function () {  
		let input , newItem ;

		//regular expression test to make sure inputs to description contain only letters
		const alphaExp = /^[a-zA-Z_]*$/;

		//1. Get new data object from the the input fields value
		input = viewCtl.getInput();
	  
		//2. check that input fields are not empty and correct data is entered.
		if (  input.inputDescription !== " " && !isNaN(domElements.valueInput.value) && domElements.valueInput.value > 0) {
			//3. clear error message
			domElements.errMsg.textContent = " ";
			//4. Add new data object to the budget controller
			newItem = modelCtl.addToDB(input.inputType,input.inputDescription,input.amount);

			//5. clear form fields
			viewCtl.clearFormFields();

			//add new item to UI
			await viewCtl.addItemToUI(newItem,input.inputType);

			//update totals and balances
			viewCtl.updateTotalsAndBalance(input);

			//update expenses percentages
			viewCtl.calculateAndDisplayPercentages()

		} else {
			domElements.errMsg.textContent = `*Please enter a description in just words and an amount in numbers greater than 0`;
	  }
		};
	
	const deleteItem = async function (event) {
		let el, itemID, splitID, type, Id;
		//1. check if target of the event delegation on the main element is a delete button
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if (itemID) {
			let Budget;
			splitID = itemID.split('-');
			type = splitID[0];
			Id = parseInt(splitID[1]);

			//2. Delete the item from the data structure
			modelCtl.deleteFromDB(type,Id);

			//3. Delete item from the UI
			viewCtl.deleteFromUI(itemID);

			//4. Calculates and Update the balance
			await modelCtl.CalculateBalance();

			//5. Return the budget
			Budget = modelCtl.getBudgetItems();

			//6. Display the balance on the UI
			viewCtl.loadTotalsFromLocalStorage(Budget);
			//7. Recalculate and update expense percentages
			viewCtl.calculateAndDisplayPercentages();
		};
	}; 
	
	//Persist Data from Indexeddb and local storage on page reload
	const loadUIFromDB = function () {

		viewCtl.displayDate();
		modelCtl.initializeLocalStorage();
		let Budget = modelCtl.getBudgetItems();
		viewCtl.loadTotalsFromLocalStorage(Budget);
		viewCtl.loadIncomeFromIDB();
		viewCtl.loadExpenseFromIDB();
		// viewCtl.ifShowNotificationRadio();
	
	  }
return {
	init : async function () {  
			
	setupEventListeners()
	appView.displayDate()
	loadUIFromDB()
	// viewCtl.displayDate()
	console.log("Application has started");
		//Making sure that the expense ul has been loaded to the DOM before calculating percentages,
		const checkForExpenses  = setInterval( function ()  {
			if (domElements.expenseContainer.childElementCount >= 1 ){
			viewCtl.calculateAndDisplayPercentages()
			clearInterval(checkForExpenses);
			}
		}, 100);
	}
}
})(appModel,appView)

appController.init();
