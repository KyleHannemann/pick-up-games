INSERT INTO games 
(title, icon, creator, public, gender, date, time,
latitude, longitude, description, max_players)
VALUES ($1, $2 , $3, $4, $5, $6, $7, 
$8, $9, $10, $11) RETURNING game_id;