import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Router: /api/users', () => {
  let testUser;

  before(async () => {
    // Creamos un usuario para los tests
    const response = await request.post('/api/sessions/register').send({
      first_name: 'Test',
      last_name: 'User',
      email: 'routertest@example.com',
      password: '123456'
    });

    testUser = response.body.payload;
  });

  it('GET /api/users debe devolver una lista de usuarios', async () => {
    const response = await request.get('/api/users');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('payload');
    expect(response.body.payload).to.be.an('array');
  });

  it('GET /api/users/:uid debe devolver los datos de un usuario específico', async () => {
    const response = await request.get(`/api/users/${testUser._id}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('payload');
    expect(response.body.payload.email).to.equal('routertest@example.com');
  });

  it('PUT /api/users/premium/:uid debe cambiar el rol del usuario', async () => {
    const response = await request.put(`/api/users/premium/${testUser._id}`);
    expect(response.status).to.equal(200);
    expect(response.body.payload.role).to.not.equal('user');
  });

  it('DELETE /api/users/:uid debe eliminar al usuario', async () => {
    const response = await request.delete(`/api/users/${testUser._id}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
  });

  after(async () => {
    await mongoose.connection.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(testUser._id) });
  });
});
