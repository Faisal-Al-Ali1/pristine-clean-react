const express = require("express");
const router = express.Router();
const { createBookHandler, getAllBooksHandler, updateBookHandler, softDeleteBookHandler } = require("../controllers/bookController")

router.post("/books", createBookHandler);
router.get("/books", getAllBooksHandler);
router.put("/books/:id", updateBookHandler);
router.put("/books/delete/:id", softDeleteBookHandler);

module.exports = router;
