CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
username VARCHAR(200),
password VARCHAR(2000),
email VARCHAR(200),
birth_year INT,
gender VARCHAR(20),
picture VARCHAR(500)
);
