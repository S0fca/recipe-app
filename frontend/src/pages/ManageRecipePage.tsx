import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import type {Recipe} from "../types.ts";
import RecipeForm from "../components/RecipeForm.tsx";

const ManageRecipePage = () => {

    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    //fetch a recipe by id
    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/recipes/recipe/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(res => res.json())
            .then(setRecipe);
    }, [id]);

    if (!id) return <p>Missing recipe ID</p>;

    if (!recipe) return <p>Loading...</p>;

    return (
        <RecipeForm recipe={recipe} recipeId={id!} mode="edit" />
    );
};

export default ManageRecipePage;

