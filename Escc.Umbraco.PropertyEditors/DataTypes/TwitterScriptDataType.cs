using System;
using System.Collections.Generic;
using Umbraco.Core.Models;
using Umbraco.Inception.Attributes;

namespace Escc.Umbraco.PropertyEditors.DataTypes
{
    /// <summary>
    /// A data type which validates Twitter widget scripts
    /// </summary>
    [UmbracoDataType(DataTypeName, PropertyEditorAlias, null, DataTypeDatabaseType.Ntext)]
    public static class TwitterScriptDataType
    {
        public const string DataTypeName = "Twitter widget script";
        public const string PropertyEditorAlias = PropertyEditorAliases.TwitterScriptPropertyEditor;

        /// <summary>
        /// Creates the data type in Umbraco.
        /// </summary>
        [Obsolete("Use Escc.Umbraco.Inception")]
        public static void CreateDataType()
        {
            UmbracoDataTypeService.InsertDataType(DataTypeName, PropertyEditorAlias, DataTypeDatabaseType.Ntext, new Dictionary<string, PreValue>());
        }
    }
}