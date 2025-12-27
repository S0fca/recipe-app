import { useState } from "react";

import ManageCookbooksPage from "./ManageCookbooksPage.tsx";
import ManageRecipesPage from "./ManageRecipesPage.tsx";

type ManageTab = "recipes" | "cookbooks";

const ManagePage = () => {
    const [tab, setTab] = useState<ManageTab>("recipes");


    return (
        <div>
            <h1>Manage</h1>

            {/*<select*/}
            {/*    value={tab}*/}
            {/*    onChange={(e) => setTab(e.target.value as "recipes" | "cookbooks")}*/}
            {/*    style={{ marginBottom: "1rem", padding: "0.6rem", fontSize: "1rem", background: "#f4a261", borderRadius: "12px" }}*/}
            {/*>*/}
            {/*    <option value="recipes">Recipes</option>*/}
            {/*    <option value="cookbooks">Cookbooks</option>*/}
            {/*</select>*/}

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
                <ManageRecipesPage></ManageRecipesPage>
            ) : (
                <ManageCookbooksPage></ManageCookbooksPage>
            )}
        </div>
    );
};

export default ManagePage;
