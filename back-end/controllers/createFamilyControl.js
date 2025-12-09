const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const { User, Family } = require("../db")

router.post('/', auth, async (req, res) => {
    try {
      const { familyName, familyCode } = req.body;
      const userId = req.user.id;

      if (!familyName){
        return res.status(400).json({message: 'Family name is missing.' })
      }
       if (!familyCode){
        return res.status(400).json({message: 'Family code is missing.' })
      }

      const existingFamily = await Family.findOne({ familyCode: familyCode });
      if (existingFamily) {
        return res.status(400).json({message: 'Family already exists.' })
      }
      const newFamily = await Family.create({
        name: familyName,
        familyCode: familyCode,
        admin: userId,
        members: [userId]
      });
      await User.findByIdAndUpdate(userId, {
        family: newFamily._id
      });
      return res.status(201).json({
        familyName: newFamily.name,
        familyCode: newFamily.familyCode
      });
    } catch (err) {
        console.error("Error creating family:", err.message);
        return res.status(500).json({message: 'Cannot create family.' });
      }
    }
);


module.exports = router;