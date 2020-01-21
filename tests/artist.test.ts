import request from 'supertest';
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
