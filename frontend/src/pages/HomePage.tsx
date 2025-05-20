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
                    <h2>🔍 Search by Ingredients</h2>
                    <p>Type what you have at home and find recipes you can make.</p>
                    <Link to="/search" className="homepage-button">Search now</Link>
                </div>

                <div className="card">
                    <h2>❤️ Your Favorites</h2>
                    <p>See recipes you've liked and saved.</p>
                    <Link to="/favorites" className="homepage-button">View favorites</Link>
                </div>

                <div className="card">
                    <h2>✍️ Add a Recipe</h2>
                    <p>Got something delicious to share? Add it to the collection!</p>
                    <Link to="/add-recipe" className="homepage-button">Add new recipe</Link>
                </div>

            </div>
        </div>
    );
}
