// BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }
    
    return {
        addItem: function(type, des, val){
            var newItem, ID;
    
            // Create New ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;    
            } else{
                ID = 0;
            }
            
            // create new item based on 'inc' or 'exp'
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // push to data
            data.allItems[type].push(newItem);
    
            return newItem;
        }
    }
    })();




// UI CONTROLLER
var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    
    
    return {
        getInput : function(){
           
            return{
               type: document.querySelector(DOMstrings.inputType).value, // inc or exp
               description: document.querySelector(DOMstrings.inputDescription).value,
               value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
           };
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string
            if(type === 'inc'){
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp'){
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace the placeholders with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        
        clearFields: function(){
            var fields, fieldsarr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);  
            // field is a list now, need to convert it into array
            fieldsarr = Array.prototype.slice.call(fields);
            //foreach is a ez version of for, iterate through all element in the array.
            fieldsarr.forEach(function(current , i , arr){
                current.value = ""; //current is the field element.
            });
            fieldsarr[0].focus();
        },
        
        
        getDOMstring: function(){
            return DOMstrings;
        }
    };
    
})();




// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    
    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstring();
         
        document.querySelector(DOM.inputBtn).addEventListener('click', cntlAddItem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode === 13){
                cntlAddItem();
            }
        });
    };
    
    
    function updateBudget() {
        //calculate the budget
        
        //return the budget
        
        //display it on the web
    }
    
    function cntlAddItem(){
        
        var input, newItem
        //get data from html page
        input = UICtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //add to data stucture
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //add to ui
            UICtrl.addListItem(newItem, input.type);
            //clear fields
            UICtrl.clearFields();
            //calculate and update budget
            updateBudget();
        }
    }
    return {
        init: function(){
            console.log('app started');
            setupEventListeners();
        }
    }
    
    
})(budgetController, UIController);


controller.init();



