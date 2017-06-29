using System;
using System.Collections.Generic;
using Umbraco.Core.Models;
using Umbraco.Inception.Attributes;

namespace Escc.Umbraco.PropertyEditors.DataTypes
{
    /// <summary>
    /// A data type which validates and formats phone numbers
    /// </summary>
    [UmbracoDataType(DataTypeName, PropertyEditorAlias, null, DataTypeDatabaseType.Nvarchar)]
    public static class PhoneNumberDataType
    {
        public const string DataTypeName = "Phone number";
        public const string PropertyEditorAlias = PropertyEditorAliases.PhonePropertyEditor;

        /// <summary>
        /// Creates the data type in Umbraco.
        /// </summary>
        [Obsolete("Use Escc.Umbraco.Inception")]
        public static void CreateDataType()
        {
            UmbracoDataTypeService.InsertDataType(DataTypeName, PropertyEditorAlias, DataTypeDatabaseType.Nvarchar, new Dictionary<string, PreValue>());
        }
    }
}