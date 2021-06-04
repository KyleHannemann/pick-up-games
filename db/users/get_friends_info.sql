SELECT u.user_id, u.username, u.email, u.picture,
u.birth_year, u.gender FROM users u JOIN friends_junction f
ON f.user_id = u.user_id OR f.friend_id = u.user_id WHERE f.accepted = true AND
(f.friend_id = $1 OR f.user_id = $1 );