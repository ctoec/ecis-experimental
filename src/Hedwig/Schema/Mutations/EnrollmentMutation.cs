using GraphQL.Types;
using GraphQL;
using Hedwig.Repositories;
using Hedwig.Schema.Types;
using Hedwig.Models;
using System.Collections.Generic;
using System;

namespace Hedwig.Schema.Mutations
{
	public class EnrollmentMutation : ObjectGraphType<Enrollment>, IAppSubMutation
	{
		public EnrollmentMutation(IEnrollmentRepository repository)
		{
			FieldAsync<EnrollmentType>(
				"updateEnrollment",
				arguments: new QueryArguments(
					new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" },
					new QueryArgument<DateGraphType>{ Name = "entry" },
					new QueryArgument<StringGraphType>{ Name = "exit" },
					new QueryArgument<AgeEnumType> {Name = "age" }
				),
				resolve: async context =>
				{
					var id = context.GetArgument<int>("id");
					var enrollment = (Enrollment) await repository.GetEnrollmentByIdAsync(id);
					if (enrollment == null)
					{
						throw new ExecutionError(
							AppErrorMessages.NOT_FOUND("Enrollment", id)
						);
					}

					var age = context.GetArgument<Age?>("age");
					var entry = context.GetArgument<DateTime?>("entry");
					var exitStr = context.GetArgument<String>("exit");

					if(age != null) {
						enrollment.Age = age;
					}

					if (entry != null)
					{
						enrollment.Entry = (DateTime) entry;
					}

					if (exitStr != null)
					{
						DateTime? exit;
						try {
							exit = ValueConverter.ConvertTo<DateTime>(exitStr);
						}
						catch (FormatException e)
						{
							exit = null;
						}
						enrollment.Exit = exit;
					}

					return enrollment;
				}
			);
		}
	}
}
