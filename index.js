require("dotenv").config();
require("./mongo");

const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/Note");

const logger = require("./loggerMiddleware");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");
const { default: mongoose } = require("mongoose");

app.use(express.json()); // Para realizar el parseo de los datos en formato JSON

app.use(cors());
app.use(logger);

app.get("/", (req, res) => {
  res.send("<h1>Home Sweet Home</h1>");
});

app.get("/api/notes", async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

app.get("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .then((note) => {
      if (note) {
        return res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;
  const note = req.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format'});
    }

    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found'});
    }

    res.status(204).end()    
  } catch (error) {
    next(error);    
  };
});

app.post("/api/notes", async (req, res) => {
  const note = req.body;

  if (!note || !note.content) {
    return res.status(400).json({
      error: "note.content is missing",
    });
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false,
  });

  //   newNote.save().then((savedNote) => {
  //     res.json(savedNote);
  //   });

  try {
    const savedNote = await newNote.save();
    res.json(savedNote);
    
  } catch (error) {
    next(error);    
  };

});

app.use(notFound);

app.use(handleErrors);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
