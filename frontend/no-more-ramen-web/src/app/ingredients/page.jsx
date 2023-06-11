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

const IngredientsPage = () => {
    // Rename this
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState({});

    // Restriction choices for ingredients
    const [restrictions, setRestrictions] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedRestrictions, setSelectedRestrictions] = useState([]);

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
                setIngredients(data);
            });
    };

    const createIngredient = async (event) => {
        event.preventDefault();

        const data = {
            name: event.target.name.value,
            unit: event.target.unit.value,
            price_per_unit: event.target.price_per_unit.value,
            restrictions: selectedRestrictions,
        };
        console.log(data);

        await fetch(api.ingredients, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        getIngredients();
        setIsCreateFormOpen(false);
        setSelectedRestrictions([]);
    };

    const editIngredient = async (event) => {
        event.preventDefault();

        const data = {
            name: event.target.name.value,
            unit: event.target.unit.value,
            price_per_unit: event.target.price_per_unit.value,
        };

        await fetch(api.ingredients + `/${selectedIngredient.ingredient_id}`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        });
        getIngredients();
        setIsEditFormOpen(false);
    };

    const deleteIngredient = async () => {
        await fetch(api.ingredients + `/${selectedIngredient.ingredient_id}`, {
            method: 'DELETE',
        });
        getIngredients();
        setIsDeleteConfirmationOpen(false);
    };

    const getRestrictions = async () => {
        await fetch(api.restrictions)
            .then((res) => res.json())
            .then((data) => {
                setRestrictions(data);
            });
    };

    const getUnits = async () => {
        await fetch(api.units)
            .then((res) => res.json())
            .then((data) => {
                setUnits(data);
            });
    };
    // ----------------------------
    const populateFormChoices = () => {
        getRestrictions();
        getUnits();
    };

    const openCreateForm = () => {
        populateFormChoices();
        setIsCreateFormOpen(true);
    };

    const openEditForm = (data) => {
        populateFormChoices();
        setSelectedIngredient(data);
        setIsEditFormOpen(true);
    };

    const openDeleteConfirmation = (data) => {
        setSelectedIngredient(data);
        setIsDeleteConfirmationOpen(true);
    };

    const onRestrictionChange = (restr) => {
        const index = selectedRestrictions.indexOf(restr);
        if (index === -1) {
            setSelectedRestrictions([...selectedRestrictions, restr.restr_id]);
        } else {
            setSelectedRestrictions(
                selectedRestrictions.filter((_, i) => i !== index)
            );
        }
    };

    useEffect(() => {
        getIngredients();
    }, []);

    return (
        <main className="p-8 flex flex-col gap-y-4">
            <h1>Ingredients</h1>
            <div className="flex justify-end">
                <button className="cta-button" onClick={openCreateForm}>
                    Add New Ingredient
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Ingredient ID</th>
                        <th>Ingredient Name</th>
                        <th>Unit ID</th>
                        <th>Unit Name</th>
                        <th>Price Per Unit</th>
                        <th>Number of Restrictions</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients &&
                        ingredients.map((data, index) => (
                            <tr key={index}>
                                <td>{data.ingredient_id}</td>
                                <td>{data.name}</td>
                                <td>{data.unit_id}</td>
                                <td>{data.unit_name}</td>
                                <td>{data.price_per_unit}</td>
                                <td>{data.restr_count}</td>
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
                    <label htmlFor="unit">Unit</label>
                    <select id="unit" name="unit" required>
                        {units &&
                            units.map((data, index) => (
                                <option key={index} value={data.unit_id}>
                                    {data.name}
                                </option>
                            ))}
                    </select>
                    <label htmlFor="price_per_unit">Price Per Unit ($)</label>
                    <input
                        type="number"
                        id="price_per_unit"
                        name="price_per_unit"
                        min="0.01"
                        step="0.01"
                        defaultValue={0.01}
                        required
                    />
                    <label htmlFor="restriction">Restrictions</label>
                    <div className="p-2">
                        {restrictions &&
                            restrictions.map((data, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        id={`restriction-${index}`}
                                        name="restriction"
                                        value={data.restriction_id}
                                        onChange={() =>
                                            onRestrictionChange(data)
                                        }
                                    />
                                    <label htmlFor={`restriction=${index}`}>
                                        {data.name}
                                    </label>
                                </div>
                            ))}
                    </div>
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
                {/* TODO: Make proper forms with dropdowns */}
                <form
                    onSubmit={editIngredient}
                    className="flex flex-col gap-y-4"
                >
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                    <label htmlFor="unit">Unit</label>
                    <select id="unit" name="unit" required>
                        {units &&
                            units.map((data, index) => (
                                <option key={index} value={data.unit_id}>
                                    {data.name}
                                </option>
                            ))}
                    </select>
                    <label htmlFor="price_per_unit">Price Per Unit ($)</label>
                    <input
                        type="number"
                        id="price_per_unit"
                        name="price_per_unit"
                        min="0.01"
                        step="0.01"
                        defaultValue={0.01}
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
                            onClick={deleteIngredient}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Dialog>
        </main>
    );
};

export default IngredientsPage;
