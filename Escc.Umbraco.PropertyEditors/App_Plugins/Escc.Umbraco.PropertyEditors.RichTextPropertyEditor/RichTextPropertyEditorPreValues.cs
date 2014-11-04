
using System.Runtime.Serialization;

namespace Escc.Umbraco.PropertyEditors.App_Plugins.Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    /// <summary>
    /// Prevalues for an Umbraco data type using Escc.Umbraco.PropertyEditors.RichTextPropertyEditor, which can be serialised to the correct JSON format
    /// </summary>
    [DataContract]
    public class RichTextPropertyEditorPreValues
    {
        [DataMember]
        public string[] toolbar { get; set; }

        [DataMember]
        public string[] stylesheets { get; set; }

        [DataMember]
        public Dimensions dimensions { get; set; }

        [DataMember]
        public Validator[] validators { get; set; }

        [DataMember]
        public string[] formatters { get; set; }
    }

    /// <summary>
    /// Dimensions for the Escc.Umbraco.PropertyEditors.RichTextPropertyEditor which can be serialised to JSON
    /// </summary>
    [DataContract]
    public class Dimensions
    {
        [DataMember]
        public int height { get; set; }

        [DataMember]
        public int width { get; set; }
    }

    /// <summary>
    /// Validators for the Escc.Umbraco.PropertyEditors.RichTextPropertyEditor which can be serialised to JSON
    /// </summary>
    [DataContract]
    public class Validator
    {
        [DataMember]
        public string name { get; set; }

        [DataMember]
        public int max { get; set; }
    }
}