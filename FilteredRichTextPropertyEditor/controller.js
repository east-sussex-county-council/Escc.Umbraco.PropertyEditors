angular.module("umbraco").controller("Escc.Umbraco.PropertyEditors.FilteredRichTextPropertyEditor.Controller", function ($scope, $controller, assetsService) {
    // Inherit the behaviour of the standard rich text editor
    $controller("Umbraco.PropertyEditors.RTEController", { $scope: $scope });

    // While loading in edit view, wire up the hide label property to the corresponding pre-value,
    // taking care because "0" means false but is a truthy value when tested.
    $scope.model.hideLabel = ($scope.model.config.hideLabel === "1");

    // Load custom CSS for this editor
    assetsService.loadCss("/App_Plugins/Escc.Umbraco.PropertyEditors.FilteredRichTextPropertyEditor/styles.css");

    setupFilters();

    // Apply filters to HTML as it is being saved. Need to get and set the content from the tinyMCE
    // editor rather than $scope.model.value, because the inherited controller above goes on to set 
    // $scope.model.value from tinyMCE, so if we don't change that our work will be overwritten.
    function setupFilters() {
        $scope.$on("formSubmitting", function (ev, args) {
            var instance = tinymce.get($scope.model.alias + "_rte");
            var html = instance.getContent();
            var filters = createFilters();

            angular.forEach(filters, function(filter) {
                html = filter(html);
            });

            instance.setContent(html);
        });
    }

    // Create the filters which will be applied to HTML as it is saved. Each one should be a 
    // function which accepts one string argument and returns a string.
    function createFilters() {
        var filters = [];
        return filters;
    }

})
.directive("validateRichText", function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

            var validators = createValidators();

            // Validation using the $parsers pipeline wasn't working with tinyMCE, but can be done by watching for 
            // changes to $scope.model.value, which is updated from tinyMCE by the inherited controller. 
            // Remove the watch when done to avoid a memory leak.
            var stopWatching = scope.$watch('model.value', function () {
                angular.forEach(validators, function (validator) {
                    var valid = validator.validate(scope.model.value);
                    $("." + validator.id, elem.parentNode).html(validator.message || validator.template);
                    scope.propertyForm.$setValidity(validator.id, valid);
                });
            });

            scope.$on('$destroy', function () {
                stopWatching();
            });

            // Create the validators which will be checked before the field can be saved.
            function createValidators() {
                return [
                    { id: 'exampleValidator', template: 'example message', validate: function (value) {
                            this.message = 'custom message for example';
                            return (!value) || value.indexOf("example") == -1;
                        }
                    },
                    { id: 'testValidator', template: 'test message', validate: function (value) { return (!value) || value.indexOf("test") == -1; } }
                ];
            }
        }
    }



});