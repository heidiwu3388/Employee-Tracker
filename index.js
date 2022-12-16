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
                "View All Departments",
                "View All Roles", 
                "View All Employees",
                "View Employee by Manager",
                "View Employee by Department",
                "View the Total Utilized Budget of a Department",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "Delete Department",
                "Delete Role",
                "Delete Empolyee",
                "Quit",
                new inquirer.Separator("---------- END OF THE LIST ----------"),
            ]
        }
    ])
    .then((answers) => {
        switch (answers.option) {
            case "View All Departments" :
                viewAllDepartments();
                break;
            case "View All Roles" :
                viewAllRoles();
                break;
            case "View All Employees" :
                viewAllEmployees();
                break;
            case "Quit" :
                process.exit(); //end the application
            default:
                chooseAnOption();
            }
    })
    .catch(error => console.error(error));
}


function viewAllDepartments() {
    const sql = "SELECT id, name AS department FROM department"
    db.query(sql, function (error, results) {
        if (error) throw error;
        console.log(" ");
        console.table(results);
        chooseAnOption();
    });

}

function viewAllRoles() {
    const sql = `SELECT role.id, role.title AS role, department.name AS department, role.salary
                FROM role
                JOIN department
                ON role.department_id = department.id`;

    db.query(sql, function (error, results) {
        if (error) throw error;
        console.log(" ");
        console.table(results);
        chooseAnOption();
    });
}

function viewAllEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, 
    department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM 
        employee
    LEFT JOIN 
        role ON employee.role_id = role.id
    LEFT JOIN 
        department ON role.department_id = department.id
    LEFT JOIN 
        employee AS manager ON employee.manager_id = manager.id`;
    
    db.query(sql, function (error, results) {
        if (error) throw error;
        console.log(" ");
        console.table(results);
        chooseAnOption();
    });
}