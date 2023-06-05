"use client";

import { useState, useEffect } from "react";
import api from "../../config/api";
import Dialog from "@/components/modal/Dialog";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] = useState({});

  // CRUD operations
  // ----------------------------
  const getUsers = async () => {
    await fetch(api.users)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  };

  const createUser = async (event) => {
    event.preventDefault();

    const data = {
      first_name: event.target.first_name.value,
      last_name: event.target.last_name.value,
      email: event.target.email.value,
    };

    await fetch(api.users, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    getUsers();
    setIsCreateFormOpen(false);
  };

  const editUser = async (event) => {
    event.preventDefault();

    const data = {
      first_name: event.target.first_name.value,
      last_name: event.target.last_name.value,
      email: event.target.email.value,
    };

    await fetch(api.users + `/${selectedUser.user_id}`, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });
    getUsers();
    setIsEditFormOpen(false);
  };

  const deleteUser = async () => {
    await fetch(api.users + `/${selectedUser.user_id}`, {
      method: "DELETE",
    });
    getUsers();
    setIsDeleteConfirmationOpen(false);
  };
  // ----------------------------

  const openEditForm = (user) => {
    setSelectedUser(user);
    setIsEditFormOpen(true);
  };

  const openDeleteConfirmation = (user) => {
    setSelectedUser(user);
    setIsDeleteConfirmationOpen(true);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <main className="p-8 flex flex-col gap-y-4">
      <h1>Users</h1>
      <div className="flex justify-end">
        <button
          className="cta-button"
          onClick={() => setIsCreateFormOpen(true)}
        >
          Add New User
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.user_id}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => openEditForm(user)}>Edit</button>
              </td>
              <td>
                <button onClick={() => openDeleteConfirmation(user)}>
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
        <form onSubmit={createUser} className="flex flex-col gap-y-4">
          <label htmlFor="first-name">First Name</label>
          <input type="text" id="first-name" name="first_name" required />
          <label htmlFor="last-name">Last Name</label>
          <input type="text" id="last-name" name="last_name" required />
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" required />
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
      <Dialog show={isEditFormOpen} onClose={() => setIsEditFormOpen(false)}>
        <form onSubmit={editUser} className="flex flex-col gap-y-4">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first_name"
            defaultValue={selectedUser.first_name}
            required
          />
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last_name"
            defaultValue={selectedUser.last_name}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            defaultValue={selectedUser.email}
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
          <p>Are you sure you want to delete this user?</p>
          <div className="flex gap-x-4 justify-center">
            <button
              className="cancel-button"
              onClick={() => setIsDeleteConfirmationOpen(false)}
            >
              Cancel
            </button>
            <button className="delete-button" onClick={deleteUser}>
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
};

export default UsersPage;
