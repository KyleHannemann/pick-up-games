INSERT INTO game_comments(
comment_username, user_id, content, game_id, time_stamp)
VALUES ($1, $2, $3, $4, $5);