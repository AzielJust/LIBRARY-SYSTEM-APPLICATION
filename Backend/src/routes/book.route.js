import express from 'express';
import { createBook, updateBook, deleteBook, getAllBooks, getBookById, getMyBooks } from '../controllers/book.controller.js';
import authMiddleware from '../authMiddleware.js';

const router = express.Router();

//-----------CRUD Functions----------//
//Create Book Route
router.post('/', authMiddleware, createBook);
//Get Book Route
router.get('/:id', getBookById);
//Delete Book Route
router.delete('/', authMiddleware, deleteBook);
//Update Book Route
router.put('/:id', authMiddleware, updateBook);

//----------Additional Functionality------//
//Get All Books
router.get('/', getAllBooks);
//Get User's Books
router.get('/mybooks', authMiddleware, getMyBooks);

export default router;