using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web.Templates;

namespace Escc.Umbraco.PropertyEditors.RichTextValueConverter
{
    /// <summary>
    /// A PropertyValueConverter for rich text saved in Umbraco, which runs formatters on the HTML before it is returned for display
    /// </summary>
    [PropertyValueType(typeof(string))]
    [PropertyValueCache(PropertyCacheValue.All, PropertyCacheLevel.Request)]
    public class RichTextPropertyValueConverter : PropertyValueConverterBase
    {
        /// <summary>
        /// Specifies the alias of the property editor the converter acts upon.
        /// </summary>
        /// <param name="propertyType">Type of the property.</param>
        /// <returns></returns>
        public override bool IsConverter(PublishedPropertyType propertyType)
        {
            return propertyType.PropertyEditorAlias == "Escc.Umbraco.PropertyEditors.RichTextPropertyEditor";
        }

        public override object ConvertDataToSource(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source == null) return null;
            var sourceString = source.ToString();

            // ensures string is parsed for {localLink} and urls are resolved correctly
            sourceString = TemplateUtilities.ParseInternalLinks(sourceString);
            sourceString = TemplateUtilities.ResolveUrlsFromTextString(sourceString);

            var formatters = new IHtmlFormatter[] { new TinyMceEmbedClassFormatter(), new UseFormForEmailLinksFormatter(), new EncodeEmailAddressFormatter() };

            foreach (var formatter in formatters)
            {
                sourceString = formatter.Format(sourceString);
            }

            return sourceString;
        }

        public override object ConvertSourceToObject(PublishedPropertyType propertyType, object source, bool preview)
        {
            // source should come from ConvertSource and be a string (or null) already
            return (source == null ? string.Empty : (string)source);
        }

        public override object ConvertSourceToXPath(PublishedPropertyType propertyType, object source, bool preview)
        {
            // source should come from ConvertSource and be a string (or null) already
            return source;
        }
    }
}
