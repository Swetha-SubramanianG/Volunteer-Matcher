# Volunteer Matcher Backend

Backend API for Volunteer Matcher application using Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/volunteer-matcher
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

3. Make sure MongoDB is running on your system

4. **Seed the database with initial tasks:**
```bash
npm run seed
```

This will create:
- A test organization user (email: org@test.com, password: password123)
- 4 sample tasks with proper MongoDB ObjectIds

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create a new task (Protected, Organization only)

### Applications
- `POST /api/applications` - Apply for a task (Protected)
- `GET /api/applications/my-applications` - Get user's applications (Protected)

### Organizations
- `GET /api/organizations/:id/opportunities` - Get opportunities for an organization

## Important Notes

- **Always run `npm run seed` after setting up the database** to populate initial tasks
- Task IDs must be valid MongoDB ObjectIds (24-character hex strings)
- The frontend now fetches tasks from the API instead of using mock data
- Invalid ObjectIds will return a 400 error with a clear message
