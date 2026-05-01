# Dashboard Updates - Student & Teacher Separation

## Overview
Implemented role-based dashboards with separate views and functionality for students and teachers.

## Backend Changes

### 1. User Model (`backend/models/User.js`)
- Added `role` field (enum: "student" | "teacher")

### 2. Auth Routes (`backend/routes/authRoutes.js`)
- Updated registration to require `role` field
- Updated login to validate role
- Added `/api/auth/me` endpoint to fetch current user info
- JWT tokens now include user role

### 3. Migration Script (`backend/migrateUsers.js`)
- Script to update existing users with default role
- Run: `node backend/migrateUsers.js`

## Frontend Changes

### 1. Authentication Pages
Created separate login/register pages for each role:
- `/login/student` - Student login (blue theme)
- `/login/teacher` - Teacher login (green theme)
- `/register/student` - Student registration (blue theme)
- `/register/teacher` - Teacher registration (green theme)
- `/login` - Role selection page
- `/register` - Role selection page

### 2. Dashboard (`frontend/src/pages/Dashboard.jsx`)

#### Teacher Dashboard Features:
- **My Courses Section**: Shows all courses uploaded by the teacher
  - Displays course title, category, duration
  - Shows number of enrolled students per course
- **Student Enrollments Section**: Lists all students who booked courses
  - Student name and course title
  - Booking status (pending/accepted/completed)
  - Actions: Accept/Reject pending bookings, Mark as completed
  - Chat button to communicate with students
- **Upload Course Button**: Quick access to create new courses

#### Student Dashboard Features:
- **My Enrolled Courses Section**: Shows all courses the student has booked
  - Course title and teacher name
  - Completion status with visual indicators:
    - ✓ Completed (green)
    - In Progress (blue)
    - Pending Approval (yellow)
    - Rejected (red)
  - Actions: View course details, Chat with teacher
- **Learning Stats**: Three stat cards showing:
  - Total Enrolled courses
  - In Progress courses
  - Completed courses
- **Browse Courses Button**: Quick access to explore more courses

### 3. Create Session Page (`frontend/src/pages/CreateSession.jsx`)
- Updated terminology from "session" to "course"
- Changed button text to "Upload Course"
- Updated placeholders and labels for teacher context

### 4. Navbar (`frontend/src/components/Navbar.jsx`)
- Shows user role badge (color-coded: green for teacher, blue for student)
- "Upload Course" button only visible to teachers
- Role-specific styling

## Key Features

### For Teachers:
1. Upload and manage courses
2. View enrolled students per course
3. Accept/reject student enrollments
4. Mark courses as completed
5. Chat with students
6. Track total enrollments

### For Students:
1. Browse and enroll in courses
2. Track course completion status
3. View learning progress statistics
4. Chat with teachers
5. See all enrolled courses in one place

## Color Themes
- **Teachers**: Emerald/Green theme
- **Students**: Blue theme
- Consistent color coding throughout the application

## API Endpoints Used
- `GET /api/auth/me` - Get current user info
- `GET /api/bookings/me` - Get user's bookings (as student or teacher)
- `GET /api/sessions/mine` - Get teacher's courses
- `PATCH /api/bookings/:id/status` - Update booking status
- `POST /api/sessions` - Create new course

## Migration Steps
1. Run the migration script to add role to existing users:
   ```bash
   node backend/migrateUsers.js
   ```
2. Existing users will be assigned "student" role by default
3. Update user roles manually in database if needed
