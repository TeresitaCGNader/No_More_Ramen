const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// Get all recipes sorted by creation time
router.get('/', async (req, res) => {
    let sql = 'SELECT * FROM Recipes ORDER BY created_time DESC';

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to get recipes' });
        }

        res.json(results);
    });
});

// Get the latest 5 recipes
router.get('/latest', async (req, res) => {
    let sql = 'SELECT * FROM Recipes ORDER BY created_time DESC LIMIT 5';

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to get latest recipes' });
        }

        res.json(results);
    });
});

// Add recipe
router.post('/', async (req, res) => {
    const { authorIdInput, nameInput, contentInput } = req.body;

    let sql = 'INSERT INTO Recipes (author_id, name, content) VALUES (?, ?, ?)';
    let data = [authorIdInput, nameInput, contentInput];

    connection.query(sql, data, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to create recipe' });
        }

        res.status(201).json(results);
    });
});

// Edit recipe
router.put('/:recipeId', async (req, res) => {
    const { authorIdInput, nameInput, contentInput } = req.body;
    const recipeIdInput = req.params.recipeId;

    let sql =
        'UPDATE Recipes SET author_id = ?, name = ?, content = ? WHERE recipe_id = ?';
    let data = [authorIdInput, nameInput, contentInput, recipeIdInput];

    connection.query(sql, data, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to update recipe' });
        }

        res.json(results);
    });
});

// Delete recipe
router.delete('/:recipeId', async (req, res) => {
    const recipeIdInput = req.params.recipeId;

    let sql = 'DELETE FROM Recipes WHERE recipe_id = ?';
    let data = [recipeIdInput];

    connection.query(sql, data, (err) => {
        if (err) {
            res.status(500).json({ message: 'Failed to delete recipe' });
        }

        res.status(204).send();
    });
});

// Get restrictions for a given recipe
router.get('/:recipeId/restrictions', async (req, res) => {
    const recipeIdInput = req.params.recipeId;

    let sql = `
        SELECT DISTINCT restr.name
        FROM Restrictions restr
        JOIN IngredientRestrictions ir ON restr.restr_id = ir.restr_id
        JOIN RecipeIngredients ri ON ir.ingredient_id = ri.ingredient_id
        WHERE ri.recipe_id = ?
        ORDER BY restr.name ASC
    `;

    connection.query(sql, [recipeIdInput], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to get restrictions' });
        }

        res.json(results);
    });
});

// Filter recipes by given restrictions
router.post('/filter', async (req, res) => {
    const { restrNameInputs } = req.body;

    let sql = `
        SELECT *
        FROM Recipes r
        WHERE r.recipe_id NOT IN (
            SELECT DISTINCT ri.recipe_id
            FROM RecipeIngredients ri
            JOIN Ingredients i ON ri.ingredient_id = i.ingredient_id
            JOIN IngredientRestrictions ir ON i.ingredient_id = ir.ingredient_id
            JOIN Restrictions restr ON ir.restr_id = restr.restr_id
            WHERE restr.name IN (?)
        )
    `;

    connection.query(sql, [restrNameInputs], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to filter recipes' });
        }

        res.json(results);
    });
});

module.exports = router;
