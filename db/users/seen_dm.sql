UPDATE dms SET seen = true WHERE (user_id = $1 AND dm_to = $2);