const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(404).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.user.data
  const isbn = req.params.isbn
  const message = req.body.message
  const theBook = Object.values(books).find(book => book.ISBN === isbn);
  if (theBook) {
    const theReview = theBook.reviews.find((item) => item.user === user)
    if (theReview) {
      theReview.message = message
    } else {
      theBook.reviews.push({ user, message })
    }
    return res.status(300).json({ body: theBook.reviews, message: "It is done successfully" });
  } else {
    return res.status(404).json({ message: "The book is not found!" });
  }
});

// Delete a book review
regd_users.delete("/auth/delReview/:isbn", (req, res) => {
  //Write your code here
  const user = req.user.data
  const isbn = req.params.isbn
  const theBook = Object.values(books).find(book => book.ISBN === isbn);
  if (theBook) {
    const reviews = theBook.reviews.filter((item) => item.user !== user)
    theBook.reviews = reviews
    return res.status(300).json({ body: reviews, message: "It is done successfully!" });
  } else {
    return res.status(404).json({ message: "The book is not found!" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
