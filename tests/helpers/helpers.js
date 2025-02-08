const { app } = require('../index')

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
    }
];

module.exports = {
    api,
    initialNotes
};