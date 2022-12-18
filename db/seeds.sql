INSERT INTO department (name)
VALUES ("Sales"),
       ("Marketing"),
       ("Accounting"),
       ("Human Resources"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 200000, NULL),
       ("Sales Manager", 120000, 1),
       ("Sales", 80000, 1),
       ("Marketing Manager", 120000, 2),
       ("Marketing associate", 80000, 2),
       ("Accounting Manager", 120000, 3),
       ("Accounting associate", 80000, 3),
       ("HR Manager", 120000, 4),
       ("HR associate", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andy", "Jassy", 1, NULL),
       ("Kimberly", "Powell", 2, 1),
       ("Taryn", "Howe", 3, 2),
       ("Cortez", "Hopkins", 3, 2),
       ("Fisher", "Hall", 3, 2),
       ("Jamie", "Eaton", 4, 1),
       ("Francisco", "Garza", 5, 6),
       ("Everette", "Bruce", 5, 6),
       ("Helen", "Marshall", 5, 6),
       ("Chaya", "Norman", 6, 1),
       ("Dylan", "Boyer", 7, 10),
       ("Ali", "Benson", 7, 10),
       ("Darrell", "Dean", 7, 10),
       ("Stephanie", "Walker", 7, 10),
       ("Halle", "Howard", 8, 1),
       ("Marcelo", "Hines", 9, 15),
       ("Johnny", "Horn", 9, 15),
       ("Alberto", "Suarez", 9, 15);