using System;
using Hedwig.Models.Attributes;

namespace Hedwig.Models
{
    public abstract class TemporalEntity
    {
        public int? AuthorId { get; set; }
        [ReadOnly]
        public User Author { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
