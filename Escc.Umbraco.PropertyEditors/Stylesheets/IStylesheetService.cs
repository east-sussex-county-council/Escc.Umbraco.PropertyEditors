using System.Collections.Generic;
using System.IO;
using ExCSS;

namespace Escc.Umbraco.PropertyEditors.Stylesheets
{
    public interface IStylesheetService
    {
        /// <summary>
        /// Reads the text from a CSS file.
        /// </summary>
        /// <param name="filePathWithinApplication">The file path within application, eg /css/file.css</param>
        /// <returns></returns>
        /// <exception cref="FileNotFoundException"></exception>
        string ReadCssFromFile(string filePathWithinApplication);

        /// <summary>
        /// Parses CSS text into a set of properties which can be saved to Umbraco.
        /// Uses a custom -umbraco-stylesheet-property declaration in a CSS rule to specify a display name for the Umbraco property.
        /// </summary>
        /// <param name="css">The CSS.</param>
        /// <param name="parser">An ExCSS parser.</param>
        /// <returns></returns>
        /// <example>.example { -umbraco-stylesheet-property: 'Example property'; color: red; }</example>
        IEnumerable<UmbracoStylesheetProperty> ParseCss(string css, Parser parser);

        /// <summary>
        /// Creates the or update umbraco stylesheet.
        /// </summary>
        /// <param name="stylesheetName">The name of the stylesheet. Expected to be the same as the filename without the .css extension.</param>
        /// <param name="umbracoStylesheetProperties">The umbraco stylesheet properties.</param>
        void CreateOrUpdateUmbracoStylesheet(string stylesheetName, IEnumerable<UmbracoStylesheetProperty> umbracoStylesheetProperties);
    }
}