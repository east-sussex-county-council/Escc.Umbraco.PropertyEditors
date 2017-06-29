using System.Collections.Generic;
using Escc.Umbraco.PropertyEditors.DataTypes;
using Umbraco.Core.Models;

namespace Escc.Umbraco.PropertyEditors.PersonNamePropertyEditor
{
    /// <summary>
    /// A person name data type for Umbraco compliant with the UK Government Arrdress and Personal Details standard
    /// </summary>
    public static class PersonNameDataType
    {
        public const string DataTypeName = "Person name";
        public const string PropertyEditorAlias = PropertyEditorAliases.PersonNamePropertyEditor;

        /// <summary>
        /// Creates the data type in Umbraco.
        /// </summary>
        /// <param name="dataTypeName">Name of the data type, if using other parameters to create a custom version.</param>
        public static void CreateDataType(string dataTypeName = DataTypeName)
        {
            IDictionary<string, PreValue> preValues = new Dictionary<string, PreValue>();
            UmbracoDataTypeService.InsertDataType(dataTypeName, PropertyEditorAliases.PersonNamePropertyEditor, DataTypeDatabaseType.Ntext, preValues);
        }
    }
}