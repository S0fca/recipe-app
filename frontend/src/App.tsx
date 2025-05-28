import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RecipesPage from "./pages/RecipesPage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import AddRecipePage from "./pages/AddRecipePage";
import RegisterPage from "./pages/RegisterPage.tsx";
import ManageRecipesPage from "./pages/ManageRecipesPage.tsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); 

    async function isAuthenticated(): Promise<boolean> {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const res = await fetch('http://localhost:8080/api/users/validate', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return res.ok;
        } catch (err) {
            return false;
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const valid = await isAuthenticated();
            setIsLoggedIn(valid);
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
                    {!isLoggedIn ? (
                        <>
                            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/" element={<HomePage />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
                            <Route path="/recipes" element={isLoggedIn ? <RecipesPage /> : <Navigate to="/login" />} />
                            <Route path="/favorites" element={isLoggedIn ? <FavoritesPage /> : <Navigate to="/login" />} />
                            <Route path="/search" element={isLoggedIn ? <SearchPage /> : <Navigate to="/login" />} />
                            <Route path="/add-recipe" element={isLoggedIn ? <AddRecipePage /> : <Navigate to="/login" />} />
                            <Route path="/manage-recipes" element={isLoggedIn ? <ManageRecipesPage /> : <Navigate to="/login" />} />
                            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                        </>
                    )}

            </Routes>
        </Router>
    );
}

function Layout({ isLoggedIn }: { isLoggedIn: boolean }) {
    const location = useLocation();
    const navigate = useNavigate();

    const login = () => {
        navigate('/login');
    };

    const register = () => {
        navigate('/register');
    };

    if (location.pathname === "/login"){
        return (
            <div style={{textAlign: "right"}}>
                <button onClick={register}>Register</button>
            </div>
        )
    }

    if (location.pathname === "/register"){
        return (
            <div style={{textAlign: "right"}}>
                <button onClick={login}>Login</button>
            </div>
        )
    }

    if (location.pathname === "/" && !isLoggedIn) {
        return (
            <div style={{textAlign: "right"}}>
                <button onClick={login} style={{margin: "4px"}}>Login</button>
                <button onClick={register} style={{margin: "4px"}}>Register</button>
            </div>
        )
    }

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload();
    };

    return (
        <header>
            <nav>
                <div>
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/recipes">Recipes</Link> |{" "}
                    <Link to="/favorites">Favorites</Link> |{" "}
                    <Link to="/search">Search</Link> |{" "}
                    <Link to="/manage-recipes">Manage Recipes</Link>
                </div>
                <button onClick={logout}>Logout</button>
            </nav>
        </header>
    );
}

export default App;
