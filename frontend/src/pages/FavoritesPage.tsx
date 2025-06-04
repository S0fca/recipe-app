import {useEffect, useState} from "react";
import RecipeCard from "../components/RecipeCard.tsx";
import {useNavigate} from "react-router-dom";
import type { Recipe } from "../types.ts";

const FavoritesPage = () => {
        const [recipes, setRecipes] = useState<Recipe[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const navigate = useNavigate();

        //fetch all user favorite recipes
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
                        const error = await response.json().then(error => error.error)
                        throw new Error(error);
                    }
                    const data = await response.json();
                    console.log(data);
                    setRecipes(Array.isArray(data) ? data : []);

                } catch (err) {
                    if (err instanceof Error){
                        setError(err.message)

                        if (err.message == "Unauthorized path") {
                            navigate("/login")
                        }
                    }else {
                        setError('Could not load recipes');
                    }
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
