using Xunit;
using Hedwig.Models;
using System;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class EntryRequiredTests
  {
	[Theory]
	[InlineData(true, false)]
	[InlineData(false, true)]
	public void Execute_ReturnsError_IfEntryDoesNotExist(
	  bool entryExists,
	  bool doesError
	)
	{
	  // if
	  var enrollment = new Enrollment();
	  if (entryExists)
	  {
		enrollment.Entry = DateTime.Now;
	  }

	  // when
	  var rule = new EntryRequired();
	  var result = rule.Execute(enrollment);

	  // then
	  Assert.Equal(doesError, result != null);
	}
  }
}
