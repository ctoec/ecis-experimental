using Xunit;
using System;
using System.Threading.Tasks;
using Hedwig.Data;
using HedwigTests.Helpers;
using Hedwig.Models;
using HedwigTests.Fixtures;

namespace HedwigTests.Integration.GraphQLQueries
{
	[Collection("SqlServer")]
	public class ChildQueryTests
	{
		[Fact]
		public async Task Get_Child_By_Id_As_Of()
		{
			using (var api = new TestApiProvider())
			{
				//Given
				var originalName = "FIRST";
				var updatedName = "UPDATED";
				var child = ChildHelper.CreateChild(api.Context, firstName: originalName);
				var asOf = Utilities.GetAsOfWithSleep();
				child.FirstName = updatedName;
				api.Context.SaveChanges();


				// When child is queried with asOf timestamp
				var responseAsOf = await api.Client.GetGraphQLAsync(
						$@"{{
                        child(id: ""{child.Id}"", asOf: ""{asOf}"") {{
                            firstName
                        }}
                    }}"
				);

				// Then the old version of the child  is returned
				responseAsOf.EnsureSuccessStatusCode();
				Child childAsOf = await responseAsOf.GetObjectFromGraphQLResponse<Child>();
				Assert.Equal(originalName, childAsOf.FirstName);

				// When child is queried
				var responseCurrent = await api.Client.GetGraphQLAsync(
						$@"{{
                        child(id: ""{child.Id}"") {{
                            firstName
                        }}
                    }}"
				);

				// Then the current version of the child is returned
				responseCurrent.EnsureSuccessStatusCode();
				Child childCurrent = await responseCurrent.GetObjectFromGraphQLResponse<Child>();
				Assert.Equal(updatedName, childCurrent.FirstName);
			}
		}

		[Fact]
		public async Task Get_Child_By_Id_As_Of_With_Family()
		{
			using (var api = new TestApiProvider())
			{
				// Given
				var family = FamilyHelper.CreateFamily(api.Context);
				var child = ChildHelper.CreateChild(api.Context, family: family);
				var asOf = Utilities.GetAsOfWithSleep();

				var address = "my address";
				family.AddressLine1 = address;
				api.Context.SaveChanges();

				// When child is queried with asOf timestamp
				var responseAsOf = await api.Client.GetGraphQLAsync(
						$@"{{
                        child(asOf: ""{asOf}"", id: ""{child.Id}"") {{
                            family {{
                                id,
                                addressLine1
                            }}
                        }}
                    }}"
				);

				// Then then old version of the child is returned
				responseAsOf.EnsureSuccessStatusCode();
				Child childAsOf = await responseAsOf.GetObjectFromGraphQLResponse<Child>();
				Assert.Equal(family.Id, childAsOf.Family.Id);
				Assert.Null(childAsOf.Family.AddressLine1);

				// When child is queried
				var responseCurrent = await api.Client.GetGraphQLAsync(
						$@"{{
                        child(id: ""{child.Id}"") {{
                            family {{
                                id,
                                addressLine1
                            }}
                        }}
                    }}"
				);

				// Then the current version of the child is returned
				responseCurrent.EnsureSuccessStatusCode();
				Child childCurrent = await responseCurrent.GetObjectFromGraphQLResponse<Child>();
				Assert.Equal(family.Id, childCurrent.Family.Id);
				Assert.Equal(address, childCurrent.Family.AddressLine1);
			}
		}

		[Fact]
		public async Task Get_Child_By_Id_As_Of_With_Family_And_Determinations()
		{
			using (var api = new TestApiProvider())
			{
				// Given
				var family = FamilyHelper.CreateFamily(api.Context);
				var child = ChildHelper.CreateChild(api.Context, family: family);
				var asOf = Utilities.GetAsOfWithSleep();

				var determination = FamilyDeterminationHelper.CreateDetermination(api.Context, family: family);
				family.Determinations = new FamilyDetermination[] { determination };
				api.Context.SaveChanges();

				// When child is queried with asOf timestamp
				var responseAsOf = await api.Client.GetGraphQLAsync(
						$@"{{
                        child(asOf: ""{asOf}"", id: ""{child.Id}"") {{
                            family {{
                                id,
                                determinations {{
                                    id
                                }}
                            }}
                        }}
                    }}"
				);

				// Then then old version of the child 
				responseAsOf.EnsureSuccessStatusCode();
				Child childAsOf = await responseAsOf.GetObjectFromGraphQLResponse<Child>();
				Assert.Equal(family.Id, childAsOf.Family.Id);
				Assert.Empty(childAsOf.Family.Determinations);

				// When child is queried
				var responseCurrent = await api.Client.GetGraphQLAsync(
						$@"{{
                        child(id: ""{child.Id}"") {{
                            family {{
                                id,
                                determinations {{
                                    id
                                }}
                            }}
                        }}
                    }}"
				);

				// Then the current version of the child is returned
				responseCurrent.EnsureSuccessStatusCode();
				Child childCurrent = await responseCurrent.GetObjectFromGraphQLResponse<Child>();
				Assert.Equal(family.Id, childCurrent.Family.Id);
				Assert.Single(childCurrent.Family.Determinations);
			}
		}
	}
}
