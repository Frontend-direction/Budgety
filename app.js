
// BUDGET CONTROLLER

let budgetController = (function () {

})();

// UI CONTROLLER

let UIController = (function () {

})();


// APPLICATION CONTROLLER

let controller = (function (budgetCtrl, UICtrl) {

  let ctrlAddItem = function () {
    // 1. Get the field input data

    // 2.Add the item to the budget controller

    // 3.Add the item to the UI

    //4. Calculate the budget

    // 5. Display the bufger on UI
    console.log('it works')
  }  
  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  })
})(budgetController, UIController);