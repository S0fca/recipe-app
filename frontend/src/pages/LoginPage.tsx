import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {api} from "../api/axios";
import { AxiosError } from "axios";

export default function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);
        try {
            const res = await api.post("/api/users/login", { username, password });

            // uložíme JWT token do localStorage
            localStorage.setItem("token", res.data.token);
            setIsLoggedIn(true);
            navigate("/");

        } catch (err) {
            if (err instanceof AxiosError) {
                const errorMsg = err.response?.data?.error || "Unknown error";

                if (errorMsg.includes("Invalid credentials")) {
                    setError("Invalid username or password.");
                } else {
                    setError(errorMsg);
                }

            } else {
                // například chyba sítě
                setError("Cannot connect to server.");
            }
        }
    };

    return (
        <div className="login">
            <h1>Log in</h1>
            <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            /><br/>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br/>
            <button onClick={handleLogin}>Log In</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}
