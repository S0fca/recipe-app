import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import type { Recipe, RecipeIngredient, Tag } from "../types.ts";
import {api} from "../api/axios";
import { AxiosError } from "axios";
import '../Form.css'

type RecipeFormProps = {
    recipe?: Recipe;
    recipeId?: string;
    mode: "edit" | "add";
};

const RecipeForm = ({ recipe, recipeId, mode }: RecipeFormProps) => {
    const navigate = useNavigate();
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>([{ id: 0, name: '', quantity: '' }]);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        if (recipe) {
            setTitle(recipe.title);
            setDescription(recipe.description);
            setInstructions(recipe.instructions);
            setIngredients(recipe.ingredients);
            setTags(recipe.tags);
        }
    }, [recipe]);

    //set all available tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await api.get<Tag[]>("/api/tags", {
                    withCredentials: true,
                });
                setAvailableTags(res.data);
            } catch {
                setAvailableTags([]);
                setTags([]);
            }
        };

        fetchTags();
    }, []);


    //adds new ingredient to list
    const handleAddIngredient = () => {
        setIngredients([...ingredients, { id: 0, name: '', quantity: '' }]);
    };

    //remove ingredient from list
    const handleRemoveIngredient = (index: number) => {
        setIngredients(prev => prev.filter((_, i) => i !== index));
    };

    //update ingredient name/quantity
    const handleIngredientChange = (index: number, field: 'name' | 'quantity', value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    //add or remove tag from list
    const toggleTag = (tag: Tag) => {
        setTags(tags.includes(tag.name)
            ? tags.filter(t => t !== tag.name)
            : [...tags, tag.name]);
    };

    //cancel button - back to manage recipes
    const handleCancel = () => {
        navigate("/manage-recipes");
    };

    //delete button - delete recipe based on id
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;

        try {
            await api.delete(`/api/recipes/recipe/${recipeId}`, {
                withCredentials: true,
            });
            navigate('/manage-recipes');
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.error || 'Failed to delete recipe');
            } else {
                setError('Failed to delete recipe');
            }
        }
    };


    //submit button, add/update recipe
    const handleSubmit = async () => {
        setError(null);

        if (!title.trim() || !instructions.trim()) {
            setError('Title and instructions are required');
            return;
        }

        const newRecipe = {
            id: recipeId,
            title,
            description,
            instructions,
            ingredients: ingredients.filter(i => i.name),
            tags,
        };

        try {
            if (mode === "edit") {
                await api.put(`/api/recipes`, newRecipe, { withCredentials: true });
            } else {
                await api.post(`/api/recipes`, newRecipe, { withCredentials: true });
            }
            navigate('/manage-recipes');
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.error || 'Failed to save recipe');
            } else {
                setError('Failed to save recipe');
            }
        }
    };


    return (
        <div className="recipe-form">
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <h1>{mode === "edit" ? `Edit Recipe: ${recipe?.title}` : "Add Recipe"}</h1>

                <label htmlFor="title">Title:</label>
                <small>{title.length}/100 characters</small>
                <input
                    id="title"
                    type="text"
                    placeholder="Pancakes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    minLength={2}
                />

                <label htmlFor="description">Description:</label>
                <small>{description.length}/255 characters</small>
                <textarea
                    id="description"
                    placeholder="A simple quick recipe."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={255}
                />

                <label htmlFor="instructions">Instructions:</label>
                <textarea
                    id="instructions"
                    placeholder={`1. Mix all the ingredients together.\n2. ...`}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    maxLength={10000}
                />

                <h3>Ingredients</h3>
                {ingredients.map((ingredient, index) => (
                    <div key={ingredient.id !== undefined && ingredient.id !== 0 ? ingredient.id : `new-${index}`} className="ingredient-row">
                        <div>
                            <label
                                htmlFor={`ingredient-name-${index}`}
                                className="ingredient-label"
                            >
                                Name:
                            </label>
                            <input
                                id={`ingredient-name-${index}`}
                                type="text"
                                placeholder="Eggs"
                                value={ingredient.name}
                                onChange={e => handleIngredientChange(index, 'name', e.target.value)}
                                className="ingredient-input"
                                maxLength={255}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor={`ingredient-quantity-${index}`}
                                className="ingredient-label"
                            >
                                Quantity:
                            </label>
                            <input
                                id={`ingredient-quantity-${index}`}
                                type="text"
                                placeholder="2 pcs"
                                value={ingredient.quantity}
                                onChange={e => handleIngredientChange(index, 'quantity', e.target.value)}
                                className="ingredient-input"
                                maxLength={255}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}
                                className={"delete-button"}
                                style={{
                                    marginLeft: '8px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                }}
                            >
                                ✖
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="add-button"
                >
                    + Add Ingredient
                </button>

                <h3>Tags</h3>
                <div className="tags-container">
                    {availableTags.map((tag) => (
                        <label key={tag.id} className="tag-label">
                            <input
                                type="checkbox"
                                checked={tags.includes(tag.name)}
                                onChange={() => toggleTag(tag)}
                                className="ingredient-input"
                            />
                            {tag.name}
                        </label>
                    ))}
                </div>

                {error && <p className="error">{error}</p>}

                <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                    {mode === "edit" && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="form-button delete-button"
                        >
                            Delete
                        </button>
                    )}
                    <button type="button" className="form-button cancel-button" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="form-button">
                        Save
                    </button>
                </div>
            </form>

            <div className="sidebar">
                <RecipeCard
                    recipe={{
                        id: 0,
                        title,
                        description,
                        instructions,
                        ingredients,
                        tags,
                        createdByUsername: "user",
                        favourite: false
                    }}
                    style={"recipe-card"}
                />
            </div>
        </div>
    );
};

export default RecipeForm;
