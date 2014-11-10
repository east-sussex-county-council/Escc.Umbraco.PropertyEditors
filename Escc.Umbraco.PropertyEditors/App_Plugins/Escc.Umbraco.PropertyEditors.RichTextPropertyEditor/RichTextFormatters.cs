
namespace Escc.Umbraco.PropertyEditors.App_Plugins.Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    /// <summary>
    /// Standard strings used to identify formatters which can be applied to rich text content as it is saved
    /// </summary>
    public class RichTextFormatters
    {
        public const string ConvertNonBreakingSpacesToSpaces = "nbsp";
        public const string RemoveEmptyBlockElements = "removeEmptyBlock";
        public const string RemoveLinkTargets = "removeTarget";
        public const string RemoveTagsWithMissingRequiredAttributes = "removeIfMissingAttribute";
        public const string AutoCorrectCommonStrings = "autocorrect";
        public const string MoveFullstopsOutsideLinks = "fullstopsOutsideLinks";
        public const string MoveTrailingSpacesOutsideLinks = "spacesOutsideLinks";
        public const string UseSmartQuotes = "smartQuotes";
        public const string ConvertHyphensToEnDashes = "enDashes";
        public const string ConvertDotsToEllipsis = "ellipsis";
        public const string StartHeadingsWithACaptialLetter = "startHeadingsWithCapital";
        public const string StartContentWithACaptialLetter = "startContentWithCapital";
        public const string FormatContentAsTwoListsOfLinks = "twoListsOfLinks";
    }
}