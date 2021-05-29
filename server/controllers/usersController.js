module.exports = {
  getUser: (req, res) => {
    const db = req.app.get("db");
    const { userId } = req.params;

    db.users
      .get_user(parseInt(userId))
      .then((data) => {
        let user = data[0];
        delete user.password;
        res.status(200).send(user);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(409);
      });
  },
  getFriends: (req, res) => {
    const db = req.app.get("db");
    db.users.get_friends(req.session.user.user_id).then((data) => {
        res.status(200).send(data)
    }).catch(err=>{
        res.sendStatus(409)
        console.log(err)
    });
  },
  addFriend: async (req, res) => {
      const db = req.app.get('db');
      const {friendId} = req.body;
    
    await db.users.add_friend([req.session.user.user_id, friendId]);
    const data =  await db.users.get_friends(req.session.user.user_id)

    res.status(200).send(data)
  
  

  }
};
