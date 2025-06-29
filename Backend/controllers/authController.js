const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const otpStorage = {}; 

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("Generated OTP:", otp); // Debugging to verify numeric OTP

        // ✅ Store OTP (Modify storage as per your choice: In-Memory, Redis, or MongoDB)
        otpStorage[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

        // ✅ Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // ✅ Check OTP in memory
        if (!otpStorage[email] || otpStorage[email].otp !== otp || Date.now() > otpStorage[email].expiresAt) {
            return res.status(400).json({ message: "Invalid or expired OTP!" });
        }

        // ✅ Remove OTP from memory after verification
        delete otpStorage[email];

        // ✅ Update only the password (role remains unchanged)
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: "Password reset successful!" });
    } catch (error) {
        console.error("Error in verifyOtp:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.librarianLogin = [
    // Validate email and password
    body("email").isEmail().withMessage("Please provide a valid email address."),
    body("password").notEmpty().withMessage("Password is required."),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Server configuration error!" });

            const user = await User.findOne({ email, role: "librarian" });
            if (!user) return res.status(400).json({ message: "Librarian not found!" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

            generateToken(res, user);

            res.json({ message: "Librarian logged in successfully!", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    }
];

exports.studentLogin = [
    // Validate email and password
    body("email").isEmail().withMessage("Please provide a valid email address."),
    body("password").notEmpty().withMessage("Password is required."),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Server configuration error!" });

            const user = await User.findOne({ email, role: "student" });
            if (!user) return res.status(400).json({ message: "Student not found!" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

            generateToken(res, user);

            res.json({ message: "Student logged in successfully!", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    }
];

exports.changePassword = [
  // Validation middleware
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Check if new password is different
      const isSame = await bcrypt.compare(req.body.newPassword, user.password);
      if (isSame) {
        return res.status(400).json({ error: 'New password must be different from current' });
      }

      // Update password
      user.password = req.body.newPassword;
      await user.save();

      res.json({ 
        success: true, 
        message: 'Password updated successfully. Please login again.' 
      });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ error: 'Server error during password change' });
    }
  }
];

const generateToken = (res, user) => {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // ✅ Only secure in production
        sameSite: "Strict",
        maxAge: 3600000 // ✅ 1 Hour Expiry
    });
};

exports.logout = (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) }); // ✅ Explicit Expiry
    res.json({ message: "Logged out successfully!" });
};

exports.checkSession = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Session expired. Please log in again." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: decoded });
    } catch (error) {
        res.status(401).json({ message: "Invalid session." });
    }
};

exports.librarianRegister = async (req, res) => {
    const { name, email, phone, password, department } = req.body;
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const allowedDepartments = [
        "Computer Science & Engineering",
        "Electronics & Communication Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electrical Engineering",
        "Information Technology",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biotechnology",
        "Management",
        "Humanities",
        "Other"
    ];
    const nameRegex = /^[A-Za-z .]{2,}$/;
    if (!name || !email || !phone || !password || !department) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address." });
    }
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Phone must be 10 digits." });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    if (!allowedDepartments.includes(department)) {
        return res.status(400).json({ message: "Invalid department selected." });
    }
    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: "Name must be at least 2 characters and contain only letters, spaces, or dots." });
    }
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }
        // Create new librarian
        const newUser = new User({
            name,
            email,
            phone,
            password,
            department,
            role: "librarian"
        });
        await newUser.save();
        res.status(201).json({ message: "Librarian registered successfully!" });
    } catch (error) {
        console.error("Librarian registration error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

