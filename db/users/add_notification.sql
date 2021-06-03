INSERT INTO notifications 
(user_id, description, game_id, user_interaction_id, user_interaction_username, user_interaction_picture)
VALUES
($1, $2, $3, $4, $5, $6)
RETURNING *;