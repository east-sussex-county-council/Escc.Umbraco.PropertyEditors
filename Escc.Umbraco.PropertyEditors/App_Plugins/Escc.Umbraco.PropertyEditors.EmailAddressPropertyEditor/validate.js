angular.module("umbraco").directive("validateEmailAddress", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, ele, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$parsers.unshift(
                function (viewValue) {

                    // Test for empty string or valid email address
                    var valid = viewValue.match(/^(|([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,}|[0-9]{1,3})(\]?))$/);
                    ngModel.$setValidity('emailInvalid', valid);

                    return viewValue;
                }

                );
        }
    }
});