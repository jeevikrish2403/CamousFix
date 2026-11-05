Deployment platform:
Link: https://jeevikrish2403.github.io/CamousFix/



# 🔧 CampusFix — Campus Complaint & Maintenance Management System

A full-stack Java + React application for managing campus maintenance complaints.

---

## Tech Stack

| Layer     | Technology            |
|-----------|-----------------------|
| Frontend  | React + Vite          |
| Backend   | Java 17 + Spring Boot 3 |
| Database  | MySQL                 |
| Auth      | JWT (Bearer Token)    |
| Security  | Spring Security       |

---

## Project Structure

```
CampusFix/
├── backend/          ← Spring Boot (Maven)
│   └── src/main/java/com/campusfix/
│       ├── model/        ← JPA Entities
│       ├── repository/   ← Spring Data JPA
│       ├── service/      ← Business Logic
│       ├── controller/   ← REST APIs
│       ├── dto/          ← Request/Response DTOs
│       ├── security/     ← JWT + Spring Security
│       └── config/       ← Security, CORS, Data Init
└── frontend/         ← React + Vite
    └── src/
        ├── api/          ← Axios instance
        ├── context/      ← Auth context
        ├── components/   ← Navbar, Badges, PrivateRoute
        └── pages/
            ├── student/
            ├── admin/
            └── technician/
```

---

## Database Tables

| Table               | Purpose                              |
|---------------------|--------------------------------------|
| `users`             | Students, Admins, Technicians        |
| `categories`        | Electrical, Plumbing, IT, etc.       |
| `complaints`        | Core complaint records               |
| `complaint_comments`| Discussion thread on each complaint  |
| `complaint_history` | Audit trail of status changes        |

---

## Status Workflow

```
OPEN → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
```

---

## Roles & Permissions

| Role        | Permissions                                           |
|-------------|-------------------------------------------------------|
| STUDENT     | Submit complaints, track, comment, close (after RESOLVED) |
| ADMIN       | View all, assign technicians, change priority/status  |
| TECHNICIAN  | View assigned, update status, add resolution notes    |

---

## Setup & Run

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+

### 1. Database
```sql
CREATE DATABASE campusfix_db;
```

### 2. Backend
```bash
cd backend
# Update src/main/resources/application.properties with your DB password
mvn spring-boot:run
```
Backend starts on: **http://localhost:8080**

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend starts on: **http://localhost:5173**

---

## Demo Accounts (seeded on first boot)

| Role        | Email                      | Password     |
|-------------|----------------------------|--------------|
| Admin       | admin@campusfix.com        | admin123     |
| Technician  | arun@campusfix.com         | tech123      |
| Student     | student@campusfix.com      | student123   |

---

## API Endpoints

### Auth
| Method | Endpoint             | Description   |
|--------|----------------------|---------------|
| POST   | /api/auth/register   | Register user |
| POST   | /api/auth/login      | Login         |

### Complaints
| Method | Endpoint                        | Role           |
|--------|---------------------------------|----------------|
| POST   | /api/complaints                 | STUDENT        |
| GET    | /api/complaints/my              | STUDENT        |
| GET    | /api/complaints                 | ADMIN          |
| GET    | /api/complaints/assigned        | TECHNICIAN     |
| GET    | /api/complaints/{id}            | ALL            |
| PATCH  | /api/complaints/{id}/assign     | ADMIN          |
| PATCH  | /api/complaints/{id}/status     | ADMIN, TECH    |
| PATCH  | /api/complaints/{id}/close      | STUDENT        |
| POST   | /api/complaints/{id}/comments   | ALL            |

### Other
| Method | Endpoint                  | Role    |
|--------|---------------------------|---------|
| GET    | /api/categories           | ALL     |
| GET    | /api/users/technicians    | ADMIN   |
| GET    | /api/users/me             | ALL     |
| GET    | /api/dashboard/stats      | ADMIN   |
