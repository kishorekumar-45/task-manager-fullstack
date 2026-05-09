# ═══════════════════════════════════════════════
#  DAY 2 — Postman Test Sequence
#  Make sure API is running: dotnet run
# ═══════════════════════════════════════════════

# IMPORTANT: Add JWT to every request below
# In Postman → Authorization tab → Bearer Token → paste your token from Day 1 login

# ─────────────────────────────────────────────
#  PROJECTS
# ─────────────────────────────────────────────

# 1. Create a project
POST https://localhost:5001/api/projects
Body:
{
  "name": "My First Project",
  "description": "Task manager test project",
  "deadline": "2024-12-31T00:00:00"
}
# → 201 Created with project details + id

# 2. Get all your projects
GET https://localhost:5001/api/projects
# → Array of projects with taskCount

# 3. Get one project
GET https://localhost:5001/api/projects/1

# 4. Update a project
PUT https://localhost:5001/api/projects/1
Body:
{
  "name": "Updated Project Name",
  "description": "New description"
}
# → 204 No Content

# 5. Delete a project (careful — cascades tasks!)
DELETE https://localhost:5001/api/projects/1
# → 204 No Content

# ─────────────────────────────────────────────
#  TASKS
# ─────────────────────────────────────────────

# 6. Create a task (use projectId from step 1)
POST https://localhost:5001/api/tasks
Body:
{
  "title": "Build login page",
  "description": "React login form with JWT",
  "projectId": 1
}
# → 201 Created, status = "Todo"

# 7. Create a few more tasks
POST https://localhost:5001/api/tasks
Body: { "title": "Set up ASP.NET project", "projectId": 1 }

POST https://localhost:5001/api/tasks
Body: { "title": "Connect SQL Server", "projectId": 1 }

# 8. Get all tasks for a project
GET https://localhost:5001/api/tasks/1
# → Array of tasks, each with status field

# 9. Update task status (this is what the Kanban drag-drop will call!)
PATCH https://localhost:5001/api/tasks/1/status
Body:
{
  "status": 1
}
# status values: 0 = Todo, 1 = InProgress, 2 = Done
# → 200 OK with { id, status: "InProgress" }

# 10. Update task details
PUT https://localhost:5001/api/tasks/1
Body:
{
  "title": "Build login page with validation",
  "description": "React login form with JWT + Formik validation"
}
# → 204 No Content

# 11. Delete a task
DELETE https://localhost:5001/api/tasks/1
# → 204 No Content

# ─────────────────────────────────────────────
#  SECURITY CHECK — should return 401
# ─────────────────────────────────────────────
# Try any endpoint WITHOUT the Authorization header
# → Should return 401 Unauthorized  ✅
