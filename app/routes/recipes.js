const express = require('express');
const mysqlConnection = require('../db/connection');

const router = express.Router();
const connection = mysqlConnection;

// Get all recipes sorted by creation time
router.get('/', async (req, res) => {
    let sql =
        'SELECT ' +
        'Recipes.recipe_id, Recipes.name as recipe_name, Recipes.created_time, Recipes.content, ' +
        'Users.user_id, Users.first_name, Users.last_name ' +
        'FROM Recipes ' +
        'LEFT OUTER JOIN Users ON Recipes.author_id = Users.user_id ' +
        'ORDER BY created_time DESC';

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to get recipes' });
        }

        const output = results.map((recipe) => {
            return {
                recipe_id: recipe.recipe_id,
                recipe_name: recipe.recipe_name,
                created_time: recipe.created_time,
                content: recipe.content,
                user_id: recipe.user_id ? recipe.user_id : 'N/A',
                user_name: recipe.first_name
                    ? recipe.first_name + ' ' + recipe.last_name
                    : 'Anonymous',
            };
        });

        return res.json(output);
    });
});

// Add recipe
router.post('/', async (req, res) => {
    // Body validation
    if (!req.body.name || !req.body.content) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    const { name, content } = req.body;

    let author = null;
    if (req.body.author !== '') {
        author = req.body.author;
    }

    const sql =
        'INSERT INTO Recipes (author_id, name, content) VALUES (?, ?, ?)';
    const data = [author, name, content];

    connection.query(sql, data, async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to create recipe' });
        }

        if (results.insertId && req.body.ingredients?.length > 0) {
            let riSql =
                'INSERT INTO RecipeIngredients (recipe_id, ingredient_id, quantity) VALUES ';
            let riData = [];

            for (const ingredient of req.body.ingredients) {
                riSql += '(?, ?, ?), ';
                riData.push(results.insertId, ingredient[0], ingredient[1]);
            }
            riSql = riSql.slice(0, -2);

            connection.execute(riSql, riData, (err, riResults) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Failed to create recipe ingredients',
                    });
                }

                return res.status(201).json({ results, riResults });
            });
        } else {
            return res.status(201).json(results);
        }
    });
});

// Edit recipe
router.put('/:recipeId', async (req, res) => {
    // Body validation
    if (!req.body.name || !req.body.content) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    const { name, content } = req.body;
    const recipeIdInput = req.params.recipeId;

    let author = null;
    if (req.body.author !== '') {
        author = req.body.author;
    }

    let sql =
        'UPDATE Recipes SET author_id = ?, name = ?, content = ? WHERE recipe_id = ?';
    let data = [author, name, content, recipeIdInput];

    connection.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to update recipe' });
        }

        return res.json(results);
    });
});

// Delete recipe
router.delete('/:recipeId', async (req, res) => {
    const recipeIdInput = req.params.recipeId;

    let sql = 'DELETE FROM Recipes WHERE recipe_id = ?';
    let data = [recipeIdInput];

    connection.query(sql, data, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to delete recipe' });
        }

        return res.status(204).send();
    });
});

module.exports = router;
