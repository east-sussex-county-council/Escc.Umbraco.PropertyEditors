using System.IO;
using System.Runtime.Serialization.Json;
using Escc.AddressAndPersonalDetails;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace Escc.Umbraco.PropertyEditors.UKLocationPropertyValueConverter
{
    [PropertyValueType(typeof(AddressInfo))]
    [PropertyValueCache(PropertyCacheValue.All, PropertyCacheLevel.Request)]
    public class UkLocationPropertyValueConverter : PropertyValueConverterBase
    {
        /// <summary>
        /// Specifies the alias of the property editor the converter acts upon.
        /// </summary>
        /// <param name="propertyType">Type of the property.</param>
        /// <returns></returns>
        public override bool IsConverter(PublishedPropertyType propertyType)
        {
            return propertyType.PropertyEditorAlias == PropertyEditorAliases.UkLocationPropertyEditor;
        }

        public override object ConvertDataToSource(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source == null) return null;

            using (var stream = new MemoryStream(System.Text.Encoding.ASCII.GetBytes(source.ToString())))
            {
                var js = new DataContractJsonSerializer(typeof(UkLocationValue));
                var value = (UkLocationValue)js.ReadObject(stream);

                return new AddressInfo
                {
                    BS7666Address = new BS7666Address()
                    {
                        Saon = value.SecondaryAddressableObjectName,
                        Paon = value.PrimaryAddressableObjectName,
                        StreetName = value.StreetName,
                        Locality = value.Locality,
                        Town = value.Town,
                        AdministrativeArea = value.AdministrativeArea,
                        Postcode = value.Postcode
                    },

                    GeoCoordinate = new GeoCoordinate()
                    {
                        Latitude = value.Latitude,
                        Longitude = value.Longitude,
                        Easting = value.Easting,
                        Northing = value.Northing
                    }
                };
            }
        }

        public override object ConvertSourceToObject(PublishedPropertyType propertyType, object source, bool preview)
        {
            // source should come from ConvertSource and be the right type (or null) already
            return source;
        }

        public override object ConvertSourceToXPath(PublishedPropertyType propertyType, object source, bool preview)
        {
            // source should come from ConvertSource and be the right type (or null) already
            return source;
        }
    }
}