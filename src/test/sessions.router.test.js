import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Router: /api/sessions', () => {
  const testUser = {
    first_name: 'Test',
    last_name: 'User',
    email: 'testuser@example.com',
    password: 'test1234'
  };

  after(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
  });

  it('POST /api/sessions/register debe registrar un nuevo usuario', async () => {
    const response = await request.post('/api/sessions/register').send(testUser);

    expect(response.status).to.be.oneOf([200, 201]);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.include.keys('_id', 'email');
    expect(response.body.payload.email).to.equal(testUser.email);
  });

  it('POST /api/sessions/login debe loguear al usuario registrado', async () => {
    const response = await request.post('/api/sessions/login').send({
      email: testUser.email,
      password: testUser.password
    });

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.have.property('email', testUser.email);
  });

  it('POST /api/sessions/login debe fallar con credenciales incorrectas', async () => {
    const response = await request.post('/api/sessions/login').send({
      email: testUser.email,
      password: 'wrongpassword'
    });

    expect(response.status).to.be.oneOf([400, 401]);
    expect(response.body.status).to.equal('error');
  });
});
