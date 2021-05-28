SELECT * FROM users JOIN player_game_junction p ON p.user_id = users.user_id WHERE
p.game_id = $1;