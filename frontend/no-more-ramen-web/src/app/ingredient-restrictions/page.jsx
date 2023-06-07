'use client';

import { useState, useEffect } from 'react';
import api from '../../config/api';
import Dialog from '@/components/modal/Dialog';

/**
 * Status: USING PLACEHOLDER
 *
 * GET: TODO
 * POST: TODO
 * PUT: TODO
 * DELETE: TODO
 */

const RestrictionsPage = () => {
    // Rename this
    const [restrictions, setRestrictions] = useState([]);
    const [selectedRestriction, setSelectedRestriction] = useState({});

    // Dialog states - Leave alone
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false);

    // CRUD operations
    // ----------------------------
    const getRestrictions = async () => {
        await fetch(api.restrictions)
            .then((res) => res.json())
            .then((data) => {
                setRestrictions(data);
            });
    };

    const createRestriction = async (event) => {
        event.preventDefault();

        const data = {
            name: event.target.name.value,
        };

        await fetch(api.restrictions, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        getRestrictions();
        setIsCreateFormOpen(false);
    };

    const editRestriction = async (event) => {
        event.preventDefault();

        const data = {
            name: event.target.name.value,
        };

        await fetch(api.restrictions + `/${selectedRestriction.restr_id}`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        });
        getRestrictions();
        setIsEditFormOpen(false);
    };

    const deleteRestriction = async () => {
        await fetch(api.restrictions + `/${selectedRestriction.restr_id}`, {
            method: 'DELETE',
        });
        getRestrictions();
        setIsDeleteConfirmationOpen(false);
    };
    // ----------------------------

    const openEditForm = (data) => {
        setSelectedRestriction(data);
        setIsEditFormOpen(true);
    };

    const openDeleteConfirmation = (data) => {
        setSelectedRestriction(data);
        setIsDeleteConfirmationOpen(true);
    };

    useEffect(() => {
        getRestrictions();
    }, []);

    return (
        <main className="p-8 flex flex-col gap-y-4">
            <h1>Restrictions</h1>
            <div className="flex justify-end">
                <button
                    className="cta-button"
                    onClick={() => setIsCreateFormOpen(true)}
                >
                    Add New Restriction
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Restriction ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {restrictions.map((data, index) => (
                        <tr key={index}>
                            <td>{data.restr_id}</td>
                            <td>{data.name}</td>
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
                <form
                    onSubmit={createRestriction}
                    className="flex flex-col gap-y-4"
                >
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
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
                <form
                    onSubmit={editRestriction}
                    className="flex flex-col gap-y-4"
                >
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
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
                    <p>Are you sure you want to delete this restriction?</p>
                    <div className="flex gap-x-4 justify-center">
                        <button
                            className="cancel-button"
                            onClick={() => setIsDeleteConfirmationOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="delete-button"
                            onClick={deleteRestriction}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Dialog>
        </main>
    );
};

export default RestrictionsPage;
