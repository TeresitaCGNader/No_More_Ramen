'use client';

import { useState, useEffect } from 'react';
import api from '../../config/api';
import Dialog from '@/components/modal/Dialog';

/**
 * Status:
 *
 * GET: DONE
 * POST: DONE
 * DELETE: DONE
 */

const IngredientRestrictionsPage = () => {
    // Rename this
    const [IR, setIR] = useState([]);
    const [selectedIR, setSelectedIR] = useState({});

    // Selectable options
    const [ingredients, setIngredients] = useState([]);
    const [restrictions, setRestrictions] = useState([]);

    // Dialog states - Leave alone
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false);

    // CRUD operations
    // ----------------------------
    const getIR = async () => {
        await fetch(api.ingredientRestrictions)
            .then((res) => res.json())
            .then((data) => {
                setIR(data);
            });
    };

    const createIR = async (event) => {
        event.preventDefault();

        const data = {
            ingredient_id: event.target.ingredient_id.value,
            restr_id: event.target.restr_id.value,
        };

        await fetch(api.ingredientRestrictions, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        getIR();
        setIsCreateFormOpen(false);
    };

    const deleteIR = async () => {
        await fetch(
            api.ingredientRestrictions +
                `?ingredient_id=${selectedIR.ingredient_id}&restr_id=${selectedIR.restr_id}`,
            {
                method: 'DELETE',
            }
        );
        getIR();
        setIsDeleteConfirmationOpen(false);
    };

    const getIngredients = async () => {
        await fetch(api.ingredients)
            .then((res) => res.json())
            .then((data) => {
                setIngredients(data);
            });
    };

    const getRestrictions = async () => {
        await fetch(api.restrictions)
            .then((res) => res.json())
            .then((data) => {
                setRestrictions(data);
            });
    };
    // ----------------------------
    const openCreateForm = async () => {
        await getIngredients();
        await getRestrictions();
        setIsCreateFormOpen(true);
    };

    const openDeleteConfirmation = (data) => {
        setSelectedIR(data);
        setIsDeleteConfirmationOpen(true);
    };

    useEffect(() => {
        getIR();
    }, []);

    return (
        <main className="p-8 flex flex-col gap-y-4">
            <h1>Ingredient Restrictions</h1>
            <div className="flex justify-end">
                <button
                    className="cta-button"
                    onClick={async () => {
                        openCreateForm();
                    }}
                >
                    Associate Ingredient to Restriction
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Ingredient ID</th>
                        <th>Ingredient Name</th>
                        <th>Restriction ID</th>
                        <th>Restriction Name</th>
                    </tr>
                </thead>
                <tbody>
                    {IR.map((data, index) => (
                        <tr key={index}>
                            <td>{data.ingredient_id}</td>
                            <td>{data.ingredient_name}</td>
                            <td>{data.restr_id}</td>
                            <td>{data.restr_name}</td>
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
                <form onSubmit={createIR} className="flex flex-col gap-y-4">
                    <h1>Associate Ingredient to Restriction</h1>
                    <label htmlFor="ingredient_id">Ingredient</label>
                    <select name="ingredient_id" id="ingredient_id">
                        {ingredients &&
                            ingredients.map((data, index) => (
                                <option key={index} value={data.ingredient_id}>
                                    {data.name}
                                </option>
                            ))}
                    </select>
                    <label htmlFor="restr_id">Restriction</label>
                    <select name="restr_id" id="restr_id">
                        {restrictions &&
                            restrictions.map((data, index) => (
                                <option key={index} value={data.restr_id}>
                                    {data.name}
                                </option>
                            ))}
                    </select>
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

export default IngredientRestrictionsPage;
