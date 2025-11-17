const chai = require('chai');
const supertest = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');

const expect = chai.expect;
const request = supertest(app);

const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const seedUsersPath = path.join(__dirname, 'seed.users.json');
const seedData = fs.readFileSync(seedUsersPath, 'utf-8');

// Reset DB for every test
beforeEach(() => {
  fs.writeFileSync(usersPath, seedData, 'utf-8');
});

describe("Family API (/api/family)", () => {
  describe("POST /api/family/manage-account", () => {

    it("should return 404 because the name does not match", async () => {
      const res = await request
        .post("/api/family/manage-account")
        .send({
          firstName: "Brandon",
          lastName: "Rodriguez",
          email: "existing@test.com",
          password: "password123"
        });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Name not found");
    });

    it("should return 404 when email does not match", async () => {
      const res = await request
        .post("/api/family/manage-account")
        .send({
          firstName: "Existing",
          lastName: "User",
          email: "wrong@test.com",
          password: "password123"
        });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Email not found");
    });

    it("should return 404 when password is incorrect", async () => {
      const res = await request
        .post("/api/family/manage-account")
        .send({
          firstName: "Existing",
          lastName: "User",
          email: "existing@test.com",
          password: "WRONG"
        });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("Incorrect password");
    });

    it("should successfully verify account (only works if name matches)", async () => {
      // FIX THE NAME IN THE SEED FILE IF YOU WANT THIS TO PASS
      const res = await request
        .post("/api/family/manage-account")
        .send({
          firstName: "Existing",
          lastName: "User",
          email: "existing@test.com",
          password: "password123"
        });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Verification successful");
    });

  });

  describe("POST /api/family/change_password", () => {

    it("should return 404 if user email does not exist", async () => {
      const res = await request
        .post("/api/family/change_password")
        .send({
          email: "notreal@test.com",
          currpassword: "password123",
          newpassword: "newpass"
        });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal("User not found");
    });

    it("should return 400 when the current password is incorrect", async () => {
      const res = await request
        .post("/api/family/change_password")
        .send({
          email: "existing@test.com",
          currpassword: "WRONG",
          newpassword: "newpass"
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Incorrect password");
    });

    it("should successfully update the password", async () => {
      const res = await request
        .post("/api/family/change_password")
        .send({
          email: "existing@test.com",
          currpassword: "password123",
          newpassword: "newpass"
        });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Password updated successfully");
    });

  });

});
