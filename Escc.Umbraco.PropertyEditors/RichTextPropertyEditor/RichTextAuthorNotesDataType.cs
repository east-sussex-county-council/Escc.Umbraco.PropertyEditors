using System.Collections.Generic;
using Escc.Umbraco.PropertyEditors.App_Plugins.Escc.Umbraco.PropertyEditors.RichTextPropertyEditor;

namespace Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    /// <summary>
    /// A more permissive customised rich text editor data type, intended for hidden author notes
    /// </summary>
    public static class RichTextAuthorNotesDataType
    {
        /// <summary>
        /// The display name of the data type
        /// </summary>
        public const string DataTypeName = "Rich text: author notes";

        /// <summary>
        /// Creates the data type.
        /// </summary>
        public static void CreateDataType()
        {
            var editorSettings = RichTextPropertyEditorDefaultSettings.CreateDefaultPreValues();

            editorSettings.toolbar = new List<string>(editorSettings.toolbar)
            {
                TinyMceButtons.StyleSelect,
                TinyMceButtons.Table,
                TinyMceButtons.Blockquote,
                TinyMceButtons.UmbracoMediaPicker,
                TinyMceButtons.Hr,
                TinyMceButtons.Strikethrough
            }.ToArray();

            editorSettings.stylesheets = new List<string>(editorSettings.stylesheets)
            {
                RichTextPropertyEditorDefaultSettings.StylesheetHeadings
            }.ToArray();

            editorSettings.validators = new Validator[0];

            RichTextDataTypeService.InsertDataType(DataTypeName, editorSettings);
        }
    }
}