import { useEffect, useState } from 'react';
import { api } from "../api/axios.ts";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types.ts";

interface User {
    id: number;
    username: string;
    role: string;
}

export default function DashboardAdmin() {
    const [users, setUsers] = useState<User[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/admin/users");
            setUsers(res.data);
        } catch (err) {
            handleError(err, "/admin/login");
        }
    };

    const fetchRecipes = async () => {
        try {
            const res = await api.get("/api/admin/recipes");

            const mapped: Recipe[] = res.data.map((r: Recipe) => ({
                id: r.id,
                title: r.title || "",
                description: r.description || "",
                instructions: r.instructions || "",
                createdByUsername: r.createdByUsername || "Unknown",
                tags: r.tags || [],
                ingredients: (r.ingredients || []).map((ing: any) => ({
                    id: ing.id || 0,
                    name: ing.ingredientName || "",
                    quantity: ing.quantity || "",
                })),
                favourite: false,
            }));

            setRecipes(mapped);
        } catch (err) {
            handleError(err, "/admin/login");
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/api/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            handleError(err);
        }
    };

    const handleDeleteRecipe = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        try {
            await api.delete(`/api/admin/recipes/${id}`);
            fetchRecipes();
        } catch (err) {
            handleError(err);
        }
    };

    const handleError = (err: any, redirectPath?: string) => {
        if (err instanceof AxiosError) {
            const errorMsg = err.response?.data?.error || "An error occurred";
            setError(errorMsg);
            if ((err.response?.status === 401 || errorMsg === "Unauthorized path") && redirectPath) {
                navigate(redirectPath);
            }
        } else {
            setError("Cannot connect to server");
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRecipes();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h2>Users</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>
                            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Recipes</h2>
            <div className="recipes-container">
                {recipes.map(recipe => (
                    <div key={recipe.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <RecipeCard recipe={recipe} style={"recipe-card"} />
                        <div>
                            <button
                                style={{ marginTop: "8px" }}
                                onClick={() => handleDeleteRecipe(recipe.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
