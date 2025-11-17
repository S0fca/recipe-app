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

            <div style={{display: "flex", flexDirection: "row"}}>
                <p>Collaborators:&nbsp;</p>
                {cookbook.collaborators.map((c) => (
                    <p
                        style={{ color: "#e76f51", cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/users/${c.id}`);
                        }}
                    >
                        {c.username}&nbsp;
                    </p>
                    )
                )}
            </div>
            <p>Recipes: {cookbook.recipes.length}</p>
        </div>
    );
};

export default CookbookCard;
