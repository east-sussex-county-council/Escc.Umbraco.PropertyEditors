using System.Collections.Generic;
using Escc.Umbraco.PropertyEditors.DataTypes;
using Umbraco.Core.Models;
using Umbraco.Core.PropertyEditors;
using Umbraco.Inception.Attributes;

namespace Escc.Umbraco.PropertyEditors.PersonNamePropertyEditor
{
    /// <summary>
    /// A person name data type for Umbraco compliant with the UK Government Arrdress and Personal Details standard
    /// </summary>
    [UmbracoDataType(DataTypeName, PropertyEditorAlias, null, DataTypeDatabaseType.Ntext)]
    public static class PersonNameDataType
    {
        public const string DataTypeName = "Person name";
        public const string PropertyEditorAlias = PropertyEditorAliases.PersonNamePropertyEditor;
    }
}