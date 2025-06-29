const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    accessionNumber: { type: String, required: true, unique: true, sparse: true },
    authorName: { type: String, required: true },
    bookName: { type: String, required: true },
    category: { type: String, required: true },
    publication: { type: String, required: true },
    year: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    supplier: { type: String, required: true },
    price: { type: Number, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Book", BookSchema);
