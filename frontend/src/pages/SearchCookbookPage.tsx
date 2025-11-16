import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {CookbookDTO} from "../types.ts";
import { AxiosError } from "axios";
import { api } from "../api/axios";
import CookbookPreviewCard from "../components/CookbookPreviewCard.tsx";

const SearchCookbooksPage = () => {
    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [results, setResults] = useState<CookbookDTO[]>([]);

    const navigate = useNavigate();


    const handleSearch = async () => {
        const params: Record<string, string> = {};
        if (username) params.username = username;
        if (title) params.title = title;

        try {
            const res = await api.get("/api/cookbooks/search", { params });
            setResults(res.data);
        } catch (err) {
            if (err instanceof AxiosError) {
                const errorMsg = err.response?.data?.error || "Search failed";
                if (err.response?.status === 401 || errorMsg === "Unauthorized path") {
                    navigate("/login");
                }
            }
        }
    };

    return (
        <div>
            <h1>Cookbooks</h1>
            <div>
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)}/>
            </div>
            <div>
                <label>Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)}/>
            </div>

            <button onClick={handleSearch}>Search</button>

            <div className="recipes-container">
                {results.length === 0 ? (
                    <div>
                        <p>No cookbooks matched your search.</p>
                        <p>Try adjusting your filters.</p>
                    </div>
                ) : (
                    results.map((cookbook) => (
                        <CookbookPreviewCard cookbook={cookbook}></CookbookPreviewCard>
                    ))
                )}
            </div>
        </div>
    )
}
export default SearchCookbooksPage;

