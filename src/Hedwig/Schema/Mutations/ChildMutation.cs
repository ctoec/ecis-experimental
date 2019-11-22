using GraphQL.Types;
using GraphQL;
using Hedwig.Repositories;
using Hedwig.Schema.Types;
using Hedwig.Models;
using System.Collections.Generic;
using System;
using System.Linq;
using Hedwig.Security;

namespace Hedwig.Schema.Mutations
{
	public class ChildMutation : ObjectGraphType<Child>, IAppSubMutation, IAuthorizedGraphType
	{
		public ChildMutation(
			IChildRepository repository,
			IEnrollmentRepository enrollmentRepo,
			ISiteRepository siteRepo)
		{
			FieldAsync<ChildType>(
				"createChildWithSiteEnrollment",
				arguments: new QueryArguments(
				  new QueryArgument<StringGraphType>{ Name = "sasid" },
					new QueryArgument<NonNullGraphType<StringGraphType>>{ Name = "firstName" },
					new QueryArgument<StringGraphType>{ Name = "middleName" },
					new QueryArgument<NonNullGraphType<StringGraphType>>{ Name = "lastName" },
					new QueryArgument<StringGraphType>{ Name = "suffix" },
					new QueryArgument<StringGraphType>{ Name = "birthdate" },
					new QueryArgument<StringGraphType>{ Name = "birthCertificateId" },
					new QueryArgument<StringGraphType>{ Name = "birthTown" },
					new QueryArgument<StringGraphType>{ Name = "birthState" },
					new QueryArgument<GenderEnumType>{ Name = "gender" },
					new QueryArgument<BooleanGraphType>{ Name = "americanIndianOrAlaskaNative" },
					new QueryArgument<BooleanGraphType>{ Name = "asian" },
					new QueryArgument<BooleanGraphType>{ Name = "blackOrAfricanAmerican" },
					new QueryArgument<BooleanGraphType>{ Name = "nativeHawaiianOrPacificIslander" },
					new QueryArgument<BooleanGraphType>{ Name = "white" },
					new QueryArgument<BooleanGraphType>{ Name = "hispanicOrLatinxEthnicity" },
					new QueryArgument<BooleanGraphType>{ Name = "foster" },
					new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "siteId" }
				),
				resolve: async context =>
				{
					var sasid = context.GetArgument<string>("sasid");
					var firstName = context.GetArgument<string>("firstName");
					var middleName = context.GetArgument<string>("middleName");
					var lastName = context.GetArgument<string>("lastName");
					var suffix = context.GetArgument<string>("suffix");
					var birthdateStr = context.GetArgument<string>("birthdate");
					var birthCertificateId = context.GetArgument<string>("birthCertificateId");
					var birthTown = context.GetArgument<string>("birthTown");
					var birthState = context.GetArgument<string>("birthState");
					var gender = (Gender) (context.GetArgument<Gender?>("gender") ?? Gender.Unspecified);
					var americanIndianOrAlaskaNative = context.GetArgument<bool?>("americanIndianOrAlaskaNative") ?? false;
					var asian = context.GetArgument<bool?>("asian") ?? false;
					var blackOrAfricanAmerican = context.GetArgument<bool?>("blackOrAfricanAmerican") ?? false;
					var nativeHawaiianOrPacificIslander = context.GetArgument<bool?>("nativeHawaiianOrPacificIslander") ?? false;
					var white = context.GetArgument<bool?>("white") ?? false;
					var hispanicOrLatinxEthnicity = context.GetArgument<bool?>("hispanicOrLatinxEthnicity") ?? false;
					var foster = context.GetArgument<bool?>("foster") ?? false;
					var siteId = context.GetArgument<int>("siteId");

					var site = await siteRepo.GetSiteByIdAsync(siteId);
					if (site == null)
					{
						throw new ExecutionError(
							AppErrorMessages.NOT_FOUND("Site", siteId.ToString())
						);
					}

					DateTime? birthdate = null;

					if (birthdateStr != null)
					{
						try {
							birthdate = ValueConverter.ConvertTo<DateTime>(birthdateStr);
						}
						catch (FormatException)
						{
						}
					}

					var child = repository.CreateChild(
					  sasid: sasid,
						firstName: firstName,
						middleName: middleName,
						lastName: lastName,
						suffix: suffix,
						birthdate: birthdate,
						birthCertificateId: birthCertificateId,
						birthTown: birthTown,
						birthState: birthState,
						americanIndianOrAlaskaNative: americanIndianOrAlaskaNative,
						asian: asian,
						blackOrAfricanAmerican: blackOrAfricanAmerican,
						nativeHawaiianOrPacificIslander: nativeHawaiianOrPacificIslander,
						white: white,
						hispanicOrLatinxEthnicity: hispanicOrLatinxEthnicity,
						gender: gender,
						foster: foster
					);

					enrollmentRepo.CreateEnrollment(child.Id, site.Id);

					return child;
				}
			);
			FieldAsync<ChildType>(
				"updateChild",
				arguments: new QueryArguments(
					new QueryArgument<NonNullGraphType<StringGraphType>>{ Name = "id" },
				  new QueryArgument<StringGraphType>{ Name = "sasid" },
					new QueryArgument<StringGraphType>{ Name = "firstName" },
					new QueryArgument<StringGraphType>{ Name = "middleName" },
					new QueryArgument<StringGraphType>{ Name = "lastName" },
					new QueryArgument<StringGraphType>{ Name = "suffix" },
					new QueryArgument<StringGraphType>{ Name = "birthdate" },
					new QueryArgument<StringGraphType>{ Name = "birthCertificateId" },
					new QueryArgument<StringGraphType>{ Name = "birthTown" },
					new QueryArgument<StringGraphType>{ Name = "birthState" },
					new QueryArgument<GenderEnumType>{ Name = "gender" },
					new QueryArgument<BooleanGraphType>{ Name = "americanIndianOrAlaskaNative" },
					new QueryArgument<BooleanGraphType>{ Name = "asian" },
					new QueryArgument<BooleanGraphType>{ Name = "blackOrAfricanAmerican" },
					new QueryArgument<BooleanGraphType>{ Name = "nativeHawaiianOrPacificIslander" },
					new QueryArgument<BooleanGraphType>{ Name = "white" },
					new QueryArgument<BooleanGraphType>{ Name = "hispanicOrLatinxEthnicity" },
					new QueryArgument<BooleanGraphType>{ Name = "foster" }
				),
				resolve: async context =>
				{
					var idStr = context.GetArgument<string>("id");
					var id = Guid.Parse(idStr);
					var child = await repository.GetChildByIdAsync_OLD(id);
					if (child == null)
					{
						throw new ExecutionError(
							AppErrorMessages.NOT_FOUND("Child", id.ToString())
						);
					}

					var sasid = context.GetArgument<string>("sasid");
					var firstName = context.GetArgument<string>("firstName");
					var middleName = context.GetArgument<string>("middleName");
					var lastName = context.GetArgument<string>("lastName");
					var suffix = context.GetArgument<string>("suffix");
					var birthdateStr = context.GetArgument<string>("birthdate");
					var birthCertificateId = context.GetArgument<string>("birthCertificateId");
					var birthTown = context.GetArgument<string>("birthTown");
					var birthState = context.GetArgument<string>("birthState");
					var gender = context.GetArgument<Gender?>("gender");
					var americanIndianOrAlaskaNative = context.GetArgument<bool?>("americanIndianOrAlaskaNative");
					var asian = context.GetArgument<bool?>("asian");
					var blackOrAfricanAmerican = context.GetArgument<bool?>("blackOrAfricanAmerican");
					var nativeHawaiianOrPacificIslander = context.GetArgument<bool?>("nativeHawaiianOrPacificIslander");
					var white = context.GetArgument<bool?>("white");
					var hispanicOrLatinxEthnicity = context.GetArgument<bool?>("hispanicOrLatinxEthnicity");
					var foster = context.GetArgument<bool?>("foster");

					if (sasid != null)
					{
						child.Sasid = sasid;
					}
					if (firstName != null)
					{
						child.FirstName = firstName;
					}
					if (middleName != null)
					{
						child.MiddleName = middleName;
					}
					if (lastName != null)
					{
						child.LastName = lastName;
					}
					if (suffix != null)
					{
						child.Suffix = suffix;
					}
					if (birthdateStr != null)
					{
						DateTime? birthdate;
						try {
							birthdate = ValueConverter.ConvertTo<DateTime>(birthdateStr);
						}
						catch (FormatException)
						{
							birthdate = null;
						}
						child.Birthdate = birthdate;
					}
					if (birthCertificateId != null)
					{
						child.BirthCertificateId = birthCertificateId;
					}
					if (birthTown != null)
					{
						child.BirthTown = birthTown;
					}
					if (birthState != null)
					{
						child.BirthState = birthState;
					}
					if (gender is Gender _gender)
					{
						child.Gender = _gender;
					}
					if (americanIndianOrAlaskaNative is bool _americanIndianOrAlaskaNative)
					{
						child.AmericanIndianOrAlaskaNative = _americanIndianOrAlaskaNative;
					}
					if (asian is bool _asian)
					{
						child.Asian = _asian;
					}
					if (blackOrAfricanAmerican is bool _blackOrAfricanAmerican)
					{
						child.BlackOrAfricanAmerican = _blackOrAfricanAmerican;
					}
					if (nativeHawaiianOrPacificIslander is bool _nativeHawaiianOrPacificIslander)
					{
						child.NativeHawaiianOrPacificIslander = _nativeHawaiianOrPacificIslander;
					}
					if (white is bool _white)
					{
						child.White = _white;
					}
					if (hispanicOrLatinxEthnicity is bool _hispanicOrLatinxEthnicity)
					{
						child.HispanicOrLatinxEthnicity = _hispanicOrLatinxEthnicity;
					}
					if (foster is bool _foster)
					{
						child.Foster = _foster;
					}

					return child;
				}
			);
		}

		public AuthorizationRules Permissions(AuthorizationRules rules)
		{
			rules.DenyNot("IsAuthenticatedPolicy");
			rules.Allow("IsDeveloperPolicy");
			rules.Allow("IsTestModePolicy");
			rules.Deny();
			return rules;
		}
	}
}
