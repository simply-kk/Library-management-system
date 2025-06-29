const fs = require("fs");
const csv = require("fast-csv");
const Book = require("../models/Book");

exports.bulkImportBooksCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        const filePath = req.file.path;
        const booksToInsert = [];
        const duplicateEntries = [];
        const errorEntries = [];

        // Fetch existing books for duplicate checking
        const existingBooks = await Book.find({}, "accessionNumber");
        const existingAccessionNumbers = new Set(existingBooks.map(book => book.accessionNumber));

        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                console.error("Error parsing CSV:", error);
                return res.status(500).json({ message: "Error processing file" });
            })
            .on("data", (row) => {
                // Handle both lowercase and original header names
                const accessionNumber = row["Accession Number"] || row["accession number"] || row["accessionNumber"];
                const authorName = row["Author Name"] || row["author name"] || row["authorName"];
                const bookName = row["Book Name"] || row["book name"] || row["bookName"];
                const category = row["Category"] || row["category"];
                const publication = row["Publication"] || row["publication"];
                const year = row["Year"] || row["year"];
                const totalPages = row["Total Pages"] || row["total pages"] || row["totalPages"];
                const supplier = row["Supplier"] || row["supplier"];
                const price = row["Price"] || row["price"];

                // Check for missing fields
                if (!accessionNumber || !authorName || !bookName || !category || !publication || !year || !totalPages || !supplier || !price) {
                    errorEntries.push({
                        accessionNumber: accessionNumber || "Unknown",
                        error: "Missing required fields",
                        missingFields: [
                            !accessionNumber && "Accession Number",
                            !authorName && "Author Name",
                            !bookName && "Book Name",
                            !category && "Category",
                            !publication && "Publication",
                            !year && "Year",
                            !totalPages && "Total Pages",
                            !supplier && "Supplier",
                            !price && "Price"
                        ].filter(Boolean).join(", ")
                    });
                    return;
                }

                // Check for duplicates
                if (existingAccessionNumbers.has(accessionNumber)) {
                    duplicateEntries.push({
                        accessionNumber,
                        error: "Duplicate Accession Number",
                    });
                    return;
                }

                // Add book to insert list
                booksToInsert.push({
                    accessionNumber,
                    authorName,
                    bookName,
                    category,
                    publication,
                    year: Number(year),
                    totalPages: Number(totalPages),
                    supplier,
                    price: Number(price),
                    addedBy: req.user._id,
                });

                existingAccessionNumbers.add(accessionNumber);
            })
            .on("end", async () => {
                let insertedCount = 0;

                if (booksToInsert.length > 0) {
                    const insertedBooks = await Book.insertMany(booksToInsert, { ordered: false });
                    insertedCount = insertedBooks.length;
                }

                fs.unlinkSync(filePath);

                res.status(201).json({
                    message: "Bulk import completed!",
                    inserted: insertedCount,
                    duplicates: duplicateEntries.length,
                    errors: errorEntries.length,
                    duplicateEntries,
                    errorEntries,
                });
            });
    } catch (error) {
        console.error("Error importing books:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.search || "";
        const skip = (page - 1) * limit;

        // Create search query
        const searchQuery = searchTerm ? {
            $or: [
                { bookName: { $regex: searchTerm, $options: 'i' } },
                { authorName: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
                { publication: { $regex: searchTerm, $options: 'i' } },
                { accessionNumber: { $regex: searchTerm, $options: 'i' } },
                { supplier: { $regex: searchTerm, $options: 'i' } }
            ]
        } : {};

        const books = await Book.find(searchQuery).skip(skip).limit(limit);
        const totalBooks = await Book.countDocuments(searchQuery);

        res.status(200).json({
            books,
            totalPages: Math.ceil(totalBooks / limit),
            totalBooks,
            currentPage: page
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
  