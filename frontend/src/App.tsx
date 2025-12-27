import './styles/App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/user/LoginPage.tsx";
import RecipeListPage from "./pages/RecipeListPage.tsx";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/search/SearchPage.tsx";
import AddRecipePage from "./pages/manage/AddRecipePage.tsx";
import RegisterPage from "./pages/user/RegisterPage.tsx";
import ManageRecipesPage from "./pages/manage/ManageRecipesPage.tsx";
import ManageRecipePage from "./pages/manage/ManageRecipePage.tsx";
import RecipePage from "./pages/RecipePage.tsx";
import MyProfilePage from "./pages/user/MyProfilePage.tsx";
import UserProfilePage from "./pages/user/UserProfilePage.tsx";
import ManageCookbooksPage from "./pages/manage/ManageCookbooksPage.tsx";

import CookbookListPage from "./pages/CookbookListPage";
import AddCookbookPage from "./pages/manage/AddCookbookPage.tsx";
import CookbookPage from "./pages/CookbookPage.tsx";

import LoginAdmin from "./admin/LoginAdmin";
import DashboardAdmin from "./admin/DashboardAdmin";

import { api } from "./api/axios";
import ManageCookbookPage from "./pages/manage/ManageCookbookPage.tsx";
import ManagePage from "./pages/manage/ManagePage.tsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

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

    useEffect(() => {
        const checkAuth = async () => {
            const userValid = await isAuthenticated();
            setIsLoggedIn(userValid);
        };
        checkAuth();
    }, []);

    if (isLoggedIn === null) {
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
                        <Route path="/recipes" element={<RecipeListPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/add-recipe" element={<AddRecipePage />} />


                        <Route path="/manage" element={<ManagePage />} />
                        <Route path="/manage-recipes" element={<ManageRecipesPage />} />
                        <Route path="/edit/:id" element={<ManageRecipePage />} />
                        <Route path="/recipes/:id" element={<RecipePage />} />


                        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<MyProfilePage />} />
                        <Route path="/users/:id" element={<UserProfilePage />} />


                        <Route path="/cookbooks" element={<CookbookListPage />} />
                        <Route path="/cookbooks/:id" element={<CookbookPage />} />
                        <Route path="/cookbooks/manage" element={<ManageCookbooksPage />} />
                        <Route path="/cookbooks/create" element={<AddCookbookPage />} />
                        <Route path="/cookbooks/edit/:id" element={<ManageCookbookPage />} />


                    </>
                )}

                {/* Admin */}
                <Route
                    path="/admin/login"
                    element={<LoginAdmin setIsLoggedIn={setIsLoggedIn} />}
                />
                <Route
                    path="/admin/dashboard"
                    element={<DashboardAdmin />}
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
    const [open, setOpen] = useState(false);

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
        <header className="header">
            <nav >
                <div className="nav-desktop">
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/recipes">Recipes</Link> |{" "}
                    <Link to="/cookbooks">Cookbooks</Link> |{" "}
                    <Link to="/favorites">Favorites</Link> |{" "}
                    <Link to="/search">Search</Link> |{" "}
                    <Link to="/manage">Manage</Link>
                </div>

                <div className="nav-desktop">
                    <Link to="/profile">My Profile</Link>
                    <button onClick={logout}>Logout</button>
                </div>

                <button
                    className="hamburger"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>
            </nav>

            {open && (
                <div className="mobile-menu">
                    <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                    <Link to="/recipes" onClick={() => setOpen(false)}>Recipes</Link>
                    <Link to="/cookbooks" onClick={() => setOpen(false)}>Cookbooks</Link>
                    <Link to="/favorites" onClick={() => setOpen(false)}>Favorites</Link>
                    <Link to="/search" onClick={() => setOpen(false)}>Search</Link>
                    <Link to="/manage" onClick={() => setOpen(false)}>Manage</Link>
                    <Link to="/profile" onClick={() => setOpen(false)}>My Profile</Link>
                    <a onClick={() => { logout(); setOpen(false); }}>Logout</a>
                </div>
            )}

        </header>
    );
}

export default App;
