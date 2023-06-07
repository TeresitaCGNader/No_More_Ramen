const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// Get all restrictions
router.get('/', async (req, res) => {
    let sql = 'SELECT * FROM Restrictions';

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to get restrictions' });
        }

        res.json(results);
    });
});

// Create new restriction
router.post('/', async (req, res) => {
    // Body validation
    if (!req.body.name) {
        res.status(400).json({ message: 'Invalid request' });
    }

    let sql = 'INSERT INTO Restrictions (name) VALUES (?)';
    let data = [req.body.name];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to create restriction' });
        }

        res.status(201).json(results);
    });
});

// Edit restriction
router.put('/:id', async (req, res) => {
    // Body validation
    if (!req.body.name) {
        res.status(400).json({ message: 'Invalid request' });
    }

    let sql = 'UPDATE Restrictions SET name = ? WHERE restr_id = ?';
    let data = [req.body.name, req.params.id];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to update restriction' });
        }

        res.json(results);
    });
});

// Delete restriction
router.delete('/:id', async (req, res) => {
    let sql = 'DELETE FROM Restrictions WHERE restr_id = ?';
    let data = [req.params.id];

    connection.execute(sql, data, (err) => {
        if (err) {
            res.status(500).json({ message: 'Failed to delete restriction' });
        }

        res.status(204).send();
    });
});

module.exports = router;
