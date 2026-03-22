# Cookbook World
Full‑stack web application for sharing recipes and creating cookbooks.  

**Tech stack**
- **Frontend:** React + TypeScript + Vite
- **Backend:** Spring Boot (Java 21), Spring Security + JWT
- **Database:** MySQL

---

## Features

- User registration and login (**JWT authentication**)
- Browse recipes and open a **recipe detail**
- Browse cookbooks and open a **cookbook detail**
- Search recipes and cookbooks
- Create, edit, and delete recipes/cookbooks
- Add/remove recipes to/from cookbooks
- User profile (username, bio, profile picture)
- Cookbook collaboration (owner can manage collaborators)

---

## Setup Instructions

### 1. Prepare the Environment

1. Create a **MySQL database** named `recipe_app` (or another name if preferred).  
2. Download the release package:  
   - [Release](https://github.com/S0fca/recipe-app/releases/tag/v2.0)
   - [Download release.zip](https://github.com/S0fca/recipe-app/releases/download/v2.0/release.zip)
3. Extract the contents of the zip file.

### 2. Backend
1. Navigate to the `/release/backend` folder.  
2. Rename the file `application-example.properties` to `application.properties`. 
3. Open **application.properties** and fill in your database credentials:  
   - `username` and `password` for your MySQL user  
   - Update the database name if you used a different one  
4. Set the JWT secret key:
   - `security.jwt.token.secret-key`
   - This is a secret string used to sign JWT tokens and protect authentication.  
   - There is no strict minimum length, but for better security, use at least 8 characters (letters, numbers, and symbols).  
   - Keep this key private and do not share it.
5. **Run the backend jar file** by double-clicking it or by running the following command in a terminal:  
```bash
java -jar recipe-app.jar
```

### 3. Front end
1. Navigate to the `/release/frontend` folder.
2. Open a **terminal** in this folder (make sure you are inside the frontend directory).
3. Install dependencies and start the development server:
   - `npm install`
   - `npm run dev`
4. The frontend will be available at http://localhost:5173

### 4. Running the Application
1. Make sure your **database** is running
2. Start the backend and frontend as described above
3. Open your browser and go to http://localhost:5173 to use the application

---

## License

PolyForm Noncommercial License 1.0.0 (see `LICENSE.md`).

