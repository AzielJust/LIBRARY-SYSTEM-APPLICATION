import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        isbn: {
            type: String
            
          },
          title: {
            type: String          
          },
          author: {
            type: String          
          },
          genre: {
            type: String,
            
            enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Fantasy', 'Mystery'],
          },
          description: {
            type: String
        
          },
          publicationYear: {
            type: Number
          },
          coverImage: {
            type: String,
            default: 'default-book.jpg'
          },
          ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
          status: {
            type: String,
            enum: ['available', 'borrowed'],
            default: 'available'
          }
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;