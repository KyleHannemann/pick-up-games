UPDATE users SET username = $1, password = $2, email = $3, picture = $4 
WHERE email = $5 RETURNING *;