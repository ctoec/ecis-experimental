using Xunit;
using System.Threading.Tasks;
using System;
using System.Linq;
using Hedwig.Models;
using Hedwig.Schema;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Integration.GraphQLMutations
{
	public class FamilyMutationTests
	{
		[Fact]
		public async Task Create_Family_With_All_Fields()
		{
			using (var api = new TestApiProvider()) {
				// If
				var child = ChildHelper.CreateChild(api.Context);
				var addressLine1 = "123 Home St";
				var addressLine2 = "Apt 1";
				var town = "Hometown";
				var state = "Homestate";
				var zip = "12345";
				var homelessness = false;

				// When

				// Issue properly serializing boolean values, hence why false is hardcoded
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						createFamilyWithChild (
							addressLine1: ""{addressLine1}"",
							addressLine2: ""{addressLine2}"",
							town: ""{town}"",
							state: ""{state}"",
							zip: ""{zip}"",
							homelessness: false,
							childId: ""{child.Id}""
						) {{
							children {{
								id
							}}
							addressLine1
							addressLine2
							town
							state
							zip
							homelessness
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Family family = await response.GetObjectFromGraphQLResponse<Family>("createFamilyWithChild");
				Assert.Equal(addressLine1, family.AddressLine1);
				Assert.Equal(addressLine2, family.AddressLine2);
				Assert.Equal(town, family.Town);
				Assert.Equal(state, family.State);
				Assert.Equal(zip, family.Zip);
				Assert.Equal(homelessness, family.Homelessness);
				Assert.Equal(child.Id, family.Children.Single().Id);
			}
		}

		[Fact]
		public async Task Create_Family_With_Partial_Fields()
		{
			using (var api = new TestApiProvider()) {
				// If
				var child = ChildHelper.CreateChild(api.Context);
				var addressLine1 = "123 Home St";

				// When
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						createFamilyWithChild (
							addressLine1: ""{addressLine1}"",
							childId: ""{child.Id}""
						) {{
							children {{
								id
							}}
							addressLine1
							homelessness
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Family family = await response.GetObjectFromGraphQLResponse<Family>("createFamilyWithChild");
				Assert.Equal(addressLine1, family.AddressLine1);
				Assert.False(family.Homelessness);
				Assert.Equal(child.Id, family.Children.Single().Id);
			}
		}

		[Fact]
		public async Task Create_Family_Child_Id_Not_Found()
		{
			using (var api = new TestApiProvider()) {
				// If
				var invalidId = Guid.Empty;

				// When
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						createFamilyWithChild (
							childId: ""{invalidId}""
						) {{
							children {{
								id
							}}
						}}
					}}"
				);

				// Then
				var gqlResponse = await response.ParseGraphQLResponse();
				Assert.NotEmpty(gqlResponse.Errors);
				Assert.Equal(AppErrorMessages.NOT_FOUND("Child", invalidId.ToString()), gqlResponse.Errors[0].Message);
			}
		}
	}
}