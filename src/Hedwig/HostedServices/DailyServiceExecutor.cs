using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Hedwig.HostedServices
{
	class DailyServiceExecutor : IHostedService
	{
		private readonly IServiceProvider _services;
		private Timer _timer;

		public DailyServiceExecutor(IServiceProvider services)
		{
			_services = services;
		}

		public Task StartAsync(CancellationToken cancellationToken)
		{
			_timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromDays(1));
			return Task.CompletedTask;
		}

		public void DoWork(Object state)
		{
			using (var scope = _services.CreateScope())
			{
				var serviceProvider = scope.ServiceProvider;
				var cdcReportGeneratorService = serviceProvider.GetRequiredService<CdcReportGeneratorScopedService>();

				cdcReportGeneratorService.TryGenerateReports().Wait();
			}
		}

		public async Task StopAsync(CancellationToken cancellationToken)
		{
			// Gracefully stop background services when app shuts down (We think?????)
			_timer?.Change(Timeout.Infinite, 0);
			await Task.CompletedTask;
		}
	}
}