const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const requestedIsbn = req.params.isbn;

  // Find the book with the requested ISBN
  const bookId = Object.keys(books).find(id => books[id].isbn === requestedIsbn);

  if (bookId) {
    const book = books[bookId];
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found for the given ISBN' });
  }
 // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const requestedAuthor = req.params.author;

  // Obtain all the keys for the 'books' object
  const bookIds = Object.keys(books);

  // Iterate through the 'books' array & check if the author matches the one provided
  const matchingBooks = bookIds
    .filter(id => books[id].author === requestedAuthor)
    .map(id => books[id]);

  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).json({ message: 'Books not found for the given author' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const requestedtitle = req.params.title;

  // Find the book with the requested ISBN
  const bookId = Object.keys(books).find(id => books[id].title === requestedtitle);

  if (bookId) {
    const book = books[bookId];
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found for the given ISBN' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const requestedreview = req.params.isbn;

  // Find the book with the requested ISBN
  const bookId = Object.values(books).find(book => book.isbn === requestedreview);

  if (bookId) {
    const reviews = bookId.reviews || {};
    res.json({ isbn: requestedreview, reviews: reviews });
  } else {
    res.status(404).json({ message: 'Book not found for the given ISBN' });
  }
});


public_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const requestedIsbn = req.params.isbn;  
  const reviewText = req.query.review;

if (!reviewText) {
  return res.status(400).json({ message: 'Review text is required in the query parameters' });
}

// Find the book with the requested ISBN
const book = Object.keys(books).find(id => books[id].isbn === requestedIsbn);
if (book) {
  // Check if the user already posted a review for this ISBN
    // Add a new review
    if (!book.reviews) {
      book.reviews = {};
    }
    book.reviews = reviewText;
    res.json({ message: 'Review added successfully', isbn: requestedIsbn, review: reviewText });
  
} else {
  res.status(404).json({ message: 'Book not found for the given ISBN' });
}
 
});

public_users.delete("/auth/reviewdel/:isbn", (req, res) => {
  //Write your code here
  const requestedIsbn = req.params.isbn;  

// Find the book with the requested ISBN
const book = Object.keys(books).find(id => books[id].isbn === requestedIsbn);
if (book) {
  // Check if the user already posted a review for this ISBN
    // Add a new review
  
    delete book.reviews;
    res.json({ message: 'Review deleted successfully', isbn: requestedIsbn, review: "" });
  
} else {
  res.status(404).json({ message: 'Book not found for the given ISBN' });
}
 
});

module.exports.general = public_users;


// Function to get the list of books using async-await with Axios
async function getBooks() {
  try {
    const response = await axios.get('http://localhost:3000/public_users/');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error.message);
    throw error;
  }
}


// Function to get book details based on ISBN using async-await with Axios
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:3000/public_users/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book by ISBN:', error.message);
    throw error;
  }
}

// Function to get book details based on Author using async-await with Axios
async function getBookByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:3000/public_users/author/${author}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book by Author:', error.message);
    throw error;
  }
}

// Function to get book details based on Title using async-await with Axios
async function getBookByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:3000/public_users/title/${title}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book by Title:', error.message);
    throw error;
  }
}

// Example usage
async function main() {
  try {

    const books = await getBooks();
    console.log('List of books:', books);

    const isbnResult = await getBookByISBN('1234567890');
    console.log('Book details by ISBN:', isbnResult);

    const authorResult = await getBookByAuthor('Chinua Achebe');
    console.log('Book details by Author:', authorResult);

    const titleResult = await getBookByTitle('Things Fall Apart');
    console.log('Book details by Title:', titleResult);
  } catch (error) {
    // Handle errors
  }
}

// Call the main function
main();
