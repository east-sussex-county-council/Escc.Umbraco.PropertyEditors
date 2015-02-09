using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ExCSS;
using umbraco.BusinessLogic;
using umbraco.cms.businesslogic.web;
using StyleSheet = umbraco.cms.businesslogic.web.StyleSheet;

namespace Escc.Umbraco.PropertyEditors.Stylesheets
{
    /// <summary>
    /// Update stylesheets in the Umbraco database based on the contents of CSS files
    /// </summary>
    public class StylesheetService : IStylesheetService
    {
        /// <summary>
        /// Reads the text from a CSS file.
        /// </summary>
        /// <param name="filePathWithinApplication">The file path within the application, eg /css/file.css</param>
        /// <returns></returns>
        /// <exception cref="FileNotFoundException"></exception>
        public string ReadCssFromFile(string filePathWithinApplication)
        {
            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, filePathWithinApplication);
            return File.ReadAllText(path);
        }

        /// <summary>
        /// Parses CSS text into a set of properties which can be saved to Umbraco.
        /// Uses a custom -umbraco-stylesheet-property declaration in a CSS rule to specify a display name for the Umbraco property.
        /// </summary>
        /// <param name="css">The CSS.</param>
        /// <param name="parser">An ExCSS parser.</param>
        /// <returns></returns>
        /// <example>.example { -umbraco-stylesheet-property: 'Example property'; color: red; }</example>
        public IEnumerable<UmbracoStylesheetProperty> ParseCss(string css, Parser parser)
        {
            if (parser == null) throw new ArgumentNullException("parser");

            var stylesheet = parser.Parse(css);

            return stylesheet.StyleRules.Select(rule => new UmbracoStylesheetProperty
            {
                DisplayName = ParseDisplayNameFromCssRule(rule),
                Selector = rule.Selector.ToString(),
                Declarations = rule.Declarations.ToString()
            })
            .Where(property => !String.IsNullOrEmpty(property.DisplayName))
            .ToList();
        }

        /// <summary>
        /// Parses the display name a custom -umbraco-stylesheet-property declaration in a CSS rule.
        /// </summary>
        /// <param name="rule">The rule.</param>
        /// <returns></returns>
        private static string ParseDisplayNameFromCssRule(StyleRule rule)
        {
            var displayName = String.Empty;

            // Look for a display name in a custom CSS declaration
            var umbracoPropertyName = rule.Declarations.SingleOrDefault(d => d.Name == "-umbraco-stylesheet-property");
            if (umbracoPropertyName != null)
            {
                // The declaration value will be surrounded by quotes, so remove them.
                displayName = umbracoPropertyName.Term.ToString();
                displayName = displayName.Substring(1, displayName.Length - 2);

                // Remove the custom declaration from the rule.
                rule.Declarations.Remove(umbracoPropertyName);
            }

            return displayName;
        }


        /// <summary>
        /// Creates the or update umbraco stylesheet.
        /// </summary>
        /// <param name="stylesheetName">The name of the stylesheet. Expected to be the same as the filename without the .css extension.</param>
        /// <param name="umbracoStylesheetProperties">The umbraco stylesheet properties.</param>
        public void CreateOrUpdateUmbracoStylesheet(string stylesheetName, IEnumerable<UmbracoStylesheetProperty> umbracoStylesheetProperties)
        {
            var user = GetUserToUpdateStylesheets();

            // Gets the stylesheet from Umbraco if it already exists, or create it. Need to check for existence or Umbraco will 
            // create multiple stylesheets with the same name. This is just about the database record, not the CSS file on disk.
            //
            // Last param is the database record of the CSS content. This doesn't seem useful, so leave empty for now.
            // The CSS file itself will style the menu and text within TinyMCE.
            var stylesheet = StyleSheet.GetByName(stylesheetName) ??
                             StyleSheet.MakeNew(user, stylesheetName, stylesheetName + ".css", String.Empty);

            // Add a property to the stylesheet, with the second parameter used as both the name and the alias.
            // We can then go on to update the alias and value, with the database updated with every property change.
            foreach (var propertyToSave in umbracoStylesheetProperties)
            {
                var property = CreateOrGetStylesheetProperty(stylesheet, propertyToSave.DisplayName, user);
                property.Alias = propertyToSave.Selector;
                property.value = propertyToSave.Declarations;
            }
        }

        /// <summary>
        /// Gets the user to update stylesheets.
        /// </summary>
        /// <returns>An admin user</returns>
        /// <remarks>Obsolete method of getting a user needed for using the old stylesheet API. 
        /// There's no new API for adding stylesheets to the Umbraco database in v 7.1.4, only for working with CSS files on disk using the FileService.
        /// Can't use User.CurrentUser() because there isn't one available when this runs during application startup.
        /// </remarks>
        private static User GetUserToUpdateStylesheets()
        {
            var users = User.getAll();
            return users.FirstOrDefault(user => user.UserType.Alias == "admin");
        }


        /// <summary>
        /// Gets an existing Umbraco stylesheet property, or creates a new one if not found.
        /// Umbraco will create multiple properties with the same details, so we need to check for existence before creating one.
        /// </summary>
        /// <param name="stylesheet"></param>
        /// <param name="propertyName">Display name of the property</param>
        /// <param name="user"></param>
        /// <returns></returns>
        private static StylesheetProperty CreateOrGetStylesheetProperty(StyleSheet stylesheet, string propertyName, umbraco.BusinessLogic.User user)
        {
            foreach (var property in stylesheet.Properties)
            {
                if (property.Text == propertyName) return property;
            }

            return StylesheetProperty.MakeNew(propertyName, stylesheet, user);
        }


    }
}