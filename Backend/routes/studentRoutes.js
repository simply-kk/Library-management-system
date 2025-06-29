const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Issue = require("../models/Issue");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { changePassword } = require("../controllers/authController");

const router = express.Router();


router.get("/dashboard", protect("student"), (req, res) => {
    res.json({ 
        message: "Welcome to Student Dashboard!", 
        user: req.user 
    });
});

router.get("/issued-books", protect("student"), async (req, res) => {
    try {
        const issues = await Issue.find({ student: req.user._id })
            .populate("books.book", "bookName accessionNumber authorName")
            .populate("returnedBooks.book", "_id");

        const unreturnedBooks = [];

        issues.forEach(issue => {
            const returnedSet = new Set(
                issue.returnedBooks.map(r => r.issuedBookId?.toString())
            );

            issue.books.forEach(bookObj => {
                if (!returnedSet.has(bookObj._id.toString())) {
                    unreturnedBooks.push({
                        _id: bookObj.book._id,
                        bookName: bookObj.book.bookName,
                        accessionNumber: bookObj.book.accessionNumber,
                        authorName: bookObj.book.authorName,
                        issueDate: bookObj.issueDate,
                        dueDate: bookObj.dueDate
                    });
                }
            });
        });

        res.json({ books: unreturnedBooks });
    } catch (error) {
        console.error("Error fetching issued books:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/history", protect("student"), async (req, res) => {
    try {
        const issues = await Issue.find({ student: req.user._id })
            .populate("books.book", "bookName accessionNumber authorName")
            .populate("returnedBooks.book", "bookName accessionNumber")
            .sort({ createdAt: -1 });

        const transactions = [];

        issues.forEach(issue => {
            const returnedMap = new Map();
            issue.returnedBooks.forEach(r => {
                if (r.issuedBookId) {
                    returnedMap.set(r.issuedBookId.toString(), r.returnedAt);
                }
            });

            issue.books.forEach(bookEntry => {
                transactions.push({
                    book: bookEntry.book,
                    issueDate: bookEntry.issueDate,
                    dueDate: bookEntry.dueDate,
                    returned: returnedMap.has(bookEntry._id.toString()),
                    returnedAt: returnedMap.get(bookEntry._id.toString()) || null
                });
            });
        });

        res.json({ transactions });
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/profile', protect('student'), async (req, res) => {
  try {
    res.json({ 
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        department: req.user.department,
        batch: req.user.batch,
        rollNumber: req.user.rollNumber,
        role: req.user.role  // Make sure this is included
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', protect('student'), async (req, res) => {
  try {
    const { phone } = req.body;
    
    // Validate phone number
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { phone },
      { new: true }
    ).select('-password');
    
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

router.post("/change-password", protect("student"), changePassword);

module.exports = router;
