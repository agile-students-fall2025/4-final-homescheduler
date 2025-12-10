const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const { User, Family } = require("../db")


router.post('/join', auth, async (req, res) => {
  try {
    const { familyCode } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!familyCode) {
      return res.status(400).json({ message: "Family code is missing." });
    }

    const newFamily = await Family.findOne({familyCode: familyCode});

    if (!newFamily){
      return res.status(404).json({message: 'Family not found.' })
    }

    if (newFamily.members.includes(userId)) {
      return res.status(400).json({ message: "You have already joined this family." });
    }
    if (user.family) {
      const oldFamily = await Family.findById(user.family);
      if (oldFamily) {
        oldFamily.members = oldFamily.members.filter(
          memberId => memberId.toString() !== userId.toString()
        );
        await oldFamily.save();
      }
    }

    newFamily.members.push(userId);
    await newFamily.save();

    user.family = newFamily._id;
    await user.save();

    return res.status(200).json({
      message: "Successfully joined family.",
      familyName: newFamily.name,
      familyCode: newFamily.familyCode
    });


  } catch(err){
    console.error("Error joining family:", err.message);
    return res.status(500).json({message: 'Cannot join family.' });
  }
});

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