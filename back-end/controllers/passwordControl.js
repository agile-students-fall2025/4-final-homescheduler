const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cwd } = require('process');

const router = express.Router();

const usersPath = path.join(process.cwd(), 'data', 'users.json');

const readUsers = () => {
  if (!fs.existsSync(usersPath)) return [];
  return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
};

const writeUsers = (data) => {
  fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
};

router.post('/manage-account', async(req, res) => {
    const {firstName, lastName, email, password} = req.body;

    if (!firstName || !lastName || !email || !password){
        return res.status(400).json({message: "Please fill in all fields"});
        return;
    }

    const users = readUsers();
    const userName = users.find((u) => u.name === (firstName + ' ' + lastName));
    const userEmail = users.find((u) => u.email === email);


    if (!userName){
        return res.status(404).json({message: "Name not found"});
    }else if(!userEmail){
        return res.status(404).json({message:"Email not found"});
    }

    const userPassword = await bcrypt.compare(password, userEmail.passwordHash);
    if(!userPassword){
        return res.status(404).json({message: "Incorrect password"});
    }
    return res.status(200).json({ message: "Verification successful"});

});

router.post('/change_password', async(req, res) => {
    const {email, currpassword, newpassword} = req.body;
    if (!email || !currpassword || !newpassword){
        return res.status(400).json({message: "Please fill in all fields"});
    }
    const users = readUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const userPassword = await bcrypt.compare(currpassword, user.passwordHash);
    if (!userPassword){
        return res.status(400).json({message: "Incorrect password"});
    }

    user.passwordHash = await bcrypt.hash(newpassword, 10);
    writeUsers(users);

    return res.status(200).json({message: "Password updated successfully"});
});

module.exports = router;