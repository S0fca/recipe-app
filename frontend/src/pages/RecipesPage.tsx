import {useEffect, useState} from "react";
import RecipeCard from "./RecipeCard.tsx";

type RecipeIngredient = {
    id: number;
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
    favourite: boolean;
};


const RecipesPage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("poslany token recipe page; TOKEN:", token);

                const response = await fetch('http://localhost:8080/api/recipes', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },

                });
                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }
                const data = await response.json();
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
                <h1>Recipes</h1>
                {loading && <p>Loading...</p>}
                {error && <p style={{color: 'red'}}>{error}</p>}
                <div className="recipes-container">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe}/>
                    ))}
                </div>

            </div>
        )
    }
;
export default RecipesPage;
