using System;
using System.Text.RegularExpressions;
using eastsussexgovuk.webservices.TextXhtml.HouseStyle;

namespace Escc.Umbraco.PropertyEditors.RichTextValueConverter
{
    public class EncodeEmailAddressFormatter : IHtmlFormatter
    {
        /// <summary>
        /// Formats the specified HTML.
        /// </summary>
        /// <param name="html">The HTML.</param>
        /// <returns></returns>
        public string Format(string html)
        {
            return String.IsNullOrEmpty(html)
                ? html
                : Regex.Replace(html, @"([A-Za-z0-9-.]+@[A-Za-z0-9-.]+\.[A-Za-z]+)",
                    match => UriFormatter.ConvertEmailToEntities(match.Groups[1].Value));
        }
    }
}
