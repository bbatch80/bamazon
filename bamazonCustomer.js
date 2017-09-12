var mysql = require("mysql");

var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "pbdbfa64",
    database: "bamazon"

});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected to mysql: " + connection.threadId)
    showProducts();

});

function showProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("Items for sale:")
        for (i = 0; i < res.length; i++) {
            console.log(res[i].id + ". " + res[i].product_name + " - $" + res[i].price)
        };


        inquirer.prompt([{
                type: "input",
                message: "Please Enter the ID of the product you would like to purchase.",
                name: "id",
            },
            {
                type: "input",
                message: "How many units of the product would you like to purchase?",
                name: "units",
            }

        ]).then(function(order) {
            var orderAmount = order.units;
            var orderId = order.id;
            connection.query("SELECT * FROM products WHERE id =" + order.id, function(err, res) {
                if (err) throw err;
                var price = res[0].price
                if (orderAmount < res[0].stock_quantity) {

                    console.log("It's your lucky day! There are " + res[0].stock_quantity + " " + res[0].product_name + "'s in stock!");
                    connection.query("UPDATE products SET stock_quantity = stock_quantity - " + orderAmount + " WHERE ID = " + orderId, function(err, res) {
                        if (err) throw err;
                        var total = price * orderAmount;
                        console.log("Thank you! Your ordered has been processed. Your total cost is $" + total + ".");
                        console.log("Stock amount updated.");

                    });
                } else {
                    console.log("Insufficient Quantity of " + res[0].product_name + "'s!");
                }
            });
        });
    });
}