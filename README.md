 📝 NotesApp - Fullstack MERN Application
A complete web application for managing personal notes, built using the MERN stack (MongoDB, Express, React, Node.js). This app features secure user authentication, password encryption, and a private dashboard for users to manage their data.
------------------------------------------------------------------

![Image Alt](https://github.com/oscaradworks-ops/note-app/blob/d212335ea73a3a170477973f7a0cffbb427f30a3/client/public/images/note%20taking%20app%20hero.png)



![Image Alt](https://github.com/oscaradworks-ops/note-app/blob/ee5e11995df144cd019b08e95f1aaae7c4e0d172/client/public/images/Screenshot%202026-01-13%20000258.png)
![Image Alt](https://github.com/oscaradworks-ops/note-app/blob/ee5e11995df144cd019b08e95f1aaae7c4e0d172/client/public/images/Screenshot%202026-01-13%20010732.png)
![Image Alt](https://github.com/oscaradworks-ops/note-app/blob/ee5e11995df144cd019b08e95f1aaae7c4e0d172/client/public/images/Screenshot%202026-01-13%20010743.png)
![Image Alt](https://github.com/oscaradworks-ops/note-app/blob/ee5e11995df144cd019b08e95f1aaae7c4e0d172/client/public/images/Screenshot%202026-01-13%20021203.png)



🚀 Key Features
User Authentication: Secure Sign-up and Login functionality.

Data Security: Implementation of JSON Web Tokens (JWT) for route protection and bcryptjs for password hashing.

CRUD Operations: Users can Create, Read, Update, and Delete their own notes.

Protected Dashboard: A private area that fetches and displays data specific to the logged-in user.

Responsive UI: A modern interface built with React Hooks and Axios for seamless API communication.


-------------------------------------------------------------------


🛠️ Tech Stack
Backend
Node.js & Express: Server environment and RESTful routing.

MongoDB & Mongoose: NoSQL database and object data modeling.

JWT: Secure transmission of information between parties as a JSON object.

Bcryptjs: Industry-standard password encryption.

Frontend
React.js: Library for building the user interface.

Axios: Promise-based HTTP client for the browser and Node.js.

React Router Dom: For dynamic routing in web applications.
-------------------------------------------------------------------- 


📦 Installation Guide

Follow these steps carefully to run the application locally.

1️⃣ Clone the Repository
git clone https://github.com/oscaradworks-ops/note-app
cd your-repo-name

2️⃣ Install Dependencies
npm install

3️⃣ Create Your Own MongoDB Database

Each user must create their own MongoDB database.
You have two options:
Option A: MongoDB Atlas (Recommended)
Go to https://www.mongodb.com/atlas
Create a free account
Create a new cluster
Create a new database
Create a database user
Whitelist your IP address
Copy your connection string

Example:

mongodb+srv://username:"passwordHere"@cluster.mongodb.net/"yourDatabaseNameHere"
Option B: Local MongoDB Installation

Install MongoDB locally
Start MongoDB service
Use connection string:

mongodb://localhost:27017/yourDatabaseName

4️⃣ Configure Environment Variables

Create a .env file in the root directory of the project.
Add your MongoDB connection string:
MONGO_URI=your_mongodb_connection_string_here
PORT=3000

5️⃣ Run the Application
npm start
Or if using nodemon:
npm run dev
📂 Project Structure (Example)
/project-root
│
├── models/
├── routes/
├── controllers/
├── public/
├── .env
├── server.js
└── package.json

🔐 Important Note About Database
Each user must:
Create their own MongoDB database
Add their own connection string
Keep credentials private
Never upload the .env file to GitHub
Add .env to your .gitignore file.

🧠 How It Works

User sends request to create a note.
Server receives request.
Note is stored inside MongoDB collection.
Notes are retrieved and displayed in the UI.
User can update or delete notes.
Changes are reflected immediately in the database.

🧪 Testing the App
After running the server:
Open your browser and navigate to:
http://localhost:3000
You can now create and manage notes.


📌 Future Improvements
User authentication (login/register)
Search functionality
Categories or tags
Rich text editor
Deployment to cloud (Render, Railway, etc.)

👨‍💻 Author

Developed using JavaScript and MongoDB as a full-stack practice project.
---------------------------------------------------------------
```text


🔌 API Endpoints
Method,  Endpoint,              Description,                 Auth Required
POST,    /api/auth/register,    Register a new user,             No
POST,    /api/auth/login,       Login & get access token,        No
GET,     /api/notes,            Get all notes for the user,      Yes
POST,    /api/notes,            Create a new note,               Yes
DELETE,  /api/notes/:id,        Delete a specific note,          Yes
```
-----------------------------------------------------------------

## 📂 Project Structure

```text
mi-app-notas/
├── config/
│   └── db.js               # Database connection logic
├── controllers/
│   ├── authController.js   # Logic for Register/Login
│   └── noteController.js   # Logic for Creating/Reading Notes
├── middleware/
│   └── auth.js             # Middleware to verify JWT tokens
├── models/
│   ├── User.js             # User Schema (Mongoose)
│   └── Note.js             # Note Schema (Mongoose)
├── routes/
│   ├── authRoutes.js       # Routes for /api/auth
│   └── noteRoutes.js       # Routes for /api/notes
├── .env                    # Environment variables (do not share this!)
├── server.js               # Main entry point for the Backend
└── README.md               # Documentation
```

📝 License
This project is open-source. Feel free to use it and modify it as you wish
