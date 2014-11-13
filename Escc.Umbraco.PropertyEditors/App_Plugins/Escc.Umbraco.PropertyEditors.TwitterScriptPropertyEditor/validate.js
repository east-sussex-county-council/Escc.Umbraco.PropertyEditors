angular.module("umbraco").directive("validateTwitterScript", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, ele, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$parsers.unshift(
                function (viewValue) {
                    // Test for valid twitter widget script code
                    var valid = viewValue.match(/^(|<a class=\"twitter-timeline\"[^>]*>.*?<\/a>\s*<script>[^<]+platform.twitter.com[^<]+twitter-wjs[^<]+<\/script>)$/);
                    ngModel.$setValidity('invalid', valid);

                    return viewValue;
                }

                );
        }
    }
});