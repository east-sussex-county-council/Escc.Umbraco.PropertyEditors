using System.Collections.Generic;
using Escc.Umbraco.PropertyEditors.DataTypes;
using Umbraco.Core.Models;

namespace Escc.Umbraco.PropertyEditors.UkLocationPropertyEditor
{
    /// <summary>
    /// A UK location data type for Umbraco to get a UK address and geocoordinates
    /// </summary>
    public static class UkLocationDataType
    {
        public const string DataTypeName = "UK location";
        public const string PropertyEditorAlias = PropertyEditorAliases.UkLocationPropertyEditor;

        /// <summary>
        /// Creates the data type in Umbraco.
        /// </summary>
        /// <param name="dataTypeName">Name of the data type, if using other parameters to create a custom version.</param>
        /// <param name="showAddress">if set to <c>true</c> show address fields.</param>
        /// <param name="showLatitudeLongitude">if set to <c>true</c> show latitude and longitude fields.</param>
        /// <param name="showEastingNorthing">if set to <c>true</c> show easting and northing fields.</param>
        public static void CreateDataType(string dataTypeName = DataTypeName, bool showAddress = true, bool showLatitudeLongitude = true, bool showEastingNorthing = true)
        {
            IDictionary<string, PreValue> preValues = new Dictionary<string, PreValue>()
            {
               {"address",new PreValue(-1,showAddress ? "1" : "0")},
               {"latLon",new PreValue(-1,showLatitudeLongitude ? "1" : "0")},
               {"eastingNorthing",new PreValue(-1,showEastingNorthing ? "1" : "0")}
            };

            UmbracoDataTypeService.InsertDataType(dataTypeName, PropertyEditorAliases.UkLocationPropertyEditor, DataTypeDatabaseType.Ntext, preValues);
        }
    }
}