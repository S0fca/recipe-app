import {useEffect, useState} from "react";
import RecipeCard from "../components/RecipeCard.tsx";
import {useNavigate} from "react-router-dom";
import type {Recipe} from "../types.ts";

const ManageRecipes = () => {
    const navigate = useNavigate();

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //fetch all users recipes
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`http://localhost:8080/api/recipes/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setRecipes(Array.isArray(data) ? data : []);
                } else {
                    const error = await response.json()
                    throw new Error(error?.error || 'Could not load recipes');
                }
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

    //navigate to edit page (onClick)
    const handleEdit = (id: number) => {
        navigate(`/edit/${id}`);
    };

        return (
            <div>
                <h1>Manage recipes</h1>

                <nav>
                    <button onClick={() => navigate('/add-recipe')}>
                        Add Recipe
                    </button>
                </nav>

                <h2>Your recipes</h2>
                {loading && <p>Loading...</p>}
                {error && <p style={{color: 'red'}}>{error}</p>}
                {!loading && !error && recipes.length === 0 && <p>You created no recipes yet.</p>}

                <div className="recipes-container">
                    {recipes.map((recipe) =>
                        <RecipeCard key={recipe.id} recipe={recipe} onClick={() => handleEdit(recipe.id)}/>
                    )}
                </div>

            </div>
        )
    }
;
export default ManageRecipes;
