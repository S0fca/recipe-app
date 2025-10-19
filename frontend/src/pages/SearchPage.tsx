import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import type {Recipe, Tag} from "../types.ts";
import PreviewCard from "../components/PreviewCard.tsx";
import { AxiosError } from "axios";
import { api } from "../api/axios";



const SearchPage = () => {

    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [results, setResults] = useState<Recipe[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const navigate = useNavigate();

    //fetch all available tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await api.get<Tag[]>("/api/tags");
                setAvailableTags(res.data);
            } catch (err) {
                setAvailableTags([]);
                setTags([]);

                if (err instanceof AxiosError) {
                    const errorMsg = err.response?.data?.error || "Failed to fetch tags";
                    console.log(errorMsg);
                    if (err.response?.status === 401 || errorMsg === "Unauthorized path") {
                        navigate("/login");
                    }
                } else {
                    console.log("Could not connect to server");
                }
            }
        };

        fetchTags();
    }, []);

    //fetch recipes that match parameters
    const handleSearch = async () => {
        const params: Record<string, string> = {};
        if (username) params.username = username;
        if (tags.length > 0) params.tags = tags.join(",");
        if (title) params.title = title;

        try {
            const res = await api.get("/api/recipes/search", { params });
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

    //add or delete tags from selected tags
    const toggleTag = (tag: Tag) => {
        setTags(tags.includes(tag.name)
            ? tags.filter(t => t !== tag.name)
            : [...tags, tag.name]);
    };

    return (
        <div>
            <h1>Search Recipes</h1>
            <div>
                <label>Title</label>
                <input placeholder="Pancakes" value={title} onChange={e => setTitle(e.target.value)}/>
            </div>
            <div>
                <label>Author</label>
                <input placeholder="User1234" value={username} onChange={e => setUsername(e.target.value)}/>
            </div>

            <h3>Tags</h3>
            <div style={styles.tagsContainer}>
                {availableTags.map(tag => (
                    <label key={tag.id} style={styles.tagLabel}>
                        <input
                            type="checkbox"
                            checked={tags.includes(tag.name)}
                            onChange={() => toggleTag(tag)}
                        />
                        {tag.name}
                    </label>
                ))}
            </div>

            <button onClick={handleSearch}>Search</button>

            <div className="recipes-container">
                {results.length === 0 ? (
                    <div>
                        <p>Nothing’s simmering here just yet. </p>
                        <p>Try changing your filters.</p>
                    </div>
                ) : (
                    results.map((recipe) => (
                        <PreviewCard
                            key={recipe.id}
                            recipe={recipe}
                            onClick={() => navigate(`/recipes/${recipe.id}`)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
export default SearchPage;

const styles = {
    tagsContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '15px',
        marginBottom: '20px',
    },
    tagLabel: {
        cursor: 'pointer',
        userSelect: 'none' as const,
    },
}
