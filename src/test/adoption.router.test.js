import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Router: /api/adoptions', () => {
  let adoptionId;
  let mockPetId;
  let mockUserId;

  // Simula que ya existen usuario y mascota para hacer una solicitud
  before(async () => {
    const petRes = await request.post('/api/pets').send({ name: 'Luna', specie: 'Gato', age: 2 });
    mockPetId = petRes.body.payload._id;

    const userRes = await request.post('/api/users').send({ first_name: 'Carlos', last_name: 'Gómez', email: 'carlos@example.com', password: '1234' });
    mockUserId = userRes.body.payload._id;
  });

  it('POST /api/adoptions debe crear una solicitud de adopción', async () => {
    const response = await request.post('/api/adoptions').send({
      user: mockUserId,
      pet: mockPetId,
      reason: 'Me encantan los gatos y quiero darle un hogar.'
    });

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.include.keys('_id', 'user', 'pet', 'reason');
    adoptionId = response.body.payload._id;
  });

  it('GET /api/adoptions debe retornar todas las solicitudes', async () => {
    const response = await request.get('/api/adoptions');
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.be.an('array');
  });

  it('GET /api/adoptions/:aid debe retornar una solicitud específica', async () => {
    const response = await request.get(`/api/adoptions/${adoptionId}`);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.property('_id', adoptionId);
  });

  it('PUT /api/adoptions/:aid debe actualizar el estado de una solicitud', async () => {
    const response = await request.put(`/api/adoptions/${adoptionId}`).send({ status: 'aprobada' });
    expect(response.status).to.equal(200);
    expect(response.body.payload.status).to.equal('aprobada');
  });

  it('DELETE /api/adoptions/:aid debe eliminar una solicitud', async () => {
    const response = await request.delete(`/api/adoptions/${adoptionId}`);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
  });

  after(async () => {
    // Limpieza
    await mongoose.connection.collection('pets').deleteOne({ _id: new mongoose.Types.ObjectId(mockPetId) });
    await mongoose.connection.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(mockUserId) });
  });
});
