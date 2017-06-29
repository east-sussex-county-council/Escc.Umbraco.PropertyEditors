using System.Runtime.Serialization;

namespace Escc.Umbraco.PropertyEditors.PersonNamePropertyEditor
{
    [DataContract]
    public class PersonNameValue
    {
        [DataMember(Name = "titles")]
        public string Titles { get; set; }

        [DataMember(Name = "givenNames")]
        public string GivenNames { get; set; }

        [DataMember(Name = "familyName")]
        public string FamilyName { get; set; }

        [DataMember(Name = "suffixes")]
        public string Suffixes { get; set; }
    }
}