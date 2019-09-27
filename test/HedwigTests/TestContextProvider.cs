using System;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Hedwig.Data;

namespace HedwigTests
{
    public class TestContextProvider : IDisposable
    {
        private SqliteConnection _connection;
        public HedwigContext Context { get; private set; }

        public TestContextProvider()
        {
            _connection = new SqliteConnection("Data Source=:memory:");
            _connection.Open();
            var options = new DbContextOptionsBuilder<HedwigContext>()
                .UseSqlite(_connection)
                .Options;
            Context = new HedwigContext(options);
            Context.Database.EnsureCreated();
        }
        public void Dispose()
        {
            Context?.Dispose();
            _connection?.Dispose();
        }
    }
}