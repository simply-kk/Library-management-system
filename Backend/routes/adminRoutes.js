const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
const { createStudent, getStudents, getStudentById, updateStudent, deleteStudent, bulkImportStudents } = require("../controllers/studentController");
const { createLibrarian } = require("../controllers/librarianController");
const router = express.Router();
const upload = multer({ dest: "uploads/" }); 
const User = require("../models/User");
const { changePassword } = require("../controllers/authController");

router.get("/dashboard", protect("librarian"), (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard!", user: req.user });
});


router.post("/create-student", protect("librarian"), createStudent);
router.get("/students", protect("librarian"), getStudents);
router.get("/students/:id", protect("librarian"), getStudentById);
router.put("/students/:id", protect("librarian"), updateStudent);
router.delete("/students/:id", protect("librarian"), deleteStudent);
router.post("/bulk-import-students", protect("librarian"), upload.single("file"), bulkImportStudents);
router.post("/create-librarian", protect("librarian"), createLibrarian);
router.post("/change-password", protect("librarian"), changePassword);

router.get("/profile", protect("librarian"), async (req, res) => {
  try {
    res.json({ 
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        department: req.user.department,
        role: req.user.role  // Make sure this is included
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", protect("librarian"), async (req, res) => {
  try {
    console.log("Request body:", req.body); // 👈 log incoming data
    console.log("User ID:", req.user._id);  // 👈 log user ID

    const { name, phone, department } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, department },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: updated });
  } catch (err) {
    console.error("Update failed:", err.message); // 👈 Better error output
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});


module.exports = router;