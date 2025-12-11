import Transaction from "../models/transaction.model.js";
import Book from "../models/book.model.js";
import User from "../models/user.model.js";

//Borrow A Book
export const createBorrowTransaction = async (req, res) => {
    const user = req.user;
    const { bookId, dueDate } = req.body;

    if (!bookId || !dueDate) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        // Finds book and checks if available
        const book = await Book.findById(bookId);
        console.log(book);
        if (!book) return res.status(404).json({ success: false, message: "Book not found" });
        if (book.status != 'available') return res.status(404).json({ success: false, message: "Book is unavailable" });

        const transaction = new Transaction({
            bookId,
            borrowerId: user._id, 
            dueDate
        });

        await transaction.save();
        
        // Update book status
        book.status = 'borrowed';
        await book.save();

        res.status(200).json({ success: true, message: "Transaction Created", transaction });
    } catch (error) {
        console.error("Transaction creation error:", error.message);
        res.status(500).json({ success: false, message: "Error creating transaction" });
    }
};

// Return Book
export const returnBook = async (req, res) => {
    const user = req.user;
    try {
        // Find the transaction
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        // Verify the borrower
        if (transaction.borrowerId.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // Find the associated book
        const book = await Book.findById(transaction.bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        // Update transaction and book
        transaction.returned = true;
        book.status = 'available'; // Mark book as available again

        // Save changes
        await transaction.save();
        await book.save();

        res.status(200).json({ 
            success: true, 
            message: "Book returned successfully", 
            transaction 
        });
    } catch (error) {
        console.error("Return book error:", error.message);
        res.status(500).json({ success: false, message: "Error returning book" });
    }
};

// Get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        // Find all transactions and populate book and user details
        const transactions = await Transaction.find()
            .populate('bookId', 'title author') // Only include title and author from book
            .populate('borrowerId', 'name email'); // Only include name and email from user

        res.status(200).json({ 
            success: true, 
            count: transactions.length,
            transactions 
        });
    } catch (error) {
        console.error("Get transactions error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching transactions" 
        });
    }
};
