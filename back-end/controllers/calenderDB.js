const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, CalendarEvent, Family } = require("../db")
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });require('dotenv').config();


const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to Database');
  } catch (error) {
    console.error('❌ Connection failed', error);
  }
};

// Call the function
const createUser = async (userData) => {
    try {
      const { firstName, lastName,email, password } = userData;
  
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email.');
      }
  
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
      });
  
      const savedUser = await newUser.save();
      
      const { password: _, ...userWithoutPassword } = savedUser.toObject();
      return userWithoutPassword;
  
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw error;
    }
  };


const runTest = async () => {
    // Connect first!
    await connectToDb();

    try {
        console.log("Creating user...");
        
        const dad = await createUser({
            firstName: "John Doe", 
            lastName: "DOe",
            email: "john@example.com",
            password: "securePassword123"
        });

        console.log("🎉 Success!");
        console.log("User created:", dad.firstName, dad.email);
        
    } catch (e) {
        console.log("⚠️ Test Failed:", e.message);
    } finally {
        mongoose.connection.close();
    }
};
runTest();

//code for later 
/*
const registerUser= async (req,res)=>{
    const{
        firstName,
        lastName,
        email,
        password
    }= req.body
}
    */
/*
const userExists = await User.findOne({ email }).populate('profile');
  if (userExists) {
    return res.status(409).json({ message: 'Email already in use.' });
  }
  if (!email || !password || !lastName || !firstNameame) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }
  const session = await mongoose.startSession();

  try{
    session.startTransaction();
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
        
    })
  }catch(e){}
  */