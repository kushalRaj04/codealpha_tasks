import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminUsers.css";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

     const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/users/admin"
            );

            setUsers(response.data.users);

        } catch (error) {

            console.error(
                "GET USERS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load users"
            );

        } finally {

            setLoading(false);

        }
    };


    // Fetch users when page loads
    useEffect(() => {

        fetchUsers();

    }, []);


     const handleDeleteUser = async (userId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await api.delete(
                `/users/admin/${userId}`
            );

            // Remove deleted user from UI
            setUsers((prevUsers) =>
                prevUsers.filter(
                    (user) => user._id !== userId
                )
            );

        } catch (error) {

            console.error(
                "DELETE USER ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        }
    };


     if (loading) {

        return (
            <div className="admin-users">

                <div className="users-loading">
                    Loading users...
                </div>

            </div>
        );
    }


     return (

        <div className="admin-users">

            {/* HEADER */}

            <div className="admin-users-header">

                <div>

                    <h1>
                        Users
                    </h1>

                    <p>
                        Manage registered customers
                    </p>

                </div>


                <div className="user-count">

                    <span>
                        Total Users
                    </span>

                    <strong>
                        {users.length}
                    </strong>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="users-error">

                    {error}

                </div>

            )}


            {/* EMPTY */}

            {users.length === 0 ? (

                <div className="no-users">

                    <div className="no-users-icon">
                        👥
                    </div>

                    <h2>
                        No Users Found
                    </h2>

                    <p>
                        There are no registered users yet.
                    </p>

                </div>

            ) : (

                /* USERS TABLE */

                <div className="users-table-container">

                    <table className="users-table">

                        <thead>

                            <tr>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Joined
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {users.map((user) => (

                                <tr key={user._id}>

                                    {/* NAME */}

                                    <td>

                                        <div className="user-name">

                                            <div className="user-avatar">

                                                {user.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}

                                            </div>

                                            <strong>
                                                {user.name}
                                            </strong>

                                        </div>

                                    </td>


                                    {/* EMAIL */}

                                    <td>

                                        <span className="user-email">

                                            {user.email}

                                        </span>

                                    </td>


                                    {/* ROLE */}

                                    <td>

                                        <span
                                            className={
                                                user.role === "admin"
                                                    ? "role-badge role-admin"
                                                    : "role-badge role-user"
                                            }
                                        >

                                            {user.role}

                                        </span>

                                    </td>


                                    {/* DATE */}

                                    <td>

                                        {user.createdAt
                                            ? new Date(
                                                user.createdAt
                                            ).toLocaleDateString()
                                            : "—"}

                                    </td>


                                    {/* ACTION */}

                                    <td>

                                        <button
                                            className="delete-user-btn"
                                            onClick={() =>
                                                handleDeleteUser(
                                                    user._id
                                                )
                                            }
                                        >

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default AdminUsers;