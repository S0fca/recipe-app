import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { api } from "../../api/axios.ts";
import type {CookbookDTO, Recipe, UserProfile} from "../../types.ts";
import '../../styles/UserProfilePage.css'
import PreviewCard from "../../components/PreviewCard.tsx";
import CookbookPreviewCard from "../../components/CookbookCard.tsx";

type ManageTab = "recipes" | "cookbooks";

export default function UserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [cookbooks, setCookbooks] = useState<CookbookDTO[]>([]);
    const [loadingRecipes, setLoadingRecipes] = useState(true);
    const [loadingCookbooks, setLoadingCookbooks] = useState(true);

    const [tab, setTab] = useState<ManageTab>("recipes");

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


            <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                {["recipes", "cookbooks"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t as "recipes" | "cookbooks")}
                        style={{
                            backgroundColor: tab === t ? "#e76f51" : "#f4a261",
                            cursor: tab === t ? "default" : "pointer",
                        }}
                        disabled={tab === t}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </nav>

            {tab === "recipes" ? (
                <>
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
                </>
            ) : (
                <>
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
                </>
            )}

        </div>
    );
}
