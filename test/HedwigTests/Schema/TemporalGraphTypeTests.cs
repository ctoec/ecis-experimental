using Xunit;
using Moq;
using GraphQL.Types;
using Hedwig.Schema;
using System;
using System.Collections.Generic;

namespace HedwigTests.Schema
{
    public class TemporalGraphTypeTests
    {
        [Fact]
        public void SetAsOfGlobal_Adds_AsOf_To_GlobalArguments()
        {
            var context = new ResolveFieldContext<object>();
            var userContext= new UserContext();
            var globalArguments = new Dictionary<string, object>();
            userContext.GlobalArguments = globalArguments;
            context.UserContext = userContext;

            DateTime asOf = DateTime.Now;
            TemporalGraphType<object>.SetAsOfGlobal(context, asOf);

            Assert.Single(globalArguments);
            Assert.Equal(asOf, globalArguments[TemporalGraphType<object>.AS_OF_KEY]);
        }

        [Fact]
        public void GetAsOfGlobal_Gets_AsOf_From_GlobalArguments()
        {
            var context = new ResolveFieldContext<object>();
            var userContext= new UserContext();
            var globalArguments = new Dictionary<string, object>();
            DateTime asOf = DateTime.Now;
            globalArguments.Add(TemporalGraphType<object>.AS_OF_KEY, asOf);
            userContext.GlobalArguments = globalArguments;
            context.UserContext = userContext;

            Assert.Equal(asOf, TemporalGraphType<object>.GetAsOfGlobal(context));
        }

        [Fact]
        public void GetAsOfGlobal_Gets_Null_If_AsOf_Not_Set()
        {
            var context = new ResolveFieldContext<object>();
            var userContext = new UserContext();
            userContext.GlobalArguments = new Dictionary<string, object>();
            context.UserContext = userContext;

            Assert.Null(TemporalGraphType<object>.GetAsOfGlobal(context));
        }
    }
}