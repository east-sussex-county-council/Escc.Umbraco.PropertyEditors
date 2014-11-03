
namespace Escc.Umbraco.PropertyEditors.App_Plugins.Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    /// <summary>
    /// Prevalues for an Umbraco data type using Escc.Umbraco.PropertyEditors.RichTextPropertyEditor, which can be serialised to the correct JSON format
    /// </summary>
    public class RichTextPropertyEditorPreValues
    {
        public string[] toolbar { get; set; }
        public string[] stylesheets { get; set; }
        public Dimensions dimensions { get; set; }
        public Validator[] validators { get; set; }
        public string[] formatters { get; set; }
    }

    /// <summary>
    /// Dimensions for the Escc.Umbraco.PropertyEditors.RichTextPropertyEditor which can be serialised to JSON
    /// </summary>
    public class Dimensions
    {
        public int height { get; set; }
        public int width { get; set; }
    }

    /// <summary>
    /// Validators for the Escc.Umbraco.PropertyEditors.RichTextPropertyEditor which can be serialised to JSON
    /// </summary>
    public class Validator
    {
        public string name { get; set; }
        public int max { get; set; }
    }
}