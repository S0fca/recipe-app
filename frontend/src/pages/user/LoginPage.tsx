import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {api} from "../../api/axios.ts";
import { AxiosError } from "axios";

export default function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);


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
                setError("Cannot connect to server.");
            }
        }
    };

    return (
        <div className="login">
            <h1>Log in</h1>
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

            <button onClick={handleLogin}>Log In</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}
