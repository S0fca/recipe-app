import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateCookbookPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        try {
            const res = await api.post("/api/cookbooks", {
                title,
                description
            });

            navigate(`/cookbooks/${res.data.id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to create cookbook");
        }
    };

    return (
        <div>
            <h1>Create Cookbook</h1>
            <h1>{title? title: "Title"}</h1>
            <div>
                <label>
                    <strong>Title:</strong>{" "}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ padding: "4px 8px", fontSize: "1rem", marginRight: "1rem" }}
                        placeholder={"Title"}
                    />
                </label>
            </div>
            <div>
                <label>
                    <strong>Description:</strong>{" "}
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ padding: "4px 8px", fontSize: "1rem" }}
                    />
                </label>
            </div>

            <button onClick={handleCreate}>Create</button>
        </div>
    );
}
