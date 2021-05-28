
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
                db.game.join_game([data.game_id, req.session.user.user_id]).then(()=>{
                    res.status.sendStatus(200);
                }).catch(err=>{
                    console.log(err)
                    res.sendStatus(411)
                })
            }).catch(err=>{
                res.status(411).send('failed to create game')
            });
    }
}