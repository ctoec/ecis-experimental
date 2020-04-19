// using System.Collections.Generic;
// using Hedwig.Models;
// using Hedwig.Repositories;
// using Moq;
// using Xunit;
// using HedwigTests.Fixtures;

// namespace HedwigTests.Repositories
// {
// 	public class HedwigRepositoryTests
// 	{
// 		[Theory]
// 		[InlineData(1, 1, false)]
// 		[InlineData(1, null, true)]
// 		[InlineData(null, 1, false)]
// 		public void UpdateEnumerableChildObjects_RemovesCurrentEntities_IfNotInUpdateEntities(
// 			int? currentId, int? updateId, bool shouldRemove
// 		)
// 		{
// 			// if
// 			var currents = new List<IHedwigIdEntity<int>>();
// 			if (currentId != null)
// 			{
// 				var currentMock = new Mock<IHedwigIdEntity<int>>();
// 				currentMock.Setup(c => c.Id).Returns(currentId.Value);
// 				currents.Add(currentMock.Object);
// 			}

// 			var updates = new List<IHedwigIdEntity<int>>();
// 			if (updateId != null)
// 			{
// 				var updateMock = new Mock<IHedwigIdEntity<int>>();
// 				updateMock.Setup(c => c.Id).Returns(updateId.Value);
// 				updates.Add(updateMock.Object);
// 			}

// 			using (var contextProvider = new TestHedwigContextProvider(callBase: false))
// 			{
// 				var contextMock = contextProvider.ContextMock;
// 				var context = contextProvider.Context;

// 				// when
// 				var hedwigRepoMock = new Mock<HedwigRepository>(context);
// 				hedwigRepoMock.CallBase = true;
// 				hedwigRepoMock.Object.UpdateEnumerableChildObjects(updates, currents);

// 				// then
// 				var times = shouldRemove ? Times.Once() : Times.Never();
// 				contextMock.Verify(
// 					ctx => ctx.Remove(It.Is<IHedwigIdEntity<int>>(entity => entity.Id == currentId)),
// 					times
// 				);
// 			}
// 		}
// 	}
// }
