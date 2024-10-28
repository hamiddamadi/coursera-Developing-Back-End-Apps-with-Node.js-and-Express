const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(404).json({ message: "Username or password is not provided!" });
  } else {
    if (!isValid(username)) {
      users.push({ username, password })
      return res.status(200).json({ message: "You are successfully registered!" });
    } else {
      return res.status(404).json({ message: "Username is repeated!" });
    }
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  const newPromise = new Promise((resolve, reject) => {
    resolve(books)
  })
  return newPromise.then((books) => {
    return res.status(300).json({ body: books, message: "It is done successfully!" });
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const newPromise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn
    const booksList = Object.values(books).filter(book => book.ISBN === isbn);
    resolve(booksList)
  })
  return newPromise.then((booksList) => {
    return res.status(200).json({ body: booksList, message: "It is done successfully!" });
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const newPromise = new Promise((resolve, reject) => {
    const author = req.params.author
    const booksList = Object.values(books).filter(book => book.author === author);
    resolve(booksList)
  })
  return newPromise.then((booksList) => {
    return res.status(200).json({ body: booksList, message: "It is done successfully!" });
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const newPromise = new Promise((resolve, reject) => {
    const title = req.params.title
    const booksList = Object.values(books).filter(book => book.title === title);
    resolve(booksList)
  })
  return newPromise.then((booksList) => {
    return res.status(200).json({ body: booksList, message: "It is done successfully!" });
  })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const Thebook = Object.values(books).find(book => book.ISBN === isbn);
  return res.status(300).json({ body: Thebook ? Thebook.reviews : {}, message: "It is done successfully!" });
});

module.exports.general = public_users;
