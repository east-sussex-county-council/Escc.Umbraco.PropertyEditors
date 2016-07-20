﻿using System.Collections.Generic;
using Umbraco.Core.Models;

namespace Escc.Umbraco.PropertyEditors.DataTypes
{
    /// <summary>
    /// A data type which validates and formats phone numbers
    /// </summary>
    public static class PhoneNumberDataType
    {
        public const string DataTypeName = "Phone number";
        public const string PropertyEditorAlias = PropertyEditorAliases.PhonePropertyEditor;

        /// <summary>
        /// Creates the data type in Umbraco.
        /// </summary>
        public static void CreateDataType()
        {
            UmbracoDataTypeService.InsertDataType(DataTypeName, PropertyEditorAlias, DataTypeDatabaseType.Nvarchar, new Dictionary<string, PreValue>());
        }
    }
}