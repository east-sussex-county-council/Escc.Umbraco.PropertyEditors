using System;
using System.Collections.Generic;
using Umbraco.Core.Models;
using Umbraco.Inception.Attributes;
using Umbraco.Inception.BL;

namespace Escc.Umbraco.PropertyEditors.DataTypes
{
    /// <summary>
    /// A multi-node tree picker data type for Umbraco
    /// </summary>
    [UmbracoDataType(DataTypeName, PropertyEditorAlias, typeof(MultiNodeTreePickerDataType), DataTypeDatabaseType.Nvarchar)]
    public class MultiNodeTreePickerDataType : IPreValueProvider
    {
        public const string DataTypeName = "Multi-node tree picker";
        public const string PropertyEditorAlias = "Umbraco.MultiNodeTreePicker";

        /// <summary>
        /// Creates the data type in Umbraco.
        /// </summary>
        [Obsolete("Use Escc.Umbraco.Inception")]
        public static void CreateDataType()
        {
            var instance = new MultiNodeTreePickerDataType();
            UmbracoDataTypeService.InsertDataType(DataTypeName, PropertyEditorAlias, DataTypeDatabaseType.Nvarchar, instance.PreValues);
        }

        public IDictionary<string, PreValue> PreValues => new Dictionary<string, PreValue>()
        {
            {"startNode", new PreValue(-1, "{\"type\": \"content\"}", 1)},
            {"filter", new PreValue(-1, null, 2)},
            {"minNumber", new PreValue(-1, null, 3)},
            {"maxNumber", new PreValue(-1, null, 4)}
        };
    }
}