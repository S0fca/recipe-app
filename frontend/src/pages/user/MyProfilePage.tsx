import { useEffect, useState } from "react";
import { api } from "../../api/axios.ts";
import type { UserProfile } from "../../types.ts";
import '../../styles/UserProfilePage.css'

export default function MyProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

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

    if (!profile) return <p>Loading...</p>;

    return (
        <div>
            <h1>My Profile</h1>

            <div>
                <img
                    src={preview || profileImage || "/placeholder.png"}
                    alt="Profile"
                />

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
            </div>

            {!editMode ? (
                <>
                    <h2>{profile.username}</h2>
                    <p>{profile.bio}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                </>
            ) : (
                <form>
                    <div>
                        <label htmlFor="username">Description:</label>
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
            )}
        </div>
    );
}
