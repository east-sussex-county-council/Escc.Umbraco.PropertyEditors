using System.Collections.Generic;
using Umbraco.Core.Models;

namespace Escc.Umbraco.PropertyEditors.DataTypes
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