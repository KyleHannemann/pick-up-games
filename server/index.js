require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const authController = require('./controllers/authController');

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

app.post('/auth/register',authController.register);
app.post('/auth/login', authController.login);
