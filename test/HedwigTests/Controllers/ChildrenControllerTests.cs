using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hedwig.Controllers;
using Hedwig.Repositories;
using Hedwig.Models;

namespace HedwigTests.Controllers
{
    public class ChildrenControllerTests
    {
        [Fact]
        public async Task Get_IncludeEntities_GetsChildrenForOrganization_WithEntities()
        {
            var organizationId = 1;
            var include = new string[] {"foo"};

            var _children = new Mock<IChildRepository>();

            var controller = new ChildrenController(_children.Object);

            await controller.Get(organizationId, include);
            _children.Verify(c => c.GetChildrenForOrganizationAsync(organizationId, include), Times.Once());
        }

        [Fact]
        public async Task Get_Id_IncludeEntities_GetsChildForOrganization_WithEntities()
        {
            var organizationId = 1;
            var include = new string [] {"foo"};

            var _children = new Mock<IChildRepository>();

            var controller = new ChildrenController(_children.Object);

            await controller.Get(Guid.NewGuid(), organizationId, include);
            _children.Verify(c => c.GetChildForOrganizationAsync(It.IsAny<Guid>(), organizationId, include), Times.Once);
        }

        [Theory]
        [InlineData(false, 0, true, typeof(CreatedAtActionResult))]
        [InlineData(true, 0, false, typeof(BadRequestResult))]
        [InlineData(false, 1, false, typeof(BadRequestResult))]
        [InlineData(false, 2, false, typeof(BadRequestResult))]
        public async Task Post_AddsChild_IfValid(
            bool hasId,
            int orgId, 
            bool shouldAddChild,
            Type resultType
        )
        {
            var organizationId = 1;

            var _children = new Mock<IChildRepository>();

            var controller = new ChildrenController(_children.Object);

            var child = new Child {
                Id = hasId ? Guid.NewGuid() : new Guid(),
                OrganizationId = orgId
            };

            var result = await controller.Post(organizationId, child);
            var times = shouldAddChild ? Times.Once() : Times.Never();
            _children.Verify(c => c.AddChild(It.IsAny<Child>()), times);
            Assert.IsType(resultType, result.Result);
        }

        [Theory]
        [InlineData(true, true, false, true, typeof(NoContentResult))]
        [InlineData(false, true, false, false, typeof(BadRequestResult))]
        [InlineData(true, false, false, false, typeof(BadRequestResult))]
        [InlineData(true, true, true, true, typeof(NotFoundResult))]
        public async Task Put_UpdatesChild_IfValid_AndExists(
            bool idsMatch,
            bool orgIdsMatch,
            bool shouldNotFind,
            bool shouldUpdateChild,
            Type resultType
        )
        {
            var organizationId = 1;

            var _children = new Mock<IChildRepository>();
            if(shouldNotFind) {
                _children.Setup(c => c.SaveChangesAsync())
                    .Throws(new DbUpdateConcurrencyException());
            }

            var controller = new ChildrenController(_children.Object);

            var pathId = Guid.NewGuid();
            var child = new Child();
            if(orgIdsMatch) child.OrganizationId = organizationId;
            if(idsMatch) child.Id = pathId;

            var result = await controller.Put(pathId, organizationId, child);
            var times = shouldUpdateChild ? Times.Once() : Times.Never();
            _children.Verify(c => c.UpdateChild(It.IsAny<Child>()), times);
            Assert.IsType(resultType, result.Result);
        }
    }
}