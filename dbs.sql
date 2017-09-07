create database `smulxtbvcmmmfwpf`;

use `smulxtbvcmmmfwpf`;

create table todos (
	id INT AUTO_INCREMENT NOT NULL,
    description VARCHAR(255),
    createdAt TIMESTAMP NOT NULL,
    PRIMARY KEY(id)
);

select * from todos;