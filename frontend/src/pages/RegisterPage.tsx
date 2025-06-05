import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    //handle user registration
    // - register (username, password)
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

            const error = err as Error;

            if (error.message.includes('Failed to fetch')) {
                setError('Cannot connect to server. ');
            } else if(error.message.includes("Username is already taken")){
                setError("Username is already taken")
            }else {
                setError(error.message || 'Unknown error');
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
