
namespace Escc.Umbraco.PropertyEditors.RichTextValueConverter
{
    /// <summary>
    /// A formatter which has a chance to modify an HTML string
    /// </summary>
    interface IHtmlFormatter
    {
        /// <summary>
        /// Formats the specified HTML.
        /// </summary>
        /// <param name="html">The HTML.</param>
        /// <returns></returns>
        string Format(string html);
    }
}
