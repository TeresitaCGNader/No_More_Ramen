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

const RecipeIngredientsPage = () => {
    // Rename this
    const [RI, setRI] = useState([]);
    const [selectedRI, setSelectedRI] = useState({});

    // Selectable options
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    // Dialog states - Leave alone
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false);

    // CRUD operations
    // ----------------------------
    const getRI = async () => {
        await fetch(api.recipeIngredients)
            .then((res) => res.json())
            .then((data) => {
                setRI(data);
            });
    };

    const createRI = async (event) => {
        event.preventDefault();

        const data = {
            ingredient_id: event.target.ingredient_id.value,
            recipe_id: event.target.recipe_id.value,
            quantity: event.target.quantity.value,
        };

        await fetch(api.recipeIngredients, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        getRI();
        setIsCreateFormOpen(false);
    };

    const editRI = async (event) => {
        event.preventDefault();

        const data = {
            ingredient_id: event.target.ingredient_id.value,
            recipe_id: event.target.recipe_id.value,
            quantity: event.target.quantity.value,
        };

        await fetch(api.recipeIngredients, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        });
        getRI();
        setIsEditFormOpen(false);
    };

    const deleteIR = async () => {
        await fetch(
            api.recipeIngredients +
                `?recipe_id=${selectedRI.recipe_id}&ingredient_id=${selectedRI.ingredient_id}`,
            {
                method: 'DELETE',
            }
        );
        getRI();
        setIsDeleteConfirmationOpen(false);
    };

    const getIngredients = async () => {
        await fetch(api.ingredients)
            .then((res) => res.json())
            .then((data) => {
                setIngredients(data);
            });
    };

    const getRecipes = async () => {
        await fetch(api.recipes)
            .then((res) => res.json())
            .then((data) => {
                setRecipes(data);
            });
    };
    // ----------------------------
    const openCreateForm = async () => {
        await getIngredients();
        await getRecipes();
        setIsCreateFormOpen(true);
    };

    const openEditForm = async (data) => {
        await getIngredients();
        await getRecipes();
        setSelectedRI(data);
        setIsEditFormOpen(true);
    };

    const openDeleteConfirmation = (data) => {
        setSelectedRI(data);
        setIsDeleteConfirmationOpen(true);
    };

    useEffect(() => {
        getRI();
    }, []);

    return (
        <main className="p-8 flex flex-col gap-y-4">
            <h1>Recipe Ingredients</h1>
            <div className="flex justify-end">
                <button
                    className="cta-button"
                    onClick={async () => {
                        openCreateForm();
                    }}
                >
                    Associate Recipe to Ingredient
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Recipe ID</th>
                        <th>Recipe Name</th>
                        <th>Ingredient ID</th>
                        <th>Ingredient Name</th>
                        <th>Unit</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {RI.map((data, index) => (
                        <tr key={index}>
                            <td>{data.recipe_id}</td>
                            <td>{data.recipe_name}</td>
                            <td>{data.ingredient_id}</td>
                            <td>{data.ingredient_name}</td>
                            <td>{data.unit_name}</td>
                            <td>{data.quantity}</td>
                            <td>
                                <button onClick={() => openEditForm(data)}>
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button
                                    onClick={() => openDeleteConfirmation(data)}
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
                <form onSubmit={createRI} className="flex flex-col gap-y-4">
                    <h1>Associate Ingredient to Restriction</h1>
                    <label htmlFor="recipe_id">Recipe</label>
                    <select name="recipe_id" id="recipe_id">
                        {recipes &&
                            recipes.map((data, index) => (
                                <option key={index} value={data.recipe_id}>
                                    {data.name}
                                </option>
                            ))}
                    </select>
                    <label htmlFor="ingredient_id">Ingredient</label>
                    <select name="ingredient_id" id="ingredient_id">
                        {ingredients &&
                            ingredients.map((data, index) => (
                                <option key={index} value={data.ingredient_id}>
                                    {data.name}
                                </option>
                            ))}
                    </select>
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        placeholder="Quantity"
                        min="0"
                        required
                    />
                    <div className="flex gap-x-4 justify-center">
                        <button
                            className="cancel-button"
                            type="button"
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
                <form onSubmit={editRI} className="flex flex-col gap-y-4">
                    <h1>Edit Ingredient Restriction</h1>
                    <label htmlFor="recipe_id">Recipe</label>
                    <select
                        name="recipe_id"
                        id="recipe_id"
                        value={selectedRI.recipe_id}
                        disabled
                    >
                        {recipes &&
                            recipes.map((data, index) => (
                                <option key={index} value={data.recipe_id}>
                                    {data.name}
                                </option>
                            ))}
                    </select>
                    <label htmlFor="ingredient_id">Ingredient</label>
                    <select
                        name="ingredient_id"
                        id="ingredient_id"
                        value={selectedRI.ingredient_id}
                        disabled
                    >
                        {ingredients &&
                            ingredients.map((data, index) => (
                                <option key={index} value={data.ingredient_id}>
                                    {data.name}
                                </option>
                            ))}
                    </select>
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        placeholder="Quantity"
                        min="0"
                        required
                    />
                    <div className="flex gap-x-4 justify-center">
                        <button
                            className="cancel-button"
                            type="button"
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
                    <p>
                        Are you sure you want to delete this
                        ingredient-restriction?
                    </p>
                    <div className="flex gap-x-4 justify-center">
                        <button
                            className="cancel-button"
                            type="button"
                            onClick={() => setIsDeleteConfirmationOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="delete-button" onClick={deleteIR}>
                            Delete
                        </button>
                    </div>
                </div>
            </Dialog>
        </main>
    );
};

export default RecipeIngredientsPage;
