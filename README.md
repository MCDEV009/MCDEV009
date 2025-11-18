# Full Access Site

A complete full-stack web application with authentication, user management, and CRUD operations.

## Features

- 🔐 User Authentication (Register/Login with JWT)
- 👤 User Profile Management
- 📝 Full CRUD Operations for Posts
- 🎨 Modern, Responsive UI
- 🔒 Secure API with Token-based Authentication
- 💾 SQLite Database

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite3
- JWT (JSON Web Tokens)
- bcryptjs (Password Hashing)
- CORS

### Frontend
- React
- React Router
- Axios
- Modern CSS with Gradients

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

1. **Register a new account** or **Login** with existing credentials
2. Once logged in, you'll see the dashboard
3. Create, read, update, and delete posts
4. Only the post owner can edit or delete their posts

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/me` - Get current user (requires auth)

### Posts
- `GET /api/posts` - Get all posts (requires auth)
- `GET /api/posts/:id` - Get a single post (requires auth)
- `POST /api/posts` - Create a new post (requires auth)
- `PUT /api/posts/:id` - Update a post (requires auth, owner only)
- `DELETE /api/posts/:id` - Delete a post (requires auth, owner only)

## Configuration

### Backend
Edit `backend/.env` to configure:
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)

### Frontend
Edit `frontend/.env` to configure:
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Security Notes

⚠️ **Important for Production:**
- Change the `JWT_SECRET` in `backend/.env` to a strong, random string
- Use environment variables for all sensitive data
- Consider using a more robust database (PostgreSQL, MySQL) for production
- Implement rate limiting
- Add HTTPS
- Configure CORS properly for your domain

## License

ISC

