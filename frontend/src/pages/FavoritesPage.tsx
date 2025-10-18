import {useEffect, useState} from "react";
import RecipeCard from "../components/RecipeCard.tsx";
import {useNavigate} from "react-router-dom";
import type { Recipe } from "../types.ts";

import {api} from "../api/axios";
import { AxiosError } from "axios";

const FavoritesPage = () => {
        const [recipes, setRecipes] = useState<Recipe[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const navigate = useNavigate();

        //fetch all user favorite recipes
        useEffect(() => {
            const fetchFavourites = async () => {
                try {
                    const res = await api.get("/api/users/favourites", {
                        withCredentials: true,
                    });

                    setRecipes(Array.isArray(res.data) ? res.data : []);
                    console.log(res.data);

                } catch (err) {
                    if (err instanceof AxiosError) {
                        const errorMsg = err.response?.data?.error || "Could not load recipes";
                        setError(errorMsg);

                        if (err.response?.status === 401 || errorMsg === "Unauthorized path") {
                            navigate("/login");
                        }
                    } else {
                        setError("Could not connect to server");
                    }
                } finally {
                    setLoading(false);
                }
            };

            fetchFavourites();
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
