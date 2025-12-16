## 🚀 Getting Started

1. Clone the repository
2. Setup backend: `cd backend && npm install`
3. Setup frontend: `cd frontend && npm install`
4. Run backend: `npm run dev`
5. Run frontend: `npm start`

## ✨ Features

- [ ] Room Management
- [ ] Booking System
- [ ] Customer Management
- [ ] Billing System
- [ ] Admin Dashboard
- [ ] Reporting

## 📄 License

MIT' > README.md

# Create .gitignore

echo 'node_modules/
.env
\*.log
dist/
build/
.DS_Store
coverage/' > .gitignore

# Create documentation files

echo '# Project Documentation

## API Documentation

Coming soon...

## Database Schema

Coming soon...

## User Guide

Coming soon...' > documentation/README.md

# Create database initialization script

echo '-- Initialize Hotel Management Database
CREATE DATABASE IF NOT EXISTS hotel_management;
USE hotel_management;

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
id INT PRIMARY KEY AUTO_INCREMENT,
room_number VARCHAR(10) UNIQUE NOT NULL,
room_type ENUM("single", "double", "suite", "deluxe") NOT NULL,
price_per_night DECIMAL(10,2) NOT NULL,
status ENUM("available", "occupied", "maintenance") DEFAULT "available",
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);' > database/init.sql
