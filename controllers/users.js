const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('notes', {
        content: 1,
        date: 1
    });
    res.json(users);
});

usersRouter.post("/", async (req, res) => {
    try {
      const { username, email, name, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
      }
    //   if (!username || !password || !email) {
    //     return res.status(400).json({ error: "Username, email, and password are required" });
    //   }
  
      // Validaciones del username
      if (/\s/.test(username)) {
        return res.status(400).json({ error: "Username cannot contain spaces" });
      }
      if (/[&=_'<>+,-]/.test(username)) {
        return res.status(400).json({ error: "Username cannot contain special characters (&, =, _, ', -, <, >, +, ,, .., tildes)." });
      }
      if (/\.\./.test(username)) {
        return res.status(400).json({ error: "Username cannot contain two or more consecutive dots." });
      }
  
      // Validación de email
    //   const emailRegex = /^\S+@\S+\.\S+$/;
    //   if (!emailRegex.test(email)) {
    //     return res.status(400).json({ error: "Invalid email format" });
    //   }
  
      // Verificar si el usuario ya existe (case-insensitive)
      const existingUser = await User.findOne({ username: username.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ error: "Expected `username` to be unique" });
      }
  
      // Verificar si el email ya está en uso
    //   const existingEmail = await User.findOne({ email: email.toLowerCase() });
    //   if (existingEmail) {
    //     return res.status(409).json({ error: "Email already in use" });
    //   }
  
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
  
      const user = new User({
        username,
        // email,
        name,
        passwordHash,
      });
  
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: "Expected `username` or `email` to be unique" });
      }
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = usersRouter;