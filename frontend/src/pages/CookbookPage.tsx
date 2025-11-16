import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios.ts";
import type { Cookbook } from "../types.ts";
import RecipeCard from "../components/RecipeCard.tsx";
import "../CookbookCard.css"
import "../RecipeCard.css"


export default function CookbookPage() {
    const { id } = useParams<{ id: string }>();
    const [cookbook, setCookbook] = useState<Cookbook | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/api/cookbooks/${id}`)
            .then(res => setCookbook(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!cookbook) return <p>Loading...</p>;

    return (
        <div className="cookbook-page">
            <div style={{ fontFamily: "Georgia, serif" }}>
                <h1>{cookbook.title}</h1>
                <p>{cookbook.description}</p>

                <h3>Owner: {cookbook.owner.username}</h3>

                <h3>Collaborators:</h3>
                {cookbook.collaborators.map(c => (
                    <div key={c.id}>{c.username}</div>
                ))}

                <h2>Recipes</h2>
            </div>
            <div className="recipes-container">
                {cookbook.recipes.map(recipe => (
                    <RecipeCard
                        key={recipe.id}
                        style={"recipe-card"}
                        recipe={recipe}
                        onClick={() => navigate(`/recipes/${recipe.id}`)}
                    />
                ))}
            </div>
        </div>
    );
}
