INSERT INTO dms (user_id, dm_to, content, timestamp, seen) VALUES
($1, $2, $3, $4, $5) RETURNING *;