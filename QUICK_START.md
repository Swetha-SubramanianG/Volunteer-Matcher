# Quick Start Guide

## Fix the ObjectId Error

The error you're seeing happens because the frontend is using mock IDs (like "2") instead of real MongoDB ObjectIds. Follow these steps:

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Create Backend .env File

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/volunteer-matcher
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

### Step 3: Seed the Database

**This is the most important step!** Run the seed script to create tasks with proper MongoDB ObjectIds:

```bash
cd backend
npm run seed
```

This will:
- Create a test organization (email: org@test.com, password: password123)
- Create 4 sample tasks with proper MongoDB ObjectIds
- Display the task IDs so you can use them

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

### Step 5: Create Frontend .env File

Create `.env` in the root directory:
```
VITE_API_URL=http://localhost:5000/api
```

### Step 6: Start Frontend

```bash
npm run dev
```

## What Changed

1. **Backend now validates ObjectIds** - Returns clear error if ID format is invalid
2. **Frontend fetches tasks from API** - No more mock data with invalid IDs
3. **TaskDetailsPage uses real task._id** - Uses MongoDB ObjectId instead of URL parameter
4. **Seed script creates real tasks** - Tasks have proper ObjectIds that work with MongoDB

## Testing

1. Sign up for a new account
2. Go to Tasks page - you should see tasks from the database
3. Click "Sign Up" on any task - it should work now!

## Troubleshooting

**If you still see ObjectId errors:**
- Make sure you ran `npm run seed` in the backend directory
- Check that MongoDB is running
- Verify the backend server is running on port 5000
- Check browser console for API errors

**If tasks don't appear:**
- Check backend console for errors
- Verify MongoDB connection in backend/.env
- Make sure you ran the seed script successfully

