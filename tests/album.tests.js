/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album } = require('../src/models');


describe('/albums', () => {
  let artist;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(201);

          Album.findByPk(res.body.id, { raw: true }).then((album) => {
            expect(album.name).to.equal('InnerSpeaker');
            expect(album.year).to.equal(2010);
            expect(album.artistId).to.equal(artist.id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', (done) => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');

          Album.findAll().then((albums) => {
            expect(albums.length).to.equal(0);
            done();
          });
        });
    });
  });
  describe('with albums in the database', () => {
    let albums;
    beforeEach((done) => {
      Promise.all([
        Album.create({ name: 'Just Noise', year: 1998, artistId: artist.id }),
        Album.create({ name: 'Noughties', year: 2007 , }),
        Album.create({ name: 'What a Year', year: 2020, })
      ]).then((documents) => {
        albums = documents;
        done();
      });
    });
  
  describe('GET /artists/:albumId', () => {
    it('gets albums record by album id', (done) => {
      const album = albums[0];
      request(app)
        .get(`/artists/albums/${album.id}`)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(album.name);
          expect(res.body.year).to.equal(album.year);
          done();
        });
    });
    it('returns a 404 if the album does not exist', (done) => {
        request(app)
          .get('/artists/albums/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('the album could not be found.');
            done();
          });
    });
});
describe('GET /artists/:artistId/albums', () => {
    it('gets artists albums record by artist id', (done) => {
      const album = albums[0];
      request(app)
        .get(`/artists/${artist.id}/albums`)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body[0].name).to.equal(album.name);
          expect(res.body[0].year).to.equal(album.year);
          done();
        });
      });
      it('returns a 404 if the artist does not exist', (done) => {
        request(app)
          .get('/artists/12345/albums')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('the artist could not be found.');
            done();
          });
      });
    });
    describe('PATCH artists/albums:id', () => {
        it('updates album year by id', (done) => {
          const album = albums[0];
          request(app)
            .patch(`/artists/albums/${album.id}`)
            .send({ year: 1901 })
            .then((res) => {
              expect(res.status).to.equal(200);
              Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
                expect(updatedAlbum.year).to.equal(1901);
                done();
              });
            });
        });
      });
      describe('PATCH /artists/albums:id', () => {
        it('updates album NAME by id', (done) => {
          const album = albums[0];
          request(app)
            .patch(`/artists/albums/${album.id}`)
            .send({ name: 'Nevermind' })
            .then((res) => {
              expect(res.status).to.equal(200);
              Album.findByPk(album.id, { raw: true }).then((updatedArtist) => {
                expect(updatedArtist.name).to.equal('Nevermind');
                done();
              });
            });
        });
        it('returns a 404 if the album does not exist', (done) => {
          request(app)
            .patch('/artists/albums/12345')
            .then((res) => {
              expect(res.status).to.equal(404);
              expect(res.body.error).to.equal('The album could not be found.');
              done();
            });
        });
      });
      describe('DELETE /artists/albums/:albumId', () => {
        it('deletes album record by id', (done) => {
          const album = albums[0];
          request(app)
            .delete(`/artists/albums/${album.id}`)
            .then((res) => {
              expect(res.status).to.equal(204);
              Album.findByPk(album.id, { raw: true }).then((updatedArtist) => {
                expect(updatedArtist).to.equal(null);
                done();
              });
            });
        });
        it('returns a 404 if the album does not exist', (done) => {
          request(app)
            .delete('/artists/albums/12345')
            .then((res) => {
              expect(res.status).to.equal(404);
              expect(res.body.error).to.equal('The album could not be found.');
              done();
            });
        });
});
});
});