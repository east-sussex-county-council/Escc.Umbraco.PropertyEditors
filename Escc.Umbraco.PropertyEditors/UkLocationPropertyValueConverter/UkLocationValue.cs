using System.Runtime.Serialization;

namespace Escc.Umbraco.PropertyEditors.UKLocationPropertyValueConverter
{
    [DataContract]
    public class UkLocationValue
    {
        [DataMember(Name = "saon")]
        public string SecondaryAddressableObjectName { get; set; }

        [DataMember(Name = "paon")]
        public string PrimaryAddressableObjectName { get; set; }

        [DataMember(Name = "streetName")]
        public string StreetName { get; set; }

        [DataMember(Name = "locality")]
        public string Locality { get; set; }

        [DataMember(Name = "town")]
        public string Town { get; set; }

        [DataMember(Name = "administrativeArea")]
        public string AdministrativeArea { get; set; }

        [DataMember(Name = "postcode")]
        public string Postcode { get; set; }

        [DataMember(Name = "lat")]
        public string Latitude { get; set; }

        [DataMember(Name = "lon")]
        public string Longitude { get; set; }

        [DataMember(Name = "easting")]
        public string Easting { get; set; }

        [DataMember(Name = "northing")]
        public string Northing { get; set; }
    }
}