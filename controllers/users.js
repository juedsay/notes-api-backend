const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");
const errorHandler = require('../middleware/handleErrors')


usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("notes", {
    content: 1,
    date: 1,
  });
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  try {
    const { username, email, name, password } = req.body;

    // Validation of required data
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // Username validation
    if (/\s/.test(username)) {
      return res.status(400).json({ error: "Username cannot contain spaces" });
    }
    if (/[&=_'<>+,-]/.test(username)) {
      return res.status(400).json({ error: "Username cannot contain special characters (&, =, _, ', -, <, >, +, ,, .., tildes)." });
    }
    if (/\.\./.test(username)) {
      return res.status(400).json({ error: "Username cannot contain two or more consecutive dots." });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Normalization (avoid duplicates due to upper/lower case)
    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    // Verify the existence of username or email
    const existingUser = await User.findOne({ 
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }] 
    });

    if (existingUser) {
      if (existingUser.username === normalizedUsername) {
        return res.status(409).json({ error: "Username is already taken" });
      }
      if (existingUser.email === normalizedEmail) {
        return res.status(409).json({ error: "Email is already in use" });
      }
    }

    // Password Hash
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create and save user
    const user = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.use(errorHandler);

module.exports = usersRouter;
