const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { bulkImportBooksCSV, getAllBooks } = require("../controllers/bookController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Bulk import books from CSV
router.post("/bulk-import-books", protect("librarian"), upload.single("file"), bulkImportBooksCSV);

// Get all books
router.get("/books", getAllBooks);

module.exports = router;