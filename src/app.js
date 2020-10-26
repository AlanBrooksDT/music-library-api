const express = require('express')
const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/album');
const songControllers = require('./controllers/songs');

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
});
//artist
app.post('/artists', artistControllers.create);
app.get('/artists', artistControllers.list);
app.get('/artists/:artistId', artistControllers.read);
app.patch('/artists/:artistId', artistControllers.updateArtistById);
app.delete('/artists/:artistId', artistControllers.deleteArtist);
//album
app.post('/artists/:artistId/albums', albumControllers.create);
app.get('/artists/:artistId/albums', albumControllers.readAlbumByArtistID);
app.get('/albums/:albumId', albumControllers.readAlbumByAlbumID);
app.patch('/albums/:albumId', albumControllers.updateAlbumById);
app.delete('/albums/:albumId', albumControllers.deleteAlbum);
//song
app.post('/albums/:albumId/songs', songControllers.create);
module.exports = app