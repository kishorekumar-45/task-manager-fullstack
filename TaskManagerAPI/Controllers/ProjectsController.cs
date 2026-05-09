using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;
using TaskManagerAPI.Models.DTOs;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints require a valid JWT
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public ProjectsController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // GET api/projects — get all projects owned by the logged-in user
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            var projects = await _context.Projects
                .Where(p => p.OwnerId == userId)
                .Include(p => p.Tasks)
                .Include(p => p.Owner)
                .Select(p => new ProjectResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Deadline = p.Deadline,
                    CreatedAt = p.CreatedAt,
                    OwnerId = p.OwnerId,
                    OwnerName = p.Owner.Username,
                    TaskCount = p.Tasks.Count
                })
                .ToListAsync();

            return Ok(projects);
        }

        // GET api/projects/{id} — get a single project with its tasks
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            var project = await _context.Projects
                .Where(p => p.Id == id && p.OwnerId == userId)
                .Include(p => p.Tasks)
                    .ThenInclude(t => t.AssignedUser)
                .Include(p => p.Owner)
                .FirstOrDefaultAsync();

            if (project == null)
                return NotFound(new { message = "Project not found." });

            return Ok(new ProjectResponseDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                Deadline = project.Deadline,
                CreatedAt = project.CreatedAt,
                OwnerId = project.OwnerId,
                OwnerName = project.Owner.Username,
                TaskCount = project.Tasks.Count
            });
        }

        // POST api/projects — create a new project
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                Deadline = dto.Deadline,
                OwnerId = userId.Value
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Reload with owner info
            await _context.Entry(project).Reference(p => p.Owner).LoadAsync();

            return CreatedAtAction(nameof(GetById), new { id = project.Id }, new ProjectResponseDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                Deadline = project.Deadline,
                CreatedAt = project.CreatedAt,
                OwnerId = project.OwnerId,
                OwnerName = project.Owner.Username,
                TaskCount = 0
            });
        }

        // PUT api/projects/{id} — update project details
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProjectDto dto)
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id && p.OwnerId == userId);

            if (project == null)
                return NotFound(new { message = "Project not found." });

            if (dto.Name != null) project.Name = dto.Name;
            if (dto.Description != null) project.Description = dto.Description;
            if (dto.Deadline.HasValue) project.Deadline = dto.Deadline;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/projects/{id} — delete project (cascades to tasks)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id && p.OwnerId == userId);

            if (project == null)
                return NotFound(new { message = "Project not found." });

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
