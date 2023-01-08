const express = require('express');
const path = require('path');
const fs = require('fs');
const database = require('./db/db.json')

const PORT = process.env.port || 3001;
const app = express();



app.use(express.static('public')); // this is needed for the webpage to load any file (including scripts)
app.use(express.json()); // This is needed to read json files
app.use(express.urlencoded({ extended: true })); // this is needed to read req.params


// GET route for notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// GET route for api/notes
app.get('/api/notes', (req, res) => {
  res.json(database)
  }
);

// POST route for api/notes. STILL NEED random id generater
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  if (newNote.title) {
  // shouldnt this be checked to not create an identical id to an existing note?
  newNote.id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1); 
  database.push(newNote);
  fs.writeFile('./db/db.json', JSON.stringify(database), (err) => err ? console.error(err) : console.log(`\x1b[36mNew note ${newNote.id} added\x1b[0m`));

  res.status(201).json('Successful post!');
  } else {
  console.log('\x1b[31mUntitled note ERROR\x1b[0m')
  res.status(500).json('ERROR adding note');
  }
});

// DELETE route optional. as it turns out, you MUST ONLY edit the database var as defined by the require statement up above. cant make new arrays. It also has to be ==? and id cant be 0
app.delete('/api/notes/:id', (req, res) => {
  const olddb = database.length;
//  database = olddb.filter((x) => x.id != req.params.id);
  database.splice(database.findIndex((x) => x.id == req.params.id), 1);
  if (olddb !== database.length) {
  fs.writeFile('./db/db.json', JSON.stringify(database), (err) => err ? console.error(err) : console.log(`\x1b[36mNote ${req.params.id} removed\x1b[0m`));

  res.status(201).json('Note Deleted!');
  } else {
  console.log('\x1b[31mInvalid note ID ERROR\x1b[0m')
  res.status(500).json('ERROR removing note');
  }
});

// GET route for any target goes to index
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`\x1b[36mServer started at http://localhost:${PORT} ??\x1b[0m`)
);
