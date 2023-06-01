const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// List ingredients
router.get('/', async (req, res) => {
    let ingrSql = 'SELECT * FROM Ingredients';
    let unitSql = 'SELECT * FROM Units';

    connection.query(ingrSql, (err, ingrResults) => {
        if (err) {
            res.status(500).json({ message: 'Failed to get ingredients' });
        }

        connection.query(unitSql, (err, unitResults) => {
            if (err) {
                res.status(500).json({ message: 'Failed to get units' });
            }

            const data = {
                title: 'Ingredients',
                ingredients: ingrResults,
                units: unitResults,
            };

            res.render('./ingredients', data);
        });
    });
});

// Create ingredient
router.post('/', async (req, res) => {
    const { name, unit, price } = req.body;

    let sql =
        'INSERT INTO Ingredients (name, unit_id, price_per_unit) VALUES (?, ?, ?)';
    let data = [name, unit, price];

    connection.query(sql, data, (err, results) => {
        if (err) {
            throw err;
        }

        res.status(201).send(results);
    });
});

// Edit ingredient
router.put('/:ingredientId', async (req, res) => {
    const { name, unit, price } = req.body;
    const ingredientId = req.params.ingredientId;

    let sql =
        'UPDATE Ingredients SET name = ?, unit_id = ?, price_per_unit = ? WHERE ingredient_id = ?';
    let data = [name, unit, price, ingredientId];

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
