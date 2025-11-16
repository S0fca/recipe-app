import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Cookbook } from "../types";
import CookbookPreviewCard from "../components/CookbookPreviewCard.tsx";
import { useNavigate } from "react-router-dom";

export default function CookbookListPage() {
    const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/cookbooks")
            .then(res => setCookbooks(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Cookbooks</h1>
            <div className="recipes-container">
                {cookbooks.map(c => (
                    <CookbookPreviewCard
                        key={c.id}
                        cookbook={c}
                        onClick={() => navigate(`/cookbooks/${c.id}`)}
                    />
                ))}
            </div>
        </div>
    );
}
