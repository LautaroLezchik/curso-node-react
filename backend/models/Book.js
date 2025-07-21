const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // This is a reference to the User model's _id
        required: true,
        ref: 'User', // Refers to the 'User' model (collection)
    },
    title: {
        type: String,
        required: [true, 'Please add a book title'],
        trim: true,
        minlength: [1, 'Title cannot be empty']
    },
    author: {
        type: String,
        required: [true, 'Please add an author'],
        trim: true,
        minlength: [1, 'Author cannot be empty']
    },
    read: {
        type: Boolean,
        default: false, // Books are unread by default when added
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Book', BookSchema);