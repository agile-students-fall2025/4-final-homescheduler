const mongoose = require('mongoose');
const { Schema, model } = mongoose; 
const crypto = require('crypto'); 

// 1. USER SCHEMA
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  family: {
    type: Schema.Types.ObjectId, // Kept consistent using Schema.Types
    ref: 'Family'
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// 2. CALENDAR EVENT SCHEMA
const calendarEventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  startDateTime: {
    type: Date,
    required: true,
    index: true 
  },
  endDateTime: {
    type: Date,
    required: true,
    // Validate that End is after Start
    validate: {
      validator: function(value) {
        // 'this' refers to the document being saved
        return this.startDateTime <= value;
      },
      message: 'End time must be after start time.'
    }
  },
  description: {
    type: String,
    trim: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// FIXED: Use .some() and .equals() for reliable ObjectId comparison
calendarEventSchema.methods.hasAccess = function(userId) {
  if (!userId) return false;
  return this.participants.some(participantId => participantId.equals(userId));
};

// 3. FAMILY SCHEMA
const familySchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    familyCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      // Generates a 6-char hex code (e.g., "A1B2C3")
      default: () => crypto.randomBytes(3).toString('hex').toUpperCase()
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }, {
    timestamps: true
  });

// Create Models
const User = model('User', userSchema);
const CalendarEvent = model('CalendarEvent', calendarEventSchema);
const Family = model('Family', familySchema);



module.exports = {
    User,
    CalendarEvent,
    Family
};