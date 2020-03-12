const express = require('express');
const morgan = require('morgan');
const books = require('./books-data.js');
const cors = require('cors')

const app = express();
app.use(cors());

app.get('/books', (req, res) => {
    //getting the search parameter & defaulting it 
    const { search = "", sort } = req.query;
  
    //Sort isn't required but if provided should be either 'title' or 'rank' => nothing else
    //Some validation is necessary 
    if (sort) {
      if (!['title', 'rank'].includes(sort)) {
        return res
          .status(400)
          .send('Sort must be one of title or rank');
      }
    }
  
    //implement filter function on books
    //Making the search insensitive lowercase 
    //includes() => returns true if searchString is found within str
    let results = books
          .filter(book =>
              book
                .title
                .toLowerCase()
                .includes(search.toLowerCase()));
  
     //After the books are filtered by the search => we can sort:
    if (sort) {
      results
        .sort((a, b) => {
          return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
      });
    }
  
    //This will now return only the selected book in postman
    //Postman search => http://localhost:8000/books?search=indiana
    res
      .json(results);
  });

module.exports = app; 

