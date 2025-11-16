import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { AxiosError } from "axios";
import type { Recipe } from "../types.ts";
import RecipeCard from "../components/RecipeCard";

const RecipePage = () => {
    const { id } = useParams<{ id: string }>(); // vezme id z URL
    // const navigate = useNavigate();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchRecipe = async () => {
            try {
                const res = await api.get(`/api/recipes/recipe/${id}`);
                setRecipe(res.data);
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.error || "Could not load recipe");
                } else {
                    setError("Could not connect to server");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!recipe) return <p>Recipe not found</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
            <RecipeCard recipe={recipe} style={"recipe-card"}/>
        </div>
    );
};

export default RecipePage;
