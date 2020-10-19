const express = require('express')
const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/album');

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/artists', artistControllers.create);
app.get('/artists', artistControllers.list);
app.get('/artists/:artistId', artistControllers.read);
app.patch('/artists/:artistId', artistControllers.updateArtistById);
app.delete('/artists/:artistId', artistControllers.deleteArtist);

app.post('/artists/:artistId/albums', albumControllers.create);
app.get('/artists/:artistId/albums', albumControllers.read);

module.exports = app