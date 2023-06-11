const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// List units
router.get('/', async (req, res) => {
    let sql = 'SELECT * FROM Units';

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to get units' });
        }

        return res.json(results);
    });
});

// Create unit
router.post('/', async (req, res) => {
    if (!req.body.name || !req.body.measurementType) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    let sql = 'INSERT INTO Units (name, measurement_type) VALUES (?, ?)';
    let data = [req.body.name, req.body.measurementType];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to create unit' });
        }

        return res.status(201).json(results);
    });
});

// Edit unit
router.put('/:id', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    let sql =
        'UPDATE Units SET name = ?, measurement_type = ? WHERE unit_id = ?';
    let data = [req.body.name, req.body.measurement_type, req.params.id];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to update unit' });
        }

        return res.json(results);
    });
});

// Delete unit
router.delete('/:id', async (req, res) => {
    let sql = 'DELETE FROM Units WHERE unit_id = ?';
    let data = [req.params.id];

    connection.execute(sql, data, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to delete unit' });
        }

        return res.status(204).send();
    });
});

module.exports = router;
