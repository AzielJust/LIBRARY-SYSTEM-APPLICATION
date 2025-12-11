import express from 'express';
import { createBorrowTransaction, returnBook, getAllTransactions } from '../controllers/transaction.controller.js';
import authMiddleware from '../authMiddleware.js';

const router = express.Router();

//-----------CRUD Functions----------//
//Create Transaction Route
router.post('/', authMiddleware, createBorrowTransaction);
router.patch('/:id', authMiddleware, returnBook);
router.get('/', authMiddleware, getAllTransactions);


export default router;