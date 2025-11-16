import {useState} from "react";
import SearchRecipesPage from "./SearchRecipesPage.tsx";
import SearchCookbookPage from "./SearchCookbookPage.tsx";

type ManageTab = "recipes" | "cookbooks";

const SearchPage = () => {
    const [tab, setTab] = useState<ManageTab>("recipes");

    return (
        <div>
            <h1>Search</h1>

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
                <SearchRecipesPage></SearchRecipesPage>
            ) : (
                <SearchCookbookPage></SearchCookbookPage>
            )}
        </div>
    )
}
export default SearchPage;
