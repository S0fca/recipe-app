import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Welcome to CookWorld</h1>
            <p className="homepage-subtitle">Build your own cookbook world. Your place to cook, collect and collaborate.</p>

            <div className="homepage-sections">

                <div className="card">
                    <h2>🍽️ Browse Recipes</h2>
                    <p>Explore a variety of recipes shared by the community.</p>
                    <Link to="/recipes" className="homepage-button">View all recipes</Link>
                </div>

                <div className="card">
                    <h2>📚 Browse Cookbooks</h2>
                    <p>Explore cookbooks shared by the community.</p>
                    <Link to="/cookbooks" className="homepage-button">View all cookbooks</Link>
                </div>

                <div className="card">
                    <h2>❤️ Your Favorites</h2>
                    <p>View and revisit your saved and liked recipes.</p>
                    <Link to="/favorites" className="homepage-button">View favorites</Link>
                </div>

                <div className="card">
                    <h2>✍️ Manage</h2>
                    <p>Create and customize your own recipes and cookbooks.</p>
                    <Link to="/manage" className="homepage-button">Add new recipe</Link>
                </div>

            </div>
        </div>
    );
}
