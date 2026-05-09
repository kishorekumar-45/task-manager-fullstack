using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.Models.DTOs
{
    public class CreateProjectDto
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime? Deadline { get; set; }
    }

    public class UpdateProjectDto
    {
        [MaxLength(100)]
        public string? Name { get; set; }

        public string? Description { get; set; }

        public DateTime? Deadline { get; set; }
    }

    public class ProjectResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime? Deadline { get; set; }
        public DateTime CreatedAt { get; set; }
        public int OwnerId { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public int TaskCount { get; set; }
    }
}
