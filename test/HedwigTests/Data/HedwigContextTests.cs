using Xunit;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HedwigTests.Data
{
  public class HedwigContextTests
  {
    [Fact]
    public void AddedTemporalEntity_IsUpdated_OnSaveChanges()
    {
      using(var context = new TestHedwigContextProvider().Context)
      {
        var family = new Family {
          OrganizationId = context.Organizations.First().Id
        };
        context.Add(family);
        context.SaveChanges();

        Assert.NotNull(family.AuthorId);
        Assert.NotNull(family.UpdatedAt);
      }
   }

   [Fact]
   public void UpdatedTemporalEntity_IsUpdated_OnSaveChanges()
   {
     using(var context = new TestHedwigContextProvider().Context)
     {
       var family = FamilyHelper.CreateFamily(context);
       var updatedAt = family.UpdatedAt;
       context.Update(family);
       context.SaveChanges();

       Assert.NotNull(family.AuthorId);
       Assert.NotNull(family.UpdatedAt);
       Assert.NotEqual(updatedAt, family.UpdatedAt);  
     }
   }

    [Fact]
    public async Task AddedTemporalEntity_IsUpdated_OnSaveChangesAsync()
    {
      using(var context = new TestHedwigContextProvider().Context)
      {
        var family = new Family {
          OrganizationId = context.Organizations.First().Id
        };
        context.Add(family);
        await context.SaveChangesAsync();

        Assert.NotNull(family.AuthorId);
        Assert.NotNull(family.UpdatedAt);
      }
   }

  [Fact]
   public async Task UpdatedTemporalEntity_IsUpdated_OnSaveChangesAsync()
   {
     using(var context = new TestHedwigContextProvider().Context)
     {
       var family = FamilyHelper.CreateFamily(context);
       var updatedAt = family.UpdatedAt;
       context.Update(family);
       await context.SaveChangesAsync();

       Assert.NotNull(family.AuthorId);
       Assert.NotNull(family.UpdatedAt);
       Assert.NotEqual(updatedAt, family.UpdatedAt);  
     }
   }

    [Fact]
    public void Add_ReadOnlyProperty_DoesNotCreateNewEntity()
    {
      using (var context = new TestHedwigContextProvider().Context)
      {
        // If entity is created with read-only property
        var org = OrganizationHelper.CreateOrganization(context);
        var child = new Child {
          FirstName = "First",
          LastName = "Last",
          Birthdate = DateTime.Now,
          Gender = Gender.Unknown,
          OrganizationId = org.Id
        };

        var nowString = DateTime.Now.Millisecond.ToString();
        var user = new User{ FirstName = nowString };
        child.Author = user;

        // When entity is added to context
        context.Add(child);
        context.SaveChanges();

        // Then the read-only property is not set
        var childRes = context.Children.AsNoTracking().First(c => c.Id == child.Id);
        Assert.Null(childRes.Author);
        // and no read-only entity is created
        var userRes = context.Users.FirstOrDefault(u => u.FirstName == nowString);
        Assert.Null(userRes);
      }
    }

    [Fact]
    public void Update_ReadOnlyProperty_DoesNotUpdateEntity()
    {
      Child child;
      var nowString = DateTime.Now.ToString();
      using(var context = new TestHedwigContextProvider().Context)
      {
        // If an entity with read-only property exists
        child = ChildHelper.CreateChild(context);
        // (load author entity)
        context.Users.First(u => u.Id == child.AuthorId);
      }

      // (necessary to avoid inifite cyclical reference)
      child.Family.Children = null;

      // When the read-only property is updated
      var previousName = child.Author.FirstName;
      child.Author.FirstName = DateTime.Now.AddDays(3).ToString();
      using(var context = new TestHedwigContextProvider().Context)
      {
        context.Update(child);
        context.SaveChanges();

        // Then the change is not persisted
        var childRes = context.Children.AsNoTracking().Include(c => c.Author).First(c => c.Id == child.Id);
        Assert.Equal(previousName, childRes.Author.FirstName);
      }
    }
  }
}