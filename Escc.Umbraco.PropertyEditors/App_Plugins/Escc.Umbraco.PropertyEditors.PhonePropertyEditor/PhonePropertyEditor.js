angular.module("umbraco").directive("validatePhoneNumber", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, ele, attrs, ngModel) {
            if (!ngModel) return;

            function formatPhoneNumber(value) {
                if (value) {
                    // Remove expected punctuation to get a consistent format
                    value = value.replace("(", "").replace(")", "").replace("-", "").replace(" ", "").trim();

                    // House style says don't use international format
                    if (value.indexOf("+") === 0 && value.length >= 3) {
                        value = "0" + value.substr(3);
                    }

                    // Assuming there are 11 digits, format into area code and number. 
                    // No other spaces to help mobiles turn it into click-to-dial.
                    if (value.match(/^[0-9]{11}$/)) {
                        if (value.indexOf("0345") === 0) {
                            value = value.substr(0, 4) + " " + value.substr(4);
                        } else {
                            value = value.substr(0, 5) + " " + value.substr(5);
                        }
                    }
                }

                return value;
            }

            ele.blur(function(e) {
                // format number for user to see
                var that = $(this);
                that.val(formatPhoneNumber(that.val()));
            });

            ngModel.$parsers.unshift(
                function (viewValue) {

                    // Format number for saving
                    viewValue = formatPhoneNumber(viewValue);

                    // Test for empty string or valid phone number
                    var valid = viewValue.match(/^(|[0-9]{3,5} [0-9]{6,})$/);
                    ngModel.$setValidity('phoneInvalid', valid);

                    return viewValue;
                }

                );
        }
    }
});