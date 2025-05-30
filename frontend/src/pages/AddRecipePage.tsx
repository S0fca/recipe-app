import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";

type RecipeIngredient = {
    name: string;
    quantity: string;
};

type Tag = {
    id: number;
    name: string;
}

const AddRecipePage = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>([{ name: '', quantity: '' }]);
    const [tags, setTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);

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
        setIngredients([...ingredients, { name: '', quantity: '' }]);
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

    const handleSubmit = async () => {
        setError(null);

        if (!title.trim() || !instructions.trim()) {
            setError('Title and instructions are required');
            return;
        }

        const recipe = {
            title,
            description,
            instructions,
            ingredients: ingredients.filter(i => i.name && i.quantity),
            tags
        };

        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);

            const response = await fetch('http://localhost:8080/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                //credentials: 'include',
                body: JSON.stringify(recipe)
            });

            if (!response.ok) {
                const error = await response.json().then(error => error.error)
                throw new Error(error);
            }

            navigate('/recipes');
        } catch (err) {
            if (err instanceof Error){
                setError(err.message)
                navigate("/login")
            }
            setError('Failed to add recipe');
        }
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(prev => prev.filter((_, i) => i !== index));
    };

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
                <h1>Add Recipe</h1>

                <label htmlFor="title">Title:</label>
                <small>{title.length}/100 characters</small>
                <input
                    id="title"
                    type="text"
                    placeholder="Pancakes"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={100}
                    minLength={2}
                />

                <label htmlFor="description">Description:</label>
                <small>{description.length}/255 characters</small>
                <textarea
                    id="description"
                    placeholder="A simple quick recipe."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    maxLength={255}
                />

                <label htmlFor="instructions">Instructions:</label>
                <textarea
                    id="instructions"
                    placeholder={`1. Mix all the ingredients together.\n2. ...`}
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    maxLength={10000}
                />

                <h3>Ingredients</h3>
                {ingredients.map((ingredient, index) => (
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
                                placeholder="2 ks"
                                value={ingredient.quantity}
                                onChange={e => handleIngredientChange(index, 'quantity', e.target.value)}
                                className="ingredient-input"
                                maxLength={255}
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
                    {availableTags.map(tag => (
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
                    <button type="button" className="submit-button, cancel-button" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="form-button">Submit</button>
                </div>

            </form>

            <div className="sidebar">
                <div className="recipe-card">
                    <div style={{display: 'flex'}}>
                        <h2>{title}</h2>
                    </div>

                    {description && <h3>{description}</h3>}

                    <div>
                        <h4>Ingredients:</h4>
                        <ul>
                            {ingredients
                                .filter(ri => ri.name.trim() !== '' || ri.quantity.trim() !== '')
                                .map(ri => (
                                    <li key={ri.name + ri.quantity}>
                                        {ri.name} {ri.quantity}
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <h4>Instructions:</h4>
                    <div>
                        {instructions.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>

                    <div style={{marginTop: '4px'}}>
                        <small>Created by: user</small>

                        <div>
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    style={{
                                        marginRight: '8px',
                                        padding: '2px 6px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                >
              {tag}
            </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AddRecipePage;

