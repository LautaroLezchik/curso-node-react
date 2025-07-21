const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true, // Ensures usernames are unique
        trim: true,   // Removes whitespace from both ends of a string
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // Ensures emails are unique
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // This ensures the password field is not returned by default when querying users
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- Mongoose Middleware for Password Hashing ---
// This pre-save hook will hash the password before saving a new user or updating a password
UserSchema.pre('save', async function(next) {
    // Only hash if the password has been modified (or is new)
    if (!this.isModified('password')) {
        next();
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10); // 10 rounds is a good balance for security and performance
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Mongoose Method for Password Comparison ---
// This method will be available on user instances to compare a given password with the hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);