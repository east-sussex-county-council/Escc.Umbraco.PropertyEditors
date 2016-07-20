using Escc.Umbraco.PropertyEditors.Stylesheets;
using ExCSS;

namespace Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    /// <summary>
    /// Service to add the standard stylesheets for TinyMCE to Umbraco
    /// </summary>
    public static class TinyMceStylesheets
    {
        /// <summary>
        /// Add the standard stylesheets for TinyMCE to Umbraco.
        /// </summary>
        /// <param name="stylesheetService">The service for parsing and registering stylesheets.</param>
        /// <param name="parser">The CSS parser.</param>
        public static void CreateStylesheets(IStylesheetService stylesheetService, Parser parser)
        {
            CreateStylesheet("TinyMCE-Content", stylesheetService, parser);
            CreateStylesheet("TinyMCE-StyleSelector-Headings", stylesheetService, parser);
        }

        private static void CreateStylesheet(string stylesheetName, IStylesheetService stylesheetService, Parser parser)
        {
            var css = stylesheetService.ReadCssFromFile("css/" + stylesheetName + ".css");
            var properties = stylesheetService.ParseCss(css, parser);
            stylesheetService.CreateOrUpdateUmbracoStylesheet(stylesheetName, properties);
        }
    }
}
