import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {api} from "../api/axios";
import { AxiosError } from "axios";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        setError(null);

        if (!username.trim()) {
            setError('Username cannot be empty');
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            await api.post("/api/users/register", { username, password });
            navigate("/login");
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409 || err.response?.data?.error?.includes("already")) {
                    setError("Username is already taken");
                } else {
                    setError(err.response?.data?.error || "Unknown error");
                }
            } else {
                setError("Cannot connect to server.");
            }
        }
    };

    return (
        <form
            className="login"
            onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
            }}
        >
            <h1>Create Account</h1>
            <input
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            /><br/>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br/>
            <button type="submit">Register</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <p>
                Already have an account? <a href="/login">Log in</a>
            </p>
        </form>
    );
}