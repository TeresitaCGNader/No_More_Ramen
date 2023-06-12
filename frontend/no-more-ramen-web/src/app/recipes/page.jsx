'use client';

import { useState, useEffect } from 'react';
import api from '../../config/api';
import Dialog from '@/components/modal/Dialog';

/**
 * Status:
 *
 * GET: DONE
 * POST: DONE
 * PUT: DONE
 * DELETE: DONE
 */

const RecipesPage = () => {
    // Rename this
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState({});

    const [users, setUsers] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    // Dialog states - Leave alone
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false);

    // CRUD operations
    // ----------------------------
    const getRecipes = async () => {
        await fetch(api.recipes)
            .then((res) => res.json())
            .then((data) => {
                setRecipes(data);
            });
    };

    const createRecipe = async (event) => {
        event.preventDefault();

        const data = {
            name: event.target.name.value,
            author: event.target.author.value,
            ingredients: selectedIngredients,
            content: event.target.content.value,
        };

        await fetch(api.recipes, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        getRecipes();
        setIsCreateFormOpen(false);
    };

    const editRecipe = async (event) => {
        event.preventDefault();

        const data = {
            name: event.target.name.value,
            author: event.target.author.value,
            content: event.target.content.value,
        };

        await fetch(api.recipes + `/${selectedRecipe.recipe_id}`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        });
        getRecipes();
        setIsEditFormOpen(false);
    };

    const deleteRecipe = async () => {
        await fetch(api.recipes + `/${selectedRecipe.recipe_id}`, {
            method: 'DELETE',
        });
        getRecipes();
        setIsDeleteConfirmationOpen(false);
    };

    const getIngredients = async () => {
        await fetch(api.ingredients)
            .then((res) => res.json())
            .then((data) => {
                setIngredients(data);
            });
    };

    const getUsers = async () => {
        await fetch(api.users)
            .then((res) => res.json())
            .then((data) => {
                const output = data.map((user) => {
                    return {
                        ...user,
                        user_name: `${user.first_name} ${user.last_name}`,
                    };
                });
                setUsers(output);
            });
    };
    // ----------------------------
    const populateFormChoices = () => {
        getIngredients();
        getUsers();
    };

    const openCreateForm = () => {
        populateFormChoices();
        setSelectedIngredients([]);
        setIsCreateFormOpen(true);
    };

    const openEditForm = (data) => {
        populateFormChoices();
        setSelectedRecipe(data);
        setIsEditFormOpen(true);
    };

    const openDeleteConfirmation = (data) => {
        setSelectedRecipe(data);
        setIsDeleteConfirmationOpen(true);
    };

    const onIngredientChange = (ing) => {
        const index = selectedIngredients.indexOf(ing);
        if (index === -1) {
            setSelectedIngredients([
                ...selectedIngredients,
                // Just add 1 unit and let the user edit it later in IR
                [ing.ingredient_id, 1],
            ]);
        } else {
            setSelectedIngredients(
                selectedIngredients.filter((_, i) => i !== index)
            );
        }
    };

    useEffect(() => {
        getRecipes();
    }, []);

    return (
        <main className="p-8 flex flex-col gap-y-4">
            <h1>Recipes</h1>
            <div className="flex justify-end">
                <button className="cta-button" onClick={openCreateForm}>
                    Add New Recipe
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Recipe ID</th>
                        <th>Name</th>
                        <th>Author ID</th>
                        <th>Author Name</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {recipes &&
                        recipes.map((data, index) => (
                            <tr key={index}>
                                <td>{data.recipe_id}</td>
                                <td>{data.recipe_name}</td>
                                <td>{data.user_id}</td>
                                <td>{data.user_name}</td>
                                <td>
                                    {new Date(
                                        data.created_time
                                    ).toLocaleDateString('en-US')}
                                </td>
                                <td>
                                    <button onClick={() => openEditForm(data)}>
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            openDeleteConfirmation(data)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <Dialog
                show={isCreateFormOpen}
                onClose={() => setIsCreateFormOpen(false)}
            >
                {/* TODO: Make proper forms with dropdowns */}
                <form onSubmit={createRecipe} className="flex flex-col gap-y-4">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                    <label htmlFor="author">Author</label>
                    <select id="author" name="author" defaultValue="">
                        <option value="">Anonymous</option>
                        {users &&
                            users.map((data, index) => (
                                <option key={index} value={data.user_id}>
                                    {data.user_name}
                                </option>
                            ))}
                    </select>
                    <label htmlFor="content">Content</label>
                    <textarea id="content" name="content" required />

                    <label htmlFor="ingredients">Ingredients</label>
                    <div className="p-2">
                        {ingredients &&
                            ingredients.map((data, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        id={`ingredient-${index}`}
                                        name="ingredient"
                                        value={data.ingredient_id}
                                        onChange={() =>
                                            onIngredientChange(data)
                                        }
                                    />
                                    <label htmlFor={`ingredient-${index}`}>
                                        {data.name}
                                    </label>
                                </div>
                            ))}
                    </div>

                    <div className="flex gap-x-4 justify-center">
                        <button
                            className="cancel-button"
                            onClick={() => setIsCreateFormOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="submit-button" type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </Dialog>
            <Dialog
                show={isEditFormOpen}
                onClose={() => setIsEditFormOpen(false)}
            >
                <form onSubmit={editRecipe} className="flex flex-col gap-y-4">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={selectedRecipe.recipe_name}
                        required
                    />
                    <label htmlFor="author">Author</label>
                    <select
                        id="author"
                        name="author"
                        defaultValue={selectedRecipe.user_id}
                    >
                        <option value="">Anonymous</option>
                        {users &&
                            users.map((data, index) => (
                                <option key={index} value={data.user_id}>
                                    {data.user_name}
                                </option>
                            ))}
                    </select>
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        defaultValue={selectedRecipe.content}
                        required
                    />
                    <div className="flex gap-x-4 justify-center">
                        <button
                            className="cancel-button"
                            onClick={() => setIsEditFormOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="submit-button" type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </Dialog>
            <Dialog
                show={isDeleteConfirmationOpen}
                onClose={() => setIsDeleteConfirmationOpen(false)}
            >
                <div className="flex flex-col w-full">
                    <p>Are you sure you want to delete this ingredient?</p>
                    <div className="flex gap-x-4 justify-center">
                        <button
                            className="cancel-button"
                            onClick={() => setIsDeleteConfirmationOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="delete-button"
                            onClick={deleteRecipe}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Dialog>
        </main>
    );
};

export default RecipesPage;
