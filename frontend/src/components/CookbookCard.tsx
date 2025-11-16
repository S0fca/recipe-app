import React from "react";
import { useNavigate } from "react-router-dom";
import type { CookbookDTO } from "../types";
import "../styles/CookbookCard.css"

type CookbookCardProps = {
    cookbook: CookbookDTO;
    onClick?: () => void;
};

const CookbookCard: React.FC<CookbookCardProps> = ({ cookbook, onClick }) => {
    const navigate = useNavigate();

    return (
        <div
            className="cookbook-card"
            style={{ cursor: onClick ? "pointer" : "default" }}
            onClick={onClick || (() => navigate(`/cookbooks/edit/${cookbook.id}`))}
        >
            <h2>{cookbook.title}</h2>
            <p>{cookbook.description}</p>
            <p>
                Owner: <strong>{cookbook.owner.username}</strong>
            </p>
            <p>
                Collaborators: {cookbook.collaborators.map(c => c.username).join(", ") || "None"}
            </p>
            <p>Recipes: {cookbook.recipes.length}</p>
        </div>
    );
};

export default CookbookCard;
