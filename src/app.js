const express = require('express')
const artistControllers = require('./controllers/artists');

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/artists', artistControllers.create);
app.get('/artists', artistControllers.list);
app.get('/artists/:artistId', artistControllers.read);

module.exports = app