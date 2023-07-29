const express       = require('express');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const db            = require('./db');
const app           = express();
const port          = 5000;
const mysql = require('mysql');
require('dotenv').config({ path: '../mysql.env'}); // Load the environment variables from .env

const Category = {
    name: String,
};
const Quote = {
    quote:      String,
    author:     String,
    imageUrl:   String,
    categoryId: [Category],
};

app.use(bodyParser.json());
app.use(cors());



// FETCHING THE QUOTES 
app.get('/v1', (req, res) => {
    const sql = 'SELECT * FROM quotes';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching quotes:', err);
            res.status(500).json({error:'Error fetching quotes'});
        } else {
            res.json(result);
        }
    });
});

// root URL handler

app.get('/', (req, res) => {
    res.send('Welcome to quot.is API');
})

// Fetch a single quote by ID 
app.get('/v1/:id', (req, res) => {
    const id    = req.params.id;
    const sql   = 'SELECT * FROM quotes WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching quote:', err);
            res.status(500).json({error: 'Error fetching quote'});
        } else if (result.length === 0) {
            res.status(404).json({ error: 'Quote not found' });
        } else {
            res.json(result[0]);
        }
    });
});


// Add a new Quote 
app.post('/quotes', (req, res) => {
    const {quote, author, imageUrl, categoryId } = req.body;

    // Validate the incoming data 

    if (!quote || !author || !categoryId) {
        res.status(400).json({ error: 'Quote, author, and category are required '});
        return;
    }
    
    // Insert the new quote into the database
    const sql = 'INSERT INTO quotes (quote, author, imageUrl, categoryId) VALUES (?, ?, ?, ?)';
    const values = [quote, author, imageUrl, categoryId];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding quote:', err);
            res.status(500).json({error: 'Error adding quote' });
        } else {
            res.json({ message: 'Quote Added Successfully!', quoteId: result.insertId})
        }
    });
});

// Fetch all categories 
app.get('/categories', (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).json({error: 'Error fetching categories' });
        } else {
            res.json(result);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is doing something on port ${port}`);

});