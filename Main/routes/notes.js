const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile, } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => {
        if (data.length > 0) {
            res.json(JSON.parse(data))
        }
    })
});

// POST Route for a new note
notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully`);
    } else {
        res.error('Error in adding note');
    }
});

notes.delete('/:id', (req, res) => {
    console.info(`${req.method} request received to delete a note`);
    const id = req.params.id;
    readFromFile('./db/db.json').then(result => {
        const dbNotes = JSON.parse(result);
        const updatedNotes = dbNotes.filter(note => note.id !== id);
        writeToFile('./db/db.json', updatedNotes);
        res.json('Note deleted successfully');
        console.info('Note deleted successfully');
    })
});

module.exports = notes;