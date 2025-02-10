const notesRouter = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/User");
const userExtractor = require('../middleware/userExtractor')

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(notes);
});

notesRouter.get("/:id", async (req, res, next) => {
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

notesRouter.put("/:id", userExtractor, async (req, res, next) => {
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

notesRouter.delete("/:id", userExtractor, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

notesRouter.post("/", userExtractor, async (req, res) => {
  const { content, important = false } = req.body;
  
  const { userId } = req;

  const user = await User.findById({ userId });

  if (!content || !note.content) {
    return res.status(400).json({
      error: "note.content is missing",
    });
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id,
  });

  //   newNote.save().then((savedNote) => {
  //     res.json(savedNote);
  //   });

  try {
    const savedNote = await newNote.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.json(savedNote);
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;
