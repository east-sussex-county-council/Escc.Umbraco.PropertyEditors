angular.module("umbraco").controller("Escc.Umbraco.PropertyEditors.RichTextPropertyEditor.PreValueController",
    function ($scope, $timeout, $log, tinyMceService, stylesheetResource) {

        // Get the saved pre-values
        var cfg = tinyMceService.defaultPrevalues();

        if ($scope.model.value) {
            if (angular.isString($scope.model.value)) {
                $scope.model.value = cfg;
            }
        } else {
            $scope.model.value = cfg;
        }

        // If any category of prevalue was missing, ensure there's an array for it
        if (!$scope.model.value.stylesheets) {
            $scope.model.value.stylesheets = [];
        }
        if (!$scope.model.value.toolbar) {
            $scope.model.value.toolbar = [];
        }
        if (!$scope.model.value.validators) {
            $scope.model.value.validators = [];
        }
        if (!$scope.model.value.formatters) {
            $scope.model.value.formatters = [];
        }

        // Load the TinyMCE button options to select from
        tinyMceService.configuration().then(function (config) {
            $scope.tinyMceConfig = config;

        });

        // Load the stylesheets to select from
        stylesheetResource.getAll().then(function (stylesheets) {
            $scope.stylesheets = stylesheets;
        });

        // Load the validators to select from 
        $scope.validators = [
            { "name": "clickHere", "displayName": "Do not link to 'click here'" },
            { "name": "linkToHere", "displayName": "Do not link to 'here'" },
            { "name": "visit", "displayName": "Do not start links with 'Visit'" },
            { "name": "more", "displayName": "Do not link to 'more'" },
            { "name": "allCaps", "displayName": "Do not type in CAPITAL LETTERS" },
            { "name": "urlAsLinkText", "displayName": "Do not use a URL as link text" },
            { "name": "onlyLinks", "displayName": "Only contains links" },
            { "name": "noDocuments", "displayName": "Do not link to documents" },
            { "name": "maximumWords", "displayName": "Maximum word count", "hasMaxValue" : true }
        ];

        // Where a validator has options, merge the saved value into the validators array so that it's redisplayed
        for (var i = 0; i < $scope.validators.length; i++) {
            for (var j = 0; j < $scope.model.value.validators.length; j++) {
                if ($scope.validators[i].name === $scope.model.value.validators[j].name) {
                    $scope.validators[i].max = $scope.model.value.validators[j].max;
                }
            }
        }

        // Load the possible formatters to select from
        $scope.formatters = [
            { "name" : "nbsp", "displayName" : "Normalise HTML spaces" },
            { "name": "removeEmptyLinks", "displayName": "Remove empty links" },
            { "name": "removeEmptyBlock", "displayName": "Remove empty block elements" },
            { "name" : "removeTarget", "displayName" : "Remove link targets" },
            { "name" : "removeIfMissingAttribute", "displayName" : "Remove tags with missing required attributes" },
            { "name" : "autocorrect", "displayName" : "Auto-correct common strings" },
            { "name" : "fullstopsOutsideLinks", "displayName" : "Move fullstops outside links" },
            { "name" : "spacesOutsideLinks", "displayName" : "Move trailing spaces outside links" },
            { "name" : "smartQuotes", "displayName" : "Use smart quotes" },
            { "name" : "enDashes", "displayName" : "Convert hyphens to en-dashes" },
            { "name" : "ellipsis", "displayName" : "Convert ... to ellipsis" },
            { "name" : "startHeadingsWithCapital", "displayName" : "Always start headings with a captial letter" },
            { "name" : "startContentWithCapital", "displayName": "Always start the content with a capital letter" },
            { "name" : "twoListsOfLinks", "displayName" : "Format content as two lists of links" }
        ];

        // Decide whether to select a checkbox based on whether its alias was saved in a string array
        $scope.selected = function (cmd, alias, lookup) {
            if (lookup && angular.isArray(lookup)) {
                cmd.selected = lookup.indexOf(alias) >= 0;
                return cmd.selected;
            }
            return false;
        };

        // Decide whether to select a checkbox based on whether its alias matches the name property of an object in an object array
        $scope.selectedByName = function (cmd, alias, lookup) {
            if (lookup && angular.isArray(lookup)) {
                cmd.selected = false;
                for (var i = 0; i < lookup.length; i++) {
                    if (lookup[i].name === alias) {
                        cmd.selected = true;
                        break;
                    }
                }
                return cmd.selected;
            }
            return false;
        };

        // Selects a TinyMCE button to include
        $scope.selectCommand = function (command) {
            var index = $scope.model.value.toolbar.indexOf(command.frontEndCommand);

            if (command.selected && index === -1) {
                $scope.model.value.toolbar.push(command.frontEndCommand);
            } else if (index >= 0) {
                $scope.model.value.toolbar.splice(index, 1);
            }
        };

        // Select an option and save its alias to a string array
        $scope.selectOption = function (option, collection) {

            var index = collection.indexOf(option.name);

            if (option.selected && index === -1) {
                collection.push(option.name);
            } else if (index >= 0) {
                collection.splice(index, 1);
            }
        };

        // Select an option and save its value to an object array
        $scope.selectOptionByName = function (option, collection) {

            var index = -1;
            for (var i = 0; i < collection.length; i++) {
                if (collection[i].name === option.name) {
                    index = i;
                    break;
                };
            }

            if (option.selected && index === -1) {
                collection.push({ name: option.name, max: option.max });
            } else if (index >= 0) {
                collection.splice(index, 1);
            }
        };

        // If a validator option is changed after the validator is selected, updated the saved value
        $scope.updateValidatorOption = function (optionName, option, collection)
        {
            var index = -1;
            for (var i = 0; i < collection.length; i++) {
                if (collection[i].name === option.name) {
                    index = i;
                    break;
                };
            }

            if (index > -1) collection[index][optionName] = option[optionName];
        }

        // Save TinyMCE settings
        $scope.$on("formSubmitting", function (ev, args) {

            var commands = _.where($scope.tinyMceConfig.commands, { selected: true });
            $scope.model.value.toolbar = _.pluck(commands, "frontEndCommand");


        });

    });
