import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        borrowerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        checkoutDate: {
            type: Date,
            default: Date.now
        },
        dueDate: {
            type: Date,
            required: true
        },
        returned: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }  
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;