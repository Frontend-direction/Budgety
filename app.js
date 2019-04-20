
// BUDGET CONTROLLER

let budgetController = (function () {
  let Expense = function (id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Income = function (id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  const calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(({value}) => sum += value);

    data.totals[type] = sum;
  };


  return {
    addItem: function (type, des, val) {
      let newItem, ID;

      // Create new ID
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else  {
        ID = 0;
      }
      
      // Create new item based on inc or exp type;
      if(type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if( type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push it inito your data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },

    deleteItem: function(type, id) {
      let index, ids;
      // id = 3

      ids = data.allItems[type].map( current => {
        return current.id;
      });

      index = ids.indexOf(id);
  
      if(index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      // 1. Calculate the total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // 2. Calculate the budget
      data.budget = data.totals.inc - data.totals.exp;

      if(data.totals.inc > 0) {
        // 3. Calculate the % of spendings in budget
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percantage: data.percentage,
      }
    },

    testing: function () {
      console.log(data)
    }

  };
})();

//----------------------------------------------------------------------------------------------------------//
// UI CONTROLLER

let UIController = (function () {

  const DOMStrings = {
    inputType:'.add__type',
    inputDescription:'.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel:'.budget__income--value',
    expenseLable: '.budget__expenses--value',
    percentageLable: '.budget__expenses--percentage',
    container: '.container',
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      }
    },

    addListItem: function(obj, type) {
      let html, element;
      // Create HTML string with placeholder text
      if(type === 'inc') {
        element = DOMStrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-${obj.id}">
                  <div class="item__description">${obj.description}</div>
                  <div class="right clearfix">
                    <div class="item__value">+ ${obj.value}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                  </div>
                </div>`
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html = `<div class="item clearfix" id="exp-${obj.id}">
        <div class="item__description">${obj.description}</div>
        <div class="right clearfix">
          <div class="item__value">- ${obj.value}</div>
          <div class="item__percentage">${obj.value}%</div>
          <div class="item__delete">
              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
          </div>
        </div>
      </div>`
      }
      // Replace placeholder text  with some actual data
        // newHTML = html.replace('%id%', obj.id);
        // newHtml = newHTML.replace('%descripton%', obj.description);
        // newHtml = newHTML.replace('%value%', obj.valeu);

      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', html)
    },

    getDOMStrings: function() {
      return DOMStrings;
    },

    clearFields: function() {
      let fields, fieldsArray;

      fields =  document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
 
      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(element => {
        element.value = "";
      });

      fieldsArray[0].focus();
    },

    deleteListItem: function (selectorID) {
      const element  = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },

    dispalyBudget: function(obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expenseLable).textContent = obj.totalExp;
      

      if(obj.percantage > 0){
        document.querySelector(DOMStrings.percentageLable).textContent = obj.percantage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLable).textContent = '----';
      }
    },
  };
})();

//----------------------------------------------------------------------------------------------------------//
// APPLICATION CONTROLLER

let controller = (function (budgetCtrl, UICtrl) {

  const setupEventListener = function () {
    let DOM = UIController.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  } 


  const updateBudget = function() {
    // 1.Calculate the budget
    budgetController.calculateBudget();
    // 2.Return the budget
    const budget = budgetController.getBudget();
    // 3.Display the budget on the UI
    UIController.dispalyBudget(budget);
  }

  let ctrlAddItem = function () {
    let input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    if(input.description !== '' && !isNaN(input.value && input.value > 0)) {
      // 2.Add the item to the budget controller
    newItem = budgetController.addItem(input.type, input.description, input.value);
    // 3.Add the item to the UI
    UIController.addListItem(newItem, input.type);

    // 4. Clear fields
    UIController.clearFields();

    // 5. Calculate and update budget
    updateBudget();
    }
  };
  
  const ctrlDeleteItem = function (event) {
    let itemID,splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID) {
      // inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete item from the data structure
        budgetController.deleteItem(type, ID);
      // 2. Delete item form the user interface
        UIController.deleteListItem(itemID);
      // 3. Update and  show the new budget
        updateBudget();
    }
  };
  
  return {
    init: function() {
      console.log("app started");
      UIController.dispalyBudget(
        {
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percantage: -1,
        }
      );
      setupEventListener();
    }
  };
})(budgetController, UIController);

controller.init();