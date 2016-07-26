using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Core.Services;

namespace Escc.Umbraco.PropertyEditors.DataTypes
{
    /// <summary>
    /// Service for creating custom data types in Umbraco
    /// </summary>
    [Obsolete("Use Escc.Umbraco.Inception")]
    public static class UmbracoDataTypeService
    {
        /// <summary>
        /// Inserts the data type.
        /// </summary>
        /// <param name="dataTypeName">Name of the data type.</param>
        /// <param name="propertyEditorAlias">The property editor alias.</param>
        /// <param name="databaseType">Field type in the database.</param>
        /// <param name="preValues">The pre-values.</param>
        public static void InsertDataType(string dataTypeName, string propertyEditorAlias, DataTypeDatabaseType databaseType, IDictionary<string, PreValue> preValues)
        {
            var dataTypeService = ApplicationContext.Current.Services.DataTypeService;

            List<IDataTypeDefinition> propertyEditorAliases = dataTypeService.GetDataTypeDefinitionByPropertyEditorAlias(propertyEditorAlias).ToList(); // Obtains all the property editor alias names.

            bool isNameInDatabase = propertyEditorAliases.Exists(x => x.Name == dataTypeName); // Checks to see if the data type name exist.

            /* If not, create a new datatype based on the property editor used in the DataTypeDefinition below */
            if (!isNameInDatabase)
            {
                var dataTypeDefinition = new DataTypeDefinition(-1, propertyEditorAlias);
                dataTypeDefinition.Name = dataTypeName;
                dataTypeDefinition.DatabaseType = databaseType;
                dataTypeService.SaveDataTypeAndPreValues(dataTypeDefinition, preValues);
            }
        }
    }
}
