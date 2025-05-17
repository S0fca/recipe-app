import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/login');
    };

    return (
        <div className="login">
            <h1>Create Account</h1>
            <input type="text" placeholder="Name"/><br></br>
            <input type="password" placeholder="Password"/><br></br>
            <button onClick={handleRegister}>Register</button>
            <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
    );
}
