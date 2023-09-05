const sequelize = require('../connection');
const express = require('express');
// const mysql = require('mysql2');
const inquirer = require('inquirer');

const app = express();
// const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

class Questionaire {
    constructor() {
        this.options = '';
        this.newDept = '';
        this.newRole = '';
        this.firstName = '';
        this.lastName = '';
        this.employeeRole = '';
        this.managerName = '';
        this.updatedEmployee = '';
    }

    async questions() {
        const { options } = await inquirer.prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee',
                ],
            },
        ]);
    
        this.options = options;
    
        switch (options) {
            case 'View all departments':
                await this.allDepartments();
                break;
            case 'View all roles':
                await this.allRoles();
                break;
            case 'View all employees':
                await this.allEmployees();
                break;
            case 'Add a department':
                await this.addDepartment();
                break;
            case 'Add a role':
                await this.addRole();
                break;
            case 'Add an employee':
                await this.addEmployee();
                break;
            case 'Update an employee':
                await this.updateEmployee();
                break;
        }
    
        const { finish } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'finish',
                message: 'Are you finished?',
            },
        ]);
    
        if (finish) {
            console.log('Goodbye!');
            process.exit();
        } else {
            this.questions();
        }
    }
    

    async addDepartment() {
        try {
            const { newDept } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'newDept',
                    message: 'What is the new department called?',
                },
            ]);
    
            await sequelize.query(`INSERT INTO department (department_name) VALUES (:newDept)`, {
                replacements: { newDept },
                type: sequelize.QueryTypes.INSERT,
            });
    
            console.log('New department added!');
        } catch (err) {
            console.error('Error adding department:', err);
        }
    }
    

    async addRole() {
        try {
            const { newRole } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'newRole',
                    message: 'What is the new role called?',
                },
            ]);
    
            await sequelize.query(`INSERT INTO role (title) VALUES (:newRole)`, {
                replacements: { newRole },
                type: sequelize.QueryTypes.INSERT,
            });
    
            console.log('New role added!');
        } catch (err) {
            console.error('Error adding role:', err);
        }
    }
    

    async addEmployee() {
        try {
            const roles = await this.allRoles();
            const managers = await this.allManagers();
    
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the first name of the new employee?',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the last name of the new employee?',
                },
                {
                    type: 'list',
                    name: 'employeeRole',
                    message: 'What is the role of the new employee?',
                    choices: roles.map((role) => role.name),
                },
                {
                    type: 'list',
                    name: 'managerName',
                    message: "Who is the employee's manager?",
                    choices: managers.map((manager) => manager.name),
                },
            ]);
    
            const role = roles.find((role) => role.name === answers.employeeRole);
            const manager = managers.find((manager) => manager.name === answers.managerName);
            
            this.firstName = answers.firstName;
            this.lastName = answers.lastName;
            this.employeeRole = role.value;
            this.managerName = manager.value;
    
            await sequelize.query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                {
                    replacements: [this.firstName, this.lastName, this.employeeRole, this.managerName],
                    type: sequelize.QueryTypes.INSERT,
                }
            );
    
            console.log('New employee added!');
        } catch (err) {
            console.error('Error adding employee:', err);
        }
    }
    

    async updateEmployee() {
        const employees = await this.allEmployees();
        const roles = await this.allRoles();
        const managers = await this.allManagers();
    
        const options = await inquirer.prompt([
            {
                type: 'list',
                name: 'update',
                message: 'What would you like to do?',
                choices: [
                    'Employee role',
                    'Employee manager',
                    'Terminate employee'
                ],
            },
        ]);
    
        switch (options.update) {
            case 'Employee role':
                await this.roleUpdate(employees, roles);
                break;
            case 'Employee manager':
                await this.managerUpdate(employees, managers);
                break;
            case 'Terminate employee':
                await this.terminateEmployee(employees);
                break;
        }
    }

    async terminateEmployee(employees) {
        const terminateEmployee = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedEmployee',
                message: 'Which employee would you like to terminate?',
                choices: employees.map((employee) => employee.name),
            }
        ]);

        const selectedEmployee = employees.find((employee) => employee.name === terminateEmployee.selectedEmployee);

        if (selectedEmployee) {
            this.updatedEmployee = selectedEmployee.value;

            await sequelize.query(
                `DELETE FROM employee WHERE id = ?`,
                {
                    replacements: [this.updatedEmployee],
                    type: sequelize.QueryTypes.DELETE,
                }
            );
            if (this.updatedEmployee) {
                console.log('Employee terminated successfully!');
            }
        } else {
            console.log('Error: Invalid employee selected.');
        }
    }
    
    async roleUpdate(employees, roles) {
        const roleUpdate = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedEmployee',
                message: "Which employee's role do you want to update?",
                choices: employees.map((employee) => employee.name),
            },
            {
                type: 'list',
                name: 'updateRole',
                message: "What is the employee's new role?",
                choices: roles.map((role) => role.name),
            }
        ]);
    
        const selectedEmployee = employees.find((employee) => employee.name === roleUpdate.selectedEmployee);
        const selectedRole = roles.find((role) => role.name === roleUpdate.updateRole);
    
        if (selectedEmployee && selectedRole) {
            this.employeeRole = selectedRole.value;
            this.chosenEmployee = selectedEmployee.value;
    
            await sequelize.query(
                `UPDATE employee SET role_id = ? WHERE id = ?`,
                {
                    replacements: [this.employeeRole, this.chosenEmployee],
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
    
            console.log('Employee role updated successfully!');
        } else {
            console.log('Error: Invalid employee or role selected.');
        }
    }
    
    async managerUpdate(employees, managers) {
        const managerUpdate = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedEmployee',
                message: "Which employee's manager do you want to update?",
                choices: employees.map((employee) => employee.name),
            },
            {
                type: 'list',
                name: 'updateManager',
                message: "Who is the employee's new manager?",
                choices: managers.map((manager) => manager.name),
            }
        ]);
    
        const selectedEmployee = employees.find((employee) => employee.name === managerUpdate.selectedEmployee);
        const selectedManager = employees.find((employee) => employee.name === managerUpdate.updateManager);
    
        if (selectedEmployee && selectedManager) {
            this.managerName = selectedManager.value;
            this.employeeName = selectedEmployee.value;
    
            await sequelize.query(
                `UPDATE employee SET manager_id = ? WHERE id = ?`,
                {
                    replacements: [this.managerName, this.employeeName],
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
    
            console.log('Employee manager updated successfully!');
        } else {
            console.log('Error: Invalid employee or manager selected.');
        }
    }
    
    
    

    allDepartments() {
        console.log('fetching departments');
        sequelize.query(`SELECT id, department_name FROM department`, {
            type: sequelize.QueryTypes.SELECT,
        }).then((results) => {
            console.log(results);
            const departments = results.map((row) => ({
                value: row.id,
                name: row.department_name,
            }));
        }).catch((err) => {
            console.error('Error fetching departments:', err);
        });
    }

    allRoles() {
        console.log('fetching roles');
        return sequelize.query(`SELECT * FROM role`, {
            type: sequelize.QueryTypes.SELECT,
        }).then((results) => {
            console.log(results);
            const roles = results.map((row) => ({
                value: row.id,
                name: row.title,
            }));
            return roles;
        }).catch((err) => {
            console.error('Error fetching roles:', err);
            return [];
        });
    }
    
    allEmployees() {
        console.log('fetching employees');
        return sequelize.query(`SELECT id, first_name, last_name, role_id FROM employee`, {
            type: sequelize.QueryTypes.SELECT,
        }).then((results) => {
            console.log(results);
            const employees = results.map((row) => ({
                value: row.id,
                name: row.first_name + ' ' + row.last_name,
            }));
            return employees;
        }).catch((err) => {
            console.error('Error fetching employees:', err);
            return [];
        });
    }
    
    allManagers() {
        console.log('fetching managers');
        return sequelize.query(`SELECT id, first_name, last_name FROM employee WHERE role_id <= 4`, {
            type: sequelize.QueryTypes.SELECT,
        })
        .then((results) => {
            console.log(results);
            const managers = results.map((row) => ({
                value: row.id,
                name: row.first_name + ' ' + row.last_name,
            }));
            
            return managers;
        })
        .catch((err) => {
            console.error('Error fetching managers:', err);
            return [];
        });
    }
    
    
}

module.exports = Questionaire;


