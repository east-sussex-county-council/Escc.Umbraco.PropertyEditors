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
        public double Latitude { get; set; }

        [DataMember(Name = "lon")]
        public double Longitude { get; set; }

        [DataMember(Name = "easting")]
        public int Easting { get; set; }

        [DataMember(Name = "northing")]
        public int Northing { get; set; }
    }
}