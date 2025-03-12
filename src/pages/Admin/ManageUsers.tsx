import React, { useEffect, useState } from "react";
import axios from "axios";

// Define User type
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users..."); // Debugging

        const response = await axios.get<User[]>(
          "http://localhost:5000/api/users",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        console.log("Users received:", response.data); // Debugging
        setUsers(response.data); // Update state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Promote user to admin
  const handleMakeAdmin = async (userId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/make-admin`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert(response.data.message);

      // Update the user list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_admin: true } : user
        )
      );
    } catch (error) {
      console.error("Error promoting user:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="border">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  {user.is_admin ? "Admin" : "User"}
                </td>
                <td className="border p-2">
                  {!user.is_admin && (
                    <button
                      onClick={() => handleMakeAdmin(user.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
