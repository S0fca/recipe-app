import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios.ts";
import type { Cookbook } from "../types.ts";
import "../styles/CookbookCard.css"
import "../styles/RecipeCard.css"
import PreviewCard from "../components/PreviewCard.tsx";


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
                <h2>{cookbook.description}</h2>

                <div style={{display: "flex", flexDirection: "row"}}>
                    <p>Owner:&nbsp;</p>
                    <p
                        style={{ color: "#e76f51", cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/users/${cookbook.owner.id}`);
                        }}
                    >
                        {cookbook.owner.username}
                    </p></div>

                {cookbook.collaborators.length != 0 && (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <p>Collaborators:&nbsp;</p>

                        {cookbook.collaborators.map((c) => (
                            <p
                                key={c.id}
                                style={{ color: "#e76f51", cursor: "pointer" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/users/${c.id}`);
                                }}
                            >
                                {c.username}&nbsp;
                            </p>
                        ))}
                    </div>
                )}


                <h2>Recipes</h2>
            </div>
            <div className="recipes-container">
                {cookbook.recipes.map(recipe => (
                    <PreviewCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => navigate(`/recipes/${recipe.id}`)}
                    />
                ))}
            </div>
        </div>
    );
}
