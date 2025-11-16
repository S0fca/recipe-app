import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import type {Recipe} from "../../types.ts";
import RecipeForm from "../../components/RecipeForm.tsx";

import {api} from "../../api/axios.ts";
import { AxiosError } from "axios";

const ManageRecipePage = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        const fetchRecipe = async () => {
            try {
                const res = await api.get<Recipe>(`/api/recipes/recipe/${id}`, {
                    withCredentials: true,
                });
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

    if (!id) return <p>Missing recipe ID</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!recipe) return <p>Recipe not found</p>;

    return <RecipeForm recipe={recipe} recipeId={id} mode="edit" />;
};

export default ManageRecipePage;