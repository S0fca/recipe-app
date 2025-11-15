import React, {useState} from "react";
import type { Recipe } from "../types.ts";

import {api} from "../api/axios.ts";
import {AxiosError} from "axios";

import "../RecipeCard.css"
import {useNavigate} from "react-router-dom";

type PreviewCardProps = {
    recipe: Recipe;
    onClick: () => void;
};

const PreviewCard: React.FC<PreviewCardProps> = ({ recipe, onClick }) => {
    const [isFavourite, setIsFavourite] = useState(recipe.favourite);
    const navigate = useNavigate();

    const handleAddToFavourites = async () => {
        try {
            await api.post(`/api/recipes/${recipe.id}/favourite`, {}, {
                withCredentials: true,
            });

            setIsFavourite(true);
            recipe.favourite = true;

        } catch (err) {
            if (err instanceof AxiosError) {
                console.error("Chyba při přidávání do oblíbených:", err.response?.data?.error || err.message);
            } else {
                console.error("Chyba při přidávání do oblíbených:", err);
            }
        }
    };

    const handleRemoveFromFavourites = async () => {
        try {
            await api.delete(`/api/recipes/${recipe.id}/favourite`, {
                withCredentials: true,
            });

            setIsFavourite(false);
            recipe.favourite = false;

        } catch (err) {
            if (err instanceof AxiosError) {
                console.error("Chyba při odebírání z oblíbených:", err.response?.data?.error || err.message);
            } else {
                console.error("Chyba při odebírání z oblíbených:", err);
            }
        }
    };
    return (
        <div
            onClick={onClick}
            className="recipe-card"
            style={{ cursor: 'pointer' }}
        >
            <h2>{recipe.title}</h2>
            {recipe.description && <p>{recipe.description}</p>}
            <div style={{marginTop: '12px'}}>
                <small
                    style={{ color: "#e76f51", cursor: "pointer" }}
                    onClick={(e) => {
                        e.stopPropagation(); // zastaví otevření receptu
                        navigate(`/users/${recipe.createdByUserId}`);
                    }}
                >
                    Created by: {recipe.createdByUsername}
                </small>

                {Array.isArray(recipe.tags) && recipe.tags.length > 0 ? (
                    <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                        {recipe.tags.map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    whiteSpace: 'nowrap',
                                    margin: '2px',
                                    padding: '2px 6px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                            >
                                    {tag}
                                </span>
                        ))}
                    </div>
                ) : null}

                <div style={{marginTop: '12px'}}>
                    {isFavourite ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromFavourites();
                            }}
                            className="favorites-button"
                        >
                            💔 Remove from Favourites
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToFavourites();
                            }}
                            className="favorites-button"
                        >
                            ❤️ Add to Favourites
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewCard;
