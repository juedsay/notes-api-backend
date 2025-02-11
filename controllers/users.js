const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");

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

    // ✅ Validación de datos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // ✅ Validación del username
    if (/\s/.test(username)) {
      return res.status(400).json({ error: "Username cannot contain spaces" });
    }
    if (/[&=_'<>+,-]/.test(username)) {
      return res.status(400).json({ error: "Username cannot contain special characters (&, =, _, ', -, <, >, +, ,, .., tildes)." });
    }
    if (/\.\./.test(username)) {
      return res.status(400).json({ error: "Username cannot contain two or more consecutive dots." });
    }

    // ✅ Validación del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // ✅ Normalización (evitar duplicados por mayúsculas/minúsculas)
    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    // ✅ Verificar existencia de username o email
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

    // ✅ Hash de contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // ✅ Crear y guardar usuario
    const user = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    // ✅ Manejo de errores más claro
    if (error.code === 11000) {
      return res.status(409).json({ error: "Username or email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = usersRouter;
