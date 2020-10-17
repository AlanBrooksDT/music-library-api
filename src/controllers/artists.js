/* src/controllers/artists.js */
const { Artist } = require('../models');

exports.create = (req, res) => {
  Artist.create(req.body).then(artist => res.status(201).json(artist));
};

exports.list = (req, res) => {
  Artist.findAll().then(artist => res.status(200).json(artist));
};

exports.read = (req, res) => {
  Artist.findByPk(req.params.artistId).then(artist => {
    if(!artist) {
      res.status(404).json({ error: 'the artist could not be found.'  });
    }
    else {
      res.status(200).json(artist);
    };
  });
};