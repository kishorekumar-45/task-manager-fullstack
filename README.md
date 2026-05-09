# TaskFlow — Full Stack Task Manager

A production-ready project management app built with **React**, **ASP.NET Web API**, and **SQL Server**. Features JWT authentication, a drag-and-drop Kanban board, and a clean dark UI.

![TaskFlow Banner](https://img.shields.io/badge/Stack-React%20%7C%20ASP.NET%20%7C%20SQL%20Server-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with BCrypt password hashing
- 📋 **Kanban Board** — Drag-and-drop tasks across Todo / In Progress / Done
- 📁 **Project Management** — Create and manage multiple projects
- 📊 **Progress Tracking** — Real-time progress bar per project
- 🎨 **Dark UI** — Clean, modern interface built with Tailwind CSS
- 🔒 **Protected Routes** — All API endpoints secured with `[Authorize]`
- 📖 **Swagger Docs** — Full API documentation built-in

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 + Vite | UI framework |
| Redux Toolkit | Auth state management |
| React Router v6 | Client-side routing |
| Axios | HTTP client + JWT interceptor |
| React Beautiful DnD | Drag-and-drop Kanban |
| Tailwind CSS | Styling |
| React Hot Toast | Notifications |

### Backend
| Tech | Purpose |
|------|---------|
| ASP.NET Web API (.NET 8) | REST API |
| Entity Framework Core 8 | ORM |
| SQL Server | Database |
| JWT Bearer Auth | Authentication |
| BCrypt.Net | Password hashing |
| Swagger / OpenAPI | API documentation |

---

## 🗄️ Database Schema

```
Users
├── Id (PK)
├── Username
├── Email
├── PasswordHash
└── CreatedAt

Projects
├── Id (PK)
├── Name
├── Description
├── Deadline
├── OwnerId (FK → Users)
└── CreatedAt

Tasks
├── Id (PK)
├── Title
├── Description
├── Status (Todo | InProgress | Done)
├── ProjectId (FK → Projects)
├── AssignedTo (FK → Users)
└── CreatedAt
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + get JWT token |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/{id}` | Get project by ID |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/{id}` | Update project |
| DELETE | `/api/projects/{id}` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/{projectId}` | Get tasks for project |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| PATCH | `/api/tasks/{id}/status` | Update status (drag-drop) |
| DELETE | `/api/tasks/{id}` | Delete task |

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Express or Developer)
- [Node.js 18+](https://nodejs.org/)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/task-manager-fullstack.git
cd task-manager-fullstack/TaskManagerAPI

# Install dependencies
dotnet restore

# Update appsettings.json with your SQL Server connection string
# "DefaultConnection": "Server=YOUR_SERVER;Database=TaskManagerDB;Trusted_Connection=True;TrustServerCertificate=True;"

# Run migrations
dotnet ef database update

# Start the API
dotnet run
# → API running at https://localhost:7148
# → Swagger UI at https://localhost:7148/swagger
```

### Frontend Setup

```bash
cd task-manager-client

# Install dependencies
npm install

# Update vite.config.js proxy target to match your API port

# Start the dev server
npm run dev
# → App running at http://localhost:5173
```

---

## 📁 Project Structure

```
task-manager-fullstack/
│
├── TaskManagerAPI/                 # ASP.NET Web API
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ProjectsController.cs
│   │   └── TasksController.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Project.cs
│   │   ├── TaskItem.cs
│   │   └── DTOs/
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Services/
│   │   └── JwtService.cs
│   └── Program.cs
│
└── task-manager-client/            # React Frontend
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── KanbanColumn.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskModal.jsx
        │   └── PrivateRoute.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   └── ProjectView.jsx
        ├── services/
        │   ├── api.js
        │   ├── auth.js
        │   ├── projects.js
        │   └── tasks.js
        └── store/
            ├── store.js
            └── authSlice.js
```

---

## 👤 Author

**Kishorekumar**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

## 📄 License

This project is licensed under the MIT License.
