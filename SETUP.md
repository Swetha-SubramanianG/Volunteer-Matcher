# Volunteer Matcher - Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/volunteer-matcher
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

**Note:** For MongoDB Atlas, use your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/volunteer-matcher
```

4. Make sure MongoDB is running:
- For local MongoDB: Start MongoDB service
- For MongoDB Atlas: Ensure your IP is whitelisted

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

## Frontend Setup

1. Install dependencies (if not already installed):
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Running Both Servers

You can run both servers simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## Features

### Authentication
- Users must sign up/login to apply for tasks
- JWT token-based authentication
- Protected routes for authenticated users

### User Roles
- **Volunteer**: Can apply for tasks and opportunities
- **Organization**: Can create tasks and view applications

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (Organization only)

#### Applications
- `POST /api/applications` - Apply for task (Authenticated users only)
- `GET /api/applications/my-applications` - Get user's applications

## Testing

1. Start both servers
2. Open `http://localhost:5173`
3. Sign up for a new account
4. Try to apply for a task (should work when authenticated)
5. Logout and try to apply (should redirect to signup)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your MONGODB_URI in `.env`
- For MongoDB Atlas, check IP whitelist and credentials

### CORS Error
- Backend CORS is configured for `localhost:5173`
- If using a different port, update CORS settings in `backend/server.js`

### Authentication Not Working
- Check if token is being stored in localStorage
- Verify JWT_SECRET matches in backend `.env`
- Check browser console for errors

