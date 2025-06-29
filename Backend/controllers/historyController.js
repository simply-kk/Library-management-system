const Issue = require("../models/Issue");
const User = require("../models/User");

const getIssueReturnHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required"
      });
    }

    const student = await User.findById(studentId)
      .select("name rollNumber department batch email");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const issues = await Issue.find({ student: studentId })
      .populate("books.book", "bookName accessionNumber authorName")
      .populate("returnedBooks.book", "_id")
      .sort({ createdAt: -1 });

    const transactions = [];

    for (const issue of issues) {
      const returnedMap = new Map();
      issue.returnedBooks.forEach(rb => {
        returnedMap.set(rb.issuedBookId.toString(), rb.returnedAt);
      });

      issue.books.forEach(bookEntry => {
        const issuanceId = bookEntry._id.toString();
        transactions.push({
          book: {
            _id: bookEntry.book._id,
            bookName: bookEntry.book.bookName,
            accessionNumber: bookEntry.book.accessionNumber,
            authorName: bookEntry.book.authorName
          },
          issueId: issue._id,
          issuedBookId: issuanceId,
          issueDate: bookEntry.issueDate,
          dueDate: bookEntry.dueDate,
          returned: returnedMap.has(issuanceId),
          returnedAt: returnedMap.get(issuanceId) || null
        });
      });
    }

    res.status(200).json({
      success: true,
      student: {
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        batch: student.batch,
        email: student.email
      },
      transactions,
      message: transactions.length
        ? `Found ${transactions.length} transactions`
        : "No transactions found"
    });

  } catch (error) {
    console.error("Error in getIssueReturnHistory:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching history"
    });
  }
};

module.exports = { getIssueReturnHistory };