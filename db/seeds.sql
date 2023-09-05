USE employee_db;

INSERT INTO department (id, department_name)
VALUES
    (1, 'HR'),
    (2, 'Front House'),
    (3, 'Back House'),
    (4, 'Management');


INSERT INTO role (id, title, salary, department_id)
VALUES
    (1,'General Manager', 100000, 4),
    (2,'HR Manager', 60000, 4),
    (3,'FOH Manager', 70000, 4),
    (4,'Head Chef', 70000, 4),
    (5,'Line Cook', 50000, 3),
    (6,'Prep Cook', 40000, 3),
    (7,'Server', 30000, 2),
    (8,'Bartender', 30000, 2),
    (9,'Host', 25000, 2),
    (10, 'HR Specialist', 50000, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Alice', 'Johnson', 1, NULL), -- general manager
    (2, 'Bob', 'Smith', 2, 1), -- HR manager
    (3, 'Eve', 'Williams', 3, 1), -- FOH manager
    (4, 'Frank', 'Davis', 4, 1), -- head chef
    (5, 'Grace', 'Martinez', 5, 4), -- line cook
    (6, 'Hannah', 'Anderson', 6, 4), -- prep cook
    (7, 'Isaac', 'Taylor', 7, 3), -- server
    (8, 'James', 'Clark', 8, 3), -- bartender
    (9, 'Lily', 'Moore', 9, 3), -- host
    (10, 'Oliver', 'Walker', 10, 2); -- HR specialist

SHOW TABLES;
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
