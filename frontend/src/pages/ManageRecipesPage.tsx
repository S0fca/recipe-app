import {useEffect, useState} from "react";
import RecipeCard from "../components/RecipeCard.tsx";
import {useNavigate} from "react-router-dom";
import type {Recipe} from "../types.ts";

import {api} from "../api/axios";
import { AxiosError } from "axios";

const ManageRecipes = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await api.get<Recipe[]>("/api/recipes/user", {
                    withCredentials: true,
                });
                setRecipes(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                if (err instanceof AxiosError) {
                    const errorMsg = err.response?.data?.error || "Could not load recipes";
                    setError(errorMsg);

                    if (err.response?.status === 401 || errorMsg === "Unauthorized path") {
                        navigate("/login");
                    }
                } else {
                    setError("Could not connect to server");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [navigate]);

    const handleEdit = (id: number) => {
        navigate(`/edit/${id}`);
    };

    return (
        <div>
            <h2>Recipes</h2>
            <nav>
                <button onClick={() => navigate("/add-recipe")}>Add Recipe</button>
            </nav>

            <h3>Your recipes</h3>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && recipes.length === 0 && <p>You created no recipes yet.</p>}

            <div className="recipes-container">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onClick={() => handleEdit(recipe.id)} style={"recipe-card-scrollbar"}/>
                ))}
            </div>
        </div>
    );
};

export default ManageRecipes;