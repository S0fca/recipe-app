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
            console.log('Token:', token);

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

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={e => {
                e.preventDefault();
                handleSubmit();
            }}>
                <h1>Edit Recipe: {recipe.title}</h1>

                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Pancakes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    placeholder="A simple quick recipe. "
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.textarea}
                />

                <label htmlFor="instructions">Instructions:</label>
                <textarea
                    id="instructions"
                    placeholder="1. Mix all the ingredients together.
2. ... "
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    style={styles.textarea}
                />

                <h3>Ingredients</h3>
                {ingredients.map((ingredient, index) => (
                    <div key={index} style={styles.ingredientRow}>
                        <div>
                            <label htmlFor={`ingredient-name-${index}`} style={styles.ingredientLabel}>Name:</label>
                            <input
                                id={`ingredient-name-${index}`}
                                type="text"
                                placeholder="Eggs"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                style={styles.ingredientInput}
                            />
                        </div>
                        <div>
                            <label htmlFor={`ingredient-quantity-${index}`}
                                   style={styles.ingredientLabel}>Quantity:</label>
                            <input
                                id={`ingredient-quantity-${index}`}
                                type="text"
                                placeholder="2 ks"
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                style={styles.ingredientInput}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveIngredient(index)}
                            style={{
                                marginLeft: '8px',
                                backgroundColor: '#e76f51',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                cursor: 'pointer'
                            }}
                        >
                            ✖
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddIngredient} style={styles.addButton}>+ Add Ingredient</button>

                <h3>Tags</h3>
                <div style={styles.tagsContainer}>
                    {availableTags.map(tag => (
                        <label key={tag.id} style={styles.tagLabel}>
                            <input
                                type="checkbox"
                                checked={tags.includes(tag.name)}
                                onChange={() => toggleTag(tag)}
                            />
                            {tag.name}
                        </label>
                    ))}
                </div>

                <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                    <button type="button" onClick={handleDelete}
                            style={{...styles.submitButton, backgroundColor: '#e76f51'}}>
                        Delete
                    </button>
                    <button type="submit" style={styles.submitButton}>Save</button>
                </div>
                {error && <p style={styles.error}>{error}</p>}
            </form>

            <div style={styles.sidebar}>

                {recipe && <RecipeCard recipe={{
                    ...recipe,
                    title,
                    description,
                    instructions,
                    ingredients,
                    tags
                }} />}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        gap: '40px',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap' as const,
    },
    form: {
        flex: 1,
        maxWidth: '650px',
        display: 'flex',
        flexDirection: 'column' as const,
        minWidth: '400px'
    },
    input: {
        marginBottom: '15px',
        padding: '8px',
        fontSize: '16px',
    },
    textarea: {
        marginBottom: '15px',
        padding: '8px',
        fontSize: '16px',
        minHeight: '80px',
        resize: 'vertical' as const,
    },
    ingredientRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
        flexWrap: 'wrap' as const,
    },
    ingredientLabel: {
        minWidth: '50px',
    },
    ingredientInput: {
        flex: '1 1 150px',
        padding: '6px',
        fontSize: '14px',
        color: 'black'
    },
    addButton: {
        alignSelf: 'flex-start',
        padding: '6px 12px',
        marginBottom: '20px',
        cursor: 'pointer',
    },
    tagsContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '15px',
        marginBottom: '20px',
    },
    tagLabel: {
        cursor: 'pointer',
        userSelect: 'none' as const,
    },
    submitButton: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginTop: '15px',
    },
    sidebar: {
        flex: 1,
        maxWidth: '500px',
        borderLeft: '1px solid #ccc',
        paddingLeft: '20px',
        minWidth: '300px'
    }
};

export default ManageRecipePage;

