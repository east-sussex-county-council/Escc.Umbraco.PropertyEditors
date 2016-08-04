angular.module("umbraco")
    .controller("Escc.Umbraco.PropertyEditors.UKLocationController",
        function ($scope, assetsService) {

            assetsService.loadCss("/App_Plugins/Escc.Umbraco.PropertyEditors.UKLocationPropertyEditor/UKLocationPropertyEditor.css");

            if (!$scope.model.value) {
                $scope.model.value = {
                    'saon': '',
                    'paon': '',
                    'streetName': '',
                    'locality': '',
                    'town': '',
                    'administrativeArea': 'East Sussex',
                    'postcode': '',
                    'lat': '',
                    'lon': '',
                    'easting': '',
                    'northing': ''
                };
            }

            $scope.formatPostcode = function (e) {
                // Autoformat postcode as it's typed
                // Only act on alphanumeric keys, to avoid breaking navigation
                if ((e.keyCode >= 48 && e.keyCode <= 57 ||
                    e.keyCode >= 65 && e.keyCode <= 90 ||
                    e.keyCode >= 97 && e.keyCode <= 122)
                    && !e.ctrlKey && !e.altKey) {
                    $scope.model.value.postcode = $scope.model.value.postcode.toUpperCase();
                    $scope.model.value.postcode = $scope.model.value.postcode.replace(/^([A-Z]+)([0-9][0-9])([0-9])/, "$1$2 $3");
                    $scope.model.value.postcode = $scope.model.value.postcode.replace(/^([A-Z]+)([0-9])([0-9])([A-Z])/, "$1$2 $3$4");
                }
            }

            // This isn't the recommended way to validate in Angular, and it doesn't prevent the page saving. Need to revisit.
            // I tried using ng-pattern, adding to $parsers and watching model.value but none of them fired.
            $scope.validatePostcode = function (e) {
                $scope.postcodeInvalid = ($scope.model.value.postcode.toUpperCase().match(/^(|[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9]((?![CIKMOV])[A-Z]){2})$/) === null);
            }

            $scope.validateLatitude = function (e) {
                $scope.latitudeInvalid = (($scope.model.value.lat < -90 || $scope.model.value.lat > 90) || !$scope.model.value.lat.match(/^(|-?([0-9]+\.)?[0-9]+)$/));
            }

            $scope.validateLongitude = function (e) {
                $scope.longitudeInvalid = (($scope.model.value.lon < -180 || $scope.model.value.lon > 180) || !$scope.model.value.lon.match(/^(|-?([0-9]+\.)?[0-9]+)$/));
            }

            $scope.validateEasting = function (e) {
                $scope.eastingInvalid = ($scope.model.value.easting.match(/^(|[0-9]+)$/) === null);
            }

            $scope.validateNorthing = function (e) {
                $scope.northingInvalid = ($scope.model.value.northing.match(/^(|[0-9]+)$/) === null);
            }
        });
