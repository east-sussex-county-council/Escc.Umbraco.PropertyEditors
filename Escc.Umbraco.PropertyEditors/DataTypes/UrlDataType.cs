using System.Collections.Generic;
using Escc.Umbraco.PropertyEditors;
using Escc.Umbraco.PropertyEditors.DataTypes;
using Umbraco.Core.Models;

namespace Escc.EastSussexGovUK.UmbracoDocumentTypes.DataTypes
{
    /// <summary>
    /// A URL data type for Umbraco, with optional extra limits
    /// </summary>
    public static class UrlDataType
    {
        public const string DataTypeName = "URL";
        public const string PropertyEditorAlias = PropertyEditorAliases.UrlPropertyEditor;

        /// <summary>
        /// Creates the data type in Umbraco.
        /// </summary>
        /// <param name="dataTypeName">Name of the data type, if using other parameters to create a custom version.</param>
        /// <param name="allowRootRelativeUrls">if set to <c>true</c> allow root relative urls.</param>
        /// <param name="pattern">An additional regular expression to validate against.</param>
        public static void CreateDataType(string dataTypeName = DataTypeName, bool allowRootRelativeUrls = true, string pattern = "")
        {
            IDictionary<string, PreValue> preValues = new Dictionary<string, PreValue>()
            {
               {"rootRelative",new PreValue(-1,allowRootRelativeUrls ? "1" : "0")},
               {"pattern",new PreValue(-1,pattern)}      
            };

            UmbracoDataTypeService.InsertDataType(dataTypeName, PropertyEditorAliases.UrlPropertyEditor, DataTypeDatabaseType.Nvarchar, preValues);
        }
    }
}