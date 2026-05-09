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
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public TasksController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // GET api/tasks/{projectId} — get all tasks for a project
        [HttpGet("{projectId}")]
        public async Task<IActionResult> GetByProject(int projectId)
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            // Verify user owns the project
            var projectExists = await _context.Projects
                .AnyAsync(p => p.Id == projectId && p.OwnerId == userId);

            if (!projectExists)
                return NotFound(new { message = "Project not found." });

            var tasks = await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .Include(t => t.AssignedUser)
                .Include(t => t.Project)
                .Select(t => new TaskResponseDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status.ToString(),
                    ProjectId = t.ProjectId,
                    ProjectName = t.Project.Name,
                    AssignedTo = t.AssignedTo,
                    AssignedUserName = t.AssignedUser != null ? t.AssignedUser.Username : null,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return Ok(tasks);
        }

        // GET api/tasks/single/{id} — get one task by ID
        [HttpGet("single/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            var task = await _context.Tasks
                .Where(t => t.Id == id && t.Project.OwnerId == userId)
                .Include(t => t.AssignedUser)
                .Include(t => t.Project)
                .FirstOrDefaultAsync();

            if (task == null)
                return NotFound(new { message = "Task not found." });

            return Ok(new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                ProjectId = task.ProjectId,
                ProjectName = task.Project.Name,
                AssignedTo = task.AssignedTo,
                AssignedUserName = task.AssignedUser?.Username,
                CreatedAt = task.CreatedAt
            });
        }

        // POST api/tasks — create a new task
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            // Verify project belongs to user
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == dto.ProjectId && p.OwnerId == userId);

            if (project == null)
                return NotFound(new { message = "Project not found." });

            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                ProjectId = dto.ProjectId,
                AssignedTo = dto.AssignedTo,
                Status = Models.TaskStatus.Todo
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = task.Id }, new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                ProjectId = task.ProjectId,
                ProjectName = project.Name,
                AssignedTo = task.AssignedTo,
                CreatedAt = task.CreatedAt
            });
        }

        // PUT api/tasks/{id} — update task title/description/assignee
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project.OwnerId == userId);

            if (task == null)
                return NotFound(new { message = "Task not found." });

            if (dto.Title != null) task.Title = dto.Title;
            if (dto.Description != null) task.Description = dto.Description;
            if (dto.AssignedTo.HasValue) task.AssignedTo = dto.AssignedTo;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH api/tasks/{id}/status — update ONLY the status (used by drag-and-drop)
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTaskStatusDto dto)
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project.OwnerId == userId);

            if (task == null)
                return NotFound(new { message = "Task not found." });

            task.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { id = task.Id, status = task.Status.ToString() });
        }

        // DELETE api/tasks/{id} — delete a task
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            if (userId == null) return Unauthorized();

            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project.OwnerId == userId);

            if (task == null)
                return NotFound(new { message = "Task not found." });

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
