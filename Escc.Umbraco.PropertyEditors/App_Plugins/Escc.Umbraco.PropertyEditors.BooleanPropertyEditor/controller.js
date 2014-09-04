// Controller copied from Umbraco's out-of-the-box controller, with added pre-value
angular.module("umbraco").controller("Escc.Umbraco.PropertyEditors.BooleanController", function ($scope, $rootScope, $routeParams) {

    function setupViewModel() {
        $scope.renderModel = {
            value: false
        };
        if ($scope.model && $scope.model.value && ($scope.model.value.toString() === "1" || angular.lowercase($scope.model.value) === "true")) {
            $scope.renderModel.value = true;
        }
    }

    setupViewModel();

    $scope.$watch("renderModel.value", function (newVal) {
        $scope.model.value = newVal === true ? "1" : "0";
    });
    
    //here we declare a special method which will be called whenever the value has changed from the server
    //this is instead of doing a watch on the model.value = faster
    $scope.model.onValueChanged = function (newVal, oldVal) {
        //update the display val again if it has changed from the server
        setupViewModel();
    };

    // If this is a new page being created, start with the default value from the data type
    if ($routeParams.create) {
      $scope.renderModel.value = ($scope.model.config.defaultValue === "1");
    }
});