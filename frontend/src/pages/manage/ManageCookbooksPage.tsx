import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CookbookDTO } from "../../types.ts";
import { api } from "../../api/axios.ts";
import CookbookPreviewCard from "../../components/CookbookCard.tsx";

const ManageCookbooksPage: React.FC = () => {
    const [cookbooks, setCookbooks] = useState<CookbookDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCookbooks = async () => {
            try {
                const res = await api.get<CookbookDTO[]>("/api/cookbooks/user", { withCredentials: true });
                setCookbooks(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load cookbooks");
            } finally {
                setLoading(false);
            }
        };
        fetchCookbooks();
    }, []);

    const handleAddCookbook = () => {
        navigate("/cookbooks/create");
    };

    return (
        <div>
            <h2>Cookbooks</h2>
            <button onClick={handleAddCookbook}>Add Cookbook</button>
            <h3>Your cookbooks</h3>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && cookbooks.length === 0 && <p>No cookbooks created yet.</p>}

            <div className="recipes-container">
                {cookbooks.map(cb => (
                    <CookbookPreviewCard key={cb.id} cookbook={cb} />
                ))}
            </div>
        </div>
    );
};

export default ManageCookbooksPage;
