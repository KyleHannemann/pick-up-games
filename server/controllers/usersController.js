


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
        res.sendStatus(419)
        console.log(err)
    });
  },
  getFriendsInfo: (req, res) => {
    const db = req.app.get("db");
    db.users.get_friends_info(req.session.user.user_id).then((data) => {
        res.status(200).send(data)
    }).catch(err=>{
        res.sendStatus(419)
        console.log(err)
    });
  },
  getOtherUsersFriendsInfo: (req, res) => {
    const db = req.app.get("db");
    const {user_id} = req.params;
    db.users.get_friends_info(user_id).then((data) => {
        res.status(200).send(data)
    }).catch(err=>{
        res.sendStatus(419)
        console.log(err)
    });
  },
  addFriend: async (req, res) => {
      const db = req.app.get('db');
      const {friendId} = req.body;
    await db.users.add_friend([req.session.user.user_id, friendId]);
    const data =  await db.users.get_friends(req.session.user.user_id)

    res.status(200).send(data)
  
  

  },
  acceptFriend: async (req, res) => {
    const db = req.app.get('db');
    const {friendId} = req.body;
    await db.users.accept_friend([parseInt(friendId), req.session.user.user_id]);
    const data =  await db.users.get_friends(req.session.user.user_id)
    
    res.status(200).send(data)
  },
  declineFriend: async (req, res) => {
    const db = req.app.get('db');
    const {friend_id, user_id} = req.body;
    await db.users.decline_friend([parseInt(friend_id), parseInt(user_id)]);
    const data =  await db.users.get_friends(req.session.user.user_id)

    res.status(200).send(data)
  },
  getNotifications: (req, res) => {
    const db = req.app.get('db');
    const {userId} = req.params;
    db.users.get_notifications(userId).then(data=>{
      res.status(200).send(data)
    }).catch(err=>{
      console.log(err)
    })
  },
  deleteNotification: (req, res) => {
    const db = req.app.get("db");
    const {notificationId} = req.params;
    db.users.delete_notification(notificationId).then(()=>{
      res.sendStatus(200)
    }).catch(err=>{
      console.log(err)
      res.status(409).send(err)
    })
  },
  getDms: (req, res) => {
    const db = req.app.get("db")
    const {userId} = req.params
    db.users.get_dms(userId).then(data=>{
      res.status(200).send(data)
    }).catch(err=>{
      console.log(err)
    })
  },
  seenDms: (req, res) => {
    const db = req.app.get("db");
    const {user_id, dm_to} = req.body;
    db.users.seen_dm([user_id, dm_to]).then(()=>{
      res.sendStatus(200)
    }).catch(err=>{
      res.status(411).send(err)
    })
  },

  getAllUsers: (req, res) => {
    const db = req.app.get("db");
    db.users.get_all_users().then(data=>{
      res.status(200).send(data)
    }).catch(err=>{
      console.log(err)
      res.sendStatus(409)
    })
  }
};
