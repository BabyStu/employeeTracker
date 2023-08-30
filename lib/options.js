const sequelize = require('./connection');
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});

class Questionaire {
    constructor() {
        this.options = '';
        this.newDept = '';
        this.newRole = '';  
        this.firstName = '';
        this.lastName = '';
        this.employeeRole = '';
        this.managerName = '';
        this.updateEmployee = '';
    }
    questions() {
    return inquirer
        .prompt([
            {
                name: 'options',
                type: 'list',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role'
                ]
            },
            {
                type: 'input',
                name: 'newDept',
                message: 'What is the new department called?',
                when: (answers) => answers.options === 'Add a department',
            },
            {
                type: 'input',
                name: 'newRole',
                message: 'What is the new role called?',
                when: (answers) => answers.options === 'Add a role',
            },
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the first name of the new employee?',
                when: (answers) => answers.options === 'Add an employee',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of the new employee?',
                when: (answers) => answers.options === 'Add an employee',
            },
            {
                type: 'list',
                name: 'employeeRole',
                message: 'What is the role of the new employee?',
                when: (answers) => answers.options === 'Add an employee',
                choices: function () {
                    return allRoles();
                }
            },
            {
                type: 'list',
                name: 'managerName',
                message: 'Who is the employees manager?',
                when: (answers) => answers.options === 'Add an employee',
                choices: function () {
                    return allManagers();
                }
            },
            {
                type: 'list',
                name: 'updateEmployee',
                message: 'Which employees role do you want to update?',
                when: (answers) => answers.options === 'Update an employee role',
                choices: function () {
                    return allEmployees();
                }
            },

        ])
        .then((answers) => {
            this.options = answers.options;
            this.newDept = answers.newDept;
            this.newRole = answers.newRole;
            this.firstName = answers.firstName;
            this.lastName = answers.lastName;
            this.employeeRole = answers.employeeRole;
            this.managerName = answers.managerName;
            this.updateEmployee = answers.updateEmployee;
        })
        
}
}