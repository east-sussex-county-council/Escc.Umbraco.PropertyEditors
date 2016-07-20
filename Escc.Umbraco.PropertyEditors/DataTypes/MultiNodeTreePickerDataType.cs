using System.Collections.Generic;
using Escc.Umbraco.PropertyEditors;
using Escc.Umbraco.PropertyEditors.DataTypes;
using Umbraco.Core.Models;

namespace Escc.EastSussexGovUK.UmbracoDocumentTypes.DataTypes
{
    /// <summary>
    /// A multi-node tree picker data type for Umbraco
    /// </summary>
    public static class MultiNodeTreePickerDataType
    {
        public const string DataTypeName = "Multi-node tree picker";
        public const string PropertyEditorAlias = "Umbraco.MultiNodeTreePicker";

        /// <summary>
        /// Creates the data type in Umbraco.
        /// </summary>
        public static void CreateDataType()
        {
            IDictionary<string, PreValue> preValues = new Dictionary<string, PreValue>()
            {
                { "startNode", new PreValue(-1, "{\"type\": \"content\"}", 1)},
                { "filter", new PreValue(-1, null, 2) },
                { "minNumber", new PreValue(-1, null,3) },
                { "maxNumber", new PreValue(-1, null, 4) }
            };

            UmbracoDataTypeService.InsertDataType(DataTypeName, PropertyEditorAlias, DataTypeDatabaseType.Nvarchar, preValues);
        }
    }
}