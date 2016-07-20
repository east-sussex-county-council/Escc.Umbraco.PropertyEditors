using Escc.Umbraco.PropertyEditors.App_Plugins.Escc.Umbraco.PropertyEditors.RichTextPropertyEditor;

namespace Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    /// <summary>
    /// Defaults and string values for configuring an instance of Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
    /// </summary>
    public static class RichTextPropertyEditorDefaultSettings
    {
        /// <summary>
        /// Standard styles for text in the TinyMCE editor window.
        /// </summary>
        public const string StylesheetTinyMceContent = "TinyMCE-Content";

        /// <summary>
        /// Stylesheet to add headings to the TinyMCE style selector dropdown.
        /// </summary>
        public const string StylesheetHeadings = "TinyMCE-StyleSelector-Headings";

        /// <summary>
        /// Creates a default set of pre-values applicable to most ESCC rich text editors.
        /// </summary>
        /// <returns></returns>
        public static RichTextPropertyEditorPreValues CreateDefaultPreValues()
        {
            var preValues = new RichTextPropertyEditorPreValues();

            preValues.toolbar = new[]
            {
                TinyMceButtons.RemoveFormat,
                TinyMceButtons.Undo,
                TinyMceButtons.Redo,
                TinyMceButtons.Cut,
                TinyMceButtons.Copy,
                TinyMceButtons.Bold,
                TinyMceButtons.BulletedList,
                TinyMceButtons.Numberedlist,
                TinyMceButtons.Link,
                TinyMceButtons.Unlink
            };

            preValues.stylesheets = new[]
            {
                StylesheetTinyMceContent
            };

            preValues.validators = new Validator[]
            {
                new Validator() { name = RichTextValidators.DoNotLinkToClickHere}, 
                new Validator() { name = RichTextValidators.DoNotLinkToHere},
                new Validator() { name = RichTextValidators.DoNotStartLinksWithVisit},
                new Validator() { name = RichTextValidators.DoNotLinkToMore},
                new Validator() { name = RichTextValidators.DoNotTypeInCapitalLetters},
                new Validator() { name = RichTextValidators.DoNotUseUrlAsLinkText},
                new Validator() { name = RichTextValidators.DoNotLinkToDocuments}
            };

            preValues.formatters = new[]
            {
                RichTextFormatters.ConvertNonBreakingSpacesToSpaces,
                RichTextFormatters.RemoveEmptyLinks,
                RichTextFormatters.RemoveEmptyBlockElements,
                RichTextFormatters.RemoveLinkTargets,
                RichTextFormatters.RemoveTagsWithMissingRequiredAttributes,
                RichTextFormatters.AutoCorrectCommonStrings,
                RichTextFormatters.MoveFullstopsOutsideLinks,
                RichTextFormatters.MoveTrailingSpacesOutsideLinks,
                RichTextFormatters.UseSmartQuotes,
                RichTextFormatters.ConvertHyphensToEnDashes,
                RichTextFormatters.ConvertDotsToEllipsis,
                RichTextFormatters.StartHeadingsWithACaptialLetter,
                RichTextFormatters.StartContentWithACaptialLetter
            };

            preValues.dimensions = new Dimensions()
            {
                height = 300
            };

            return preValues;
        }
    }
}