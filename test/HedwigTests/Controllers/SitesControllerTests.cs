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
    public class SitesControllerTests
    {
        // [Fact]
        // public async Task Get_GetsSitesForOrganization()
        // {
        //     var _sites = new Mock<ISiteRepository>();
        //     var _enrollments = new Mock<IEnrollmentRepository>();
        //     var _children = new Mock<IChildRepository>();
        //     var _families = new Mock<IFamilyRepository>();

        //     var controller = new SitesController(_sites.Object, _enrollments.Object, _children.Object, _families.Object);

        //     var orgId = 1;
        //     await controller.Get(orgId);

        //     _sites.Verify(s => s.GetSitesForOrganizationAsync(orgId), Times.Once());
        // }

        // [Theory]
        // [InlineData(new string[]{}, false, false, false, false, false)]
        // [InlineData(new string[]{"enrollments"}, true, false, false, false, false)]
        // [InlineData(new string[]{"child"}, false, false, false, false, false)]
        // [InlineData(new string[]{"family"}, false, false, false, false, false)]
        // [InlineData(new string[]{"determinations"}, false, false,  false, false, false)]
        // [InlineData(new string[]{"fundings"}, false, false, false, false, false)]
        // [InlineData(new string[]{"enrollments", "child", "family"}, true, false, true, true, false)]
        // [InlineData(new string[]{"enrollments", "child", "determinations"}, true, false, true, false, false)]
        // [InlineData(new string[]{"enrollments", "child", "family", "determinations"}, true, false, true, true, true)]
        // [InlineData(new string[]{"enrollments", "family", "determinations"}, true, false, false, false, false)]
        // [InlineData(new string[]{"enrollments", "fundings", "family", "determinations"},true, true, false, false, false)]
        // [InlineData(new string[]{"enrollments", "fundings", "child", "family", "determinations"}, true, true, true, true, true)]
        // public async Task Get_IncludeEntities_GetsSiteForOrganization_WithEntities(
        //     string[] include,
        //     bool shouldGetEnrollments,
        //     bool includeFundings,
        //     bool shouldGetChild,
        //     bool shouldGetFamily,
        //     bool includeDeterminations
        // )
        // {
        //     var orgId = 1;
        //     var siteId = 1;
        //     var _sites = new Mock<ISiteRepository>();
        //     _sites.Setup(s => s.GetSiteForOrganizationAsync(siteId, orgId))
        //         .ReturnsAsync(new Site{Id = siteId});
        //     var _enrollments = new Mock<IEnrollmentRepository>();
        //     _enrollments.Setup(e => e.GetEnrollmentsForSiteAsync(siteId, It.IsAny<bool>()))
        //         .ReturnsAsync(new List<Enrollment> { new Enrollment {ChildId = Guid.NewGuid() }});
        //     var _children = new Mock<IChildRepository>();
        //     _children.Setup(c => c.GetChildrenByIdsAsync(It.IsAny<IEnumerable<Guid>>()))
        //         .ReturnsAsync(new List<Child> { new Child {FamilyId = 1 }});
        //     var _families = new Mock<IFamilyRepository>();

        //     var controller = new SitesController(_sites.Object, _enrollments.Object, _children.Object, _families.Object);

        //     await controller.Get(siteId, orgId, include);

        //     _sites.Verify(s => s.GetSiteForOrganizationAsync(siteId, orgId));
        //     var etimes = shouldGetEnrollments ? Times.Once() : Times.Never();
        //     _enrollments.Verify(e => e.GetEnrollmentsForSiteAsync(siteId, includeFundings), etimes);
        //     var ctimes = shouldGetChild ? Times.Once() : Times.Never();
        //     _children.Verify(c => c.GetChildrenByIdsAsync(It.IsAny<IEnumerable<Guid>>()), ctimes);
        //     var ftimes = shouldGetFamily ? Times.Once() : Times.Never();
        //     _families.Verify(f => f.GetFamiliesByIdsAsync(It.IsAny<IEnumerable<int>>(), includeDeterminations), ftimes);

        // }
    }
}