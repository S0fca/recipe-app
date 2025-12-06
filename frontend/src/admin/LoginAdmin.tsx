import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { api } from "../api/axios.ts";

export default function LoginAdmin({setIsLoggedIn}: {
    setIsLoggedIn: (v: boolean) => void;
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
            setIsLoggedIn(true);
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
            <div className="login-field">
                <label htmlFor="username">Username:</label>
                <input
                    id={"username"}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /><br/>
            </div>

            <div className="login-field">
                <label htmlFor="password">Password:</label>
                <div style={{ position: 'relative', display: 'inline-block' , alignItems: 'center'}}>
                    <input
                        id={"password"}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <p
                        onClick={() => setShowPassword(!showPassword)}
                        className="show-password"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </p>
                </div>
            </div>
            <br />
            <button onClick={handleLogin}>Log In</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
