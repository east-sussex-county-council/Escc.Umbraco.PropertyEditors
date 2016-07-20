using System;
using System.Text.RegularExpressions;
using Escc.Html;

namespace Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    public class EncodeEmailAddressFormatter : IRichTextHtmlFormatter
    {
        /// <summary>
        /// Formats the specified HTML.
        /// </summary>
        /// <param name="html">The HTML.</param>
        /// <returns></returns>
        public string Format(string html)
        {
            var encoder = new HtmlEncoder();
            return String.IsNullOrEmpty(html)
                ? html
                : Regex.Replace(html, @"([A-Za-z0-9-.]+@[A-Za-z0-9-.]+\.[A-Za-z]+)",
                    match => encoder.HtmlEncodeEveryCharacter(match.Groups[1].Value));
        }
    }
}
