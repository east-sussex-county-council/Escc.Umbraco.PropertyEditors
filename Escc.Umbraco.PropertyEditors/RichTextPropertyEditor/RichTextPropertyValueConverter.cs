using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Exceptionless;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web.Templates;

namespace Escc.Umbraco.PropertyEditors.RichTextPropertyEditor
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

            try
            {
                // Find, load and run any instances of IRichTextHtmlFormatter in the current scope
                var lookupType = typeof(IRichTextHtmlFormatter);
                var assemblies = AppDomain.CurrentDomain.GetAssemblies().Where(assembly => assembly.FullName.StartsWith("Escc."));
                IEnumerable<Type> formatters = assemblies.SelectMany(assembly => assembly.GetTypes()).Where(t => lookupType.IsAssignableFrom(t) && !t.IsInterface);

                foreach (var formatterType in formatters)
                {
                    var formatter = (IRichTextHtmlFormatter)Activator.CreateInstance(formatterType);
                    sourceString = formatter.Format(sourceString);
                }
            }
            catch (ReflectionTypeLoadException ex)
            {
                // If some assembly we load is referencing missing code, report the error and allow the page to load
                foreach (var nestedException in ex.LoaderExceptions)
                {
                    nestedException.ToExceptionless().Submit();
                }
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
