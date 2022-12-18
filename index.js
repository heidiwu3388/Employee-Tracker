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
                "Add Department",
                "Delete Department",
                "View All Roles", 
                "Add Role",
                "Delete Role",
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "Delete Empolyee",
                "View Employee by Manager",
                "View Employee by Department",
                "View the Total Utilized Budget of a Department",
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
            case "Add Department" :
                addDepartment();
                break;
            case "Delete Department" :
                deleteDepartment();
                break;
            case "View All Roles" :
                viewAllRoles();
                break;
            case "Add Role" :
                addRole();
                break;
            case "Delete Role" :
                deleteRole();
                break;
            case "View All Employees" :
                viewAllEmployees();
                break;
            case "Add Employee" :
                addEmployee();
                break;
            case "Update Employee Role" :
                updateEmployeeRole();
                break;
            case "Update Employee Manager" :
                updateEmployeeManager();
                break;
            case "Delete Empolyee" :
                deleteEmployee();
                break;
            case "View Employee by Manager" :
                viewEmployeeByManager();
                break;
            case "View Employee by Department" :
                viewEmployeeByDepartment();
                break;
            case "View the Total Utilized Budget of a Department" :
                viewTotalUtilizedBudget();
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
    const sql = "SELECT id, name AS department FROM department ORDER BY id";
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
            name: "departmentName",
            validate: validateRequiredInput
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

function deleteDepartment() {
    // query to get the list of departments
    const sql = `
        SELECT 
            * 
        FROM 
            department
        ORDER BY
            name`;
    db.query(sql, function (error, results) {
        if (error) throw error;
        const departmentList = results.map((department) => {return {name: department.name, value: department.id}});
        // ask user to choose a department to delete
        inquirer.prompt([
            {
                type: "list",
                message: "Which department would you like to delete?",
                name: "departmentId",
                choices: departmentList
            }
        ])
        .then((answers) => {
            // delete the department from the database
            const sql = `DELETE FROM department WHERE id = ${answers.departmentId}`;
            db.query(sql, function (error, results) {
                if (error) throw error;
                console.log(chalk.green(`Department deleted successfully!\n`));
                chooseAnOption();
            });
        })
        .catch(error => console.error(error));
    });
}

function viewAllRoles() {
    // query to get the list of roles
    const sql = `SELECT role.id, role.title AS role, department.name AS department, role.salary
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id
                ORDER BY role.id`;

    db.query(sql, function (error, results) {
        if (error) throw error;
        console.log(" ");
        console.table(results);
        chooseAnOption();
    });
}

function addRole() {
    // query to get the list of departments
    const sql = "SELECT * FROM department ORDER BY name";
    db.query(sql, function (error, results) {
        if (error) throw error;
        const departmentList = results.map((department) => {return {name: department.name, value: department.id}});
        // ask user to enter the role information
        inquirer.prompt([
            {
                type: "input",
                message: "What is the title of the role?",
                name: "roleTitle",
                validate: validateRequiredInput
            },
            {
                type: "input",
                message: "What is the salary of the role?",
                name: "roleSalary",
                validate: validateRequiredNumber
            },
            {
                type: "list",
                message: "Which department does the role belong to?",
                name: "roleDepartment",
                choices: departmentList
            }
        ])
        .then((answers) => {
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

function deleteRole() {
    // query to get the list of roles
    let sql = "SELECT * FROM role ORDER BY department_id, title";
    db.query(sql, function (error, results) {
        if (error) throw error;
        const roleList = results.map((role) => {return {name: role.title, value: role.id}});
        // ask user to choose a role to delete
        inquirer.prompt([
            { 
                type: "list",
                message: "Which role would you like to delete?",
                name: "roleId",
                choices: roleList
            }
        ])
        .then((answers) => {
            // delete the role from the database
            sql = `DELETE FROM role WHERE id = ${answers.roleId}`;
            db.query(sql, function (error, results) {
                if (error) throw error;
                console.log(chalk.green(`Role deleted successfully!\n`));
                chooseAnOption();
            });
        })
        .catch(error => console.error(error));
    });
}
function viewAllEmployees() {
    // query to get the list of employees
    const sql = `SELECT 
                    employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title AS role, 
                    department.name AS department, 
                    role.salary, 
                    CONCAT(manager.first_name, " ", manager.last_name) AS manager
                FROM 
                    employee
                LEFT JOIN 
                    role ON employee.role_id = role.id
                LEFT JOIN 
                    department ON role.department_id = department.id
                LEFT JOIN 
                    employee AS manager ON employee.manager_id = manager.id
                ORDER BY
                    employee.id`;
    db.query(sql, function (error, results) {
        if (error) throw error;
        console.log(" ");
        console.table(results);
        chooseAnOption();
    });
}



function addEmployee() {
    // query to get the list of roles
    let sql = "SELECT * FROM role ORDER BY department_id, title";
    db.query(sql, function (error, results) {
        if (error) throw error;
        const roleList = results.map((role) => {return {name: role.title, value: role.id}});
        // query to get the list of managers
        sql = "SELECT * FROM employee ORDER BY first_name, last_name";
        db.query(sql, function (error, results) {
            if (error) throw error;
            const managerList = results.map((manager) => {return {name: manager.first_name + " " + manager.last_name, value: manager.id}});
            managerList.unshift({name: "None", value: null});
            // prompt the user to enter the employee information
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the first name of the employee?",
                    name: "employeeFirstName",
                    validate: validateRequiredInput
                    
                },
                {
                    type: "input",
                    message: "What is the last name of the employee?",
                    name: "employeeLastName",
                    validate: validateRequiredInput
                },
                {
                    type: "list",
                    message: "What is the role of the employee?",
                    name: "employeeRoleId",
                    choices: roleList
                },
                {
                    type: "list",
                    message: "Who is the manager of the employee?",
                    name: "employeeManagerId",
                    choices: managerList
                }
            ])
            .then((answers) => {
                // insert the employee information into the database
                sql = `
                    INSERT INTO 
                        employee (first_name, last_name, role_id, manager_id) 
                    VALUES (
                        "${answers.employeeFirstName}", 
                        "${answers.employeeLastName}", 
                        ${answers.employeeRoleId},
                        ${answers.employeeManagerId}
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

function updateEmployeeRole() {
    // query to get the list of employees
    let sql = "SELECT * FROM employee";
    db.query(sql, function (error, results) {
        if (error) throw error;
        const employeeList = results.map((employee) => {return {name: employee.first_name + " " + employee.last_name, value: employee.id}});
        // query to get the list of roles
        sql = "SELECT * FROM role";
        db.query(sql, function (error, results) {
            if (error) throw error;
            const roleList = results.map((role) => {return {name: role.title, value: role.id}});
            // prompt the user to enter the employee information
            inquirer.prompt([
                {
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    name: "employee",
                    choices: employeeList
                },
                {
                    type: "list",
                    message: "What is the new role of the employee?",
                    name: "employeeRole",
                    choices: roleList
                }
            ])
            .then((answers) => {
                // update the employee information into the database
                sql = `
                    UPDATE 
                        employee 
                    SET 
                        role_id = ${answers.employeeRole}
                    WHERE 
                        id = ${answers.employee}`;
                db.query(sql, function (error, results) {
                    if (error) throw error;
                    console.log(chalk.green(`Employee role updated successfully!\n`));
                    chooseAnOption();
                });
            })
            .catch(error => console.error(error));
        });
    });
}

function updateEmployeeManager() {
    // query to get the list of employees
    let sql = "SELECT * FROM employee";
    db.query(sql, function (error, results) {
        if (error) throw error;
        const employeeList = results.map((employee) => {return {name: employee.first_name + " " + employee.last_name, value: employee.id}});
        // prompt the user to enter the employee information
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee's manager do you want to update?",
                name: "employee",
                choices: employeeList
            },
        ])
        .then((answers) => {
            const employeeId = answers.employee;
            // filter the list of employees to remove the employee whose manager is being updated
            const managerList = employeeList.filter((manager) => manager.value !== employeeId);
            // prompt the user to enter the employee information
            inquirer.prompt([
                {
                    type: "list",
                    message: "Who is the new manager of the employee?",
                    name: "employeeManager",
                    choices: managerList
                }
            ])
            .then((answers) => {
                sql = `
                    UPDATE 
                        employee 
                    SET 
                        manager_id = ${answers.employeeManager}
                    WHERE 
                        id = ${employeeId}`;
                db.query(sql, function (error, results) {
                    if (error) throw error;
                    console.log(chalk.green(`Employee manager updated successfully!\n`));
                    chooseAnOption();
                });
            });
        })
        .catch(error => console.error(error));
    });
};

function deleteEmployee() {
    // query to get the list of employees
    let sql = "SELECT * FROM employee";
    db.query(sql, function (error, results) {
        if (error) throw error;
        const employeeList = results.map((employee) => {return {name: employee.first_name + " " + employee.last_name, value: employee.id}});
        // prompt the user to enter the employee information
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee do you want to delete?",
                name: "employeeId",
                choices: employeeList
            }
        ])
        .then((answers) => {
            sql = `
                DELETE FROM 
                    employee 
                WHERE 
                    id = ${answers.employeeId}`;
            db.query(sql, function (error, results) {
                if (error) throw error;
                console.log(chalk.green(`Employee deleted successfully!\n`));
                chooseAnOption();
            }
        )})
        .catch(error => console.error(error));
    });
}

function viewEmployeeByManager() {
    // query to get the list of managers
    let sql = `
        SELECT DISTINCT
            manager.first_name, 
            manager.last_name,
            manager.id
        FROM 
            employee 
        INNER JOIN
            employee AS manager ON employee.manager_id = manager.id
        ORDER BY manager.first_name, manager.last_name`; 
    db.query(sql, function (error, results) {
        if (error) throw error;
        const managerList = results.map((manager) => {return {name: manager.first_name + " " + manager.last_name, value: manager.id}});
        // add an option to view employees of all managers
        managerList.unshift({name: "All Managers", value: 0});
        // prompt the user to enter the employee information
        inquirer.prompt([
            {
                type: "list",
                message: "Which manager‘s employees do you want to view?",
                name: "managerId",
                choices: managerList
            }
        ])
        .then((answers) => {
            console.log(chalk.green())
            if (answers.managerId === 0) { // if the user wants to view employees of all managers
                sql = `
                    SELECT
                        CONCAT(manager.first_name, ' ', manager.last_name) AS manager,
                        employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department, 
                        role.salary
                    FROM 
                        employee 
                    JOIN 
                        employee AS manager ON employee.manager_id = manager.id
                    LEFT JOIN 
                        role ON employee.role_id = role.id
                    LEFT JOIN 
                        department ON role.department_id = department.id
                    ORDER BY 
                        manager`;
            } else { // if the user wants to view employees of a specific manager
                sql = `
                    SELECT
                        employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department, 
                        role.salary
                    FROM 
                        employee
                    LEFT JOIN 
                        role ON employee.role_id = role.id
                    LEFT JOIN 
                        department ON role.department_id = department.id
                    LEFT JOIN 
                        employee AS manager ON employee.manager_id = manager.id
                    WHERE 
                        manager.id = ${answers.managerId}`;
            }
            db.query(sql, function (error, results) {
                if (error) throw error;
                console.log(" ");
                console.table(results);
                chooseAnOption();
            });
        })
        .catch(error => console.error(error));
    });
}

function viewEmployeeByDepartment() {
    // query to get the list of departments
    let sql = "SELECT * FROM department ORDER BY name";
    db.query(sql, function (error, results) {
        if (error) throw error;
        const departmentList = results.map((department) => {return {name: department.name, value: department.id}});
        // add option to view employees of all departments
        departmentList.unshift({name: "All Departments", value: 0});
        inquirer.prompt([
            {
                type: "list",
                message: "Which department's employees do you want to view?",
                name: "departmentId",
                choices: departmentList
            }
        ])
        .then((answers) => {
            if (answers.departmentId === 0) { // if the user wants to view employees of all departments
                sql = `
                    SELECT
                        department.name AS department, 
                        employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        role.salary,
                        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                    FROM 
                        employee 
                    LEFT JOIN 
                        role ON employee.role_id = role.id
                    LEFT JOIN
                        employee AS manager ON employee.manager_id = manager.id
                    JOIN 
                        department ON role.department_id = department.id
                    ORDER BY 
                        department`;
            } else { // if the user wants to view employees of a specific department
                sql = `
                    SELECT
                        employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        role.salary,
                        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                    FROM 
                        employee 
                    LEFT JOIN 
                        role ON employee.role_id = role.id
                    LEFT JOIN
                        employee AS manager ON employee.manager_id = manager.id
                    JOIN 
                        department ON role.department_id = department.id
                    WHERE
                        department.id = ${answers.departmentId}`;
            }
            db.query(sql, function (error, results) {
                if (error) throw error;
                console.log(" ");
                console.table(results);
                chooseAnOption();
            });
        })
        .catch(error => console.error(error));
    });
}


function viewTotalUtilizedBudget() {
    // query to get the list of departments
    let sql = "SELECT * FROM department";
    db.query(sql, function (error, results) {
        if (error) throw error;
        // create an array of department objects
        const departmentList = results.map((department) => {return {name: department.name, value: department.id}});
        // add the option to view the total utilized budget of all departments
        departmentList.unshift({name: "All Departments", value: 0});
        // prompt the user to enter the department information
        inquirer.prompt([
            {
                type: "list",
                message: "Which department's total utilized budget do you want to view?",
                name: "departmentId",
                choices: departmentList
            }
        ])
        .then((answers) => {
            let sql;
            if (answers.departmentId === 0) { // all departments
                // query to get the total utilized budget of all departments
                sql = `
                    SELECT 
                        department.name AS department,
                        SUM(role.salary) AS total_budget
                    FROM
                        department
                    LEFT JOIN
                        role ON role.department_id = department.id
                    LEFT JOIN
                        employee ON employee.role_id = role.id
                    GROUP BY
                        department.name
                    ORDER BY
                        department.name`;
            } else { // specific department
                // query to get the total utilized budget of a specific department
                sql = `
                    SELECT 
                        department.name AS department,
                        SUM(role.salary) AS total_budget
                    FROM
                        department
                    LEFT JOIN
                        role ON role.department_id = department.id
                    LEFT JOIN
                        employee ON employee.role_id = role.id
                    WHERE
                        department.id = ${answers.departmentId}
                    ORDER BY
                        department.name`;
            }
            db.query(sql, function (error, results) {
                if (error) throw error;
                console.log("");
                console.table(results);
                chooseAnOption();
            });
        })
        .catch(error => console.error(error));
    });
}

function validateRequiredInput(name) {
    // reject for empty string
    if (name.trim().length <= 0) {
        console.log(chalk.red("\nCannot be blank!"))
        return false;
    }
    return true;
}

function validateRequiredNumber(id) {
    // reject for empty string
    if (id.trim().length <= 0) {
        console.log(chalk.red("\nCannot be blank!"))
        return false;
    }
    // reject for non-number
    if (isNaN(id.trim())) {
        console.log(chalk.red("\nMust be a number!"))
        return false
    }
    return true;
}