using System;
using System.Text.RegularExpressions;

namespace Escc.Umbraco.PropertyEditors.RichTextValueConverter
{
    public class TinyMceEmbedClassFormatter : IHtmlFormatter
    {
        public string Format(string html)
        {
            return String.IsNullOrEmpty(html) ? html : Regex.Replace(html, "<span class=\"embed\"><a ([^>]*)>(.*?)</a></span>", "<a class=\"embed\" $1>$2</a>");
        }
    }
}
