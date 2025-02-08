const mongoose = require('mongoose')
const supertest = require('supertest')
const {app, server} = require('../index')

const Note = require('../models/Note')
const api = supertest(app)

const initialNotes = [
    {
        content: 'Practica de testing 01',
        important: true,
        date: new Date()
    },
    {
        content: 'juedsay Practica de testing 02',
        important: false,
        date: new Date()
    }
];

beforeEach( async () => {
    await Note.deleteMany({})

    const note1 = new Note(initialNotes[0])
    await note1.save()
    
    const note2 = new Note(initialNotes[1])
    await note2.save()
});

test('Notes are returned as json', async () => {
    await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-type', /application\/json/)
})

test('There are two notes', async () => {
    const res = await api.get('/api/notes')
    expect(res.body).toHaveLength(initialNotes.length)
})

test('First note is about testing', async () => {
    const res = await api.get('/api/notes')
    expect(res.body[0].content).toBe('Practica de testing 01')    
});

test('First note must contain juedsay word', async () => {
    const res = await api.get('/api/notes')
    expect(res.body[1].content).toContain('juedsay')
});

test('Any note must contain juedsay word', async () => {
    const res = await api.get('/api/notes')
    const contents = res.body.map(note => note.content)
    expect(contents).toEqual(expect.arrayContaining([expect.stringMatching(/juedsay/)]))
});

test('Any note must contain...', async () => {
    const res = await api.get('/api/notes')
    const contents = res.body.map(note => note.content)
    expect(contents).toContain('juedsay Practica de testing 02')
});

test('First note must be important', async () => {
    const res = await api.get('/api/notes')
    expect(res.body[0].important).toEqual(true)      
});

test("Second note must'n be important", async () => {
    const res = await api.get('/api/notes')
    expect(res.body[1].important).toEqual(false)      
});

afterAll(() => {
    mongoose.connection.close()
    server.close()
})