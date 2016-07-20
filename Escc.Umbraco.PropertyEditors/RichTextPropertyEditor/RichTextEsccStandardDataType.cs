
namespace Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    /// <summary>
    /// A customised rich text editor data type with ESCC formatters and validators
    /// </summary>
    public static class RichTextEsccStandardDataType
    {
        /// <summary>
        /// The display name of the data type
        /// </summary>
        public const string DataTypeName = "Rich text: ESCC standard";

        /// <summary>
        /// Creates the data type.
        /// </summary>
        public static void CreateDataType()
        {
            var editorSettings = RichTextPropertyEditorDefaultSettings.CreateDefaultPreValues();

            RichTextDataTypeService.InsertDataType(DataTypeName, editorSettings);
        }
    }
}