const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// Get all users
router.get('/', async (req, res) => {
    let sql = 'SELECT * FROM Users';

    connection.query(sql, (err, results) => {
        if (err) {
            throw err;
        }

        res.json(results);
    });
});

// Create new user
router.post('/', async (req, res) => {
    // Body validation
    if (!req.body.first_name || !req.body.last_name || !req.body.email) {
        res.status(400).json({ message: 'Invalid request' });
    }

    let sql =
        'INSERT INTO Users (first_name, last_name, email) VALUES (?, ?, ?)';
    let data = [req.body.first_name, req.body.last_name, req.body.email];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            throw err;
        }

        res.status(201).send(results);
    });
});

// Edit user
router.put('/:id', async (req, res) => {
    // Body validation
    if (!req.body.first_name || !req.body.last_name || !req.body.email) {
        res.status(400).json({ message: 'Invalid request' });
    }

    let sql =
        'UPDATE Users SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?';
    let data = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.params.id,
    ];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to update user' });
        }

        res.send(results);
    });
});

// Delete user
router.delete('/:id', async (req, res) => {
    let sql = 'DELETE FROM Users WHERE user_id = ?';
    let data = [req.params.id];

    connection.execute(sql, data, (err) => {
        if (err) {
            throw err;
        }

        res.status(204).send();
    });
});

module.exports = router;
