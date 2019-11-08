using System.Threading;
using System;
using System.Text;

namespace HedwigTests.Helpers
{
    public class Utilities
    {
        private const int WAIT_MSEC = 1000;
        public static DateTime GetAsOfWithSleep()
        {
            Thread.Sleep(WAIT_MSEC);
            DateTime asOf = DateTime.Now.ToUniversalTime();
            Thread.Sleep(WAIT_MSEC);
            return asOf;
        }
    }
}