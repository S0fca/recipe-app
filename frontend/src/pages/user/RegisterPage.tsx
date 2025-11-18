import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../../api/axios.ts";
import { AxiosError } from "axios";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        setError(null);

        // validace
        if (!username.trim()) {
            setError('Username cannot be empty');
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
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

            <div className="login-field">
                <label htmlFor="username">Username:</label>
                <input
                    id={"username"}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="login-field">
                <label htmlFor="password">Password:</label>
                <div style={{ position: 'relative', display: 'inline-block' }}>
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
                        {showPassword ? "Hide" : "Show"}
                    </p>
                </div>
            </div>

            <div className="login-field">
                <label htmlFor="password-confirmation">Confirm password:</label>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <input
                        id={"password-confirmation"}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <p
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="show-password"
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </p>
                </div>
            </div>

            <button type="submit">Register</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p>
                Already have an account? <a href="/login">Log in</a>
            </p>
        </form>
    );
}
