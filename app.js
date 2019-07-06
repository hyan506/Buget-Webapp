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
        },
        budget: 0,
        percentage: -1
    }
    function calculateTotal(type){
        var sum = 0;
        data.allItems[type].forEach(function(current,index,arr){
            sum += current.value;
        });
        data.totals[type] = sum;
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
        },
        
        calculateBudget: function() {
            //calculate total inc and exp
            calculateTotal('inc');
            calculateTotal('exp');
            //calculate budget
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the persentage that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round(100 * (data.totals.exp / data.totals.inc));
            } else{
                data.percentage = -1;
            }
        },
        
        getBudget: function() {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
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
        
        displayBudget: function(obj) {
            console.log(obj);
            console.log(obj.budget);
            if(obj.budget){
                console.log('seems fine!');
            }
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
            
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+ '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
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
        budgetCtrl.calculateBudget();
        //return the budget
        var budget = budgetCtrl.getBudget();
        //display it on the web
        UICtrl.displayBudget(budget);
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
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    }
    
    
})(budgetController, UIController);


controller.init();



