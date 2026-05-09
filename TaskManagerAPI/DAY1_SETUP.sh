# ═══════════════════════════════════════════════
#  DAY 1 SETUP — Task Manager API
#  Run these commands in order
# ═══════════════════════════════════════════════

# ── STEP 1: Create the project ────────────────
dotnet new webapi -n TaskManagerAPI --no-openapi
cd TaskManagerAPI

# ── STEP 2: Install NuGet packages ────────────
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.0
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.0
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.0
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.0
dotnet add package System.IdentityModel.Tokens.Jwt --version 7.3.1
dotnet add package BCrypt.Net-Next --version 4.0.3
dotnet add package Swashbuckle.AspNetCore --version 6.5.0

# ── STEP 3: Copy the generated files into your project ─
# Replace: Program.cs, appsettings.json
# Create folders and add:
#   Models/  → User.cs, Project.cs, TaskItem.cs
#   Models/DTOs/ → AuthDto.cs
#   Data/    → AppDbContext.cs
#   Services/ → JwtService.cs
#   Controllers/ → AuthController.cs

# ── STEP 4: Run EF Core Migrations ───────────
dotnet ef migrations add InitialCreate
dotnet ef database update
# → This creates TaskManagerDB in your SQL Server

# ── STEP 5: Run the API ───────────────────────
dotnet run
# → API runs at: https://localhost:5001
# → Swagger UI at: https://localhost:5001/swagger

# ═══════════════════════════════════════════════
#  POSTMAN TEST SEQUENCE
# ═══════════════════════════════════════════════

# 1. Register a user
POST https://localhost:5001/api/auth/register
Body (JSON):
{
  "username": "kishore",
  "email": "kishore@test.com",
  "password": "Test@1234"
}
# → Returns: { token, username, email, userId }

# 2. Login
POST https://localhost:5001/api/auth/login
Body (JSON):
{
  "email": "kishore@test.com",
  "password": "Test@1234"
}
# → Returns: { token, username, email, userId }

# 3. Copy the token → use in Day 2 protected endpoints
# In Postman: Authorization → Bearer Token → paste token

# ═══════════════════════════════════════════════
#  IF EF TOOLS NOT FOUND, run this first:
# ═══════════════════════════════════════════════
dotnet tool install --global dotnet-ef
