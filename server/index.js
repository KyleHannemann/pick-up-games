require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const authController = require("./controllers/authController");
const gameController = require("./controllers/gameController");
const usersController = require("./controllers/usersController");

const { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env;

const app = express();

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
})
  .then((db) => {
    app.set("db", db);
    console.log("db connected")
  })
  .catch((err) => {
    console.log(err)
  });

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24}, //~1 Day
  })
);

const io = require("socket.io")(
  app.listen(SERVER_PORT, () => {
    console.log(`listening on port ${SERVER_PORT}`);
  }),
  { cors: { origin: true } }
);
//socket io
io.on('connection', (socket)=>{
    console.log(`socket ${socket.id} connected`)
    socket.on('disconnect', ()=>{
        console.log(`Socket ${socket.id} disconnected`)
    })

    socket.on('friend update', (body)=>{
        console.log(body)
        io.emit('friend added', body)
    })
    socket.on('friend accept', (body)=>{
        console.log(body)
        io.emit('friend accept', body)
    })
    socket.on('game comment', (body)=>{
        const db = app.get('db')
        db.game.add_comment([body.comment_username, body.user_id, body.content,
           body.game_id, body.time_stamp, body.reply, body.reply_to])
        .then((data)=>{
          
          io.emit('game comment', data)
          
        }).catch(err=>{
          io.emit('game comment', err)
        })
        
        
    })
    // socket.on('notification', async (body) => {
    //   const db = app.get('db')
    //   await db.users.add_notification([body.user_id,
    //     body.description, body.game_id, body.user_interaction])
    //   db.users.get_notifications(body.user_id).then(data=>{
    //     io.emit('notification', data)
    //   }).catch(err=>{
    //     console.log(err)
    //   })
    // })
    socket.on('invites', async (body)=>{
      const db = app.get('db')
      console.log(body);
      const {invites, game_id, username, user_id, picture} = body;
      for (let i = 0; i < invites.length; i++){
         const noti = await db.users.add_notification([parseInt(invites[i]),
        "invited you to a game", game_id, user_id, username, picture] )
        io.emit("notification", noti)
      }
    
    });
    socket.on('friend request notification', async (body) => {
      const db = app.get('db')
      console.log(body)
      const {user_id, description, game_id, username, user_interaction_id, picture} = body
      const noti =  await db.users.add_notification([user_id,
      description, game_id, user_interaction_id, username, picture])
      io.emit("notification", noti)
    })
    

    
})
//endpoints
//users
app.get("/users/notifications/:userId", usersController.getNotifications)
app.delete("/users/notifications/delete/:notificationId", usersController.deleteNotification)
app.get("/users/:userId", usersController.getUser);
app.post("/users/addFriend", usersController.addFriend);
app.put("/users/addFriend/accept", usersController.acceptFriend);
app.put("/users/addFriend/decline", usersController.declineFriend);
app.get("/users/friends/all", usersController.getFriendsInfo);
app.get("/users/get/all", usersController.getAllUsers);
app.get("/users/get/users/friends/:user_id", usersController.getOtherUsersFriendsInfo)
//game
app.post("/game/create", gameController.createGame);
app.get("/game/joined/:userId", gameController.getJoinedGames);
app.get("/game/players/:gameId", gameController.getPlayers);
app.get("/game/all/games", gameController.getAllGames);
app.get("/game/:gameId", gameController.getGame);
app.put("/game/join/:gameId", gameController.joinGame);
app.put("/game/leave/:gameId", gameController.leaveGame);
app.get("/game/comments/:gameId", gameController.getComments);
app.post("/game/comment/add/:gameId", gameController.addComments);
//auth
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);
app.get("/auth/user", authController.checkSession);
app.get("/auth/logout", authController.logout);
app.put("/auth/edit/profile", authController.edit);
