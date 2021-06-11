module.exports = {
  createGame: (req, res) => {
    const db = req.app.get("db");
    const {
      title,
      icon,
      public,
      gender,
      location,
      date,
      time,
      description,
      maxPlayers,
    } = req.body;
    db.game
      .create_game([
        title,
        icon,
        req.session.user.user_id,
        public,
        gender,
        date,
        time,
        location.addy,
        location.lat,
        location.lng,
        description,
        maxPlayers,
      ])
      .then((data) => {
        db.game
          .join_game([data[0].game_id, req.session.user.user_id])
          .then(() => {
            res.status(200).send(data[0]);
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(411);
          });
      })
      .catch((err) => {
        res.status(409).send("failed to create game");
      });
  },
  getJoinedGames: (req, res) => {
    const db = req.app.get("db");
    const {userId} = req.params
    console.log(userId)
    db.game
      .get_joined_games(userId)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(404);
      });
  },
  getPlayers: (req, res) => {
    const db = req.app.get("db");
    const { gameId } = req.params;
    db.game
      .get_players(gameId)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getAllGames: async (req, res) => {
    const db = req.app.get("db");
    let data = await db.game
      .get_all_games();
    for (let i = 0; i < data.length; i++){
      let players = await db.game.get_players(data[i].game_id);
      data[i].players = players;
    }
    res.status(200).send(data)
      
  },
  getGame: (req, res) => {
    const db = req.app.get("db");
    const { gameId } = req.params;
    db.game
      .get_game(gameId)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.sendStatus(411);
        console.log(err);
      });
  },
  joinGame: (req, res) => {
    const db = req.app.get("db");
    const { gameId } = req.params;
    db.game.join_game([parseInt(gameId), req.session.user.user_id]).then(()=>{
        res.sendStatus(200)
    }).catch(err=>{
        res.sendStatus(409)
        console.log(err)
    });
  },
  leaveGame: (req, res) => {
    const db = req.app.get('db');
    const {gameId} = req.params;
    db.game.leave_game([req.session.user.user_id, parseInt(gameId)]).then(()=>{
      res.sendStatus(200)
    }).catch(err=>{
      res.sendStatus(409)
    })
  },
  getComments: (req, res) => {
    const db = req.app.get('db');
    const {gameId} = req.params;
    db.game.get_comments(gameId).then((data)=>{
      res.status(200).send(data)
    }).catch(err=>{
      res.status(409).send(err)
    })
  },
  addComments: (req, res) => {
    // const db = req.app.get('db');
    // const {gameId} = req.params;
    // const {content, timeStamp} = req.body
    // // db.game.add_comment([req.session.user.username, req.session.user.user_id, content, gameId, timeStamp ])
    // // .then(()=>{
    // //   res.sendStatus(200)
    // // }).catch(err=>{
    // //   res.status(409).send(err)
    // // })
  }
};
