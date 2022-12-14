// import all required packages
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");


console.log("******************************");
console.log("*         WELCOME TO         *");
console.log("*      EMPLOYEE TRACKER      *");
console.log("******************************");
chooseAnOption();

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
            case "" :
                break;
            case "Quit" :
                return; //end the application
            }
        return chooseAnOption();
    })
}