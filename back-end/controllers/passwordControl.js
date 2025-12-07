const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../db');   
const auth = require('../authentication');

const router = express.Router();

router.post('/manage-account', async(req, res) => {
    try{
        const {firstName, lastName, email, password} = req.body;

        if (!firstName || !lastName || !email || !password){
            return res.status(400).json({message: "Please fill in all fields"});
        }

        const user = await User.findOne({ email });
        if (!user){
            return res.status(404).json({message: "Email not found"});
        }
        if (user.firstName !== firstName || user.lastName !== lastName){
            return res.status(404).json({message: "Name not found"});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(404).json({message: "Incorrect password"});
        }
        return res.status(200).json({ message: "Verification successful"});
    } catch(err){
        console.error("manage-account error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/change_password', async(req, res) => {
    try{
        const {email, currpassword, newpassword} = req.body;
        if (!email || !currpassword || !newpassword){
            return res.status(400).json({message: "Please fill in all fields"});
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(currpassword, user.password);
        if (!passwordMatch){
            return res.status(400).json({message: "Incorrect password"});
        }

        user.password = await bcrypt.hash(newpassword, 10);
        await user.save();

        return res.status(200).json({message: "Password updated successfully"});
    }catch (err){
        console.error("change-password error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;