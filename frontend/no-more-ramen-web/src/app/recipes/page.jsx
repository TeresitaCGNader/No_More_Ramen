'use client';

import { useState, useEffect } from 'react';
import api from '../../config/api';
import Dialog from '@/components/modal/Dialog';

/**
 * Status:
 *
 * GET: TODO
 * POST: TODO
 * PUT: TODO
 * DELETE: TODO
 */

const RecipesPage = () => {
    // Rename this
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState({});

    // Dialog states - Leave alone
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false);

    // CRUD operations
    // ----------------------------
    const getIngredients = async () => {
        await fetch(api.ingredients)
            .then((res) => res.json())
            .then((data) => {
                setRecipes(data.ingredients);
            });
    };

    const createIngredient = async (event) => {
        event.preventDefault();

        const data = {
            name: event.target.name.value,
            measurementType: event.target.measurementType.value,
        };

        await fetch(api.ingredients, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        getIngredients();
        setIsCreateFormOpen(false);
    };

    const editIngredient = async (event) => {
        event.preventDefault();

        const data = {
            name: event.target.name.value,
            measurement_type: event.target.measurement_type.value,
        };

        await fetch(api.ingredients + `/${selectedRecipe.ingredient_id}`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        });
        getIngredients();
        setIsEditFormOpen(false);
    };

    const deleteUnit = async () => {
        await fetch(api.ingredients + `/${selectedRecipe.ingredient_id}`, {
            method: 'DELETE',
        });
        getIngredients();
        setIsDeleteConfirmationOpen(false);
    };
    // ----------------------------

    const openEditForm = (data) => {
        setSelectedRecipe(data);
        setIsEditFormOpen(true);
    };

    const openDeleteConfirmation = (data) => {
        setSelectedRecipe(data);
        setIsDeleteConfirmationOpen(true);
    };

    useEffect(() => {
        getIngredients();
    }, []);

    return (
        <main className="p-8 flex flex-col gap-y-4">
            <h1>Ingredients</h1>
            <div className="flex justify-end">
                <button
                    className="cta-button"
                    onClick={() => setIsCreateFormOpen(true)}
                >
                    Add New Ingredient
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Ingredient ID</th>
                        <th>Ingredient Name</th>
                        <th>Unit ID</th>
                        <th>Price Per Unit</th>
                    </tr>
                </thead>
                <tbody>
                    {recipes &&
                        recipes.map((data, index) => (
                            <tr key={index}>
                                <td>{data.ingredient_id}</td>
                                <td>{data.name}</td>
                                <td>{data.unit_id}</td>
                                <td>{data.price_per_unit}</td>
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
                <form
                    onSubmit={createIngredient}
                    className="flex flex-col gap-y-4"
                >
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                    <label htmlFor="measurementType">Measurement Type</label>
                    <input
                        type="text"
                        id="measurementType"
                        name="measurementType"
                        required
                    />
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
                {/* TODO: Make proper forms with dropdowns */}
                <form
                    onSubmit={editIngredient}
                    className="flex flex-col gap-y-4"
                >
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                    <label htmlFor="measurement_type">Measurement Type</label>
                    <input
                        type="text"
                        id="measurement_type"
                        name="measurement_type"
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
                        <button className="delete-button" onClick={deleteUnit}>
                            Delete
                        </button>
                    </div>
                </div>
            </Dialog>
        </main>
    );
};

export default RecipesPage;
