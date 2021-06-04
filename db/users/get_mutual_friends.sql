SELECT DISTINCT u.username, u.picture, u.user_id FROM USERS u JOIN friends_junction f ON u.user_id = f.user_id OR u.user_id = f.friend_id WHERE 
f.friend_id = $1 OR f.user_id = $1 AND accepted = true AND u.user_id != $1; 
