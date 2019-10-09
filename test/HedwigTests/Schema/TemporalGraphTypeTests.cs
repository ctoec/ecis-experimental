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
            var userContext= new RequestContext();
            var globalArguments = new Dictionary<string, object>();
            userContext.GlobalArguments = globalArguments;
            context.UserContext = userContext;

            DateTime asOf = DateTime.Now;
            TemporalGraphType<object>.SetAsOfGlobal(context, asOf);

            Assert.Single(globalArguments);
            Assert.True(globalArguments.ContainsValue(asOf));
        }

        [Fact]
        public void GetAsOfGlobal_Gets_AsOf_From_GlobalArguments()
        {
            var context = new ResolveFieldContext<object>();
            var userContext= new RequestContext();
            var globalArguments = new Dictionary<string, object>();
            DateTime asOf = DateTime.Now;
            userContext.GlobalArguments = globalArguments;
            context.UserContext = userContext;
            TemporalGraphType<object>.SetAsOfGlobal(context, asOf);

            Assert.Equal(asOf, TemporalGraphType<object>.GetAsOfGlobal(context));
        }

        [Fact]
        public void GetAsOfGlobal_Gets_Null_If_AsOf_Not_Set()
        {
            var context = new ResolveFieldContext<object>();
            var userContext = new RequestContext();
            userContext.GlobalArguments = new Dictionary<string, object>();
            context.UserContext = userContext;

            Assert.Null(TemporalGraphType<object>.GetAsOfGlobal(context));
        }
    }
}