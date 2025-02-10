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

  //* parallel
  //   const notesObjects = initialNotes.map(note => new Note(note));
  //   const promises = notesObjects.map(note => note.save());
  //   await Promise.all(promises);
  //*

  //*sequential
  for await (const note of initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  }
  //*
});

describe("GET all notes", () => {
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
});

describe("Test de content in the notes", () => {
  test("First note is about testing", async () => {
    const res = await api.get("/api/notes");
    expect(res.body[0].content).toBe("Practica de testing 01");
  });

  test("First note must contain juedsay word", async () => {
    const res = await api.get("/api/notes");
    expect(res.body[1].content).toContain("juedsay");
  });

  test("Any note must contain juedsay word", async () => {
    const { contents, res } = await getAllContentFromNotes();
    expect(contents).toEqual(
      expect.arrayContaining([expect.stringMatching(/juedsay/)])
    );
  });

  test("Any note must contain...", async () => {
    const { contents, res } = await getAllContentFromNotes();
    expect(contents).toContain("juedsay Practica de testing 02");
  });
});

describe("Check if a note is important or not", () => {
  test("First note must be important", async () => {
    const res = await api.get("/api/notes");
    expect(res.body[0].important).toEqual(true);
  });

  test("Second note must'n be important", async () => {
    const res = await api.get("/api/notes");
    expect(res.body[1].important).toEqual(false);
  });
});

describe("POST new notes", () => {
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
    const { contents, res } = await getAllContentFromNotes();

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
});

describe("DELETE notes", () => {
  test("a note can be deleted", async () => {
    const { res } = await getAllContentFromNotes();
    const { body: notes } = res;
    const noteToDelete = notes[0];
    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const { contents, res: secondResponse } = await getAllContentFromNotes();
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1);
    expect(contents).not.toContain(noteToDelete.content);
  });

  test("a note that do not exist can't be deleted", async () => {
    await api.delete("/api/notes/1234").expect(400);

    const { res } = await getAllContentFromNotes();
    expect(res.body).toHaveLength(initialNotes.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close()
  server.close();
});
