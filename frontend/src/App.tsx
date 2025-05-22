import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RecipesPage from "./pages/RecipesPage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import AddRecipePage from "./pages/AddRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import RegisterPage from "./pages/RegisterPage.tsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <Layout isLoggedIn={isLoggedIn} />
            <Routes>
                    {!isLoggedIn ? (
                        <>
                            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
                            <Route path="/recipes" element={isLoggedIn ? <RecipesPage /> : <Navigate to="/login" />} />
                            <Route path="/favorites" element={isLoggedIn ? <FavoritesPage /> : <Navigate to="/login" />} />
                            <Route path="/search" element={isLoggedIn ? <SearchPage /> : <Navigate to="/login" />} />
                            <Route path="/add-recipe" element={isLoggedIn ? <AddRecipePage /> : <Navigate to="/login" />} />
                            <Route path="/recipe/:id" element={isLoggedIn ? <RecipeDetailPage /> : <Navigate to="/login" />} />
                        </>
                    )}

            </Routes>
        </Router>
    );
}

function Layout({ isLoggedIn }: { isLoggedIn: boolean }) {
    const location = useLocation();
    if (location.pathname === "/login" || !isLoggedIn) return null;

    return (
        <header>
            <nav>
                <Link to="/">Home</Link> |{" "}
                <Link to="/recipes">Recipes</Link> |{" "}
                <Link to="/favorites">Favorites</Link> |{" "}
                <Link to="/search">Search</Link> |{" "}
                <Link to="/add-recipe">Add Recipe</Link>
            </nav>
        </header>
    );
}

export default App;
