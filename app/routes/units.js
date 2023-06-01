const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// List units
router.get('/', async (req, res) => {
    let sql = 'SELECT * FROM Units';

    connection.query(sql, (err, results) => {
        if (err) {
            throw err;
        }

        const data = {
            title: 'Units',
            units: results,
        };

        res.render('./units', data);
    });
});

// Create unit
router.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({ message: 'Invalid request' });
        return;
    }

    let sql = 'INSERT INTO Units (name, measurement_type) VALUES (?, 1)';
    let data = [req.body.name];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            throw err;
        }

        res.status(201).send(results);
    });
});

// Edit unit
router.put('/:id', async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({ message: 'Invalid request' });
        return;
    }

    let sql = 'UPDATE Units SET name = ? WHERE unit_id = ?';
    let data = [req.body.name, req.params.id];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to update unit' });
            return;
        }

        res.send(results);
    });
});

// Delete unit
router.delete('/:id', async (req, res) => {
    let sql = 'DELETE FROM Units WHERE unit_id = ?';
    let data = [req.params.id];

    connection.execute(sql, data, (err) => {
        if (err) {
            throw err;
        }

        res.status(204).send();
    });
});

module.exports = router;