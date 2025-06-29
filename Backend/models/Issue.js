// const mongoose = require("mongoose");

// const issueSchema = new mongoose.Schema(
//   {
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     books: [
//       {
//         book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
//         issueDate: { type: Date, required: true },
//         dueDate: { type: Date, required: true },
//       },
//     ],
//     returnedBooks: [
//       {
//         book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
//         returnedAt: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Issue", issueSchema);

const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    books: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
        issueDate: { type: Date, required: true },
        dueDate: { type: Date, required: true },
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      },
    ],
    returnedBooks: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        returnedAt: { type: Date, default: Date.now },
        issuedBookId: { type: mongoose.Schema.Types.ObjectId }, // key fix
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
