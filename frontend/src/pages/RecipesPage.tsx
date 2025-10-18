import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { AxiosError } from "axios";
import type { Recipe } from "../types.ts";
import PreviewCard from "../components/PreviewCard";

const RecipesPage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await api.get("/api/recipes");
                setRecipes(res.data);
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
    }, []);

    return (
        <div>
            <h1>Recipes</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="recipes-container">
                {recipes.map((recipe) => (
                    <PreviewCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => navigate(`/recipes/${recipe.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecipesPage;
