const express = require('express');
const app = express();

app.use(express.urlencoded());
app.set('view engine', 'pug');
app.set('views', './views');


let characters = [
    { id: 1, name: 'Cloud Strife', job: 'Soldier', weapon: 'Buster sword', level: 25 },
    { id: 2, name: 'Tifa Lockhart', job: 'Fighter', weapon: 'Leather gloves', level: 22 },
    { id: 3, name: 'Aerith Gainsborough', job: 'Mage', weapon: 'Magic staff', level: 20 }
]

app.get('/characters', (req,res) =>{
    res.send(characters);
});

app.get('/characters/:id', (req,res) => {
    const ide = req.params.id;
    const character = characters[ide];
    if (!character) {
        res.sendStatus(404);
    }
    res.send(character)
});

app.post('/characters', (req,res) => {
    const newCharacter = req.body;
    const level = newCharacter.level;

    if (Object.keys(newCharacter).length === 0) {
        res.sendStatus(400);
    }

    if (level < 1 || level > 99){
        res.status(400).send('Level must be between 1 and 99');
    }

    const isduplicate = characters.some(c => {
        c.id === newCharacter.id || c.name === newCharacter.name
    });

    if (isduplicate) {
        res.sendStatus(400);
    }

    Object.assign(characters, req.body);
    res.sendStatus(201);
});

app.put('/characters/:id', (req,res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const index = findCharacterIndex(id);
})




app.listen(8080, (req,res) => {
    console.log('Servidor arrancado')
});

