using System;
using System.Text.RegularExpressions;

namespace Escc.Umbraco.PropertyEditors.RichTextPropertyValueConverter
{
    /// <summary>
    /// Umbraco's configuration of TinyMCE means that, when a class is applied to a link, it is actually applied to a span element surrounding the link.
    /// We want to allow an 'embed' class to be used on a link. This formatter combines the span with the link for presentation.
    /// </summary>
    public class TinyMceEmbedClassFormatter : IRichTextHtmlFormatter
    {
        /// <summary>
        /// Formats the specified HTML.
        /// </summary>
        /// <param name="html">The HTML.</param>
        /// <returns></returns>
        public string Format(string html)
        {
            return String.IsNullOrEmpty(html) ? html : Regex.Replace(html, "<span class=\"embed\"><a ([^>]*)>(.*?)</a></span>", "<a class=\"embed\" $1>$2</a>");
        }
    }
}
