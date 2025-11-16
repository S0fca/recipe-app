import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";
import type { CookbookDTO, Recipe, CreateCookbookRequest } from "../types";
import PreviewCard from "../components/PreviewCard";
import '../Form.css'

export default function ManageCookbookPage() {
    const { id } = useParams<{ id: string }>();

    const [cookbook, setCookbook] = useState<CookbookDTO | null>(null);
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [newCollaboratorUsername, setNewCollaboratorUsername] = useState("");

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        const fetchCookbook = async () => {
            try {
                const res = await api.get<CookbookDTO>(`/api/cookbooks/${id}`, { withCredentials: true });
                setCookbook(res.data);
                setTitle(res.data.title);
                setDescription(res.data.description);
            } catch (err) {
                console.error(err);
                alert("Failed to load cookbook");
            } finally {
                setLoading(false);
            }
        };

        const fetchMyRecipes = async () => {
            try {
                const res = await api.get<Recipe[]>("/api/recipes/user", { withCredentials: true });
                setMyRecipes(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCookbook();
        fetchMyRecipes();
    }, [id]);

    const handleRemoveRecipe = async (recipeId: number) => {
        if (!cookbook) return;
        try {
            await api.delete(`/api/cookbooks/${cookbook.id}/recipes/${recipeId}`, { withCredentials: true });
            const res = await api.get<CookbookDTO>(`/api/cookbooks/${cookbook.id}`, { withCredentials: true });
            setCookbook(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to remove recipe");
        }
    };

    const handleAddRecipe = async (recipeId: number) => {
        if (!cookbook) return;
        try {
            await api.post(`/api/cookbooks/${cookbook.id}/recipes/${recipeId}`, {}, { withCredentials: true });
            const res = await api.get<CookbookDTO>(`/api/cookbooks/${cookbook.id}`, { withCredentials: true });
            setCookbook(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to add recipe");
        }
    };

    const handleSaveChanges = async () => {
        if (!cookbook) return;
        const payload: CreateCookbookRequest = { title, description };
        try {
            const res = await api.put<CookbookDTO>(`/api/cookbooks/${cookbook.id}`, payload, { withCredentials: true });
            setCookbook(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to update cookbook");
        }
    };

    const handleAddCollaborator = async () => {
        if (!cookbook || !newCollaboratorUsername) return;
        try {
            await api.post(`/api/cookbooks/${cookbook.id}/collaborators`, null, {
                params: { username: newCollaboratorUsername },
                withCredentials: true,
            });
            const res = await api.get<CookbookDTO>(`/api/cookbooks/${cookbook.id}`, { withCredentials: true });
            setCookbook(res.data);
            setNewCollaboratorUsername("");
        } catch (err) {
            console.error(err);
            alert("Failed to add collaborator");
        }
    };

    const handleRemoveCollaborator = async (username: string) => {
        if (!cookbook) return;
        try {
            await api.delete(`/api/cookbooks/${cookbook.id}/collaborators`, {
                params: { username },
                withCredentials: true,
            });
            const res = await api.get<CookbookDTO>(`/api/cookbooks/${cookbook.id}`, { withCredentials: true });
            setCookbook(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to remove collaborator");
        }
    };

    const handleDeleteCookbook = async () => {
        if (!cookbook) return;

        if (!window.confirm("Are you sure you want to delete this cookbook?")) return;

        try {
            await api.delete(`/api/cookbooks/${cookbook.id}`, { withCredentials: true });
            alert("Cookbook deleted");
            window.location.href = "/manage"; // nebo navigate
        } catch (err) {
            console.error(err);
            alert("Failed to delete cookbook");
        }
    };

    const handleCancel = () => {
        window.location.href = "/manage";
    };


    if (loading || !cookbook) return <p>Loading...</p>;

    return (
        <div>
            <h1>Edit Cookbook: {title}</h1>

            <div style={{ marginBottom: "1rem" }}>
                <div>
                    <label>
                        <strong>Title:</strong>{" "}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ padding: "4px 8px", fontSize: "1rem", marginRight: "1rem" }}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <strong>Description:</strong>{" "}
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ padding: "4px 8px", fontSize: "1rem" }}
                        />
                    </label>
                </div>

                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                    <button onClick={handleSaveChanges} className="form-button">
                        Save
                    </button>

                    <button
                        onClick={handleCancel}
                        className="form-button cancel-button"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDeleteCookbook}
                        className="form-button delete-button"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <h2>Collaborators</h2>
            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={newCollaboratorUsername}
                    onChange={(e) => setNewCollaboratorUsername(e.target.value)}
                    style={{ padding: "4px 8px", fontSize: "1rem", marginRight: "0.5rem" }}
                />
                <button onClick={handleAddCollaborator}>Add</button>
            </div>
            <ul>
                {cookbook.collaborators.map((collab) => (
                    <li key={collab.id}>
                        {collab.username}{" "}
                        <button onClick={() => handleRemoveCollaborator(collab.username)}>Remove</button>
                    </li>
                ))}
            </ul>

            <h2>Recipes in this Cookbook</h2>
            <p>Click to remove</p>

            {cookbook.recipes.length === 0 && <p>No recipes yet.</p>}
            <div className="recipes-container">
                {cookbook.recipes.map((recipe) => (
                    <div key={recipe.id} style={{ position: "relative" }}>
                        <PreviewCard recipe={recipe} onClick={() => handleRemoveRecipe(recipe.id)} />
                    </div>
                ))}
            </div>

            <h2>Add Recipe to Cookbook</h2>
            <p>Click to add</p>

            <div className="recipes-container">
                {myRecipes
                    .filter((r) => !cookbook.recipes.some((cr) => cr.id === r.id))
                    .map((recipe) => (
                        <div key={recipe.id}>
                            <PreviewCard recipe={recipe} onClick={() => handleAddRecipe(recipe.id)} />
                        </div>
                    ))}
            </div>
        </div>
    );
}
