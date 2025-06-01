import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';

export default function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const error = await response.json().then(error => error.error)
                throw new Error(error);
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // uložit JWT
            setIsLoggedIn(true);
            navigate('/');
        } catch (err) {
            const error = err as Error;

            if (error.message.includes('Failed to fetch')) {
                setError('Cannot connect to server. ');
            } else if(error.message.includes("Invalid credentials")){
                setError("Invalid username or password.")
            }else {
                setError(error.message || 'Unknown error');
            }
        }
    };

    // const handleLogin = async () => {
    //     setIsLoggedIn(true);
    //     navigate('/');
    // };

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
