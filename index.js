const express = require('express');
const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', './views');


// estructura ininmutable para el reseteo de Postman
const INITIAL_CHARACTERS = [
    { id: 1, name: 'Cloud Strife', job: 'Soldier', weapon: 'Buster sword', level: 25 },
    { id: 2, name: 'Tifa Lockhart', job: 'Fighter', weapon: 'Leather gloves', level: 22 },
    { id: 3, name: 'Aerith Gainsborough', job: 'Mage', weapon: 'Magic staff', level: 20 }
];

// copia de la bbdd simulada
let characters = [...INITIAL_CHARACTERS]; 

// guarda el inice del personaje
const findCharacterIndex = (id) => characters.findIndex(c => c.id === parseInt(id));


// metodos para Postman
// limpieza global
app.post('/reset', (req, res) => {
    characters = [...INITIAL_CHARACTERS];
    res.sendStatus(201);
});

// obtener todos los characters
app.get('/characters', (req,res) =>{
    res.json(characters);
});

// buscar character por id 
app.get('/characters/:id', (req,res) => {
    const id = parseInt(req.params.id); 
    const character = characters.find(c => c.id === id); 

    if (!character) {
        res.sendStatus(404); 
    }
    res.json(character); 
});

// crear nuevo character
app.post('/characters', (req,res) => {
    const newCharacter = req.body;
    const level = parseInt(newCharacter.level);

    if (Object.keys(newCharacter).length === 0) {
        return res.sendStatus(400); 
    }

    if (level < 1 || level > 99){ 
        res.status(400).send('Level must be between 1 and 99'); 
    }

    const isExist = characters.some(c => c.id === newCharacter.id || c.name === newCharacter.name);
    
    if (isExist) {
        res.sendStatus(400);
    }

    characters.push({ ...newCharacter, level: level});
    res.sendStatus(201);
});

// actualizar un character
app.put('/characters/:id', (req,res) => {
    const id = parseInt(req.params.id); 
    const updatedData = req.body;
    const index = findCharacterIndex(id);

    if (index === -1) {
        res.status(404).send('Character does not exist'); 
    }

    if (Object.keys(updatedData).length === 0) {
        res.sendStatus(400); 
    }

    if (updatedData.level) { 
        const level = parseInt(updatedData.level);
        if (isNaN(level) || level < 1 || level > 99) {
            res.status(400).send('Level must be between 1 and 99'); 
        }
        updatedData.level = level;
    }
    
    const isExist = characters.some((c, i) => 
        i !== index && (c.id === updatedData.id || c.name ===updatedData.name));

    if (isExist) {
        res.sendStatus(400); 
    }

    characters[index] = {...characters[index], ...updatedData, id: characters[index].id};
    res.sendStatus(204); 
});

// borrar por id un character
app.delete('/characters/:id', (req, res) =>{
    const id = req.params.id;
    const index = findCharacterIndex(id);

    if (index === -1){
        res.status(404).send('Character does not exist'); 
    }

    characters.splice(index, 1);
    res.sendStatus(204); 
});

// metodos para vistas de Pug
app.get('/index', (req, res) => {
    res.render('index', {
        title : 'Welcome'
    })
});

app.get('/list', (req, res) => {
    res.render('list', {
        title: 'Character List',
        characters: characters
    });
});

app.get('/new', (req, res) => {
    res.render('new', { title: 'New Character'});
});

app.post('/new', (req, res) => {
    const { name, job, weapon, level } = req.body;
    const newId = characters.length > 0 ? Math.max(...characters.map(c => c.id)) + 1 : 1;
    characters.push({
        id: newId,
        name, 
        job,
        weapon,
        level: parseInt(level)
    });

    res.redirect('/list');
});

// llamada del puerto
app.listen(8080, () => {
    console.log(`Servidor arrancado`);
});