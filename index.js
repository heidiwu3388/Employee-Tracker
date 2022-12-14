// import all required packages
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");

// create database connection configuration
const db = mysql.createConnection(
      {
        host: "localhost",
        user: "root",
        password: "rootroot",
        database: "employee_db",
      },
    )

// connect to the database
db.connect(error => {
    if (error) throw error;
    console.log("--- employee_db connected ----");
    console.log("******************************");
    console.log("*         WELCOME TO         *");
    console.log("*      EMPLOYEE TRACKER      *");
    console.log("******************************");
    chooseAnOption();
});    

function chooseAnOption() {
    // ask user to choose an option
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "option",
            choices: [
                new inquirer.Separator("---- Departments ----"),
                "View All Departments",
                "Add Department",
                "Delete Department",
                "View the Total Utilized Budget of a Department",
                new inquirer.Separator("------- Roles -------"),
                "View All Roles", 
                "Add Role",
                "Delete Role",
                new inquirer.Separator("----- Employees -----"),
                "View All Employees",
                "Add Employee",
                "Delete Empolyee",
                "Update Employee Role",
                "Update Employee Manager",
                "View Employee by Manager",
                "View Employee by Department",
                new inquirer.Separator("--------------------"),
                "Quit",
                new inquirer.Separator("*********** END OF THE LIST ***********"),
            ]
        }
    ])
    .then((answers) => {
        switch (answers.option) {
            case "View All Departments" :
                viewAllDepartment();
                break;
            case "Quit" :
                process.exit(); //end the application
            default:
                chooseAnOption();
            }
    })
    .catch(error => console.error(error));
}


function viewAllDepartment() {
    db.query('SELECT id, name AS department FROM department', function (error, results) {
        if (error) throw error;
        console.log(" ");
        console.table(results);
        chooseAnOption();
    });

}
