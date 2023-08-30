
INSERT INTO department (id, name)
VALUES
    (1, 'HR'),
    (2, 'Front House'),
    (3, 'Back House'),
    (4, 'Management');


INSERT INTO role (id, title, salary, department_id)
VALUES
    (1, 'HR Specialist', 40000, 1),
    (2, 'HR Manager', 60000, 4),
    (3, 'Prep Cook', 45000, 3),
    (4, 'Line Cook', 50000, 3),
    (5, 'Head Chef', 70000, 4),
    (6, 'Host', 30000, 2),
    (7, 'Server', 40000, 2),
    (8, 'Bartender', 50000, 2),
    (9, 'FOH Manager', 70000, 4),
    (10, 'General Manager', 100000, 4)
    ;

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    ('Alice', 'Johnson', 1, 2),       -- HR Specialist
    ('Bob', 'Smith', 2, NULL),             -- HR Manager
    ('Eve', 'Williams', 3, 5),       -- Prep Cook
    ('Frank', 'Davis', 4, 5),           -- Line Cook
    ('Grace', 'Martinez', 5, NULL),     -- Head Chef
    ('Hannah', 'Anderson', 6, 9),       -- Host
    ('Isaac', 'Taylor', 7, 9),          -- Server
    ('James', 'Clark', 8, 9),           -- Bartender
    ('Lily', 'Moore', 9, NULL),         -- FOH Manager
    ('Oliver', 'Walker', 10, NULL);     -- General Manager
