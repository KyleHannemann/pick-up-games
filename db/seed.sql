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

CREATE TABLE game_comments(
comment_id SERIAL PRIMARY KEY,
comment_username VARCHAR(2000),
user_id INT REFERENCES users(user_id),
content VARCHAR(2000),
game_id INT REFERENCES games(game_id),
time_stamp VARCHAR(2000),
reply BOOLEAN,
reply_to INT REFERENCES game_comments(comment_id));

CREATE TABLE notifications(
notification_id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(user_id),
description VARCHAR(200),
game_id INT REFERENCES games(game_id),
user_interaction_id INT REFERENCES users(user_id),
user_interaction_username VARCHAR(500),
user_interaction_picture VARCHAR(2000));

CREATE TABLE dms(
dm_id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(user_id),
dm_to INT REFERENCES users(user_id),
content VARCHAR(2000),
timestamp VARCHAR(2000),
seen BOOLEAN
);

/*RESET ALL BUT USERS*/
DROP TABLE player_game_junction;
DROP TABLE friends_junction;
DROP TABLE game_comments;
DROP TABLE notifications;
DROP TABLE dms;
DROP TABLE games;