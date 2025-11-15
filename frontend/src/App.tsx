import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RecipesPage from "./pages/RecipesPage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import AddRecipePage from "./pages/AddRecipePage";
import RegisterPage from "./pages/RegisterPage.tsx";
import ManageRecipesPage from "./pages/ManageRecipesPage.tsx";
import ManageRecipePage from "./pages/ManageRecipePage.tsx";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import UserProfilePage from "./pages/UserProfilePage.tsx";
import ViewUserProfilePage from "./pages/ViewUserProfilePage.tsx";

import LoginAdmin from "./admin/LoginAdmin";
import DashboardAdmin from "./admin/DashboardAdmin";

import { api } from "./api/axios";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean | null>(null);

    // kontrola běžného uživatele
    async function isAuthenticated(): Promise<boolean> {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            const res = await api.get("/api/users/validate");
            return res.status === 200;
        } catch (err) {
            return false;
        }
    }

    // kontrola admina
    async function isAdminAuthenticated(): Promise<boolean> {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            const res = await api.get("/api/admin/validate");
            return res.status === 200;
        } catch (err) {
            return false;
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const userValid = await isAuthenticated();
            setIsLoggedIn(userValid);

            const adminValid = await isAdminAuthenticated();
            setIsAdminLoggedIn(adminValid);
        };
        checkAuth();
    }, []);

    if (isLoggedIn === null || isAdminLoggedIn === null) {
        return <div>Checking authentication...</div>;
    }

    return (
        <Router>
            <Layout isLoggedIn={isLoggedIn} />
            <Routes>
                {/* Běžný uživatel */}
                {!isLoggedIn ? (
                    <>
                        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/recipes" element={<RecipesPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/add-recipe" element={<AddRecipePage />} />
                        <Route path="/manage-recipes" element={<ManageRecipesPage />} />
                        <Route path="/edit/:id" element={<ManageRecipePage />} />
                        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<UserProfilePage />} />
                        <Route path="/users/:id" element={<ViewUserProfilePage />} />
                    </>
                )}

                {/* Admin */}
                <Route
                    path="/admin/login"
                    element={<LoginAdmin setIsAdminLoggedIn={setIsAdminLoggedIn} />}
                />
                <Route
                    path="/admin/dashboard"
                    element={isAdminLoggedIn ? <DashboardAdmin /> : <Navigate to="/" replace />}
                />
            </Routes>
        </Router>
    );
}

// Layout navigace
function Layout({ isLoggedIn }: { isLoggedIn: boolean }) {
    const location = useLocation();
    const navigate = useNavigate();

    const login = () => navigate('/login');
    const register = () => navigate('/register');
    const logout = () => {
        localStorage.removeItem('token');
        window.location.reload(); // obnoví všechny stavy
    };

    if (location.pathname === "/login") {
        return (
            <div style={{ textAlign: "right" }}>
                <button onClick={register}>Register</button>
            </div>
        );
    }

    if (location.pathname === "/register") {
        return (
            <div style={{ textAlign: "right" }}>
                <button onClick={login}>Login</button>
            </div>
        );
    }

    if (location.pathname === "/" && !isLoggedIn) {
        return (
            <div style={{ textAlign: "right" }}>
                <button onClick={login} style={{ margin: "4px" }}>Login</button>
                <button onClick={register} style={{ margin: "4px" }}>Register</button>
            </div>
        );
    }

    if (location.pathname === "/admin/login") {
        return (
            <></>
        );
    }

    return (
        <header>
            <nav>
                <div>
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/recipes">Recipes</Link> |{" "}
                    <Link to="/favorites">Favorites</Link> |{" "}
                    <Link to="/search">Search</Link> |{" "}
                    <Link to="/manage-recipes">Manage Recipes</Link> |{" "}
                    <Link to="/profile">My Profile</Link>
                </div>
                <button onClick={logout}>Logout</button>
            </nav>
        </header>
    );
}

export default App;
