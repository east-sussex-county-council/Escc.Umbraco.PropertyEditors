using System;
using System.Globalization;
using System.IO;
using System.Runtime.Serialization.Json;
using Escc.AddressAndPersonalDetails;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace Escc.Umbraco.PropertyEditors.PersonNamePropertyEditor
{
    /// <summary>
    /// Automatically convert the JSON value of a property using a <c>PersonNamePropertyEditor</c> to a <see cref="PersonName"/>
    /// </summary>
    /// <seealso cref="Umbraco.Core.PropertyEditors.PropertyValueConverterBase" />
    [PropertyValueType(typeof(PersonName))]
    [PropertyValueCache(PropertyCacheValue.All, PropertyCacheLevel.Request)]
    public class PersonNamePropertyValueConverter : PropertyValueConverterBase
    {
        /// <summary>
        /// Specifies the alias of the property editor the converter acts upon.
        /// </summary>
        /// <param name="propertyType">Type of the property.</param>
        /// <returns></returns>
        public override bool IsConverter(PublishedPropertyType propertyType)
        {
            return propertyType.PropertyEditorAlias == PropertyEditorAliases.PersonNamePropertyEditor;
        }

        /// <summary>
        /// Converts the JSON property data to a <see cref="PersonName"/>, or <c>null</c> if empty.
        /// </summary>
        /// <param name="propertyType">Type of the property.</param>
        /// <param name="source">The source.</param>
        /// <param name="preview">if set to <c>true</c> [preview].</param>
        /// <returns></returns>
        public override object ConvertDataToSource(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source == null) return null;

            using (var stream = new MemoryStream(System.Text.Encoding.ASCII.GetBytes(source.ToString())))
            {
                var js = new DataContractJsonSerializer(typeof(PersonNameValue));
                var value = (PersonNameValue)js.ReadObject(stream);

                var data = new PersonName();
                if (!String.IsNullOrEmpty(value.Titles))
                {
                    data.Titles.AddRange(value.Titles.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
                }
                if (!String.IsNullOrEmpty(value.GivenNames))
                {
                    data.GivenNames.AddRange(value.GivenNames.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
                }
                data.FamilyName = value.FamilyName;
                if (!String.IsNullOrEmpty(value.Suffixes))
                {
                    data.Suffixes.AddRange(value.Suffixes.Split(new[] {' '}, StringSplitOptions.RemoveEmptyEntries));
                }

                return data.ToString().Length > 0 ? data : null;
            }
        }

        /// <summary>
        /// Converts the source to object.
        /// </summary>
        /// <param name="propertyType">Type of the property.</param>
        /// <param name="source">The source.</param>
        /// <param name="preview">if set to <c>true</c> [preview].</param>
        /// <returns></returns>
        public override object ConvertSourceToObject(PublishedPropertyType propertyType, object source, bool preview)
        {
            // source should come from ConvertSource and be the right type (or null) already
            return source;
        }

        /// <summary>
        /// Converts the source to x path.
        /// </summary>
        /// <param name="propertyType">Type of the property.</param>
        /// <param name="source">The source.</param>
        /// <param name="preview">if set to <c>true</c> [preview].</param>
        /// <returns></returns>
        public override object ConvertSourceToXPath(PublishedPropertyType propertyType, object source, bool preview)
        {
            // source should come from ConvertSource and be the right type (or null) already
            return source;
        }
    }
}