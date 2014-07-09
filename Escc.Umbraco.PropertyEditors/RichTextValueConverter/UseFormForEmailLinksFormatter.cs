using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using eastsussexgovuk.webservices.TextXhtml.HouseStyle;
using EsccWebTeam.HouseStyle;

namespace Escc.Umbraco.PropertyEditors.RichTextValueConverter
{
    /// <summary>
    /// Ensure email address links consistently point to our form rather than requiring the user has an email client.
    /// </summary>
    public class UseFormForEmailLinksFormatter : IHtmlFormatter
    {
        /// <summary>
        /// Formats the specified HTML.
        /// </summary>
        /// <param name="html">The HTML.</param>
        /// <returns></returns>
        public string Format(string html)
        {
            // As a first line of defence, email links may have been converted into entities, so check for both encoded and unencoded.
            const string mailto = "(mailto:|&#0109;&#0097;&#0105;&#0108;&#0116;&#0111;&#0058;)";
            const string anythingExceptEndAnchor = "((?!</a>).)*";

            html = Regex.Replace(html,
                    "(<a [^>]*href=\")" + mailto + "([^\"]*)(\"[^>]*>)" +
                    anythingExceptEndAnchor + "</a>",
                    match =>
                    {
                        // Get the email address, decoding from entities if necessary
                        var email = HttpUtility.HtmlDecode(match.Groups[3].Value);

                        // Get the link text. The regex used to match it allows for child tags, but matches
                        // character by character so we have to reassemble it. It may still be entities at this point.
                        var linkText = new StringBuilder();
                        foreach (Capture capture in match.Groups[5].Captures)
                        {
                            linkText.Append(capture.Value);
                        }

                        // If the link text is the email address we can't pass it in the URL as entities because that
                        // looks like a XSS attack. But we don't want to put an email address unencoded into the current
                        // page either. So instead, try to turn the first part of the email address into a real name.
                        var linkTextForUrl = HttpUtility.HtmlDecode(linkText.ToString());
                        if (linkTextForUrl.Contains("@"))
                        {
                            linkTextForUrl = linkTextForUrl.Substring(0, linkTextForUrl.IndexOf("@", StringComparison.Ordinal));
                            linkTextForUrl = Case.ToTitleCase(linkTextForUrl.Replace(".", " "));
                        }

                        // Get URL of form and HTML encode it as we reassable the link
                        var baseUrl = HttpContext.Current != null ? HttpContext.Current.Request.Url : new Uri("https://www.eastsussex.gov.uk");
                        var formUrl = UriFormatter.GetWebsiteEmailFormUri(email, linkTextForUrl, baseUrl).ToString();
                        return match.Groups[1].Value + HttpUtility.HtmlEncode(formUrl) + match.Groups[4].Value + linkText + "</a>";
                    });
            return html;
        }
    }
}
