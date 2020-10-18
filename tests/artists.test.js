/* tests/artists.test.js */
const { expect } = require('chai');
const request = require('supertest');
const { Artist } = require('../src/models');
const app = require('../src/app');

describe('/artists', () => {
  before(async () => {
    try {
      await Artist.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /artists', async () => {
    it('creates a new artist in the database', async () => {
      const response = await request(app).post('/artists').send({
        name: 'Tame Impala',
        genre: 'Rock',
      });

      await expect(response.status).to.equal(201);
      expect(response.body.name).to.equal('Tame Impala');

      const insertedArtistRecords = await Artist.findByPk(response.body.id, { raw: true });
      expect(insertedArtistRecords.name).to.equal('Tame Impala');
      expect(insertedArtistRecords.genre).to.equal('Rock');
    });
  });

  /* 
The first thing to notice here is the beforeEach hook, which is nested 
inside of the "with artists in the database" describe block. The beforeEach 
block inserts 3 new artists into the database for us, so in all of the 
tests inside this describe block, we can assume that these 3 artists exist. 
Moreover, the artists created in this block will be new for each test because 
the beforeEach hook in the upper scope (the first before each in the test file) 
drops the artists collection before each test, so we know we can update, delete etc. 
in other tests and each time we do so on fresh data because beforeEach will put 
in new data into artists, and afterEach will drop all artists. */

  describe('with artists in the database', () => {
    let artists;
    beforeEach((done) => {
      Promise.all([
        Artist.create({ name: 'Tame Impala', genre: 'Rock' }),
        Artist.create({ name: 'Kylie Minogue', genre: 'Pop' }),
        Artist.create({ name: 'Dave Brubeck', genre: 'Jazz' }),
      ]).then((documents) => {
        artists = documents;
        done();
      });
    });

    describe('GET /artists', () => {
      it('gets all artist records', (done) => {
        request(app)
          .get('/artists')
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((artist) => {
              const expected = artists.find((a) => a.id === artist.id);
              expect(artist.name).to.equal(expected.name);
              expect(artist.genre).to.equal(expected.genre);
            });
            done();
          });
      });
    });
    describe('GET /artists/:artistId', () => {
      it('gets artist record by id', (done) => {
        const artist = artists[0];
        request(app)
          .get(`/artists/${artist.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(artist.name);
            expect(res.body.genre).to.equal(artist.genre);
            done();
          });
      });
      it('returns a 404 if the artist does not exist', (done) => {
        request(app)
          .get('/artists/12345')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('the artist could not be found.');
            done();
          });
      });
  });
  describe('PATCH /artists/:id', () => {
    it('updates artist GENRE by id', (done) => {
      const artist = artists[0];
      request(app)
        .patch(`/artists/${artist.id}`)
        .send({ genre: 'Psychedelic Rock' })
        .then((res) => {
          expect(res.status).to.equal(200);
          Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
            expect(updatedArtist.genre).to.equal('Psychedelic Rock');
            done();
          });
        });
    });
  });
  describe('PATCH /artists/:id', () => {
    it('updates artist NAME by id', (done) => {
      const artist = artists[0];
      request(app)
        .patch(`/artists/${artist.id}`)
        .send({ name: 'Jon Bon Jovi' })
        .then((res) => {
          expect(res.status).to.equal(200);
          Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
            expect(updatedArtist.name).to.equal('Jon Bon Jovi');
            done();
          });
        });
    });
    it('returns a 404 if the artist does not exist', (done) => {
      request(app)
        .patch('/artists/12345')
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');
          done();
        });
    });
  });
  describe('DELETE /artists/:artistId', () => {
    it('deletes artist record by id', (done) => {
      const artist = artists[0];
      request(app)
        .delete(`/artists/${artist.id}`)
        .then((res) => {
          expect(res.status).to.equal(204);
          Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
            expect(updatedArtist).to.equal(null);
            done();
          });
        });
    });
    it('returns a 404 if the artist does not exist', (done) => {
      request(app)
        .delete('/artists/12345')
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');
          done();
        });
    });
  });
});
});
