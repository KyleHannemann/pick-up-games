INSERT INTO game_comments(
comment_username, user_id, content, game_id, time_stamp, reply, reply_to)
VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;