const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// Get all ingredient restrictions
router.get('/', async (req, res) => {
    let sql =
        'SELECT Ingredients.ingredient_id, Ingredients.name AS ingredient_name, ' +
        'Restrictions.restr_id, Restrictions.name AS restr_name ' +
        'FROM IngredientRestrictions ' +
        'JOIN Ingredients ON IngredientRestrictions.ingredient_id = Ingredients.ingredient_id ' +
        'JOIN Restrictions ON IngredientRestrictions.restr_id = Restrictions.restr_id;';

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({
                message: 'Failed to get ingredient restrictions',
            });
        }

        res.json(results);
    });
});

// Create new recipeIngredients
// This isn't used directly in the recipe ingredients page.
// It should be used in the recipe page during the recipe creation process.
router.post('/', async (req, res) => {
    // Body validation
    if (!req.body.restr_id || !req.body.ingredient_id) {
        res.status(400).json({ message: 'Invalid request' });
    }

    let sql =
        'INSERT INTO IngredientRestrictions (ingredient_id, restr_id) VALUES (?, ?)';
    let data = [req.query.recipe_id, req.query.ingredient_id];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            res.status(500).json({
                message: 'Failed to create ingredient restriction',
            });
        }

        res.status(201).json(results);
    });
});

// Note: There is no edit route for ingredient restrictions

// Delete ingredient restrictions
router.delete('/', async (req, res) => {
    // Body validation
    if (!req.query.restr_id || !req.query.ingredient_id) {
        res.status(400).json({ message: 'Invalid request' });
    }

    let sql =
        'DELETE FROM IngredientRestrictions WHERE restr_id = ? AND ingredient_id = ?';
    let data = [req.query.restr_id, req.query.ingredient_id];

    connection.execute(sql, data, (err) => {
        if (err) {
            res.status(500).json({
                message: 'Failed to delete ingredient restriction',
            });
        }

        res.status(204).send();
    });
});

module.exports = router;
