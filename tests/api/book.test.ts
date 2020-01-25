import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Book from '../../src/models/likes/book';

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

describe('GET /likes/books/', () => {
  // token not being sent - should respond with a 401
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app)
      .get('/likes/books/')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
    done();
  });

  // send the token - should respond with a 200
  it('should respond with JSON data - 200', async (done) => {
    const res = await request(app)
      .get('/likes/books/')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    done();
  });
});

describe('PUT /likes/books/', () => {
  it('should return require authorization - return 401', async (done) => {
    const res = await request(app)
      .put('/likes/books')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
    done();
  });

  // #Todo: There is probalby better way to go about this. Re-check it!
  it('should return json data with either title and author props and same title as sent for success or message prop for err', async (done) => {
    const title = 'Demons';
    const author = 'Fyodor Dostoevsky';
    const res = await request(app)
      .put('/likes/books')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ title, author });

    if (res.status === 409) {
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
    } else if (res.status === 201) {
      expect(res.status).toBe(201);
      expect(res.body.book).toHaveProperty('title');
      expect(res.body.book).toHaveProperty('author');
      expect(res.body.book.title).toBe(title);
    }
    done();
  });
});

// #Todo: There is probalby better way to go about this. Re-check it!
describe('DELETE /likes/books/:bookId', () => {
  const title = 'Demons';
  const author = 'Fyodor Dostoevsky';

  it('should return require authorization - return 401', async (done) => {
    const bookId = await (await Book.findOne({ title, author }))._id;
    const res = await request(app).delete(`/likes/books/${bookId}`);
    expect(res.status).toBe(401);
    done();
  });

  it('should delete userId from book if it exists or return 404 if not', async (done) => {
    const bookId = await (await Book.findOne({ title, author }))._id;
    const res = await request(app)
      .delete(`/likes/books/${bookId}`)
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
