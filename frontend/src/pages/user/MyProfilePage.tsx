import { useEffect, useState } from "react";
import { api } from "../../api/axios.ts";
import type {CookbookDTO, Recipe, UserProfile} from "../../types.ts";
import '../../styles/UserProfilePage.css'
import CookbookPreviewCard from "../../components/CookbookCard.tsx";
import PreviewCard from "../../components/PreviewCard.tsx";
import {useNavigate} from "react-router-dom";

type ManageTab = "recipes" | "cookbooks";

export default function MyProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [cookbooks, setCookbooks] = useState<CookbookDTO[]>([]);
    const [loadingRecipes, setLoadingRecipes] = useState(true);
    const [loadingCookbooks, setLoadingCookbooks] = useState(true);

    const navigate = useNavigate();

    const [tab, setTab] = useState<ManageTab>("recipes");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/users/me");
                setProfile(res.data);
                setUsername(res.data.username);
                setBio(res.data.bio || "");

                const imgRes = await api.get(`/api/users/${res.data.id}/image`, {
                    responseType: "blob",
                });
                const url = URL.createObjectURL(imgRes.data);
                setProfileImage(url);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleUpdateProfile = async () => {
        try {
            const res = await api.put("/api/users/profile", { username, bio });
            setProfile(res.data);
            setEditMode(false);
            alert("Profile updated");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    const handleUploadImage = async () => {
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG, WEBP allowed");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("Max size is 2MB");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            await api.post("/api/users/profile/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Profile image updated");

            if (profile) {
                const imgRes = await api.get(`/api/users/${profile.id}/image`, {
                    responseType: "blob",
                });
                const url = URL.createObjectURL(imgRes.data);
                setProfileImage(url);
            }

            setFile(null);
            setPreview(null);
        } catch (err) {
            console.error(err);
            alert("Failed to upload image");
        }
    };


    useEffect(() => {
        api.get(`/api/recipes/user`, { withCredentials: true })
            .then(res => setRecipes(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoadingRecipes(false));
    }, []);

    useEffect(() => {
        api.get(`/api/cookbooks/user`, { withCredentials: true })
            .then(res => setCookbooks(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoadingCookbooks(false));
    }, []);


    if (!profile) return <p>Loading...</p>;

    return (
        <div>
            <h1>My Profile</h1>

            <div>
                {preview || profileImage? (<img
                    src={preview || profileImage || "/placeholder.png"}
                    alt="Profile"
                />):(<p>No profile image</p>)}

            </div>

            {!editMode ? (
                <>
                    <h2>{profile.username}</h2>
                    <p>{profile.bio}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                </>
            ) : (
                <>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                            }}
                        />
                        {file && <button onClick={handleUploadImage}>Upload Image</button>}
                    </div>

                    <form>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input id={"username"} value={username} onChange={e => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="bio">Description:</label>
                            <textarea id={"bio"} value={bio} onChange={e => setBio(e.target.value)} />
                        </div>
                        <div>
                            <button className={"cancel-button"} onClick={() => setEditMode(false)}>Cancel</button>
                            <button className={"form-button"} onClick={handleUpdateProfile}>Save</button>
                        </div>
                    </form>
                </>
            )}

            <h1>My Creations</h1>
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
