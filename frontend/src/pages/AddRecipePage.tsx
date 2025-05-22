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
    const [tags, setTags] = useState<Tag[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Načtení dostupných tagů z backendu
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/api/tags', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(setAvailableTags)
            .catch(() => setAvailableTags([]));
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
        setTags(tags.includes(tag)
            ? tags.filter(t => t !== tag)
            : [...tags, tag]);
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
            const response = await fetch('http://localhost:8080/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(recipe)
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message);
            }

            navigate('/recipes');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add recipe');
        }
    };

    return (
        <div>
            <h1>Add Recipe</h1>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            /><br />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            /><br />

            <textarea
                placeholder="Instructions (e.g. step1; step2; step3)"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
            /><br />

            <h3>Ingredients</h3>
            {ingredients.map((ingredient, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Ingredient"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Quantity"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    />
                </div>
            ))}
            <button onClick={handleAddIngredient}>+ Add Ingredient</button>

            <h3>Tags</h3>
            {availableTags.map(tag => (
                <label key={tag.id} style={{ marginRight: '10px' }}>
                    <input
                        type="checkbox"
                        checked={tags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                    />
                    {tag.name}
                </label>
            ))}

            <br /><br />
            <button onClick={handleSubmit}>Submit</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default AddRecipePage;

