import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

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

describe('GET /likes/artists/', () => {
  // token not being sent - should respond with a 401
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app).get('/likes/artists/');
    expect(res.status).toBe(401);
    done();
  });

  // send the token - should respond with a 200
  it('should respond with JSON data - 200', async (done) => {
    const res = await request(app)
      .get('/likes/artists/')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    done();
  });
});

describe('PUT /likes/artists/', () => {
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app).put('/likes/artists');
    expect(res.status).toBe(401);
    done();
  });

  // #Todo: There is probalby better way to go about this. Re-check it!
  it('should return json data with either name prop for success or message prop for err', async (done) => {
    const name = 'dmx';
    const res = await request(app)
      .put('/likes/artists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name });

    if (res.status === 409) {
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
    } else if (res.status === 201) {
      expect(res.status).toBe(201);
      expect(res.body.artist).toHaveProperty('name');
    }
    done();
  });
});

// #Todo: There is probalby better way to go about this. Re-check it!
describe('DELETE /likes/artists/:artistId', () => {
  const artistId = '5e24d7350b68952acdcafc2e';
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app).delete(`/likes/artists/${artistId}`);
    expect(res.status).toBe(401);
    done();
  });

  it('should delete userId from artist if it exists or return 404 if not', async (done) => {
    const res = await request(app)
      .delete(`/likes/artists/${artistId}`)
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
