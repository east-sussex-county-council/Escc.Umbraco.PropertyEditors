using System.Collections.Generic;
using Escc.Umbraco.PropertyEditors;
using Escc.Umbraco.PropertyEditors.DataTypes;
using Umbraco.Core.Models;

namespace Escc.EastSussexGovUK.UmbracoDocumentTypes.DataTypes
{
    /// <summary>
    /// A data type which validates Twitter widget scripts
    /// </summary>
    public static class TwitterScriptDataType
    {
        public const string DataTypeName = "Twitter widget script";
        public const string PropertyEditorAlias = PropertyEditorAliases.TwitterScriptPropertyEditor;

        /// <summary>
        /// Creates the data type in Umbraco.
        /// </summary>
        public static void CreateDataType()
        {
            UmbracoDataTypeService.InsertDataType(DataTypeName, PropertyEditorAlias, DataTypeDatabaseType.Ntext, new Dictionary<string, PreValue>());
        }
    }
}