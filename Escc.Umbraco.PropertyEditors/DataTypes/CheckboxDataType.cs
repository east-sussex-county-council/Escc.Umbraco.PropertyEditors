using System;
using System.Collections.Generic;
using Umbraco.Core.Models;
using Umbraco.Inception.Attributes;
using Umbraco.Inception.BL;

namespace Escc.Umbraco.PropertyEditors.DataTypes
{
    /// <summary>
    /// A checkbox data type for Umbraco which includes the option to be selected by default
    /// </summary>
    [UmbracoDataType(DataTypeName, PropertyEditorAlias, typeof(CheckboxDataType), DataTypeDatabaseType.Nvarchar)]
    public class CheckboxDataType : IPreValueProvider
    {
        public const string DataTypeName = "Checkbox (true by default)";
        public const string PropertyEditorAlias = "Umbraco.TrueFalse";

        [Obsolete("Use Escc.Umbraco.Inception")]
        public static void CreateCheckboxDataType()
        {
            var instance = new CheckboxDataType();
            UmbracoDataTypeService.InsertDataType(DataTypeName, PropertyEditorAlias, DataTypeDatabaseType.Integer, instance.PreValues);
        }

        public IDictionary<string, PreValue> PreValues => new Dictionary<string, PreValue>()
        {
            {"defaultValue",new PreValue(-1,"1")}
        };
    }
}