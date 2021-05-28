SELECT * FROM games g JOIN player_game_junction j ON g.game_id = j.game_id WHERE j.user_id = 
(SELECT user_id from users WHERE user_id = $1);