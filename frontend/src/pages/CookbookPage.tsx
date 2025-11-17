import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios.ts";
import type { Cookbook } from "../types.ts";
import RecipeCard from "../components/RecipeCard.tsx";
import "../styles/CookbookCard.css"
import "../styles/RecipeCard.css"


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

                <div style={{display: "flex", flexDirection: "row"}}>
                    <h3>Owner:&nbsp;</h3>
                    <h3
                        style={{ color: "#e76f51", cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/users/${cookbook.owner.id}`);
                        }}
                    >
                        {cookbook.owner.username}
                    </h3></div>

                <div style={{display: "flex", flexDirection: "row"}}>
                    <h3>Collaborators:&nbsp;</h3>
                    {cookbook.collaborators.map((c) => (
                            <h3
                                style={{ color: "#e76f51", cursor: "pointer" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/users/${c.id}`);
                                }}
                            >
                                {c.username}&nbsp;
                            </h3>
                        )
                    )}
                </div>

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
