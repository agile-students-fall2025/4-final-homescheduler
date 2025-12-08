const express = require('express');
const router = express.Router();
const { User, Family } = require("../db")
//const path = require('path');
//require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

router.post('/', async (req, res) => {
    
    try {
        const { familyName, userId} = req.body;
        if (!familyName){
            return res.status(400).json({message: 'Family name is missing.' })
        }
        //check if family exists
        const existingFamily = await Family.findOne({ name: familyName });
        if (existingFamily) {
            return res.status(400).json({message: 'Family name already exists.' })
      }
      //create new family
      const newFamily = new Family({
        name: familyName,
        members: [userId]
      });

      const savedFamily = await newFamily.save();
      return res.status(201).json(savedFamily);

    } catch (e) {
        console.error("Error creating family:", e.message);
        return res.status(500).json({message: 'Cannot create family.' });
      
      }
    
    }
);

router.get('/check', async (req, res) => {
    try {
        const { familyName } = req.query;

        if (!familyName){
            return res.status(400).json({message: 'Family name required.'})
        }

        const existingFamily = await Family.findOne({ name: familyName });
        if (!existingFamily) {
            //return res.status(500).json({message: 'Family does not exist.' });
            return res.json({exists: false});
      }
    return res.json({
        exists: true,
        family: existingFamily
    });
} catch (e) {
    console.error("Test Failed:", e.message);
    return res.status(500).json({message: 'Server error'});
}
});

module.exports = router;

///
/*
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database');
  } catch (error) {
    console.error('Connection failed', error);
  }
};

// Call the function
const createFamily = async (familyData) => {
    try {
      const { familyName, members} = familyData;
  
      // Check if family exists
      const existingFamily = await Family.findOne({ name: familyName });
      if (existingFamily) {
        throw new Error('Family name already exists.');
      }
      const findMembers = await User.find({ email: { $in: members } });
      
      const newFamily = new Family({
        name: familyName,
        members: members.map(u => u._id),
      });
  
      const savedFamily = await newFamily.save();
      return savedFamily.toObject();
      
  
    } catch (error) {
      console.error("Error creating family:", error.message);
      throw error;
    }
  };


const runTest = async () => {
    // Connect first!
    await connectToDb();

    try {
        console.log("Creating family...");
        
        const family = await createFamily({
            familyName: "New Family", 
            members: [
              "john@example.com",
              "peter@example.com"
            ]
        });

        console.log("Success!");
        console.log(family.members.length, "members in ", family.name);
        
    } catch (e) {
        console.log("Test Failed:", e.message);
    } finally {
        mongoose.connection.close();
    }
};
runTest();
*/