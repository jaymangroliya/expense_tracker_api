# 🛠️ Expense Tracker - Backend API

Node.js + Express + TypeScript backend for the Expense Tracker app.

## 🔗 Live URL
http://exp-track-api.ap-south-1.elasticbeanstalk.com/api

## 📦 Tech Stack
- Express + TypeScript
- MongoDB + Mongoose
- Joi for validation
- Deployed on AWS Elastic Beanstalk

## 🚀 Endpoints
- `POST /api/auth/login` - Login with name + password
- `POST /api/expenses` - Submit new expense (employee)
- `GET /api/expenses` - Get expenses (by role)
- `PATCH /api/expenses/:id` - Approve/Reject (admin only)
- `GET /api/expenses/analytics` - Category totals (admin)

## ⚙️ Env Vars (use EB env config)
PORT=5000
MONGO_URI=<your MongoDB connection>

## 📁 Start (Local)
npm install 
npm run dev 
