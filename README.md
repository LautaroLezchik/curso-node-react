# My Book Management App

This is a full-stack web application designed to help users manage their personal libraries. Users can register, log in, view their list of books (read and unread), add new books, mark books as read, and delete books.

## Disclamer

Esta app, como entregable del curso de Node-React fué hecha (notoriamente) con (mucha) ayuda de Gemini IA.
Obviamente que hubiera sido más educativo poder escribirla completamente a mano, pero no pude dedicarle el tiempo para lograrlo de esa manera.
Es verdad que hoy en día la mayoría de estas aplicaciones se construyend de esta manera, pero está bueno entender las razones del funcionamiento del código.
Actualmente trabajo en un proyecto fullStack con Next.js, por lo que estos conceptos los estoy aprendiendo con el uso.
Ya tengo 3 años de experiencia con React, pero me faltaba entender Node, y más allá de que los métodos los estoy usando en el proyecto en el que trabajo, este curso me fué MUY ÚTIL para entender:
- Dependencias
- Middlewears
- Tokens
- Rutas protegidas
- Manejo de volumen de queries.

Como la parte front la entiendo más, es que dejé los css como objeto en el mismo código, sin tener una hoja de estilos dedicada.
Me centré más en el backend, y en poder probar con Postman las API. Eso me sirvió mucho.

Gracias por la claridad de las explicaciones!!

---

## Overview

This application provides a simple yet powerful way to keep track of your reading. Whether you want to add new books to your "to-read" list or mark completed ones, this app offers a clean interface and robust backend.

---

## Features

**Frontend (React)**
* **User Authentication:** Register and log in with protected routes.
* **Personalized Library:** View books specific to the authenticated user.
* **CRUD Operations:** Add new books, mark books as read/unread, and delete books.
* **Global State Management:** Uses React Context for authentication state.
* **RESTful API Consumption:** Interacts seamlessly with the Node.js backend.

**Backend (Node.js + Express + MongoDB)**
* **RESTful API:** Implements all necessary endpoints for user and book management.
* **User Authentication:** Secure registration and login using JWT (JSON Web Tokens).
* **Data Models:** Mongoose schemas for `User` and `Book` data.
* **Protected Routes:** Ensures only authenticated users can access their book data.
* **Password Hashing:** Uses `bcryptjs` for secure password storage.
* **Input Validation:** Validates data for user authentication and book operations.
* **Error Handling:** Provides clear error messages for API failures.

---

## Technologies Used

**Frontend:**
* **React.js:** A JavaScript library for building user interfaces.
* **React Router DOM:** For declarative routing in React applications.
* **Axios:** A promise-based HTTP client for making API requests.

**Backend:**
* **Node.js:** JavaScript runtime environment.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** A NoSQL database (used via MongoDB Atlas).
* **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
* **jsonwebtoken (JWT):** For secure user authentication.
* **bcryptjs:** For hashing passwords.
* **dotenv:** For managing environment variables.
* **express-async-handler:** To simplify error handling for async Express routes.
* **cors:** Node.js middleware for enabling Cross-Origin Resource Sharing.

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

* **Node.js** (LTS version recommended) & **npm** (Node Package Manager)
    * You can download them from [nodejs.org](https://nodejs.org/).
* **MongoDB Atlas Account & Cluster:** A cloud-hosted MongoDB database.
    * Sign up at [cloud.mongodb.com](https://cloud.mongodb.com/).
    * Ensure you have created a database user with a strong password and whitelisted your IP address (or "Allow Access From Anywhere" for quick testing, but not recommended for production).
* **Git** (Optional, but recommended for version control)
    * Download from [git-scm.com](https://git-scm.com/).
* **Postman / Insomnia / VS Code Thunder Client** (Optional, for testing API endpoints)

---

## Installation & Setup

Follow these steps to get the project up and running locally.

1.  **Clone the Repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd <your-project-name> # Navigate to the root of the cloned project
    ```
    *If you've been building locally without Git, just navigate to your main project folder.*

2.  **Create a `.env` file for the Backend:**
    * In the **`backend/`** directory, create a new file named **`.env`**.
    * Add your MongoDB Atlas connection string and a JWT secret key to this file:

        ```env
        MONGO_URI=mongodb+srv://<your-atlas-username>:<your-atlas-password>@<your-cluster-name>.mongodb.net/<your-database-name>?retryWrites=true&w=majority
        JWT_SECRET=your_super_secure_random_jwt_secret_key_here
        PORT=5000
        NODE_ENV=development
        ```
        * **Important:** Replace `<your-atlas-username>`, `<your-atlas-password>`, `<your-cluster-name>`, and `<your-database-name>` with your actual MongoDB Atlas credentials.
        * Generate a strong `JWT_SECRET` (e.g., using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` in your terminal).
    * **Add `.env` to `.gitignore`:** Ensure your `.env` file is in `backend/.gitignore` to prevent it from being committed to version control:
        ```
        # backend/.gitignore
        node_modules/
        .env
        ```

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    (From the project root)
    ```bash
    cd frontend
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

---

## Running the Application

You will need to run both the backend and frontend servers concurrently.

1.  **Start the Backend Server:**
    * Open a new terminal window.
    * Navigate to the `backend/` directory:
        ```bash
        cd backend
        ```
    * Start the server:
        ```bash
        npm start
        ```
        (You should see "MongoDB Connected: ..." and "Server running on port 5000" messages.)

2.  **Start the Frontend Development Server:**
    * Open another new terminal window.
    * Navigate to the `frontend/` directory:
        ```bash
        cd frontend
        ```
    * Start the React development server:
        ```bash
        npm start
        ```
        (This will open your application in your default web browser, usually at `http://localhost:3000`.)

You can now use the application in your browser. Register a new user or log in with an existing one to manage your books!

---

## API Endpoints (Backend)

All API endpoints are prefixed with `http://localhost:5000/api/`.

### Authentication Endpoints (`/api/auth`)

* **`POST /api/auth/register`**
    * **Description:** Register a new user.
    * **Body:** `{ "username": "string", "email": "string", "password": "string" }`
    * **Response:** `{ "_id": "string", "username": "string", "email": "string", "token": "string" }`
* **`POST /api/auth/login`**
    * **Description:** Authenticate a user and get a JWT.
    * **Body:** `{ "email": "string", "password": "string" }`
    * **Response:** `{ "_id": "string", "username": "string", "email": "string", "token": "string" }`

### Book Management Endpoints (`/api/books`) - (All require **Authentication Header** `Authorization: Bearer <JWT>`)

* **`GET /api/books`**
    * **Description:** Get all books for the authenticated user.
    * **Response:** `Array of Book Objects`
* **`POST /api/books`**
    * **Description:** Add a new book for the authenticated user.
    * **Body:** `{ "title": "string", "author": "string", "read": "boolean (optional, default: false)" }`
    * **Response:** `Created Book Object`
* **`PUT /api/books/:id`**
    * **Description:** Update a specific book (e.g., mark as read/unread, change title/author).
    * **Parameters:** `:id` (Book ID)
    * **Body:** `{ "title": "string (optional)", "author": "string (optional)", "read": "boolean (optional)" }`
    * **Response:** `Updated Book Object`
* **`DELETE /api/books/:id`**
    * **Description:** Delete a specific book.
    * **Parameters:** `:id` (Book ID)
    * **Response:** `{ "message": "Book removed successfully", "id": "string" }`

---

