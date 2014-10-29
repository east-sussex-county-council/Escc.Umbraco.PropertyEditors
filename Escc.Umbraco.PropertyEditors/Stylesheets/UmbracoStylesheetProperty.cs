namespace Escc.Umbraco.PropertyEditors.Stylesheets
{
    /// <summary>
    /// Model for an Umbraco stylesheet property
    /// </summary>
    /// <remarks>In Umbraco 7.1.4 there are two models for stylesheet properties. The old model writes to the database on access, so is
    /// not suitable. The new model only reflects file operations so has no equivalent of the <see cref="DisplayName" /> property.</remarks>
    public class UmbracoStylesheetProperty
    {
        /// <summary>
        /// The style name shown in the Umbraco back office, including the styles dropdown in TinyMCE
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// The CSS selector applied
        /// </summary>
        public string Selector { get; set; }

        /// <summary>
        /// The CSS declarations applied
        /// </summary>
        public string Declarations { get; set; }
    }
}