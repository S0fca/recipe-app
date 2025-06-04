# Recipe App
A simple fullstack recipe application built with:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Spring Boot (Java 17)
---
## User Documentation

This application allows users to share recipes. The main features include:

- Registration and login using JWT tokens  
- Viewing all recipes 
- Searching for recipes 
- Adding, editing, and deleting recipes  

Register or login if you have and account and navigate through the app using the menu bar at the top.

---

## Setup Instructions

### 1. Prepare the Environment

1. Create a **MySQL database** named `recipe_app` (or another name if preferred).  
2. Download the release package:  
   - https://github.com/S0fca/recipe-app/releases/download/v0.1/release.zip
3. Extract the contents of the zip file.

### 2. Backend
1. Navigate to the `/release/backend` folder.  
2. Rename the file `application-example.properties` to `application.properties`. 
3. Open **application.properties** and fill in your database credentials:  
   - `username` and `password` for your MySQL user  
   - Update the database name if you used a different one  
4. Set a `secret key` for encoding passwords (used for JWT tokens). 
   - This is a secret string used to sign JWT tokens and protect authentication.  
   - There is no strict minimum length, but for better security, use at least 8 characters (letters, numbers, and symbols).  
   - Replace the placeholder in **application.properties** with your chosen key.  
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
2. Start the backend and fronend as described above
3. Open your browser and go to http://localhost:5173 to use the application
