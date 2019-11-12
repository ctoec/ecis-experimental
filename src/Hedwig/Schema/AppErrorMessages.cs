namespace Hedwig.Schema
{
    public static class AppErrorMessages
    {
        private static string NOT_FOUND_TMPL = "{0} with id {1} not found";
        private static string BAD_REQUEST_TMPL = "Bad request for {0}";

        public static string NOT_FOUND(string type, string id) {
            return string.Format(NOT_FOUND_TMPL, type, id);
        }

        public static string NOT_FOUND(string type, int id) {
            return string.Format(NOT_FOUND_TMPL, type, id);
        }

        public static string BAD_REQUEST(string type) {
            return string.Format(BAD_REQUEST_TMPL, type);
        }
    }
}
