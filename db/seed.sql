CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
username VARCHAR(200),
password VARCHAR(2000),
email VARCHAR(200),
birth_year INT,
gender VARCHAR(20),
picture VARCHAR(500)
);

CREATE TABLE games (
game_id SERIAL PRIMARY KEY,
title VARCHAR(1000),
icon VARCHAR(1000),
creator INT REFERENCES users (user_id),
public BOOLEAN,
gender VARCHAR(20),
date VARCHAR(1000),
time VARCHAR(1000),
address VARCHAR(2000),
latitude FLOAT,
longitude FLOAT,
description VARCHAR(3000),
player_count INT,
max_players INT
);

CREATE TABLE player_game_junction (
game_id INT references games(game_id),
user_id INT references users(user_id)
);

CREATE TABLE friends_junction(
user_id INT REFERENCES users(user_id),
friend_id INT REFERENCES users(user_id),
accepted BOOLEAN);