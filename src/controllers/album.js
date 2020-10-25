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

exports.readAlbumByAlbumID = (req, res) => {
    Album.findByPk(req.params.albumId).then(album => {
      if(!album) {
        res.status(404).json({ error: 'the album could not be found.'  });
      }
      else {
        res.status(200).json(album);
      };
    });
  };

exports.readAlbumByArtistID = (req, res) => {
  Album.findAll({ where: { artistId: req.params.artistId } }).then(album => {
    if(album.length==0) {
      res.status(404).json({ error: 'the artist could not be found.'  });
    }
    else {
      res.status(200).json(album);
    };
  });
};

exports.updateAlbumById = (req, res) => {
    Album.update(req.body, { where: { id : req.params.albumId } }).then(([rowsUpdated]) => {
      if (!rowsUpdated) {
        res.status(404).json({ error: 'The album could not be found.'});
      } else {
        res.status(200).json(rowsUpdated);
      }
    });
  };
  
  exports.deleteAlbum = (req, res) => {
    Album.destroy({ where: {id: req.params.albumId }}).then(rowDeleted => {
      if (!rowDeleted) {
        res.status(404).json({ error: 'The album could not be found.' });
      } else {
        res.status(204).json(rowDeleted);
      }
    });
  };
