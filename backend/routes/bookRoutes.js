const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler'); // For handling async errors
const Book = require('../models/Book'); // Import the Book model
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

// @desc    Get all books for the authenticated user
// @route   GET /api/books
// @access  Private
router.get(
    '/',
    protect, // Apply protection middleware
    asyncHandler(async (req, res) => {
        // Find all books where the 'user' field matches the authenticated user's ID
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json(books);
    })
);

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
router.post(
    '/',
    protect, // Apply protection middleware
    asyncHandler(async (req, res) => {
        const { title, author, read } = req.body;

        // Basic validation for required fields
        if (!title || !author) {
            res.status(400);
            throw new Error('Please add a title and author for the book');
        }

        const newBook = await Book.create({
            user: req.user._id, // Associate the book with the authenticated user
            title,
            author,
            read: read || false, // Default to false if 'read' is not provided
        });

        res.status(201).json(newBook);
    })
);

// @desc    Update a book (e.g., mark as read/unread, change title/author)
// @route   PUT /api/books/:id
// @access  Private
router.put(
    '/:id',
    protect, // Apply protection middleware
    asyncHandler(async (req, res) => {
        const { title, author, read } = req.body; // Extract fields that can be updated

        // Find the book by ID
        const book = await Book.findById(req.params.id);

        if (!book) {
            res.status(404); // Not Found
            throw new Error('Book not found');
        }

        // --- Crucial Security Check: Ensure the logged-in user owns the book ---
        // Convert both IDs to strings for comparison
        if (book.user.toString() !== req.user._id.toString()) {
            res.status(401); // Unauthorized
            throw new Error('Not authorized to update this book');
        }
        // --- End Security Check ---

        // Prepare update object, only include fields that were provided in the request body
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (author !== undefined) updateData.author = author;
        // The 'read' field specifically needs to handle boolean 'false' correctly
        if (read !== undefined) updateData.read = read;

        if (Object.keys(updateData).length === 0) {
            res.status(400);
            throw new Error('No valid fields provided for update');
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true } // Return the updated document, run schema validators
        );

        res.status(200).json(updatedBook);
    })
);

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
router.delete(
    '/:id',
    protect, // Apply protection middleware
    asyncHandler(async (req, res) => {
        const book = await Book.findById(req.params.id);

        if (!book) {
            res.status(404); // Not Found
            throw new Error('Book not found');
        }

        // --- Crucial Security Check: Ensure the logged-in user owns the book ---
        // Convert both IDs to strings for comparison
        if (book.user.toString() !== req.user._id.toString()) {
            res.status(401); // Unauthorized
            throw new Error('Not authorized to delete this book');
        }
        // --- End Security Check ---

        await book.deleteOne(); // Use deleteOne for Mongoose 6+

        res.status(200).json({ message: 'Book removed successfully', id: req.params.id });
    })
);

module.exports = router;