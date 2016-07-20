using System.Collections.Generic;
using Umbraco.Core.Models;

namespace Escc.Umbraco.PropertyEditors.DataTypes
{
    /// <summary>
    /// A data type which validates email addresses
    /// </summary>
    public static class EmailAddressDataType
    {
        public const string DataTypeName = "Email address";
        public const string PropertyEditorAlias = PropertyEditorAliases.EmailAddressPropertyEditor;

        /// <summary>
        /// Creates the data type in Umbraco.
        /// </summary>
        public static void CreateDataType()
        {
            UmbracoDataTypeService.InsertDataType(DataTypeName, PropertyEditorAlias, DataTypeDatabaseType.Nvarchar, new Dictionary<string, PreValue>());
        }
    }
}