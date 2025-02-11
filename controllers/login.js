const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

loginRouter.post("/", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    let user = await User.findOne({ username: identifier });

    if (!user) {
      user = await User.findOne({ email: identifier });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid user or password" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      return res.status(401).json({ error: "Invalid user or password" });
    }

    const userForToken = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(userForToken, process.env.SECRET_TOKEN_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({
      name: user.name,
      username: user.username,
      token
    });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = loginRouter;
