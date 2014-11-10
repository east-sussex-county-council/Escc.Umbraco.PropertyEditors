
namespace Escc.Umbraco.PropertyEditors.App_Plugins.Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    /// <summary>
    /// Standard strings to identify validators which can check rich text content before it is saved
    /// </summary>
    public class RichTextValidators
    {
        public const string DoNotLinkToClickHere = "clickHere";
        public const string DoNotLinkToHere = "linkToHere";
        public const string DoNotStartLinksWithVisit = "visit";
        public const string DoNotLinkToMore = "more";
        public const string DoNotTypeInCapitalLetters = "allCaps";
        public const string DoNotUseUrlAsLinkText = "urlAsLinkText";
        public const string OnlyContainsLinks = "onlyLinks";
        public const string DoNotLinkToDocuments = "noDocuments";
        public const string MaximumWordCount = "maximumWords";
    }
}