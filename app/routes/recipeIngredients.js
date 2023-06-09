const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// Get all recipe ingredients
router.get('/', async (req, res) => {
    let sql =
        'SELECT Recipes.recipe_id, Recipes.name AS recipe_name, ' +
        'Ingredients.ingredient_id, Ingredients.name AS ingredient_name, ' +
        'Units.name AS unit_name, RecipeIngredients.quantity ' +
        'FROM RecipeIngredients ' +
        'JOIN Recipes ON RecipeIngredients.recipe_id = Recipes.recipe_id ' +
        'JOIN Ingredients ON RecipeIngredients.ingredient_id = Ingredients.ingredient_id ' +
        'JOIN Units ON Ingredients.unit_id = Units.unit_id;';

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to get recipe ingredients',
            });
        }

        return res.json(results);
    });
});

// Create new recipeIngredients
// This isn't used directly in the recipe ingredients page.
// It should be used in the recipe page during the recipe creation process.
router.post('/', async (req, res) => {
    // Body validation
    if (!req.body.quantity || !req.body.recipe_id || !req.body.ingredient_id) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    let sql =
        'INSERT INTO RecipeIngredients (quantity, recipe_id, ingredient_id) VALUES (?, ?, ?)';
    let data = [req.body.quantity, req.body.recipe_id, req.body.ingredient_id];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to create recipe ingredient',
            });
        }

        return res.status(201).json(results);
    });
});

// Edit recipe ingredient
router.put('/', async (req, res) => {
    // Body validation
    if (!req.body.quantity || !req.body.recipe_id || !req.body.ingredient_id) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    let sql =
        'UPDATE RecipeIngredients SET quantity = ? WHERE recipe_id = ? AND ingredient_id = ?';
    let data = [req.body.quantity, req.body.recipe_id, req.body.ingredient_id];

    connection.execute(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to update recipe ingredient',
            });
        }

        return res.json(results);
    });
});

// Delete recipe ingredient
router.delete('/', async (req, res) => {
    // Body validation
    if (!req.query.recipe_id || !req.query.ingredient_id) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    let sql =
        'DELETE FROM RecipeIngredients WHERE recipe_id = ? AND ingredient_id = ?';
    let data = [req.query.recipe_id, req.query.ingredient_id];

    connection.execute(sql, data, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to delete recipe ingredient',
            });
        }

        return res.status(204).send();
    });
});

module.exports = router;
