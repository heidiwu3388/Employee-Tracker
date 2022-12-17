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
            case "Add Department" :
                addDepartment();
                break;
            case "Add Role" :
                addRole();
                break;
            case "Add Employee" :
                addEmployee();
                break;
            case "Quit" :
                process.exit(0); //end the application
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

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "departmentName"
        }
    ])
    .then((answers) => {
        const sql = `INSERT INTO department (name) VALUES ("${answers.departmentName}")`;
        db.query(sql, function (error, results) {
            if (error) throw error;
            console.log(chalk.green(`${answers.departmentName} Department added successfully!\n`));
            chooseAnOption();
        });
    })
    .catch(error => console.error(error));
}

function addRole() {
    // query to get the list of departments
    const sql = "SELECT * FROM department";
    db.query(sql, function (error, results) {
        if (error) throw error;
        const departmentList = results.map((department) => {return {name: department.name, value: department.id}});
        console.log("departmentList: ", departmentList);
        // ask user to enter the role information
        inquirer.prompt([
            {
                type: "input",
                message: "What is the title of the role?",
                name: "roleTitle"
            },
            {
                type: "input",
                message: "What is the salary of the role?",
                name: "roleSalary"
            },
            {
                type: "list",
                message: "Which department does the role belong to?",
                name: "roleDepartment",
                choices: departmentList
            }
        ])
        .then((answers) => {
            console.log("answers: ", answers);
            // insert the role information into the database
            const sql = `
            INSERT INTO 
                role (title, salary, department_id) 
            VALUES 
                ("${answers.roleTitle}", ${answers.roleSalary}, ${answers.roleDepartment})`;
            db.query(sql, function (error, results) {
                if (error) throw error;
                console.log(chalk.green(`${answers.roleTitle} Role added successfully!\n`));
                chooseAnOption();
            });
        })
        .catch(error => console.error(error));
    });
}

function addEmployee() {
    // query to get the list of roles
    let sql = "SELECT * FROM role";
    db.query(sql, function (error, results) {
        if (error) throw error;
        const roleList = results.map((role) => {return {name: role.title, value: role.id}});
        // query to get the list of managers
        sql = "SELECT * FROM employee";
        db.query(sql, function (error, results) {
            if (error) throw error;
            const managerList = results.map((manager) => {return {name: manager.first_name + " " + manager.last_name, value: manager.id}});
            // prompt the user to enter the employee information
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the first name of the employee?",
                    name: "employeeFirstName"
                },
                {
                    type: "input",
                    message: "What is the last name of the employee?",
                    name: "employeeLastName"
                },
                {
                    type: "list",
                    message: "What is the role of the employee?",
                    name: "employeeRole",
                    choices: roleList
                },
                {
                    type: "list",
                    message: "Who is the manager of the employee?",
                    name: "employeeManager",
                    choices: managerList
                }
            ])
            .then((answers) => {
                sql = `
                    INSERT INTO 
                        employee (first_name, last_name, role_id, manager_id) 
                    VALUES (
                        "${answers.employeeFirstName}", 
                        "${answers.employeeLastName}", 
                        "${answers.employeeRole}",
                        "${answers.employeeManager}"
                    )`;
                db.query(sql, function (error, results) {
                    if (error) throw error;
                    console.log(chalk.green(`${answers.employeeFirstName} ${answers.employeeLastName} added successfully!\n`));
                    chooseAnOption();
                });
            })
            .catch(error => console.error(error));
        });
    });
}