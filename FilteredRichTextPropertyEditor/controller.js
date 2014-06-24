angular.module("umbraco").controller("Escc.Umbraco.PropertyEditors.FilteredRichTextPropertyEditor.Controller", function ($scope, $controller) {
    // Inherit the behaviour of the standard rich text editor
    $controller("Umbraco.PropertyEditors.RTEController", { $scope: $scope });

    // While loading in edit view, wire up the hide label property to the corresponding pre-value,
    // taking care because "0" means false but is a truthy value when tested.
    $scope.model.hideLabel = ($scope.model.config.hideLabel === "1");


    // Apply filters to HTML as it is being saved. Need to get and set the content from the tinyMCE
    // editor rather than $scope.model.value, because the inherited controller above goes on to set 
    // $scope.model.value from tinyMCE, so if we don't change that our work will be overwritten.
    $scope.$on("formSubmitting", function(ev, args) {
        var instance = tinymce.get($scope.model.alias + "_rte");
        var html = instance.getContent();
        var filters = createFilters();

        angular.forEach(filters, function(filter) {
            html = filter(html);
        });

        instance.setContent(html);
    });

    // Create the filters which will be applied to HTML as it is saved. Each one should be a 
    // function which accepts one string argument and returns a string.
    function createFilters() {
        var filters = [];
        return filters;
    }

});