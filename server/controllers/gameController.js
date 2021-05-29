
module.exports = {
    createGame: (req,res) => {
        const db = req.app.get('db');
        const {
            title,
            icon,
            public,
            gender,
            location,
            date,
            time,
            description,
            maxPlayers
        } = req.body;
        console.log(req.body);
        db.game.create_game([title, icon, req.session.user.user_id,
            public, gender, date, time, location.lat, location.lng, description, maxPlayers]).then((data)=>{
                console.log(data)
                db.game.join_game([data[0].game_id, req.session.user.user_id]).then(()=>{
                    res.sendStatus(200);
                }).catch(err=>{
                    console.log(err)
                    res.sendStatus(411)
                })
            }).catch(err=>{
                res.status(411).send('failed to create game')
            });
    },
    getJoinedGames: (req,res) => {
        const db = req.app.get('db');
        db.game.get_joined_games(req.session.user.user_id).then(data=>{
            res.status(200).send(data)
        }).catch(err=>{
            console.log(err);
            res.sendStatus(404);
        })
    },
    getPlayers: (req,res) => {
        const db = req.app.get('db');
        const {gameId} = req.params
        console.log(gameId)
        db.game.get_players(gameId).then(data=>{
            res.status(200).send(data)
        }).catch(err=>{
            console.log(err);
        })
    },
    getAllGames: (req, res) => {
        const db = req.app.get('db');
        db.game.get_all_games().then(data=>{
            res.status(200).send(data);
        }).catch(err=>{
            console.log(err)
        })
    },
    getGame: (req, res) => {
        const db = req.app.get('db')
        const {gameId} = req.params;
        db.game.get_game(gameId).then(data=>{
            res.status(200).send(data)
        }).catch(err=>{
            res.sendStatus(500)
            console.log(err)
        })
    },
}