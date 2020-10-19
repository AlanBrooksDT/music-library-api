/* src/controllers/album.js */
const { Album, Artist } = require('../models');

exports.create = (req, res) => {
    Artist.findByPk(req.params.artistId).then (artist => {
        if (!artist) {
            res.status(404).json({ error: 'The artist could not be found.' });
        } else {
            Album.create(req.body).then(album => {
                album.setArtist(req.params.artistId).then(artistAlbum => {
                    res.status(201).json(artistAlbum);
                });
            });
        };
    });
};

exports.read = (req, res) => {
    Album.findByPk(req.params.artistId).then(album => {
      if(!album) {
        res.status(404).json({ error: 'the artist could not be found.'  });
      }
      else {
        res.status(200).json(album);
      };
    });
  };