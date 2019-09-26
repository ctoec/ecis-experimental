using System.Threading;
using System;

namespace HedwigTests.Helpers
{
    public class Utilities
    {
        private const int WAIT_MSEC = 1500;
        public static DateTime GetAsOfWithSleep()
        {
            Thread.Sleep(WAIT_MSEC);
            DateTime asOf = DateTime.Now.ToUniversalTime();
            Thread.Sleep(WAIT_MSEC);
            return asOf;
        }
    }
}