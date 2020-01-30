using System;

namespace Hedwig.Models
{
    public abstract class TemporalEntity
    {
        public int? AuthorId { get; set; }
        public User Author { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
