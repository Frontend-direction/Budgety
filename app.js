
// BUDGET CONTROLLER

let budgetController = (function () {

})();

// UI CONTROLLER

let UIController = (function () {

  const DOMStrings = {
    inputType:'.add__type',
    inputDescription:'.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      }
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();


// APPLICATION CONTROLLER

let controller = (function (budgetCtrl, UICtrl) {

  let DOM = UIController.getDOMStrings();

  let ctrlAddItem = function () {
    // 1. Get the field input data
    let input = UICtrl.getInput();
    console.log(input)
    // 2.Add the item to the budget controller

    // 3.Add the item to the UI

    //4. Calculate the budget

    // 5. Display the bufger on UI
  }  
  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  })
})(budgetController, UIController);