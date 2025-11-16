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
  
 // update event test case
 describe('PUT /api/events/:id', () => {
  it('should update a preexisting event', async () => {
    const resGet = await request.get('/api/events');
    expect(resGet.status).to.equal(200)

    const gymEvent = resGet.body.find(e => e.title === 'Gym');
    expect(gymEvent).to.exist;
    
    
    const eventIdToUpdate = gymEvent.id

    const updates = {
      title: 'CANCELLED - Gym',
      start: '2025-11-14T19:00:00'
    };

    const res = await request
      .put(`/api/events/${eventIdToUpdate}`)
      .send(updates);

    
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.title).to.equal('CANCELLED - Gym');
    expect(res.body.start).to.equal('2025-11-14T19:00:00');
    expect(res.body.id).to.equal(eventIdToUpdate);


    // Check if the file was  updated
    const updatedEvents = JSON.parse(fs.readFileSync(liveDataPath, 'utf-8'));
    const changedEvent = updatedEvents.find(e => e.id === eventIdToUpdate);
    expect(changedEvent.title).to.equal('CANCELLED - Gym');
  });

  it('should return 404 if ID is nonexistent', async () => {
    const res = await request
      .put(`/api/events/fake-id-123`)
      .send({ title: 'New Title'});

    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('Event not found');
  });
});

 // delete event test case
 describe('DELETE /api/events/:id', () => {
  it('should delete a preexisting event', async () => {
    const resGet = await request.get('/api/events');
    expect(resGet.status).to.equal(200)

    const movingEvent = resGet.body.find(e => e.title === 'Moving Day');
    expect(movingEvent).to.exist;
    
    const eventIdToDelete = movingEvent.id

    const res = await request
      .delete(`/api/events/${eventIdToDelete}`)

    
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Event deleted successfully');


    // Check if the file was  updated
    const updatedEvents = JSON.parse(fs.readFileSync(liveDataPath, 'utf-8'));
    expect(updatedEvents).to.have.lengthOf(1);
    expect(updatedEvents[0].title).to.equal('Gym');
  });

  it('should return 404 if ID is nonexistent', async () => {
    const res = await request.delete(`/api/events/fake-id-123`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('Event not found');
  });
});

  // ---end 
});
  