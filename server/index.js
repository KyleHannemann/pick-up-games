require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const authController = require('./controllers/authController');
const gameController = require('./controllers/gameController');
const usersController = require('./controllers/usersController')

const {CONNECTION_STRING, SERVER_PORT, SESSION_SECRET} = process.env;

const app = express();

app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}//~1 week
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db=>{
    app.set('db', db)
    console.log('db connected')
    app.listen(SERVER_PORT, ()=>{console.log(`listening on port ${SERVER_PORT}`)})
}).catch(err=>{console.log(err)})

//endpoints
//users
app.get('/users/:userId', usersController.getUser );
app.post('/users/addFriend', usersController.addFriend);
app.get('/users/getFriends', usersController.getFriends);
//game
app.post('/game/create', gameController.createGame )
app.get('/game/joined', gameController.getJoinedGames)
app.get('/game/players/:gameId', gameController.getPlayers);
app.get('/game/all', gameController.getAllGames);
app.get('/game/:gameId', gameController.getGame);
//auth
app.post('/auth/register',authController.register);
app.post('/auth/login', authController.login);
app.get('/auth/user', authController.checkSession);
app.get('/auth/logout', authController.logout);
app.put('/auth/edit/profile', authController.edit)

