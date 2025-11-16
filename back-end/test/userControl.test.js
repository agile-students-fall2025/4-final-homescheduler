const chai = require('chai');
const supertest = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');

const expect = chai.expect;
const request = supertest(app);

// Correct data paths
const usersPath = path.join(process.cwd(), 'data', 'users.json');
const seedUsersPath = path.join(__dirname, 'seed.users.json');

// Load seed data
const seedUsers = fs.readFileSync(seedUsersPath, 'utf-8');

// Reset users.json before each test
beforeEach(() => {
  fs.writeFileSync(usersPath, seedUsers, 'utf-8');
});

describe("Auth API (/api/users)", () => {

  // -------------------------------
  // SIGNUP TESTS
  // -------------------------------
  describe("POST /api/users/signup", () => {

    it("should successfully create a new user", async () => {
      const newUser = {
        firstName: "Ava",
        lastName: "August",
        email: "ava@test.com",
        password: "mypassword123"
      };

      const res = await request
        .post("/api/users/signup")
        .send(newUser);

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal("Account created successfully!");
      expect(res.body.user.email).to.equal("ava@test.com");

      const updated = JSON.parse(fs.readFileSync(usersPath));
      expect(updated.length).to.equal(2); // 1 seed + 1 new
    });

    it("should return 400 when missing fields", async () => {
      const res = await request
        .post("/api/users/signup")
        .send({ email: "missing@fields.com" });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Please fill in all fields.");
    });

    it("should return 409 when email already exists", async () => {
      const res = await request
        .post("/api/users/signup")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "existing@test.com",
          password: "fakepassword"
        });

      expect(res.status).to.equal(409);
      expect(res.body.message).to.equal("Email already registered.");
    });

  });

  // -------------------------------
  // LOGIN TESTS
  // -------------------------------
  describe("POST /api/users/login", () => {

    it("should log in with correct credentials", async () => {
      const res = await request
        .post("/api/users/login")
        .send({
          email: "existing@test.com",
          password: "password123"
        });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Logged in!");
      expect(res.body.user).to.have.property("token");
    });

    it("should return 404 for nonexistent email", async () => {
      const res = await request
        .post("/api/users/login")
        .send({
          email: "wrong@test.com",
          password: "whatever"
        });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Email not found.");
    });

    it("should return 400 for wrong password", async () => {
      const res = await request
        .post("/api/users/login")
        .send({
          email: "existing@test.com",
          password: "WRONG"
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Incorrect password.");
    });

  });

});
