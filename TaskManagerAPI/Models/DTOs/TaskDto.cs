using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.Models.DTOs
{
    public class CreateTaskDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        public int ProjectId { get; set; }

        public int? AssignedTo { get; set; }
    }

    public class UpdateTaskDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        public string? Description { get; set; }

        public int? AssignedTo { get; set; }
    }

    public class UpdateTaskStatusDto
    {
        [Required]
        public TaskStatus Status { get; set; }
    }

    public class TaskResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public int? AssignedTo { get; set; }
        public string? AssignedUserName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
