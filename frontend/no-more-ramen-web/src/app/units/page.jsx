'use client';

import { useState, useEffect } from 'react';
import api from '../../config/api';
import Dialog from '@/components/modal/Dialog';

/**
 * Status:
 *
 * GET: Working
 * POST: Working
 * PUT: Working
 * DELETE: Working
 */

const UnitsPage = () => {
    // Rename this
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState({});

    // Dialog states - Leave alone
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false);

    // CRUD operations
    // ----------------------------
    const getUnits = async () => {
        await fetch(api.units)
            .then((res) => res.json())
            .then((data) => {
                setUnits(data);
            });
    };

    const createUnits = async (event) => {
        event.preventDefault();

        const data = {
            name: event.target.name.value,
            measurementType: event.target.measurementType.value,
        };

        await fetch(api.units, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        getUnits();
        setIsCreateFormOpen(false);
    };

    const editUnits = async (event) => {
        event.preventDefault();

        const data = {
            name: event.target.name.value,
            measurement_type: event.target.measurement_type.value,
        };

        await fetch(api.units + `/${selectedUnit.unit_id}`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        });
        getUnits();
        setIsEditFormOpen(false);
    };

    const deleteUnit = async () => {
        await fetch(api.units + `/${selectedUnit.unit_id}`, {
            method: 'DELETE',
        });
        getUnits();
        setIsDeleteConfirmationOpen(false);
    };
    // ----------------------------

    const openEditForm = (user) => {
        setSelectedUnit(user);
        setIsEditFormOpen(true);
    };

    const openDeleteConfirmation = (user) => {
        setSelectedUnit(user);
        setIsDeleteConfirmationOpen(true);
    };

    useEffect(() => {
        getUnits();
    }, []);

    return (
        <main className="p-8 flex flex-col gap-y-4">
            <h1>Units</h1>
            <div className="flex justify-end">
                <button
                    className="cta-button"
                    onClick={() => setIsCreateFormOpen(true)}
                >
                    Add New Unit
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Unit ID</th>
                        <th>Name</th>
                        <th>Measurement Type</th>
                    </tr>
                </thead>
                <tbody>
                    {units.map((data, index) => (
                        <tr key={index}>
                            <td>{data.unit_id}</td>
                            <td>{data.name}</td>
                            <td>{data.measurement_type}</td>
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
                <form onSubmit={createUnits} className="flex flex-col gap-y-4">
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
                <form onSubmit={editUnits} className="flex flex-col gap-y-4">
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
                    <p>Are you sure you want to delete this unit?</p>
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

export default UnitsPage;
