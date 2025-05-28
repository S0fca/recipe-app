import {useEffect, useState} from "react";
import RecipeCard from "./RecipeCard.tsx";

type RecipeIngredient = {
    id: number;
    name: string;
    quantity: string;
};

type Recipe = {
    id: number;
    title: string;
    description: string;
    instructions: string;
    createdByUsername: string;
    tags: string[];
    ingredients: RecipeIngredient[];
    favourite: boolean;
};

type Tag = {
    id: number;
    name: string;
}

const SearchPage = () => {

    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [results, setResults] = useState<Recipe[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/api/tags', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(res => res.json())
            .then((tags: Tag[]) => {
                setAvailableTags(tags);
            })
            .catch(() => {
                setAvailableTags([]);
                setTags([]);
            });
    }, []);


    const handleSearch = async () => {
        const params = new URLSearchParams();
        if (username) params.append('username', username);
        if (tags.length > 0) params.append('tags', tags.join(','));
        if (title) params.append('title', title);

        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:8080/api/recipes/search?${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await response.json();
        setResults(data);
    };

    const toggleTag = (tag: Tag) => {
        setTags(tags.includes(tag.name)
            ? tags.filter(t => t !== tag.name)
            : [...tags, tag.name]);
    };

    return (
        <div>
            <h1>Search Recipes</h1>
            <label>Title</label>
            <input placeholder="Pancakes" value={title} onChange={e => setTitle(e.target.value)}/>
            <label>Author</label>
            <input placeholder="User1234" value={username} onChange={e => setUsername(e.target.value)}/>

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
                        <RecipeCard key={recipe.id} recipe={recipe}/>
                    ))
                )}
            </div>


            {/*

        Title
        Tag
        User

        */}

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
