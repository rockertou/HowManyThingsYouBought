// MVC - model, view, controller

var model = (function () {

    var item = function (id, name, value) {

        this.id = id;
        this.name = name;
        this.value = value;

    };

    var data = {

        allItems: [],
        totals: 0,

    }

    var calculateTotal = function () {

        var sum = 0;
        data.allItems.forEach(function (currentVal) {

            sum += currentVal.value;

        });

        data.totals = sum;

    };

    return {

        addItem: function (name, value) {

            var ID;

            if (data.allItems.length > 0) {

                ID = data.allItems[data.allItems.length - 1].id + 1;

            } else {
                ID = 0;
            }

            var newItem = new item(ID, name, value);
            data.allItems.push(newItem);

            return newItem;

        },

        deleteItem: function (id) {
            var ids = data.allItems.map(function (currentVal) {

                return currentVal.id;

            });

            var index = ids.indexOf(parseInt(id, 10));

            if (index >= 0) {

                data.allItems.splice(index, 1);

            }

        },


        calculateSum: function () {

            calculateTotal();
            return {
                sum: data.totals,
            }

        },

        test: function () {
            console.log(data);
        },
    }

})();

var view = (function () {

    var DOMstrings = {

        name: '.name',
        value: '.value',
        btn: '.bought_btn',
        list: '.bought_list',
        sumLabel: '.total_value',
        container: '.container',
        month: '.month',
    }

    var formatting = function (number) {

        number = number.toFixed(2);
        number = number.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

        return number;

    };

    return {
        getInfo: function () {
            return {
                name: document.querySelector(DOMstrings.name).value,
                value: parseFloat(document.querySelector(DOMstrings.value).value),
            };

        },

        addListItem: function (object) {

            var newHTML;

            var element = DOMstrings.list;

            var html = '<div class="item clearfix" id = "%id%"><div class="item_name">%name%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="delete"><button class="delete_btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            newHTML = html.replace('%id%', object.id);
            newHTML = newHTML.replace('%name%', object.name);
            newHTML = newHTML.replace('%value%', formatting(object.value) + '元');

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },

        deleteListItem: function (id) {

            var element = document.getElementById(id);

            element.parentNode.removeChild(element);

        },

        clearInput: function () {

            var inputs = document.querySelectorAll(DOMstrings.name + ',' + DOMstrings.value);

            var inputArray = Array.prototype.slice.call(inputs);

            inputArray.forEach(function (currentVal) {

                currentVal.value = '';

            });

            inputArray[0].focus();

        },

        displaySum: function (object) {

            document.querySelector(DOMstrings.sumLabel).textContent = formatting(object.sum) + '元';

        },

        displayMonth: function () {

            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth();

            document.querySelector(DOMstrings.month).textContent = year + '年' + month + '月';

        },


        getDOMstrings: function () {

            return DOMstrings;
        },
    };


})();

var controller = (function (m, v) {

    var setupEventListener = function () {

        var DOMstrings = view.getDOMstrings();

        document.querySelector(DOMstrings.btn).addEventListener('click', addItem);

        document.addEventListener('keypress', function (event) {

            if (event.keycode === 13 || event.which === 13) {

                addItem();

            }

        });
        document.querySelector(DOMstrings.container).addEventListener('click', deleteItem);
    };

    var deleteItem = function (event) {

        var itemID = event.target.parentNode.parentNode.parentNode.id;
        // console.log(itemID);
        model.deleteItem(itemID);

        view.deleteListItem(itemID);

        updateTotal();

    };

    var updateTotal = function () {
        var sum = model.calculateSum();
        view.displaySum(sum);

    };

    var addItem = function () {

        var input = view.getInfo();
        // console.log(input);

        if (input.name !== '' && !isNaN(input.value) && input.value > 0) {

            var newItem = model.addItem(input.name, input.value);

            view.addListItem(newItem);

            view.clearInput();

            updateTotal();

        }

    };

    return {

        init: function () {

            console.log('APP started.');
            view.displayMonth();
            view.displaySum({
                sum: 0,
            });

            setupEventListener();
        }
    }


})(model, view);

controller.init();