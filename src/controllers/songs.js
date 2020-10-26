/* src/controllers/songs.js */
const { Album, Song } = require('../models');

exports.create = (req, res) => {
    Album.findByPk(req.params.albumId).then (album => {
        if (!album) {
            res.status(404).json({ error: 'The album could not be found.' });
        } else {
            const songData = {
                name: req.body.name,
                albumId: album.id,
                artistId: req.body.artist,
              };
              Song.create(songData).then((song) => {
                res.status(201).json(song);
            });
        };
    });
};