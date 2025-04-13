import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Test funcional - Auth (Register & Login)', () => {
  const mockUser = {
    first_name: 'Test',
    last_name: 'User',
    email: 'testuser@example.com',
    password: '123456'
  };

  it('Debe registrar un nuevo usuario correctamente', async () => {
    const response = await request.post('/api/sessions/register').send(mockUser);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body.payload).to.have.property('email', mockUser.email);
  });

  it('Debe loguear un usuario existente y devolver una cookie', async () => {
    const response = await request.post('/api/sessions/login').send({
      email: mockUser.email,
      password: mockUser.password
    });

    expect(response.status).to.equal(200);
    expect(response.headers['set-cookie']).to.exist;

    const { body } = response;
    expect(body).to.have.property('status', 'success');
    expect(body.payload).to.have.property('email', mockUser.email);
  });
});
