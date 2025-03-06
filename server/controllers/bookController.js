const Book = require("../models/bookModel");

// ✅ Create a New Book
const createBookHandler = async (req, res) => {
    try {
        let { title, author, genre, publication_date, description } = req.body;

        if (publication_date) {
            publication_date = new Date(publication_date).toISOString().split("T")[0];
        }

        const newBook = await Book.create({
            title,
            author,
            genre,
            publication_date,
            description
        });

        res.status(201).json(newBook);
    } catch (error) {
        console.error("Error creating book:", error.message);
        res.status(500).json({ error: "Error creating New Book" });
    }
};

// ✅ Get All Books (excluding soft-deleted ones)
const getAllBooksHandler = async (req, res) => {
    try {
        const books = await Book.findAll({
            where: { is_deleted: false }
        });

        res.json(books);
    } catch (error) {
        console.error("❌ Error fetching books:", error); // Log full error object
        res.status(500).json({ error: "Error fetching books", details: error.message });
    }
};

// ✅ Update a Book
const updateBookHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, genre, publication_date, description } = req.body;

        const [updated] = await Book.update(
            { title, author, genre, publication_date, description },
            { where: { id } }
        );

        if (!updated) {
            return res.status(404).json({ error: "Book not found" });
        }

        const updatedBook = await Book.findByPk(id);
        res.json(updatedBook);
    } catch (error) {
        console.error("Error updating book:", error.message);
        res.status(500).json({ error: "Error updating book" });
    }
};

// ✅ Soft Delete a Book 
const softDeleteBookHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const [updated] = await Book.update(
            { is_deleted: true },
            { where: { id } }
        );

        if (!updated) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json({ message: "Book soft deleted successfully" });
    } catch (error) {
        console.error("Error soft deleting book:", error.message);
        res.status(500).json({ error: "Error soft deleting book" });
    }
};

module.exports = { createBookHandler, getAllBooksHandler, updateBookHandler, softDeleteBookHandler };
