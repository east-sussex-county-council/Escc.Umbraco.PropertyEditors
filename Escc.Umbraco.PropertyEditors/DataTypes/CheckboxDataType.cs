using System.Collections.Generic;
using Umbraco.Core.Models;
using Umbraco.Web.UI.Umbraco.Masterpages;

namespace Escc.Umbraco.PropertyEditors.DataTypes
{
    /// <summary>
    /// A checkbox data type for Umbraco which includes the option to be selected by default
    /// </summary>
    public static class CheckboxDataType
    {
        public const string DataTypeName = "Checkbox (true by default)";
        public const string PropertyEditorAlias = "Umbraco.TrueFalse";

        public static void CreateCheckboxDataType()
        {
            IDictionary<string, PreValue> preValues = new Dictionary<string, PreValue>()
            {
               {"defaultValue",new PreValue(-1,"1")}      
            };

            UmbracoDataTypeService.InsertDataType(DataTypeName, PropertyEditorAlias, DataTypeDatabaseType.Integer, preValues);
        }
    }
}