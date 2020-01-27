import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Movie from '../../src/models/likes/movie';

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

describe('GET /likes/movies/', () => {
  // token not being sent - should respond with a 401
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app)
      .get('/likes/movies/')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
    done();
  });

  // send the token - should respond with a 200
  it('should respond with JSON data - 200', async (done) => {
    const res = await request(app)
      .get('/likes/movies/')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    done();
  });
});

describe('PUT /likes/movies/', () => {
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app)
      .put('/likes/movies')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
    done();
  });

  // #Todo: There is probalby better way to go about this. Re-check it!
  it('should return json data with either title prop for success or message prop for err', async (done) => {
    const title = '12 Angry Man';
    const res = await request(app)
      .put('/likes/movies')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ title });

    if (res.status === 409) {
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
    } else if (res.status === 201) {
      expect(res.status).toBe(201);
      expect(res.body.movie).toHaveProperty('title');
    }
    done();
  });
});

// #Todo: There is probalby better way to go about this. Re-check it!
describe('DELETE /likes/movies/:movieId', () => {
  // #TODO: Get movieID by calling DB and getting movie by title
  const title = '12 Angry Man';
  it('should return require authorization - return 401', async (done) => {
    const movieId = await (await Movie.findOne({ title }))._id;
    const res = await request(app).delete(`/likes/movies/${movieId}`);
    expect(res.status).toBe(401);
    done();
  });

  it('should delete userId from movie if it exists or return 404 if not', async (done) => {
    const movieId = await (await Movie.findOne({ title }))._id;
    const res = await request(app)
      .delete(`/likes/movies/${movieId}`)
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
