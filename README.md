# Team Task Manager

A production-ready full-stack collaborative task management web application inspired by Trello/Asana.

## Tech Stack

- Frontend: React (Vite) + Tailwind CSS + React Router + Axios
- Backend: Node.js + Express.js (MVC architecture)
- Database: MongoDB + Mongoose
- Authentication: JWT + bcrypt
- Deployment: Railway (backend) + Railway or Vercel (frontend)

## Folder Structure

```text
team-task-manager/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ db.js
│  │  ├─ controllers/
│  │  │  ├─ authController.js
│  │  │  ├─ dashboardController.js
│  │  │  ├─ projectController.js
│  │  │  └─ taskController.js
│  │  ├─ middleware/
│  │  │  ├─ authMiddleware.js
│  │  │  ├─ errorMiddleware.js
│  │  │  └─ validateMiddleware.js
│  │  ├─ models/
│  │  │  ├─ Project.js
│  │  │  ├─ Task.js
│  │  │  └─ User.js
│  │  ├─ routes/
│  │  │  ├─ authRoutes.js
│  │  │  ├─ dashboardRoutes.js
│  │  │  ├─ projectRoutes.js
│  │  │  └─ taskRoutes.js
│  │  ├─ utils/
│  │  │  └─ AppError.js
│  │  ├─ validators/
│  │  │  ├─ authValidators.js
│  │  │  ├─ projectValidators.js
│  │  │  └─ taskValidators.js
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ .env.example
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  │  └─ axiosClient.js
│  │  ├─ components/
│  │  │  ├─ Navbar.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ context/
│  │  │  ├─ AuthContext.jsx
│  │  │  ├─ AuthContextObject.js
│  │  │  └─ useAuth.js
│  │  ├─ pages/
│  │  │  ├─ DashboardPage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ ProjectsPage.jsx
│  │  │  ├─ SignupPage.jsx
│  │  │  └─ TasksPage.jsx
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ .env.example
│  └─ package.json
├─ DEMO_SCRIPT.md
└─ README.md
```

## Backend Setup (Step-by-Step)

1. Initialize backend and install dependencies:
   - `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`, `morgan`, `express-validator`
2. Create MVC structure:
   - Models, controllers, routes, middleware, validators, and config.
3. Implement authentication:
   - Signup/login with hashed passwords and JWT token response.
4. Add protected middleware:
   - JWT verification for private APIs.
5. Implement role-aware project logic:
   - Project creator is admin.
   - Only admin can add/remove members.
6. Implement task logic:
   - Only admin can create and assign tasks.
   - Assigned member can update only their own task status.
7. Build dashboard stats endpoint:
   - Total tasks, tasks by status, overdue tasks, tasks per user.
8. Add centralized error handling and request validation.

## Frontend Setup (Step-by-Step)

1. Create React app with Vite.
2. Install and configure Tailwind CSS.
3. Add Router and Auth Context for global auth state.
4. Build pages:
   - Login, Signup, Dashboard, Projects, Tasks.
5. Configure Axios with auth token interceptor.
6. Add protected route component.
7. Integrate all backend APIs with page-level actions and state updates.

## Database Schema

### User
- `name: String`
- `email: String (unique)`
- `password: String (hashed)`

### Project
- `name: String`
- `description: String`
- `admin: ObjectId -> User`
- `members: [ObjectId -> User]`

### Task
- `title: String`
- `description: String`
- `dueDate: Date`
- `priority: Low | Medium | High`
- `status: To Do | In Progress | Done`
- `assignedTo: ObjectId -> User`
- `project: ObjectId -> Project`
- `createdBy: ObjectId -> User`

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Projects
- `GET /api/projects` (user projects)
- `POST /api/projects` (create project)
- `PATCH /api/projects/:projectId/members/add`
- `PATCH /api/projects/:projectId/members/remove`

### Tasks
- `GET /api/tasks/project/:projectId`
- `POST /api/tasks/project/:projectId`
- `PATCH /api/tasks/:taskId/status`

### Dashboard
- `GET /api/dashboard`

### Health
- `GET /api/health`

## Local Development

### 1) Backend
- Copy `backend/.env.example` to `backend/.env`
- Run:
  - `cd backend`
  - `npm install`
  - `npm run dev`

### 2) Frontend
- Copy `frontend/.env.example` to `frontend/.env`
- Run:
  - `cd frontend`
  - `npm install`
  - `npm run dev`

## Railway Deployment Steps

## Backend on Railway
1. Push repository to GitHub.
2. In Railway, create a new project and connect your repo.
3. Select root directory `backend`.
4. Set environment variables:
   - `PORT=5000`
   - `MONGO_URI=<your mongodb connection string>`
   - `JWT_SECRET=<secure random string>`
   - `JWT_EXPIRES_IN=7d`
5. Deploy.
6. Copy generated backend URL:
   - Example: `https://team-task-manager-api.up.railway.app`

## Frontend on Railway or Vercel
1. Create a second service (Railway) or a Vercel project.
2. Set root directory `frontend`.
3. Set env variable:
   - `VITE_API_URL=https://your-backend-url/api`
4. Deploy.
5. Verify frontend can call backend endpoints successfully.

## Sample .env Files

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team_task_manager
JWT_SECRET=super_secret_jwt_key_change_me
JWT_EXPIRES_IN=7d
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## Demo Video Script

See `DEMO_SCRIPT.md`.

## Production Notes

- Use strong `JWT_SECRET` in production.
- Enforce HTTPS and CORS allowlist for frontend domain.
- Add rate limiting and request logging for public deployments.
- For larger teams, add refresh tokens, audit logs, and pagination.
>>>>>>> 6e7a364 (Initial commit - Team Task Manager full stack project)
