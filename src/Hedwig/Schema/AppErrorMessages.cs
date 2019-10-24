namespace Hedwig.Schema
{
    public static class AppErrorMessages
    {
        private static string NOT_FOUND_TMPL = "{0} with id {1} not found";
        public static string NOT_FOUND(string type, int id) {
            return string.Format(NOT_FOUND_TMPL, type, id);
        }
    }
}
