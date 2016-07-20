using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Json;
using Escc.EastSussexGovUK.UmbracoDocumentTypes.DataTypes;
using Escc.Umbraco.PropertyEditors.App_Plugins.Escc.Umbraco.PropertyEditors.RichTextPropertyEditor;
using Escc.Umbraco.PropertyEditors.DataTypes;
using Umbraco.Core.Models;

namespace Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
{
    /// <summary>
    /// Service to configure data types using the rich text editor
    /// </summary>
    public static class RichTextDataTypeService
    {
        /// <summary>
        /// Inserts the data type into Umbraco.
        /// </summary>
        /// <param name="dataTypeName">Name of the data type.</param>
        /// <param name="editorSettings">The editor settings.</param>
        /// <param name="hideLabel">if set to <c>true</c> [hide label].</param>
        public static void InsertDataType(string dataTypeName, RichTextPropertyEditorPreValues editorSettings, bool hideLabel = false)
        {
            Stream stream = null;
            try
            {
                stream = new MemoryStream();

                var serialiser = new DataContractJsonSerializer(typeof (RichTextPropertyEditorPreValues));
                serialiser.WriteObject(stream, editorSettings);
                stream.Position = 0;

                using (var reader = new StreamReader(stream))
                {
                    var preValues = new Dictionary<string, PreValue>()
                    {
                        {"hideLabel", new PreValue(-1, hideLabel ? "1" : "0")},
                        {"editor", new PreValue(-1, reader.ReadToEnd())},
                    };

                    UmbracoDataTypeService.InsertDataType(dataTypeName, PropertyEditorAliases.RichTextPropertyEditor, DataTypeDatabaseType.Ntext, preValues);
                }
            }
            finally
            {
                if (stream != null) stream.Dispose();
            }
        }
    }
}
