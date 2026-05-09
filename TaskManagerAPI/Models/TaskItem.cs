using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.Models
{
    public enum TaskStatus
    {
        Todo,
        InProgress,
        Done
    }

    public class TaskItem
    {
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public TaskStatus Status { get; set; } = TaskStatus.Todo;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public int ProjectId { get; set; }
        public int? AssignedTo { get; set; }

        // Navigation
        public Project Project { get; set; } = null!;
        public User? AssignedUser { get; set; }
    }
}
