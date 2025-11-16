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

  // ---

  //update event test
  describe('PUT /api/events/:id', () => {
    it('should update an existing event', async () => {
      const eventIdToUpdate = '3b54f70d-a670-4cbe-b1b3-301dc2123690'; // The "Gym" event
      const updates = {
        title: 'CANCELLED - Gym',
        start: '2025-11-14T19:00:00' // Changed time
      };

      const res = await request
        .put(`/api/events/${eventIdToUpdate}`)
        .send(updates);
      
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('CANCELLED - Gym');
      expect(res.body.start).to.equal('2025-11-14T19:00:00');
      
      // Check the file
      const updatedEvents = JSON.parse(fs.readFileSync(liveDataPath, 'utf-8'));
      const changedEvent = updatedEvents.find(e => e.id === eventIdToUpdate);
      expect(changedEvent.title).to.equal('CANCELLED - Gym');
    });

    it('should return 404 for a non-existent ID', async () => {
      const res = await request
        .put('/api/events/fake-id-123')
        .send({ title: 'New Title' });
        
      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('Event not found');
    });
  });

  // ---

  //Delete event test case
  describe('DELETE /api/events/:id', () => {
    it('should delete an existing event', async () => {
      const eventIdToDelete = 'f1be346a-199e-46fb-a5cb-0165ff502b70'; // "Moving Day"

      const res = await request
        .delete(`/api/events/${eventIdToDelete}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Event deleted successfully');
      
      // Check the file
      const updatedEvents = JSON.parse(fs.readFileSync(liveDataPath, 'utf-8'));
      expect(updatedEvents).to.have.lengthOf(1); // Was 2, now 1
      expect(updatedEvents[0].title).to.equal('Gym'); // Only "Gym" remains
    });

    it('should return 404 for a non-existent ID', async () => {
      const res = await request.delete('/api/events/fake-id-123');
        
      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('Event not found');
    });
  });

});

//End of calender test cases