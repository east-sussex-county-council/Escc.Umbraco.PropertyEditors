Escc.Umbraco.PropertyEditors
============================

Core property editors for Umbraco 7.

RichTextPropertyEditor
------------------------------
This property editor replicates the built-in rich text editor, but adds validation and a series of formatters applied to the HTML before it is saved, and a PropertyValueConverter which runs a further series of formatters when the property is displayed.

To install this property editor, copy the files from `~\App_Plugins\Escc.Umbraco.PropertyEditors.RichTextPropertyEditor` to an equivalent folder under your Umbraco installation, and restart the Umbraco IIS application pool. The files have to be actually in that folder - a virtual directory doesn't work.

To install the PropertyValueConverter copy `Escc.Umbraco.PropertyEditors.dll` to the `bin` folder of your Umbraco installation.