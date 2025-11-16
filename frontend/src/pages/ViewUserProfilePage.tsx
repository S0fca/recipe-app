import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { api } from "../api/axios";
import type {CookbookDTO, Recipe, UserProfile} from "../types.ts";
import '../UserProfilePage.css'
import PreviewCard from "../components/PreviewCard.tsx";
import CookbookPreviewCard from "../components/CookbookPreviewCard.tsx";

export default function ViewUserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [cookbooks, setCookbooks] = useState<CookbookDTO[]>([]);
    const [loadingRecipes, setLoadingRecipes] = useState(true);
    const [loadingCookbooks, setLoadingCookbooks] = useState(true);

    useEffect(() => {
        api.get(`/api/users/${id}`, { withCredentials: true })
            .then(res => setProfile(res.data))
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        api.get(`/api/users/${id}/image`, {
            withCredentials: true,
            responseType: "blob",
        })
            .then(res => {
                const blobUrl = URL.createObjectURL(res.data);
                setImageUrl(blobUrl);
            })
            .catch(() => {
                setImageUrl(null);
            });

        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [id]);

    useEffect(() => {
        if (!id) return;

        api.get(`/api/recipes/user/${id}`, { withCredentials: true })
            .then(res => setRecipes(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoadingRecipes(false));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        api.get(`/api/cookbooks/user/${id}`, { withCredentials: true })
            .then(res => setCookbooks(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoadingCookbooks(false));
    }, [id]);



    if (!profile) return <p>Loading...</p>;

    return (
        <div>
            <h1>{profile.username}</h1>
            <div style={{ marginTop: "1rem" }}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`${profile.username} profile`}
                    />
                ) : (
                    <p>No profile image</p>
                )}
            </div>
            <p>{profile.bio}</p>

            {loadingCookbooks && <p>Loading...</p>}

            <div className="recipes-container">
                {cookbooks.map((cookbook) => (
                    <CookbookPreviewCard
                        key={cookbook.id}
                        cookbook={cookbook}
                        onClick={() => navigate(`/cookbooks/${cookbook.id}`)}
                    />
                ))}
            </div>

            {loadingRecipes && <p>Loading...</p>}

            <div className="recipes-container">
                {recipes.map((recipe) => (
                    <PreviewCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => navigate(`/recipes/${recipe.id}`)}
                    />
                ))}
            </div>

        </div>
    );
}
