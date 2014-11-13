angular.module("umbraco").directive("validateUrl", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, ele, attrs, ngModel) {
            if (!ngModel) return;

            ele.blur(function (e) {
                // format URL for user to see
                var that = $(this);
                that.val(formatUrlToSave(that.val()));
            });

            function formatUrlToSave(value) {

                // If the protocol is missing but it looks like a domain, be helpful and assume http
                if (value && (value.indexOf("www.") === 0 || value.match(/^[a-z0-9]{2,}[.][a-z0-9]{2,}[a-z0-9.]*$/))) {
                    value = "http://" + value;
                }

                return value;
            }

            ngModel.$parsers.unshift(
                function (viewValue) {

                    // URL regex MIT licenced by Diego Perini
                    // https://gist.github.com/dperini/729294
                    var re_weburl = new RegExp(
                          "^" +
                            // protocol identifier
                            "(?:(?:https?|ftp)://)" +
                            // user:pass authentication
                            "(?:\\S+(?::\\S*)?@)?" +
                            "(?:" +
                              // IP address exclusion
                              // private & local networks
                              "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                              "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                              "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                              // IP address dotted notation octets
                              // excludes loopback network 0.0.0.0
                              // excludes reserved space >= 224.0.0.0
                              // excludes network & broacast addresses
                              // (first & last IP address of each class)
                              "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                              "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                              "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                            "|" +
                              // host name
                              "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                              // domain name
                              "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                              // TLD identifier
                              "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                            ")" +
                            // port number
                            "(?::\\d{2,5})?" +
                            // resource path
                            "(?:/\\S*)?" +
                          "$", "i"
                        );

                    // Assume valid, to allow blank values
                    var valid = true;

                    if (viewValue) {

                        viewValue = formatUrlToSave(viewValue);

                        // Allow root-relative URLs by prepending a domain for validation, but don't save the domain
                        var urlToValidate = viewValue;
                        if (scope.model.config.rootRelative === "1") {
                            if (viewValue.indexOf("/") === 0) {
                                urlToValidate = "http://example.org";
                            }
                        }

                        // Now check against the URL regex
                        valid = (urlToValidate.match(re_weburl));

                        // If an additional pattern is specified as a prevalue, check that too
                        if (scope.model.config.pattern) {
                            valid = valid && urlToValidate.match(scope.model.config.pattern);
                        }
                    }

                    ngModel.$setValidity('invalid', valid);

                    return viewValue;
                }

                );
        }
    }
});