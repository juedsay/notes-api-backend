require("dotenv").config();
require("./mongo");

const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/Note");
const User = require("./models/User")

const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");
const userExtractor = require("./middleware/userExtractor")
// const { default: mongoose } = require("mongoose");

const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes');
const loginRouter = require("./controllers/login");

app.use(express.json()); // Para realizar el parseo de los datos en formato JSON

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("<h1>Home Sweet Home</h1>");
});

app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(notFound);

app.use(handleErrors);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
