const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let idValue = 0

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data))
        }
    })
});
  


app.post('/api/notes', (req, res) => {
    console.info(req.body);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let savedNotes = JSON.parse(data)
            
            for (i = 0; i < savedNotes.length; i++){
                idValue++
            }
            
            let activeNote = 
            {id: `${idValue}`,
                ...req.body,
            }
            
            savedNotes.push(activeNote)
            console.log(savedNotes)
  
            fs.writeFile('./db/db.json', JSON.stringify(savedNotes, null, 4),
            (writeErr) => writeErr
                ? console.error(writeErr)
                : console.info('notes saved!')
            )

            idValue = 0
            res.json(savedNotes)
        }
    })
})

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let noteToBeDeleted = JSON.parse(data)
            
            console.log(req.params)

            let notesAfterDeletion = noteToBeDeleted.filter((object) => {
                return object.id !== req.params.id
            })
            

            console.log(notesAfterDeletion)

            fs.writeFile('./db/db.json', JSON.stringify(notesAfterDeletion, null, 4),
            (writeErr) => writeErr
                ? console.error(writeErr)
                : console.info('notes saved!')
            )
            res.json(notesAfterDeletion)
        }
    })
})

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

