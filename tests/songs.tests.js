/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album, Song } = require('../src/models');

describe('/songs', () => {
    let artist;
    let album;
  
    before(async () => {
      try {
        await Artist.sequelize.sync();
        await Album.sequelize.sync();
        await Song.sequelize.sync();
      } catch (err) {
        console.log(err);
      }
    });
  
    beforeEach(async () => {
      try {
        await Artist.destroy({ where: {} });
        await Album.destroy({ where: {} });
        await Song.destroy({ where: {} });
        artist = await Artist.create({
          name: 'Tame Impala',
          genre: 'Rock',
        });
        album = await Album.create({
            name: 'Something Loud',
            year: 2020,
            artistId: artist.id,
        });
      } catch (err) {
        console.log(err);
      }
    });

    describe('POST /album/:albumId/song', () => {
        it('creates a new song under an album', (done) => {
          //console.log(album.id)
            request(app)
            .post(`/albums/${album.id}/songs`)
            .send({
              artist: artist.id,
              name: 'Solitude Is Bliss',
            })
            .then((res) => {
              expect(res.status).to.equal(201);
              const songId = res.body.id;
              expect(res.body.id).to.equal(songId);
              expect(res.body.name).to.equal('Solitude Is Bliss');
              expect(res.body.artistId).to.equal(artist.id);
              expect(res.body.albumId).to.equal(album.id);
              done();
            });
        });
      });
    });