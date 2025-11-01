import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { api } from "../api/axios.ts";

export default function LoginAdmin({
                                       setIsAdminLoggedIn,
                                   }: {
    setIsAdminLoggedIn: (v: boolean) => void;
}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(null);
        try {
            const res = await api.post("/api/admin/login", { username, password });

            // uložíme token a nastavíme stav admina
            localStorage.setItem("token", res.data.token);
            setIsAdminLoggedIn(true);
            navigate("/admin/dashboard"); // správná cesta pro admin dashboard

        } catch (err) {
            if (err instanceof AxiosError) {
                const errorMsg = err.response?.data?.error || "Unknown error";

                if (errorMsg.includes("Invalid credentials")) {
                    setError("Invalid username or password.");
                } else {
                    setError(errorMsg);
                }

            } else {
                setError("Cannot connect to server.");
            }
        }
    };

    return (
        <div className="login">
            <h1>Admin Login</h1>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            /><br />
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="show-password"
                >
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
            <br />
            <button onClick={handleLogin}>Log In</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
