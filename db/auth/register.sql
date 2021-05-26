INSERT INTO users (username, password, email, birth_year, gender, picture)
VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;