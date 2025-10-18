import {useState} from "react";
import type { Recipe } from "../types.ts";

import {api} from "../api/axios";
import { AxiosError } from "axios";

type RecipeCardProps = {
    recipe: Recipe;
    onClick?: () => void;
    style: string
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, style }: RecipeCardProps) => {
    const [isFavourite, setIsFavourite] = useState(recipe.favourite);

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
        <div key={recipe.id} className={style} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div>
                <h2>{recipe.title}</h2>

                {recipe.description ? (<h3>{recipe.description}</h3>) : null}

            </div>
            {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (

                    <div>
                <h4>Ingredients:</h4>
                <ul>
                    {recipe.ingredients.map((ri, index) =>
                            (ri.name || ri.quantity) ? (
                                <li key={ri.id !== undefined && ri.id !== 0 ? ri.id : `new-${index}`}>
                                    {ri.name} {(ri.quantity) ? "–" : null} {ri.quantity}
                                </li>
                            ) : null
                        )
                     }
                </ul>

            </div>)
                : null}

            <div>
                <h4>Instructions:</h4>
                <div>
                    {recipe.instructions
                        ? recipe.instructions.split('\n').map((line, index) => (
                            <p key={index}>{line.trim()}</p>
                        ))
                        : <p>No instructions provided.</p>}
                </div>
            </div>
                <div style={{marginTop: '12px'}}>
                    <small>Created by: {recipe.createdByUsername}</small>

                    {Array.isArray(recipe.tags) && recipe.tags.length > 0 ? (
                        <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                            {recipe.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="favorites-button"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null}

                    <div style={{marginTop: '12px'}}>
                        {isFavourite ? (
                            <button
                                onClick={handleRemoveFromFavourites}
                                className="favorites-button"
                            >
                                💔 Remove from Favourites
                            </button>
                        ) : (
                            <button
                                onClick={handleAddToFavourites}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#f8e8d6',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                ❤️ Add to Favourites
                            </button>
                        )}
                    </div>
                </div>
            </div>
    );
};

            export default RecipeCard;
