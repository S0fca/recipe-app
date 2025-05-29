import {useEffect, useState} from "react";
import RecipeCard from "./RecipeCard.tsx";
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch('http://localhost:8080/api/recipes', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    const error = await response.json().then(error => error.error)
                    throw new Error(error);
                }
                const data = await response.json();
                setRecipes(data);
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
