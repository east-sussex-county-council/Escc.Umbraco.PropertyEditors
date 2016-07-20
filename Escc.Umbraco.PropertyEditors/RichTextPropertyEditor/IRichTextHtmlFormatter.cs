
namespace Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    /// <summary>
    /// A formatter which has a chance to modify an HTML string
    /// </summary>
    public interface IRichTextHtmlFormatter
    {
        /// <summary>
        /// Formats the specified HTML.
        /// </summary>
        /// <param name="html">The HTML.</param>
        /// <returns></returns>
        string Format(string html);
    }
}
