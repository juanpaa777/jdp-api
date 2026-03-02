CREATE TABLE users (
    id SMALLINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL
);
CREATE TABLE tasks (
    id SMALLINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(250) NOT NULL,
    priority BOOLEAN NOT NULL,
    user_id SMALLINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (name, lastname) VALUES ('John', 'Doe');
INSERT INTO tasks (name, description, priority, user_id) VALUES ('Task 1', 'Description 1', TRUE, 1);
INSERT INTO tasks (name, description, priority, user_id) VALUES ('Task 2', 'Description 2', FALSE, 1);
