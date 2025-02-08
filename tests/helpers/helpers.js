const { app } = require('../../index')

const supertest = require('supertest')

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
    },
    {
        content: 'juedsay Practica de testing 03',
        important: true,
        date: new Date()
    },
    {
        content: 'juedsay Practica de testing 04',
        important: true,
        date: new Date()
    }
];
const getAllContentFromNotes = async () => {
    const res = await api.get('/api/notes')
    return {
        contents: res.body.map(note => note.content),
        res
    } 
};

module.exports = {
    api,
    getAllContentFromNotes,
    initialNotes
};