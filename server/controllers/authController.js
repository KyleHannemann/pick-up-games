const bcrypt = require("bcrypt");

module.exports = {
  register: async (req, res) => {
    const db = req.app.get("db");
    const { username, password, email, birth_year, gender, picture } = req.body;
    try{
    const [checkExists] = await db.auth.get_user(email);
    if (checkExists) {
      return res.status(409).send("email already registered");
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const [user] = await db.auth.register([
        username,
        hash,
        email,
        birth_year,
        gender,
        picture,
      ]);
      delete user.password;
      const friends = await db.users.get_friends(user.user_id);
      req.session.user = user;
      req.session.user.friends = friends;
      return res.status(200).send(req.session.user);
    }
  }
  catch(err){
    res.status(409).send(err)
  }
  },
  login: async (req, res) => {
    const db = req.app.get("db");
    const { email, password } = req.body;

    const [user] = await db.auth.get_user(email);

    if (!user) {
      return res.status(409).send("incorrect email and/or password");
    } else {
      const check_password = bcrypt.compareSync(password, user.password);
      if (check_password === false) {
        return res.status(409).send("incorrect email and/or password");
      } else {
        delete user.password;
        const friends = await db.users.get_friends(user.user_id);
        req.session.user = user;
        req.session.user.friends = friends;
        return res.status(200).send(req.session.user);
      }
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
  },
  checkSession: async (req, res) => {
    console.log(req.session.user)
    const db = req.app.get('db')
    try{
    if (req.session.user) {
      const friends = await db.users.get_friends(req.session.user.user_id);
      req.session.user.friends = friends;
      return res.status(200).send(req.session.user);
    
    } else {
      return res.sendStatus(404);
    }
  }
  catch (error){
    console.log(error)
  }
  },
  edit: async (req, res) => {
    const db = req.app.get("db");
    const { username, password, email, picture } = req.body;
    const [user] = await db.auth.get_user(email);
    let updatedPassword;
    if (password === null) {
      updatedPassword = user.password;
    } else {
      const salt = bcrypt.genSaltSync(10);
      updatedPassword = bcrypt.hashSync(password, salt);
    }
    const [updatedUser] = await db.auth.edit_user([
      username,
      updatedPassword,
      email,
      picture,
      req.session.user.email,
    ]);

    delete updatedUser.password;
    req.session.user = updatedUser
    res.status(200).send(req.session.user);
  },
};
