# Team Task Manager Demo Script (2-5 Minutes)

## 1) Intro (20-30 sec)
- "This is Team Task Manager, a full-stack collaborative task app built with React, Tailwind, Express, and MongoDB."
- "It supports secure JWT authentication, project-level collaboration, and task tracking with role-aware behavior."

## 2) Authentication (30-40 sec)
- Show Signup page and create a user.
- Log out, then log in with the same credentials.
- Mention protected routes: unauthenticated users are redirected to Login.

## 3) Project Management (45-60 sec)
- Open Projects page.
- Create a new project.
- Explain: project creator is the admin automatically.
- Add and remove members using user IDs.

## 4) Task Management (45-60 sec)
- Go to Tasks page.
- Select project and create task with due date, priority, and assignee.
- Show kanban-like grouping (To Do, In Progress, Done).
- Update a task status from the status dropdown.

## 5) Dashboard Analytics (30-45 sec)
- Open Dashboard page.
- Highlight total tasks, status breakdown, and overdue tasks.
- Explain that backend also returns task counts per user for reporting.

## 6) API + Deployment (30-45 sec)
- Briefly show `.env` files.
- Mention API modules: auth, projects, tasks, dashboard.
- Mention deployment target: backend on Railway and frontend on Railway/Vercel.

## 7) Closing (10-20 sec)
- "This project demonstrates production-ready patterns: MVC architecture, validation middleware, centralized error handling, and scalable frontend state management with Context API."
