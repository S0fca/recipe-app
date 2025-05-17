import { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';

export default function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsLoggedIn(true);
        navigate('/');
    };

    return (
        <div className="login">
            <h1>Log in</h1>
            <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleLogin}>Log In</button>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}
