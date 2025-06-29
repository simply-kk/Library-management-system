const Issue = require("../models/Issue");

const returnBook = async (req, res) => {
  try {
    const { studentId, issueId, issuedBookId } = req.body;

    if (!studentId || !issueId || !issuedBookId) {
      return res.status(400).json({ message: "Missing studentId, issueId, or issuedBookId" });
    }

    const issue = await Issue.findOne({ _id: issueId, student: studentId });
    if (!issue) return res.status(404).json({ message: "Issue record not found." });

    const bookEntry = issue.books.id(issuedBookId);
    if (!bookEntry) return res.status(404).json({ message: "Issued book entry not found." });

    const alreadyReturned = issue.returnedBooks.some(
      (r) => r.issuedBookId?.toString() === issuedBookId
    );

    if (alreadyReturned) {
      return res.status(400).json({ message: "This book issuance is already returned." });
    }

    issue.returnedBooks.push({
      book: bookEntry.book,
      returnedAt: new Date(),
      issuedBookId: issuedBookId, // ✅ store reference
    });

    await issue.save();

    res.status(200).json({ success: true, message: "Book returned successfully" });
  } catch (error) {
    console.error("❌ Return error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUnreturnedBooks = async (req, res) => {
  try {
    const { studentId } = req.params;

    const issues = await Issue.find({ student: studentId })
      .populate("books.book", "bookName accessionNumber authorName")
      .populate("returnedBooks.book", "_id");

    const unreturnedBooks = [];

    for (const issue of issues) {
      const returnedSet = new Set(issue.returnedBooks.map(r => r.issuedBookId?.toString()));

      for (const bookObj of issue.books) {
        const issuedId = bookObj._id.toString();
        if (!returnedSet.has(issuedId)) {
          unreturnedBooks.push({
            _id: bookObj.book._id,
            bookName: bookObj.book.bookName,
            accessionNumber: bookObj.book.accessionNumber,
            authorName: bookObj.book.authorName,
            issueId: issue._id,
            issuedBookId: bookObj._id, // ✅ correct key name
            issueDate: bookObj.issueDate,
            dueDate: bookObj.dueDate,
          });
        }
      }
    }

    return res.status(200).json({ success: true, books: unreturnedBooks });
  } catch (error) {
    console.error("❌ Error fetching unreturned books:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getUnreturnedBooks, returnBook };