import {useEffect, useState} from "react";

type RecipeIngredient = {
    //id: number;
    name: string;
    quantity: string;
};

type Recipe = {
    id: number;
    title: string;
    description: string;
    instructions: string;
    createdByUsername: string;
    tags: string[];
    ingredients: RecipeIngredient[];
};

const FavoritesPage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`http://localhost:8080/api/users/favourites/${"name"}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }
                const data = await response.json();
                console.log(data);
                setRecipes(data);

            } catch (err) {
                setError('Could not load recipes');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);
        return (
            <div>
                <h1>Favorites</h1>
                {loading && <p>Loading...</p>}
                {error && <p style={{color: 'red'}}>{error}</p>}
                <div className="recipes-container">
                    {recipes.map((recipe) =>

                                <div key={recipe.id} className="recipe-card">
                                    <h2>{recipe.title}</h2>
                                    <h3>{recipe.description}</h3>

                                    <div>
                                        {recipe.instructions.split(';').map((line, index) => (
                                            <p key={index}>{line}</p>
                                        ))}
                                    </div>

                                    <div>
                                        <h4>Ingredients:</h4>
                                        <ul>
                                            {recipe.ingredients.map((ri) => (
                                                <li key={ri.name}>
                                                    {ri.name} – {ri.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={{ marginTop: '4px' }}>
                                        <small>Created by: {recipe.createdByUsername}</small>

                                        <div>
                                            {recipe.tags.map((tag) => (
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

                    )}
                </div>


            </div>
        )
    }
;
export default FavoritesPage;
