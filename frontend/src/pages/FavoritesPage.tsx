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

const FavoritesPage = () => {
        const [recipes, setRecipes] = useState<Recipe[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            const fetchRecipes = async () => {
                try {
                    const token = localStorage.getItem('token');

                    const response = await fetch(`http://localhost:8080/api/users/favourites`, {
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
                    setRecipes(Array.isArray(data) ? data : []);

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
                {!loading && !error && recipes.length === 0 && <p>You have no favorite recipes yet.</p>}

                <div className="recipes-container">
                    {recipes.map((recipe) =>
                        <RecipeCard key={recipe.id} recipe={recipe}/>
                    )}
                </div>


            </div>
        )
    }
;
export default FavoritesPage;
