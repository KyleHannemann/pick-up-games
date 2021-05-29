UPDATE friends_junction SET accepted = true WHERE 
user_id = $1 AND friend_id = $2;