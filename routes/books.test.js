const request = require('supertest');
const app = require('../app');
const db = require('../db');

const testBook = {
  isbn: '1234567890',
  amazon_url: 'http://a.co/eobPtX2',
  author: 'Test Author',
  language: 'english',
  pages: 100,
  publisher: 'Test Publisher',
  title: 'Test Book',
  year: 2023,
};

afterAll(async () => {
  await db.end();
});

describe('Books API', () => {
  describe('GET /books', () => {
    test('should return an array of books', async () => {
      const response = await request(app).get('/books');
      expect(response.statusCode).toBe(200);
      expect(response.body.books).toBeInstanceOf(Array);
    });
  });

  describe('POST /books', () => {
    test('should create a new book', async () => {
      const response = await request(app).post('/books').send(testBook);
      expect(response.statusCode).toBe(201);
      expect(response.body.book).toMatchObject(testBook);
    });

    test('should return 400 if request data is invalid', async () => {
      const invalidBook = { ...testBook, pages: 'invalid' };
      const response = await request(app).post('/books').send(invalidBook);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /books/:id', () => {
    test('should return a book by id', async () => {
      const response = await request(app).get(`/books/${testBook.isbn}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.book).toMatchObject(testBook);
    });

    test('should return 404 if book is not found', async () => {
      const response = await request(app).get('/books/non-existent-id');
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /books/:isbn', () => {
    test('should update a book', async () => {
      const updatedBook = { ...testBook, author: 'Updated Author' };
      const response = await request(app)
        .put(`/books/${testBook.isbn}`)
        .send(updatedBook);
      expect(response.statusCode).toBe(200);
      expect(response.body.book).toMatchObject(updatedBook);
    });

    test('should return 400 if request data is invalid', async () => {
      const invalidBook = { ...testBook, pages: 'invalid' };
      const response = await request(app)
        .put(`/books/${testBook.isbn}`)
        .send(invalidBook);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('DELETE /books/:isbn', () => {
    test('should delete a book', async () => {
      const response = await request(app).delete(`/books/${testBook.isbn}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Book deleted');
    });

    test('should return 404 if book is not found', async () => {
      const response = await request(app).delete('/books/non-existent-id');
      expect(response.statusCode).toBe(404);
    });
  });
});
