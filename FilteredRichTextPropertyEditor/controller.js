angular.module("umbraco").controller("Escc.Umbraco.PropertyEditors.FilteredRichTextPropertyEditor.Controller", function ($scope, $controller, assetsService) {
    // Inherit the behaviour of the standard rich text editor
    $controller("Umbraco.PropertyEditors.RTEController", { $scope: $scope });

    // While loading in edit view, wire up the hide label property to the corresponding pre-value,
    // taking care because "0" means false but is a truthy value when tested.
    $scope.model.hideLabel = ($scope.model.config.hideLabel === "1");

    // Load custom CSS for this editor
    assetsService.loadCss("/App_Plugins/Escc.Umbraco.PropertyEditors.FilteredRichTextPropertyEditor/styles.css");
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
                    $("." + validator.id, elem).html(validator.message || validator.template);
                    scope.propertyForm.$setValidity(validator.id, valid);
                });
            });

            scope.$on('$destroy', function () {
                stopWatching();
            });

            // Create the validators which will be checked before the field can be saved. Should return an array of objects,
            // each with the following interface:
            //
            // { 
            //      id: 'a unique alias',
            //      template: 'an error message',
            //      validate: function (value) { return true if value is valid; false if not; }
            // }
            //
            // The validate function can optionally set this.message to a custom error message, which will be used instead of .template.
            //
            // The view should include an element similar to the following as a direct child of the element invoking this directive. 
            // Replace 'alias' with the unique alias specified in the interface above:
            //
            //      <p ng-show="propertyForm.$error.alias" class="alert alert-error alias"></p>
            // 
            function createValidators() {
                return [
                    {
                        id: 'clickHere',
                        template: "You linked to '{0}'. Links must make sense on their own, out of context. Linking to 'click here' or anything similar doesn't do that. You should normally use the main heading of the destination page as your link text.",
                        validate: function (value) {
                            if (!value) return true;

                            var anythingExceptEndAnchor = "((?!</a>).)*", regex, match;

                            // Check for links involving the phrase 'click here'
                            regex = new RegExp("<a [^>]*>(" + anythingExceptEndAnchor + "\\bclick\\s+here\\b" + anythingExceptEndAnchor + ")</a>", "i");
                            match = regex.exec(value);

                            // If not found, check for links which just use the word 'here'
                            if (!match) {
                                regex = new RegExp("<a [^>]*>(\\s*here\\s*)</a>", "i");
                                match = regex.exec(value);
                            }

                            // If invalid, show a custom message which includes the invalid link text
                            if (match) {
                                this.message = this.template.replace("{0}", match[1]);
                            }
                            return !match;
                        }
                    }
                ];
            }
        }
    }



})
.directive("applyFormatters", function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {

            createFormatters();

            // Apply formatters to HTML as it is being saved. Normally this is built into Angular, but we need 
            // to get and set the content from the tinyMCE editor rather than $scope.model.value, because the 
            // inherited controller above goes on to set $scope.model.value from tinyMCE, so if we rely on the
            // default behaviour and don't change the tinyMCE value our work will be overwritten.
            scope.$on("formSubmitting", function (ev, args) {
                var instance = tinymce.get(scope.model.alias + "_rte");
                var html = instance.getContent();

                angular.forEach(ngModel.$formatters, function (format) {
                    html = format(html);
                });

                instance.setContent(html);
            });
            
            // Create the formatters which will be applied to HTML as it is saved.  
            // Each one should be a function which accepts one string argument and returns a string. 
            // Use ngModel.$formatters.push(formatter_function) to register a formatter.
            function createFormatters() {

                function exampleFormatter(value) {
                    if (value) {
                        // value = value.toUpperCase();
                    }
                    return value;
                }
                ngModel.$formatters.push(exampleFormatter);
            }
        }
    }
});