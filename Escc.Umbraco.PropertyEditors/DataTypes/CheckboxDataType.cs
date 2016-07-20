using System.Collections.Generic;
using Escc.EastSussexGovUK.UmbracoDocumentTypes.DataTypes;
using Umbraco.Core.Models;

namespace Escc.Umbraco.PropertyEditors.DataTypes
{
    /// <summary>
    /// A checkbox data type for Umbraco which includes the option to be selected by default
    /// </summary>
    public static class CheckboxDataType
    {
        public const string DataTypeName = "Checkbox (true by default)";
        public const string PropertyEditorAlias = PropertyEditorAliases.BooleanPropertyEditor;

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