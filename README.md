# 🛡️ Cyber Crime Reporting Portal

A secure and modern full-stack web application that enables citizens to report cyber crimes online, upload evidence, track complaint status, and communicate with investigating officers. The system also provides powerful dashboards and management tools for officers and administrators.

---

# 📸 Project Preview

<p align="center">
  <img src="./assets/homepage.png" alt="Cyber Crime Reporting Portal" width="100%">
</p>

---

# 📖 About The Project

Cyber Crime Reporting Portal is a role-based web application developed as a **BCA Final Year Full Stack Project** using the MERN-inspired stack with **React, Node.js, Express.js, and MySQL**.

The platform simplifies cyber crime reporting by allowing citizens to submit complaints digitally while enabling officers and administrators to efficiently investigate, manage, and monitor cases.

---

# ✨ Features

## 👤 Citizen

- User Registration
- Secure Login
- Email Verification
- JWT Authentication
- File Cyber Crime Complaint
- Upload Images, PDFs & Videos
- Track Complaint Status
- View Complaint History
- Chat with Investigating Officer
- Receive Notifications

---

## 👮 Cyber Crime Officer

- Secure Login
- View Assigned Complaints
- Update Investigation Status
- Add Investigation Notes
- Chat with Citizens
- Close Complaints

---

## 👨‍💼 Admin

- Dashboard Analytics
- Manage Users
- Manage Officers
- Assign Complaints
- Crime Statistics
- Officer Performance
- Generate Reports
- Block Fake Accounts

---

# 📂 Main Modules

## 🔐 Authentication

- Register
- Login
- Forgot Password
- Email Verification
- JWT Authentication
- Password Encryption (bcrypt)

---

## 📄 Complaint Module

- File New Complaint
- Complaint Details
- Complaint Tracking
- Complaint History
- Edit Complaint
- Search Complaints

---

## 📎 Evidence Upload

- Images
- PDF Documents
- Videos
- File Validation
- Secure Storage

---

## 🔍 Investigation Module

- Assign Officer
- Investigation Notes
- Status Updates
- Case Closure

---

## 🔔 Notification Module

- Email Notifications
- In-App Notifications
- SMS Alerts (Optional)

---

## 📊 Dashboard

- Total Complaints
- Active Cases
- Solved Cases
- Pending Cases
- Monthly Statistics
- Crime Analytics

---

# 🛑 Crime Categories

- Online Fraud
- UPI Scam
- Credit Card Fraud
- Identity Theft
- Social Media Abuse
- Cyber Bullying
- Hacking
- Phishing
- Fake Websites
- Mobile App Fraud
- Cryptocurrency Scam
- OTP Fraud
- Email Scam
- Others

---

# 🗄️ Database Tables

- Users
- Officers
- Complaints
- Complaint Evidence
- Complaint Status
- Crime Categories
- Notifications
- Chat Messages
- Activity Logs
- Reports

---

# 🛠️ Tech Stack

## Frontend

- React.js
- HTML5
- CSS3
- Bootstrap / Tailwind CSS
- Axios
- React Router

---

## Backend

- Node.js
- Express.js

---

## Database

- MySQL

---

## Authentication

- JWT
- bcrypt

---

## File Upload

- Multer

---

## Optional Integrations

- Socket.IO
- Nodemailer
- Cloudinary

---

# 📁 Project Structure

```text
CyberCrimePortal/
│
├── assets/
│   └── homepage.png
│
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── database/
│   └── cybercrime.sql
│
├── README.md
└── package.json
```

---

# ⚙️ Installation

## Clone Repository

```bash
https://github.com/tushar18-2006/Cyber-Crime-Report
```

---

## Install Frontend

```bash
cd client
npm install
```

---

## Install Backend

```bash
cd ../server
npm install
```

---

## Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=cybercrime

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASS=your_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Run Backend

```bash
npm run dev
```

---

## Run Frontend

```bash
npm start
```

---

# 👥 User Roles

| Role | Permissions |
|------|-------------|
| Citizen | Report complaints, upload evidence, chat, track status |
| Officer | Investigate cases, update status, add notes |
| Admin | Manage users, officers, reports and analytics |

---

# 📈 Admin Dashboard

- Total Users
- Total Complaints
- Active Cases
- Closed Cases
- Crime Analytics
- Officer Performance
- Download Reports
- Monthly Statistics

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- Role-Based Access Control
- Protected APIs
- File Validation
- SQL Injection Protection
- Secure Password Storage

---

# 🚀 Future Enhancements

- AI Fake Complaint Detection
- AI Chatbot
- Face Verification
- QR Complaint Tracking
- Live Location Sharing
- Mobile Application
- Multi-language Support
- Push Notifications

---

# 💡 Skills Demonstrated

- Full Stack Development
- REST API Development
- Authentication & Authorization
- MySQL Database Design
- File Upload Handling
- Dashboard Development
- Reporting & Analytics
- Role-Based Access Control

---

# 🎯 Project Objective

The objective of this project is to provide a secure and efficient digital platform for reporting cyber crimes while enabling law enforcement agencies to investigate and manage cases effectively through an integrated dashboard.

---

# 👨‍💻 Developed By

**Tushar**

