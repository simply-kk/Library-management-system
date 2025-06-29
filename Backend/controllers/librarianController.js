const { body, validationResult } = require("express-validator");
const User = require("../models/User");

exports.createLibrarian = [
    // Validate inputs
    body("name")
        .notEmpty().withMessage("Name is required")
        .matches(/^[A-Za-z\s'-]+$/).withMessage("Name can only contain letters, spaces, hyphens, and apostrophes"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("phone").isLength({ min: 10, max: 10 }).withMessage("Phone number must be 10 digits"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("department").notEmpty().withMessage("Department is required"),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, phone, password, department } = req.body;

            // Check if the requesting user is a librarian
            if (req.user.role !== "librarian") {
                return res.status(403).json({ message: "Access denied. Only librarians can create new librarians." });
            }

            // Check if the email is already registered
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: "A user with this email already exists!" });
            }

            // Create the new librarian
            const librarian = new User({
                name,
                email,
                phone,
                password, // Password will be hashed by the pre-save hook in the User model
                department,
                role: "librarian",
                createdBy: req.user._id, // Track which librarian created this account
            });

            await librarian.save();

            res.status(201).json({ message: "Librarian created successfully!", librarian });
        } catch (error) {
            console.error("Error creating librarian:", error);
            res.status(500).json({ message: "Server Error" });
        }
    }
];

