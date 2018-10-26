using System;
using System.Globalization;
using System.IO;
using System.Runtime.Serialization.Json;
using Escc.AddressAndPersonalDetails;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace Escc.Umbraco.PropertyEditors.UkLocationPropertyEditor
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
            return propertyType.PropertyEditorAlias == "Escc.Umbraco.PropertyEditors.UkLocationPropertyEditor";
        }

        public override object ConvertDataToSource(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source == null) return null;

            using (var stream = new MemoryStream(System.Text.Encoding.ASCII.GetBytes(source.ToString())))
            {
                var js = new DataContractJsonSerializer(typeof(UkLocationValue));
                var value = (UkLocationValue)js.ReadObject(stream);

                var data = new AddressInfo
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
                };

                ParseCoordinates(value, data);

                return data;
            }
        }

        private static void ParseCoordinates(UkLocationValue value, AddressInfo data)
        {
            if (!String.IsNullOrEmpty(value.Latitude))
            {
                double result;
                if (Double.TryParse(value.Latitude, NumberStyles.Any, CultureInfo.InvariantCulture, out result))
                {
                    data.GeoCoordinate.Latitude = result;
                }
            }
            if (!String.IsNullOrEmpty(value.Longitude))
            {
                double result;
                if (Double.TryParse(value.Longitude, NumberStyles.Any, CultureInfo.InvariantCulture, out result))
                {
                    data.GeoCoordinate.Longitude = result;
                }
            }
            if (!String.IsNullOrEmpty(value.Easting))
            {
                int result;
                if (Int32.TryParse(value.Easting, NumberStyles.Any, CultureInfo.InvariantCulture, out result))
                {
                    data.GeoCoordinate.Easting = result;
                }
            }
            if (!String.IsNullOrEmpty(value.Northing))
            {
                int result;
                if (Int32.TryParse(value.Northing, NumberStyles.Any, CultureInfo.InvariantCulture, out result))
                {
                    data.GeoCoordinate.Northing = result;
                }
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