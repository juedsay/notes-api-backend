const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

loginRouter.post("/", async (req, res) => {
  const { body } = req;
  const { username, email, password } = body;

  const user = await User.findOne({ username, email });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: "invalid user or password",
    });
  }

  const userForToken = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(userForToken, process.env.SECRET_TOKEN_KEY, {
    expiresIn: 60 * 60 * 24 * 7,
  });

  res.send({
    name: user.name,
    username: user.username,
    // email: user.email,
    token
  });
});

module.exports = loginRouter;
