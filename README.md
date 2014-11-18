Escc.Umbraco.PropertyEditors
============================

Core property editors for Umbraco 7.

BooleanPropertyEditor
---------------------
This is a copy of the built-in true/false editor. This copy allows the checkbox to be checked by default. 

RichTextPropertyEditor
------------------------------
This property editor extends the built-in rich text editor using several methods.

* A custom Angular controller runs the built-in controller, effectively inheriting its default behaviour. Angular directives add validation and a series of formatters applied to the HTML before it is saved. 

* A custom pre-value editor extends the built-in options, allowing validators and formatters to be enabled or disabled for each data type that uses this property editor. The code in `controller.js` looks for these pre-values to see what to run. The pre-values are stored in the Umbraco database as JSON, and the `RichTextPropertyEditorPreValues` class is designed to serialise to the correct JSON format.

* A PropertyValueConverter runs a further series of formatters when the property is displayed.

* A `StylesheetService` allows stylesheets to be read from a CSS file and added to Umbraco, where they can be used in the rich text editor to style the text in edit view. If you add a custom `-umbraco-stylesheet-property` declaration in a CSS rule, it will make the rule available in the TinyMCE style selector dropdown.
 
        .example { -umbraco-stylesheet-property: 'Example property'; color: red; }
Separating style rules into separate stylesheets allows them to be enabled or disabled for each data type that uses this property editor.

See [Escc.UmbracoDocumentTypes.Website](https://github.com/east-sussex-county-council/Escc.UmbracoDocumentTypes.Website) for examples of how to create custom data types in code using this property editor.

UkLocationPropertyEditor
------------------------
This is for editing UK addresses in BS7666 format. It also collects geocordinates as both latitude and longitude, and eastings and northings.

Future iterations could see the validation improved (currently it doesn't prevent saving), an address lookup added on the postcode field and a Google map for selecting the coordinates.

EmailAddressPropertyEditor, PhonePropertyEditor, UrlPropertyEditor, TwitterScriptPropertyEditor
------------------------------------------------- 
These apply regular expression validation. There is built-in functionality for this in Umbraco but, when tested with 7.1.4, it caused an error when a field was left empty (even if the regular expression allowed for that).  

Install using NuGet
-------------------

This project is published as a NuGet package to our private feed. We use [NuBuild](https://github.com/bspell1/NuBuild) to make creating the NuGet package really easy, and [reference our private feed using a nuget.config file](http://blog.davidebbo.com/2014/01/the-right-way-to-restore-nuget-packages.html).

When you install the package it copies the property editors into `App_Plugins` and references the DLL output. These are excluded from the consuming project's git respository by its `.gitignore` file. 

However, when the consuming project is deployed NuGet restore ensures the DLL reference still works, but it doesn't restore the `App_Plugins` folders because [package restore doesn't restore content files](http://jeffhandley.com/archive/2013/12/09/nuget-package-restore-misconceptions.aspx). To work around this, the NuGet package includes a `.targets` file. NuGet automatically includes this as an MSBuild step in the `.csproj` file of the consuming project, which allows the `.targets` file to copy files into the project at build time.