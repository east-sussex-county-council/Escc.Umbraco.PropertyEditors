Escc.Umbraco.PropertyEditors
============================

Core property editors for Umbraco 7.

RichTextPropertyEditor
------------------------------
This property editor replicates the built-in rich text editor, but adds validation and a series of formatters applied to the HTML before it is saved.

To install this property editor, copy the files from the `RichTextPropertyEditor` folder to a folder under your Umbraco installation named `~\App_Plugins\Escc.Umbraco.PropertyEditors.RichTextPropertyEditor` and restart the Umbraco IIS application pool. The files have to be actually in that folder - a virtual directory doesn't work.