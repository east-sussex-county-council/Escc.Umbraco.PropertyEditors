Escc.Umbraco.PropertyEditors
============================

Core property editors for Umbraco 7.

RichTextPropertyEditor
------------------------------
This property editor extends the built-in rich text editor using several methods.

* A custom Angular controller runs the built-in controller, effectively inheriting its default behaviour. Angular directives add validation and a series of formatters applied to the HTML before it is saved. 

* A custom pre-value editor extends the built-in options, allowing validators and formatters to be enabled or disabled for each data type that uses this property editor. The code in `controller.js` looks for these pre-values to see what to run. The pre-values are stored in the Umbraco database as JSON, and the `RichTextPropertyEditorPreValues` class is designed to serialise to the correct JSON format.

* A `PropertyValueConverter` automatically discovers all implementations of `IRichTextHtmlFormatter` in the current scope, and runs them when the property is displayed. One formatter is included by default, which encodes email addresses as HTML entities. Your can add your own formatters by implementing `IRichTextHtmlFormatter` and they will be picked up automatically.

## PersonNamePropertyEditor
This is for editing people's names, and includes a `PropertyValueConverter` which returns a `PersonName` compliant with the UK government address and personal details standard.

UkLocationPropertyEditor
------------------------
This is for editing UK addresses in BS7666 format. It also collects geocordinates as both latitude and longitude, and eastings and northings.

Future iterations could see the validation improved (currently it doesn't prevent saving), an address lookup added on the postcode field and a Google map for selecting the coordinates.

EmailAddressPropertyEditor, PhonePropertyEditor, UrlPropertyEditor
------------------------------------------------- 
These apply regular expression validation. There is built-in functionality for this in Umbraco but, when tested with 7.1.4, it caused an error when a field was left empty (even if the regular expression allowed for that).  

Install using NuGet
-------------------

This project is published as a NuGet package to our private feed. 

When you install the package it copies the property editors into `App_Plugins` and references the DLL output. These are excluded from the consuming project's git respository by its `.gitignore` file. 

However, when the consuming project is deployed NuGet restore ensures the DLL reference still works, but it doesn't restore the `App_Plugins` folders because [package restore doesn't restore content files](http://jeffhandley.com/archive/2013/12/09/nuget-package-restore-misconceptions.aspx). To work around this, the NuGet package includes a `.targets` file. NuGet automatically includes this as an MSBuild step in the `.csproj` file of the consuming project, which allows the `.targets` file to copy files into the project at build time.