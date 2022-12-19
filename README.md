# Employee-Tracker

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

## Description

This is a command-line application that allows non-developers to easily view and interact with information stored in a company's employee database. This is implemented using Node.js, Inquirer and MySQL.

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Screenshot](#screenshot)
* [License](#license) 

## Installation
1. download all files from this repo
2. install all dependencies
```
npm install

```
3. create database schema
```
mysql -u root -p
```
```
mysql> source ./db/schema.sql
```
4. run the application
```
node index.js
```

## Usage

- please refer to this video [https://youtu.be/ScNsDF_SYls](https://youtu.be/ScNsDF_SYls) for a demo of how to use this application.
- When the application starts, the following options will be presented:
    - View All Departments
    - Add Department
    - Delete Department
    - View All Roles
    - Add Role
    - Delete Role
    - View All Employees
    - Add Employee
    - Update Employee Role
    - Update Employee Manager
    - Delete Empolyee
    - View Employee by Manager
    - View Employee by Department
    - View the Total Utilized Budget of a Department
    - Quit
- When users choose one of the options, the corresponding data will be retrieved and be displayed in a formatted table.


## Screenshot
- The design of the database schema
![Database Schema](./assets/images/database_schema.png)
- When application starts:
![Application Starts](./assets/images/001_Options.png)
- View All Departments:
![View All Departments](./assets/images/002_View_All_Departments.png)
- Add Department:
![Add Department](./assets/images/003_Add_Department.png)
- Delete Department:
![Delete Department](./assets/images/004_Delete_Department.png)
- View All Roles:
![View All Roles](./assets/images/005_View_All_Roles.png)
- Add Role:
![Add Role](./assets/images/006_Add_Role.png)
- Delete Role:
![Delete Role](./assets/images/007_Delete_Role.png)
- View All Employees:
![View All Employees](./assets/images/008_View_All_Employees.png)
- Add Employee:
![Add Employee](./assets/images/009_Add_Employee.png)
- Update Employee Role:
![Update Employee Role](./assets/images/010_Update_Employee_Role.png)
- Update Employee Manager:
![Update Employee Manager](./assets/images/011_Update_Employee_Manager.png)
- Delete Employee:
![Delete Employee](./assets/images/012_Delete_Employee.png)
- View Employee by Manager:
![View Employee by Manager](./assets/images/013_View_Employee_By_Manager.png)
- View Employee by Department:
![View Employee by Department](./assets/images/014_View_Employee_By_Department.png)
- View the Total Utilized Budget of a Department:
![View the Total Utilized Budget of a Department](./assets/images/015_View_Budget_Of_Department.png)

## License

MIT