namespace Hedwig.Models
{
  public interface IHedwigIdEntity<out T>
  {
    T Id { get; }
  }
}

