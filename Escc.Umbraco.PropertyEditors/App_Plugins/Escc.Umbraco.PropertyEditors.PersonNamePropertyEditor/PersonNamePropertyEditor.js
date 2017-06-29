angular.module("umbraco")
    .controller("Escc.Umbraco.PropertyEditors.PersonNameController",
        function ($scope, assetsService) {

            assetsService.loadCss("/App_Plugins/Escc.Umbraco.PropertyEditors.PersonNamePropertyEditor/PersonNamePropertyEditor.css");

            if (!$scope.model.value) {
                $scope.model.value = {
                    'titles': '',
                    'givenNames': '',
                    'familyName': '',
                    'suffixes': ''
                };
            }
        });
