angular.module("umbraco").controller("Escc.Umbraco.PropertyEditors.RichTextPropertyEditor.PreValueController",
    function ($scope, $timeout, $log, tinyMceService, stylesheetResource) {
        var cfg = tinyMceService.defaultPrevalues();

        if ($scope.model.value) {
            if (angular.isString($scope.model.value)) {
                $scope.model.value = cfg;
            }
        } else {
            $scope.model.value = cfg;
        }

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

        tinyMceService.configuration().then(function (config) {
            $scope.tinyMceConfig = config;

        });

        stylesheetResource.getAll().then(function (stylesheets) {
            $scope.stylesheets = stylesheets;
        });

        $scope.validators = [
            { "name": "clickHere", "displayName": "Do not link to 'click here'" },
            { "name": "linkToHere", "displayName": "Do not link to 'here'" },
            { "name": "visit", "displayName": "Do not start links with 'Visit'" },
            { "name": "more", "displayName": "Do not link to 'more'" },
            { "name": "allCaps", "displayName": "Do not type in CAPITAL LETTERS" },
            { "name": "urlAsLinkText", "displayName": "Do not use a URL as link text" },
            { "name": "onlyLinks", "displayName": "Only contains links"}
        ];

        $scope.formatters = [
            { "name" : "nbsp", "displayName" : "Convert non-breaking spaces to spaces" },
            { "name" : "removeEmptyBlock", "displayName" : "Remove empty block elements" },
            { "name" : "removeTarget", "displayName" : "Remove link targets" },
            { "name" : "removeIfMissingAttribute", "displayName" : "Remove tags with missing required attributes" },
            { "name" : "autocorrect", "displayName" : "Auto-correct common strings" },
            { "name" : "fullstopsOutsideLinks", "displayName" : "Move fullstops outside links" },
            { "name" : "spacesOutsideLinks", "displayName" : "Move trailing spaces outside links" },
            { "name" : "smartQuotes", "displayName" : "Use smart quotes" },
            { "name" : "enDashes", "displayName" : "Replace hyphens with en-dashes" },
            { "name" : "ellipsis", "displayName" : "Convert ... to ellipsis" },
            { "name" : "startHeadingsWithCapital", "displayName" : "Always start headings with a captial letter" },
            { "name" : "startContentWithCapital", "displayName": "Always start the content with a capital letter" },
            { "name" : "twoListsOfLinks", "displayName" : "Format content as two lists of links" }
        ];

        $scope.selected = function (cmd, alias, lookup) {
            if (lookup && angular.isArray(lookup)) {
                cmd.selected = lookup.indexOf(alias) >= 0;
                return cmd.selected;
            }
            return false;
        };

        $scope.selectCommand = function (command) {
            var index = $scope.model.value.toolbar.indexOf(command.frontEndCommand);

            if (command.selected && index === -1) {
                $scope.model.value.toolbar.push(command.frontEndCommand);
            } else if (index >= 0) {
                $scope.model.value.toolbar.splice(index, 1);
            }
        };

        $scope.selectOption = function (option, collection) {

            var index = collection.indexOf(option.name);

            if (option.selected && index === -1) {
                collection.push(option.name);
            } else if (index >= 0) {
                collection.splice(index, 1);
            }
        };

        $scope.$on("formSubmitting", function (ev, args) {

            var commands = _.where($scope.tinyMceConfig.commands, { selected: true });
            $scope.model.value.toolbar = _.pluck(commands, "frontEndCommand");


        });

    });
