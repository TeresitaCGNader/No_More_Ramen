const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// List ingredients
router.get('/', async (req, res) => {
    const sql =
        'SELECT ' +
        'Ingredients.ingredient_id, Ingredients.name, price_per_unit, ' +
        'Units.unit_id, Units.name as unit_name, ' +
        'COUNT(IngredientRestrictions.restr_id) as restr_count ' +
        'FROM Ingredients ' +
        'JOIN Units ON Ingredients.unit_id = Units.unit_id ' +
        'LEFT JOIN IngredientRestrictions ON Ingredients.ingredient_id = IngredientRestrictions.ingredient_id ' +
        'GROUP BY Ingredients.ingredient_id';

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Failed to get ingredients' });
        }

        res.json(results);
    });
});

// Create ingredient
router.post('/', async (req, res) => {
    // Body validation
    if (!req.body.name || !req.body.unit || !req.body.price_per_unit) {
        res.status(400).json({ message: 'Invalid request' });
    }

    const { name, unit, price_per_unit } = req.body;

    const sql =
        'INSERT INTO Ingredients (name, unit_id, price_per_unit) VALUES (?, ?, ?)';
    const data = [name, unit, price_per_unit];

    connection.query(sql, data, async (err, results) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Failed to create ingredient' });
        }

        if (req.body.restrictions && req.body.restrictions.length > 0) {
            let createIRSql =
                'INSERT INTO IngredientRestrictions (ingredient_id, restr_id) VALUES ';
            let createIRData = [];
            for (const restriction_id of req.body.restrictions) {
                createIRSql += '(?, ?), ';
                createIRData.push(results.insertId);
                createIRData.push(restriction_id);
            }
            // Remove last comma and space
            createIRSql = createIRSql.slice(0, -2);

            connection.execute(createIRSql, createIRData, (err, IRresults) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Failed to create ingredient restriction',
                    });
                }

                return res.status(201).json({ results, IRresults });
            });
        } else {
            return res.status(201).json(results);
        }
    });
});

// Edit ingredient
router.put('/:ingredientId', async (req, res) => {
    // Body validation
    if (!req.body.name || !req.body.unit || !req.body.price_per_unit) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    const { name, unit, price_per_unit } = req.body;
    const ingredientId = req.params.ingredientId;

    let sql =
        'UPDATE Ingredients SET name = ?, unit_id = ?, price_per_unit = ? WHERE ingredient_id = ?';
    let data = [name, unit, price_per_unit, ingredientId];

    connection.query(sql, data, (err, results) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Failed to update ingredient' });
        }

        return res.json(results);
    });
});

// Delete ingredient
router.delete('/:ingredientId', async (req, res) => {
    const ingredientIdInput = req.params.ingredientId;

    let sql = 'DELETE FROM Ingredients WHERE ingredient_id = ?';
    let data = [ingredientIdInput];

    connection.query(sql, data, (err) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Failed to delete ingredient' });
        }

        return res.status(204).send();
    });
});

module.exports = router;
