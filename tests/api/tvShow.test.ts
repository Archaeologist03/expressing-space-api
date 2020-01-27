import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import TvShow from '../../src/models/likes/tvShow';

let token: string = '';
const email = 'x@x.com';
const password = '12345';

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

describe('GET /likes/tvShows/', () => {
  // token not being sent - should respond with a 401
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app)
      .get('/likes/tvShows/')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
    done();
  });

  // send the token - should respond with a 200
  it('should respond with JSON data - 200', async (done) => {
    const res = await request(app)
      .get('/likes/tvShows/')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    done();
  });
});

describe('PUT /likes/tvShows/', () => {
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app)
      .put('/likes/tvShows')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
    done();
  });

  // #Todo: There is probalby better way to go about this. Re-check it!
  it('should return json data with either title prop for success or message prop for err', async (done) => {
    const title = 'Mr. Robot';
    const res = await request(app)
      .put('/likes/tvShows')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ title });

    if (res.status === 409) {
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
    } else if (res.status === 201) {
      expect(res.status).toBe(201);
      expect(res.body.tvShow).toHaveProperty('title');
    }
    done();
  });
});

// #Todo: There is probalby better way to go about this. Re-check it!
describe('DELETE /likes/tvShows/:tvShowId', () => {
  // #TODO: Get tvShowId by calling DB and getting tvShow by title
  const title = 'Mr. Robot';
  it('should return require authorization - return 401', async (done) => {
    const tvShowId = await (await TvShow.findOne({ title }))._id;
    const res = await request(app).delete(`/likes/tvShows/${tvShowId}`);
    expect(res.status).toBe(401);
    done();
  });

  it('should delete userId from tvShow if it exists or return 404 if not', async (done) => {
    const tvShowId = await (await TvShow.findOne({ title }))._id;
    const res = await request(app)
      .delete(`/likes/tvShows/${tvShowId}`)
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
