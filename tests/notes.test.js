const mongoose = require("mongoose");
const { server } = require("../index");
const Note = require("../models/Note");
const {
  api,
  initialNotes,
  getAllContentFromNotes,
} = require("./helpers/helpers");

beforeEach(async () => {
  await Note.deleteMany({});

  const note1 = new Note(initialNotes[0]);
  await note1.save();

  const note2 = new Note(initialNotes[1]);
  await note2.save();
});

test("Notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-type", /application\/json/);
});

test("There are two notes", async () => {
  const res = await api.get("/api/notes");
  expect(res.body).toHaveLength(initialNotes.length);
});

test("First note is about testing", async () => {
  const res = await api.get("/api/notes");
  expect(res.body[0].content).toBe("Practica de testing 01");
});

test("First note must contain juedsay word", async () => {
  const res = await api.get("/api/notes");
  expect(res.body[1].content).toContain("juedsay");
});

test("Any note must contain juedsay word", async () => {
  const contents = getAllContentFromNotes()
  expect(contents).toEqual(
    expect.arrayContaining([expect.stringMatching(/juedsay/)])
  );
});

test("Any note must contain...", async () => {
  const contents = getAllContentFromNotes()
  expect(contents).toContain("juedsay Practica de testing 02");
});

test("First note must be important", async () => {
  const res = await api.get("/api/notes");
  expect(res.body[0].important).toEqual(true);
});

test("Second note must'n be important", async () => {
  const res = await api.get("/api/notes");
  expect(res.body[1].important).toEqual(false);
});

test("a valid note can be added", async () => {
  //Note I'll try to post
  const newNote = {
    content: "A new note has be added with success",
    important: true,
  };

  //Calling a service to post a newNote
  await api
    .post("/api/notes")
    .send(newNote)
    .expect(200)
    .expect("Content-type", /application\/json/);

  //Validating a newNote was created successfully, calling a service to get all created notes
  const contents = getAllContentFromNotes();

  expect(res.body).toHaveLength(initialNotes.length + 1);
  expect(contents).toContain(newNote.content);
});

test("a note with out content can't be added", async () => {
  //New note I'll try to post
  const newNote = {
    important: true,
  };

  //Calling a service to post a newNote
  await api
    .post("/api/notes")
    .send(newNote)
    .expect(400)
    .expect("Content-type", /application\/json/);

  //Validating a newNote was't created, calling a service to get all created notes
  const res = await api.get("/api/notes");

  expect(res.body).toHaveLength(initialNotes.length);
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
