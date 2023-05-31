const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// List ingredients
router.get('/', async (req, res) => {
    let sql = 'SELECT * FROM Ingredients';

    connection.query(sql, (err, results) => {
        if (err) {
            throw err;
        }

        res.send(results);
    });
});

// Create ingredient
router.post('/', async (req, res) => {
    const { nameInput, unitIdInput, pricePerUnitInput } = req.body;

    let sql =
        'INSERT INTO Ingredients (name, unit_id, price_per_unit) VALUES (?, ?, ?)';
    let data = [nameInput, unitIdInput, pricePerUnitInput];

    connection.query(sql, data, (err, results) => {
        if (err) {
            throw err;
        }

        res.status(201).send(results);
    });
});

// Edit ingredient
router.put('/:ingredientId', async (req, res) => {
    const { nameInput, unitIdInput, pricePerUnitInput } = req.body;
    const ingredientIdInput = req.params.ingredientId;

    let sql =
        'UPDATE Ingredients SET name = ?, unit_id = ?, price_per_unit = ? WHERE ingredient_id = ?';
    let data = [nameInput, unitIdInput, pricePerUnitInput, ingredientIdInput];

    connection.query(sql, data, (err, results) => {
        if (err) {
            throw err;
        }

        res.send(results);
    });
});

// Delete ingredient
router.delete('/:ingredientId', async (req, res) => {
    const ingredientIdInput = req.params.ingredientId;

    let sql = 'DELETE FROM Ingredients WHERE ingredient_id = ?';
    let data = [ingredientIdInput];

    connection.query(sql, data, (err) => {
        if (err) {
            throw err;
        }

        res.status(204).send();
    });
});

module.exports = router;