import jwt from 'jsonwebtoken';
import Book from "../models/book.model.js"
import User from "../models/user.model.js"

//Create A Book
export const createBook =  async (req, res) => {
    const user = req.user;
    const { title, author, genre, description, publicationYear, coverImage} = req.body;

    console.log(user); // Should have user._id

    if (!author || !title || !genre || !description || !publicationYear ) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const book = new Book({
            title,
            author,
            genre,
            description,
            publicationYear,
            coverImage,
            ownerId: user._id // <-- FIXED: lowercase 'd'
        });

        await book.save(); // Save to database

        res.status(200).json({ success: true, message: "Book Created", book });
    } catch (error) {
        console.error("Book save error:", error.message);
        res.status(500).json({ success: false, message: "Error creating book" });
    }
};

// READ - Get all books
export const getAllBooks = async (req, res) => {
    try {
      const books = await Book.find().populate("ownerId", "name email"); // adjust if needed
      res.status(200).json({ success: true, books });
    } catch (error) {
      console.error("Get all books error:", error.message);
      res.status(500).json({ success: false, message: "Error fetching books" });
    }
  };
  
  // READ - Get a single book by ID
  export const getBookById = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).populate("ownerId", "name owner");
      const owner = await User.findById(book.ownerId);
      if (!book) return res.status(404).json({ success: false, message: "Book not found" });
      if (!owner) return res.status(404).json({ success: false, message: "Owner not found" });
      res.status(200).json({ success: true, book, owner });
    } catch (error) {
      console.error("Get book by ID error:", error.message);
      res.status(500).json({ success: false, message: "Error fetching book" });
    }
  };
  
  // UPDATE a book
  export const updateBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
  
      if (!book) return res.status(404).json({ success: false, message: "Book not found" });
  
      if (book.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
  
      Object.assign(book, req.body); // update only provided fields
      await book.save();
  
      res.status(200).json({ success: true, message: "Book updated", book });
    } catch (error) {
      console.error("Update book error:", error.message);
      res.status(500).json({ success: false, message: "Error updating book" });
    }
  };
  
  // DELETE a book
  export const deleteBook = async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
  
      if (!book) return res.status(404).json({ success: false, message: "Book not found" });
  
      res.status(200).json({ success: true, message: "Book deleted" });
    } catch (error) {
      console.error("Delete book error:", error.message);
      res.status(500).json({ success: false, message: "Error deleting book" });
    }
  };

  //Get all books from a specific User
  export const getMyBooks = async (req, res) => {
    try {
        const user = req.user
        
        console.log("Requested userId:", user._id); // Debug log
        const books = await Book.find({ ownerId: user._id }).populate("ownerId", "name email");
        console.log("Found books:", books); // Debug log
        res.status(200).json({ success: true, books });
    } catch (error) {
        console.error("Get books by user error:", error.message);
        res.status(500).json({ success: false, message: "Error fetching user's books" });
    }
  };