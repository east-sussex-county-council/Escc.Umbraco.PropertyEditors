using Escc.Elibrary;

namespace Escc.Umbraco.PropertyEditors.RichTextValueConverter
{
    public class ElibraryLinkFormatter : IHtmlFormatter
    {
        /// <summary>
        /// Formats the specified HTML.
        /// </summary>
        /// <param name="html">The HTML.</param>
        /// <returns></returns>
        public string Format(string html)
        {
            return ElibraryLinkProxy.ParseAndRewriteElibraryLinks(html);
        }
    }
}
