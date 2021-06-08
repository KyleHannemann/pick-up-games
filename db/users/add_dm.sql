INSERT INTO dms (user_id, dm_to, content) VALUES
($1, $2, $3) RETURNING *;