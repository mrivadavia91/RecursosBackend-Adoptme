import chai from 'chai';
import supertest from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../src/app.js';
import mongoose from 'mongoose';

const expect = chai.expect;
const request = supertest(app);

describe('POST /api/users/:uid/documents - Subida de documentos', () => {
  let uid;

  before(async () => {
    // Creamos un usuario temporal para testear
    const response = await request.post('/api/sessions/register').send({
      first_name: 'Doc',
      last_name: 'Tester',
      email: 'doctest@example.com',
      password: '123456'
    });
    uid = response.body.payload._id;
  });

  it('Debe subir un archivo PDF correctamente y guardar la referencia en el usuario', async () => {
    const filePath = path.join(__dirname, 'files', 'test.pdf');
    
    const response = await request
      .post(`/api/users/${uid}/documents`)
      .attach('documents', filePath);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body.payload).to.have.property('documents');
    expect(response.body.payload.documents.length).to.be.greaterThan(0);

    const doc = response.body.payload.documents.find(d => d.name === 'test.pdf');
    expect(doc).to.exist;
    expect(doc.reference).to.include('/documents/');
  });

  after(async () => {
    await mongoose.connection.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(uid) });
  });
});
