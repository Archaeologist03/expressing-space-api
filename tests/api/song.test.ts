import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Song from '../../src/models/likes/song';

let token: string = '';
const email = 'x@x.com';
const password = '12345';

// Login before tests - get token
beforeAll((done) => {
  request(app)
    .post('/auth/login')
    .send({
      email,
      password,
    })
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});

describe('GET /likes/songs/', () => {
  // token not being sent - should respond with a 401
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app)
      .get('/likes/songs/')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
    done();
  });

  // send the token - should respond with a 200
  it('should respond with JSON data - 200', async (done) => {
    const res = await request(app)
      .get('/likes/songs/')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    done();
  });
});

describe('PUT /likes/songs/', () => {
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app)
      .put('/likes/songs')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
    done();
  });

  // #Todo: There is probalby better way to go about this. Re-check it!
  it('should return json data with either title and artist props and same title as sent for success or message prop for err', async (done) => {
    const title = 'NY State of Mind';
    const artist = 'Nas';
    const res = await request(app)
      .put('/likes/songs')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ title, artist });

    if (res.status === 409) {
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
    } else if (res.status === 201) {
      expect(res.status).toBe(201);
      expect(res.body.song).toHaveProperty('title');
      expect(res.body.song).toHaveProperty('artist');
      expect(res.body.song.title).toBe(title);
    }
    done();
  });
});

// #Todo: There is probalby better way to go about this. Re-check it!
describe('DELETE /likes/songs/:songId', () => {
  const title = 'NY State of Mind';
  const artist = 'Nas';

  it('should return require authorization - return 401', async (done) => {
    const songId = await (await Song.findOne({ title, artist }))._id;
    const res = await request(app).delete(`/likes/songs/${songId}`);
    expect(res.status).toBe(401);
    done();
  });

  it('should delete userId from song if it exists or return 404 if not', async (done) => {
    const songId = await (await Song.findOne({ title, artist }))._id;
    const res = await request(app)
      .delete(`/likes/songs/${songId}`)
      .set('Authorization', `Bearer ${token}`);

    if (res.status === 404) {
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    } else if (res.status === 202) {
      expect(res.status).toBe(202);
      expect(res.body).toHaveProperty('message');
    }
    done();
  });
});
