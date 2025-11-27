**LifeEase - Student Productivity & Wellness Application

A full-stack web application helping students manage tasks, events, journals, and mental wellness.

Live Demo:[https://life-ease-zeta.vercel.app]

About
LifeEase is a comprehensive productivity application designed for students to manage academic and personal responsibilities while supporting mental wellness through mood tracking and journaling.

Built with: React, Node.js, Express, MongoDB, TailwindCSS

 ***Features
 
Task Management - Create, edit, and delete tasks with priorities and recurring options

 Event Calendar - Schedule and track important dates
 
 Personal Journal - Write and manage daily reflections
 
 Mood Tracker - Log emotional states (great, good, okay, bad, terrible)
 
 Analytics Dashboard - View productivity stats, mood trends, and activity streaks
 
 Interactive Calendar - Visual monthly overview with clickable date previews
 
 Dark Mode - Toggle between light and dark themes
 
 Browser Notifications - Reminders for upcoming tasks and events
 
Secure Authentication - JWT-based login/registration


 *** Tech Stack
Layer           |          Technology
Frontend                   React 18, Vite, TailwindCSS
Backend                    Node.js, Express
Database                   MongoDB (Mongoose ODM)
Authentication             JWT, bcryptjs
Hosting                    Vercel (Frontend), Render (Backend)



 *** Prerequisites
Before starting, ensure you have:

Node.js v16+ (Download)

MongoDB - Local installation OR MongoDB Atlas account

Git (Download)

 ***Installation & Setup
 
Step 1: Clone Repository

```
git clone https://github.com/yourusername/LifeEase.git
cd LifeEase
```
Step 2: Backend Setup
```
cd backend
npm install
```
Create .env file:
```
cp .env.example .env
```
Edit .env:
env

Step 3: Frontend Setup
```
cd ../frontend
npm install
```
Step 4: Start Development Servers
Terminal 1 - Backend:
```
cd backend
npm run dev
```
Expected output:

✅ MongoDB Connected Successfully

🚀 Server running on http://localhost:5000

Terminal 2 - Frontend:
```
cd frontend
npm run dev
```
Expected output:

 ➜  Local:   http://localhost:5173/
 
Step 5: Access Application

Open browser: http://localhost:5173

 ***API Endpoints
Authentication

POST /api/auth/register - Register user

POST /api/auth/login - Login user

Protected Endpoints (Require JWT)

GET/POST/PUT/DELETE /api/tasks - Task CRUD

GET/POST/PUT/DELETE /api/events - Event CRUD

GET/POST/PUT/DELETE /api/journal - Journal CRUD

GET/POST/PUT/DELETE /api/mood - Mood CRUD

GET /api/analytics/dashboard - Analytics data

Authorization Header:

Authorization: Bearer <your_jwt_token>


***Documentation
SRS Document: [https://docs.google.com/document/d/1xUXmgvYHJaGZD0M-FcRqBUWrjXE8ZGkw6aK6wE9y0ro/edit?usp=sharing]

API Documentation: See API Endpoints section above


 ***Author
by Kadi Matou Koita

 ***Acknowledgments
 
MongoDB Atlas (Database hosting)

Vercel & Render (Application hosting)
