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
const EventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    // Matches React's "start"
    start: {
      type: Date,
      required: true, 
    },
    // Matches React's "end" (Optional, as your "Add" modal doesn't send it)
    end: {
      type: Date, 
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    // Matches React's "location" (was description)
    location: {
      type: String,
      default: ''
    },
    // Matches React's "user" (Store the name string directly)
    user: {
      type: String, 
      required: true
    },
    // Matches React's filter
    isFamily: {
      type: Boolean,
      default: true
    }
  });
  
  // Helper: Rename _id to id for the frontend
  EventSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  });

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

  // 4. REMINDER SCHEMA
  const reminderSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    dueAt: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      default: ""
    },
    repeat: {
      type: [String],
      default: []
    },
    notify: {
      type: String,
      default: "off"
    },
    done: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true
  });

  // Ensures the frontend receives `id` instead of `_id`
  reminderSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
    }
  });
  const Reminder = model("Reminder", reminderSchema);


  const User = model('User', userSchema);

  // CHANGED: Variable name from 'Events' to 'CalendarEvent'
  // CHANGED: Model name from 'Events' to 'CalendarEvent'
  const CalendarEvent = model('CalendarEvent', EventSchema); 
  
  const Family = model('Family', familySchema);
  
  module.exports = {
      User,
      CalendarEvent, // <--- Now this matches your controller import!
      Family
  };