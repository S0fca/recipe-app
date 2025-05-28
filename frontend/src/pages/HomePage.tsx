import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Welcome to RecipePage</h1>
            <p className="homepage-subtitle">Your place to discover, save and share your favorite recipes.</p>

            <div className="homepage-sections">

                <div className="card">
                    <h2>🍽️ Browse Recipes</h2>
                    <p>Explore a variety of recipes shared by the community.</p>
                    <Link to="/recipes" className="homepage-button">View all recipes</Link>
                </div>

                <div className="card">
                    <h2>❤️ Your Favorites</h2>
                    <p>View and revisit your saved and liked recipes.</p>
                    <Link to="/favorites" className="homepage-button">View favorites</Link>
                </div>

                <div className="card">
                    <h2>🔍 Search for recipes</h2>
                    <p>Find delicious recipes by title or tags.</p>
                    <Link to="/search" className="homepage-button">Search now</Link>
                </div>

                <div className="card">
                    <h2>✍️ Manage Recipes</h2>
                    <p>Share your own creations or edit your existing recipes.</p>
                    <Link to="/manage-recipes" className="homepage-button">Add new recipe</Link>
                </div>

            </div>
        </div>
    );
}
