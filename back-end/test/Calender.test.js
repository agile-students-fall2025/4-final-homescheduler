const chai = require('chai');
const supertest = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app'); 

const expect = chai.expect;
const request = supertest(app);

// --- Test Data Management ---
const liveDataPath = path.join(process.cwd(), 'data', 'events.json');
const seedDataPath = path.join(__dirname, 'seed.events.json');

// Read the seed data 
const seedData = fs.readFileSync(seedDataPath, 'utf-8');

//Reset data
beforeEach(() => {
  try {
    fs.writeFileSync(liveDataPath, seedData, 'utf-8');
  } catch (err) {
    console.error('Error resetting test data:', err);
  }
});

///Calendar Test caseses

//Get test calender
describe('Event API (/api/events)', () => {

  describe('GET /api/events', () => {
    it('should return all events from the file', async () => {
      const res = await request.get('/api/events');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(2); // From seed.events.json
      expect(res.body[0].title).to.equal('Moving Day');
    });
  });

  // ---
  // new event tests
  describe('POST /api/events', () => {
    it('should create a new event and add it to the file', async () => {
      const newEvent = {
        title: 'Doctors Appointment',
        start: '2025-11-25T10:30:00',
        user: 'Me',
        location: 'Downtown Clinic',
        isFamily: false
      };

      const res = await request
        .post('/api/events')
        .send(newEvent);

      // Check the response
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.be.a('string'); // Check if a UUID was generated
      expect(res.body.title).to.equal('Doctors Appointment');
      expect(res.body.extendedProps.location).to.equal('Downtown Clinic');
      
      // Check if the file was  updated
      const updatedEvents = JSON.parse(fs.readFileSync(liveDataPath, 'utf-8'));
      expect(updatedEvents).to.have.lengthOf(3);
      expect(updatedEvents[2].title).to.equal('Doctors Appointment');
    });

    it('should return 400 if required fields are missing', async () => {
      const badEvent = {
        location: 'Nowhere' 
      };

      const res = await request
        .post('/api/events')
        .send(badEvent);

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('Missing required fields: title, start, user');
    });
  });

  // ---end 
});
  