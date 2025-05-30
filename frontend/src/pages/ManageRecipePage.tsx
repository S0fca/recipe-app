import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import RecipeCard from "./RecipeCard.tsx";

type RecipeIngredient = {
    id: number;
    name: string;
    quantity: string;
};

type Tag = {
    id: number;
    name: string;
}

type Recipe = {
    id: number;
    title: string;
    description: string;
    instructions: string;
    createdByUsername: string;
    tags: string[];
    ingredients: RecipeIngredient[];
    favourite: boolean;
};

const ManageRecipePage = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>([{id: 0, name: '', quantity: '' }]);
    const [tags, setTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        if (recipe) {
            setTitle(recipe.title);
            setDescription(recipe.description);
            setInstructions(recipe.instructions);
            setIngredients(recipe.ingredients);
            setTags(recipe.tags);
        }
    }, [recipe]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/api/tags', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(res => res.json())
            .then((tags: Tag[]) => {
                setAvailableTags(tags);
            })
            .catch(() => {
                setAvailableTags([]);
                setTags([]);
            });
    }, []);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { id: 0, name: '', quantity: '' }]);
    };

    const handleIngredientChange = (index: number, field: 'name' | 'quantity', value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const toggleTag = (tag: Tag) => {
        setTags(tags.includes(tag.name)
            ? tags.filter(t => t !== tag.name)
            : [...tags, tag.name]);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:8080/api/recipes/recipe/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                navigate('/manage-recipes');
            } else {
                throw new Error('Failed to delete recipe');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete');
        }
    };

    const handleSubmit = async () => {
        setError(null);
        console.log("submit");

        if (!title.trim() || !instructions.trim()) {
            setError('Title and instructions are required');
            return;
        }

        const recipe = {
            id,
            title,
            description,
            instructions,
            ingredients: ingredients.filter(i => i.name && i.quantity),
            tags
        };

        console.log(recipe)

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/api/recipes', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(recipe)
            });

            if (response.ok) {
                navigate('/manage-recipes');
            } else {
                const message = await response.text();
                throw new Error(message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add recipe');
        }
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(prev => prev.filter((_, i) => i !== index));
    };

    if (!recipe) return <p>Loading...</p>;

    function handleCancel() {
        navigate("/manage-recipes")
    }

    return (
        <div className="recipe-form">
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <h1>Edit Recipe: {recipe.title}</h1>

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
                {ingredients?.map((ingredient, index) => (
                    <div key={index} className="ingredient-row">
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
                                onChange={(e) =>
                                    handleIngredientChange(index, 'name', e.target.value)
                                }
                                className="ingredient-input"
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
                                placeholder="2 ks"
                                value={ingredient.quantity}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'quantity', e.target.value)
                                }
                                className="ingredient-input"
                            />
                        </div>
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
                            />
                            {tag.name}
                        </label>
                    ))}
                </div>

                {error && <p className="error">{error}</p>}

                <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="form-button, delete-button"
                    >
                        Delete
                    </button>
                    <button type="button" className="form-button, cancel-button" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="form-button">
                        Save
                    </button>
                </div>

            </form>

            <div className="sidebar">
                {recipe && (
                    <RecipeCard
                        recipe={{
                            ...recipe,
                            title,
                            description,
                            instructions,
                            ingredients,
                            tags,
                        }}
                    />
                )}
            </div>
        </div>
    );
};


export default ManageRecipePage;

