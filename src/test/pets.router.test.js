import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Router: /api/pets', () => {
  let createdPetId;

  const mockPet = {
    name: 'Firulais',
    specie: 'Perro',
    age: 4
  };

  it('POST /api/pets debe crear una mascota correctamente', async () => {
    const response = await request.post('/api/pets').send(mockPet);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body.payload).to.include.keys('_id', 'name', 'specie', 'age');
    createdPetId = response.body.payload._id;
  });

  it('GET /api/pets debe retornar una lista de mascotas', async () => {
    const response = await request.get('/api/pets');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('payload').that.is.an('array');
  });

  it('GET /api/pets/:pid debe devolver una mascota específica', async () => {
    const response = await request.get(`/api/pets/${createdPetId}`);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.property('name', 'Firulais');
  });

  it('PUT /api/pets/:pid debe actualizar una mascota correctamente', async () => {
    const response = await request.put(`/api/pets/${createdPetId}`).send({ age: 5 });
    expect(response.status).to.equal(200);
    expect(response.body.payload.age).to.equal(5);
  });

  it('DELETE /api/pets/:pid debe eliminar una mascota', async () => {
    const response = await request.delete(`/api/pets/${createdPetId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
  });

  after(async () => {
    await mongoose.connection.collection('pets').deleteOne({ _id: new mongoose.Types.ObjectId(createdPetId) });
  });
});
