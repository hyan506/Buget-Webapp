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
            exp: [];
            inc: []
        }
        totals = {
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
        
    };
    
})();




// UI CONTROLLER
var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    
    
    return {
        getInput : function(){
           
            return{
               type: document.querySelector(DOMstrings.inputType).value, // inc or exp
               description: document.querySelector(DOMstrings.inputDescription).value,
               value: document.querySelector(DOMstrings.inputValue).value
           };
        },
        
        addListItem: function(obj, type){
            
        },
        
        
        getDOMstring : function(){
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
    
    function cntlAddItem(){
        
        var input, newItem
        //get data from html page
        input = UICtrl.getInput();
        //add to data stucture
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        console.log(input);
    }
    return {
        init: function(){
            console.log('app started');
            setupEventListeners();
        }
    }
    
    
})(budgetController, UIController);


controller.init();



