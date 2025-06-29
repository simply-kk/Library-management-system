const bcrypt = require("bcryptjs");
const User = require("../models/User");
const csv = require("csv-parser");
const fs = require("fs");

// exports.bulkImportStudents = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded!" });
//         }

//         const students = [];
//         const errors = [];
//         const duplicates = [];

//         fs.createReadStream(req.file.path)
//             .pipe(csv())
//             .on("data", (row) => {
//                 // Validate inputs
//                 if (!row.name || !row.email || !row.phone || !row.department || !row.batch || !row.rollNumber) {
//                     errors.push({ row, error: "Missing required fields" });
//                     return;
//                 }

//                 // Validate email format
//                 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                 if (!emailRegex.test(row.email)) {
//                     errors.push({ row, error: "Invalid email format" });
//                     return;
//                 }

//                 // Validate phone number (10 digits)
//                 const phoneRegex = /^\d{10}$/;
//                 if (!phoneRegex.test(row.phone)) {
//                     errors.push({ row, error: "Invalid phone number" });
//                     return;
//                 }

//                 // Validate batch format (YYYY-YYYY)
//                 const batchRegex = /^\d{4}-\d{4}$/;
//                 if (!batchRegex.test(row.batch)) {
//                     errors.push({ row, error: "Invalid batch format" });
//                     return;
//                 }

//                 // Validate roll number (only numbers)
//                 const rollNumberRegex = /^\d+$/;
//                 if (!rollNumberRegex.test(row.rollNumber)) {
//                     errors.push({ row, error: "Invalid roll number" });
//                     return;
//                 }

//                 // Generate password and hash it
//                 const password = `${row.name.substring(0, 2)}@123`;
//                 const hashedPassword = bcrypt.hashSync(password, 10);

//                 // Add student to the list
//                 const student = {
//                     name: row.name,
//                     email: row.email,
//                     phone: row.phone,
//                     department: row.department,
//                     batch: row.batch,
//                     rollNumber: row.rollNumber,
//                     password: hashedPassword, // Store hashed password
//                     role: "student",
//                     createdBy: req.user._id,
//                 };
//                 students.push(student);
//             })
//             .on("end", async () => {
//                 // Check for duplicate emails
//                 const existingEmails = await User.find({ email: { $in: students.map(s => s.email) } }).select("email");
//                 const existingEmailSet = new Set(existingEmails.map(e => e.email));

//                 const validStudents = students.filter(student => {
//                     if (existingEmailSet.has(student.email)) {
//                         duplicates.push({ student, error: "Duplicate email" });
//                         return false;
//                     }
//                     return true;
//                 });

//                 // Save valid students to the database
//                 if (validStudents.length > 0) {
//                     await User.insertMany(validStudents);
//                 }

//                 // Delete the uploaded file
//                 fs.unlinkSync(req.file.path);

//                 // Send response with errors and duplicates
//                 res.status(201).json({
//                     message: "Bulk import completed!",
//                     created: validStudents.length,
//                     duplicates,
//                     errors,
//                 });
//             });
//     } catch (error) {
//         console.error("Error importing students:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
   
// };

exports.bulkImportStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        const students = [];
        const errors = [];
        const duplicates = [];

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (row) => {
                // Validate inputs
                if (!row.name || !row.email || !row.phone || !row.department || !row.batch || !row.rollNumber) {
                    errors.push({ row, error: "Missing required fields" });
                    return;
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(row.email)) {
                    errors.push({ row, error: "Invalid email format" });
                    return;
                }

                // Validate phone number (10 digits)
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(row.phone)) {
                    errors.push({ row, error: "Invalid phone number" });
                    return;
                }

                // Validate batch format (YYYY-YYYY)
                const batchRegex = /^\d{4}-\d{4}$/;
                if (!batchRegex.test(row.batch)) {
                    errors.push({ row, error: "Invalid batch format" });
                    return;
                }

                // Validate roll number (only numbers)
                const rollNumberRegex = /^\d+$/;
                if (!rollNumberRegex.test(row.rollNumber)) {
                    errors.push({ row, error: "Invalid roll number" });
                    return;
                }

                // Generate password and hash it
                const password = `${row.name.substring(0, 2)}@123`;
                const hashedPassword = bcrypt.hashSync(password, 10);

                // Add student to the list
                const student = {
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                    department: row.department,
                    batch: row.batch,
                    rollNumber: row.rollNumber,
                    password: hashedPassword,
                    role: "student",
                    createdBy: req.user._id,
                };
                students.push(student);
            })
            .on("end", async () => {
                // Check for duplicate emails and roll numbers
                const existingRecords = await User.find({
                    $or: [
                        { email: { $in: students.map(s => s.email) } },
                        { rollNumber: { $in: students.map(s => s.rollNumber) } }
                    ]
                }).select("email rollNumber");

                const existingEmailSet = new Set(existingRecords.map(e => e.email));
                const existingRollNumberSet = new Set(existingRecords.map(e => e.rollNumber));

                const validStudents = students.filter(student => {
                    let isValid = true;
                    
                    if (existingEmailSet.has(student.email)) {
                        duplicates.push({ student, error: "Duplicate email" });
                        isValid = false;
                    }
                    
                    if (existingRollNumberSet.has(student.rollNumber)) {
                        duplicates.push({ student, error: "Duplicate roll number" });
                        isValid = false;
                    }
                    
                    return isValid;
                });

                // Save valid students to the database
                if (validStudents.length > 0) {
                    await User.insertMany(validStudents, { ordered: false });
                }

                // Delete the uploaded file
                fs.unlinkSync(req.file.path);

                // Send response with errors and duplicates
                res.status(201).json({
                    message: "Bulk import completed!",
                    created: validStudents.length,
                    duplicates,
                    errors,
                });
            });
    } catch (error) {
        console.error("Error importing students:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { name, email, phone, department, batch, rollNumber } = req.body;

        // Validate name (alphabets, spaces, hyphens, and apostrophes)
        const nameRegex = /^[A-Za-z\s'-]+$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ message: "Name can only contain alphabets, spaces, hyphens, and apostrophes!" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address!" });
        }

        // Validate phone number (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Please enter a valid 10-digit phone number!" });
        }

        // Validate department (alphabets, spaces, and & symbol)
        const departmentRegex = /^[A-Za-z\s&]+$/;
        if (!departmentRegex.test(department)) {
            return res.status(400).json({ message: "Department can only contain alphabets, spaces, and the & symbol!" });
        }

        // Validate batch (format: YYYY-YYYY)
        const batchRegex = /^\d{4}-\d{4}$/;
        if (!batchRegex.test(batch)) {
            return res.status(400).json({ message: "Batch must be in the format YYYY-YYYY (e.g., 2021-2025)!" });
        }

        // Validate roll number (only numbers)
        const rollNumberRegex = /^\d+$/;
        if (!rollNumberRegex.test(rollNumber)) {
            return res.status(400).json({ message: "Roll number can only contain numbers!" });
        }

        // Check if the student already exists
        const studentExists = await User.findOne({ email });
        if (studentExists) {
            return res.status(400).json({ message: "A student with this email already exists!" });
        }

        // Generate password based on the student's name
        const firstName = name.split(" ")[0]; // Extract the first name
        const password = `${firstName.substring(0, 2)}@123`; // First two letters + "@123"

        // Create the student account
        const student = new User({
            name,
            email,
            phone,
            password, // Password will be hashed by the pre-save hook in the User model
            department,
            batch,
            rollNumber,
            role: "student", // Set role to "student"
            createdBy: req.user._id, // Track which librarian created this student
        });

        await student.save();

        // Return the auto-generated password (for one-time use)
        res.status(201).json({
            message: "Student account created successfully!",
            student: { name, email, department, batch, rollNumber },
            password, // Send the auto-generated password to the librarian
        });
    } catch (error) {
        console.error("Error creating student account:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const searchQuery = {
      role: "student",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { batch: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ],
    };

    const [students, total] = await Promise.all([
      User.find(searchQuery).select("-password").skip(skip).limit(limit),
      User.countDocuments(searchQuery),
    ]);

    res.status(200).json({
      students,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, department, batch, rollNumber } = req.body;

        // Validate inputs (similar to createStudent)
        const student = await User.findByIdAndUpdate(
            id,
            { name, email, phone, department, batch, rollNumber },
            { new: true }
        ).select("-password");

        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        res.status(200).json({ message: "Student updated successfully!", student });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await User.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        res.status(200).json({ message: "Student deleted successfully!" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await User.findById(id).select("-password");

        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

