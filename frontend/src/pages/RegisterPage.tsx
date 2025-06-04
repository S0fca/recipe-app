import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        setError(null);

        if (!username || username.trim().length === 0) {
            setError('Username cannot be empty');
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                const message = await response.text();
                if (response.status === 409) {
                    throw new Error('Username already exists');
                }
                throw new Error(message);
            }
            navigate('/login');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error occurred');
            }
        }
    };

    return (
        <div className="login">
            <h1>Create Account</h1>
            <input
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            /><br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br />
            <button onClick={handleRegister}>Register</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    );
}
