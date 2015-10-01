angular.module("umbraco").controller("Escc.Umbraco.PropertyEditors.RichTextPropertyEditor.Controller", function ($scope, $controller, assetsService) {
    // Inherit the behaviour of the standard rich text editor
    $controller("Umbraco.PropertyEditors.RTEController", { $scope: $scope });

    // While loading in edit view, wire up the hide label property to the corresponding pre-value,
    // taking care because "0" means false but is a truthy value when tested.
    $scope.model.hideLabel = ($scope.model.config.hideLabel === "1");

    // Load custom CSS for this editor
    assetsService.loadCss("/App_Plugins/Escc.Umbraco.PropertyEditors.RichTextPropertyEditor/styles.css");
})
.directive("validateRichText", function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

            // Get saved prevalues for the datatype
            var editorConfig = scope.model.config.editor;
            if (!editorConfig || angular.isString(editorConfig)) {
                editorConfig = [];
            }
            var validators = createValidators(editorConfig.validators);

            // Validation using the $parsers pipeline wasn't working with tinyMCE, but can be done by watching for 
            // changes to $scope.model.value, which is updated from tinyMCE by the inherited controller. 
            // Remove the watch when done to avoid a memory leak.
            var stopWatching = scope.$watch('model.value', function() {
                angular.forEach(validators, function(validator) {
                    var valid = validator.validate(scope.model.value);
                    $("." + validator.id, elem).html(validator.message || validator.template);
                    scope.propertyForm.$setValidity(validator.id, valid);
                });
            });

            scope.$on('$destroy', function() {
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
            function createValidators(validatorsToApply) {
                var anythingExceptEndAnchor = "((?!</a>).)*";
                var validatorsToReturn = [];

                if (findValidator('clickHere', validatorsToApply)) {
                    validatorsToReturn.push({
                        id: 'clickHere',
                        template: "You linked to '{0}'. Links must make sense on their own, out of context. Linking to 'click here' doesn't do that. You should normally use the main heading of the destination page as your link text.",
                        validate: function(value) {
                            if (!value) return true;

                            var regex, match;

                            // Check for links involving the phrase 'click here'
                            regex = new RegExp("<a [^>]*>(" + anythingExceptEndAnchor + "\\bclick\\s+here\\b" + anythingExceptEndAnchor + ")</a>", "i");
                            match = regex.exec(value);

                            // If invalid, show a custom message which includes the invalid link text
                            if (match) {
                                this.message = this.template.replace("{0}", match[1]);
                            }
                            return !match;
                        }
                    });
                }

                if (findValidator('linkToHere', validatorsToApply)) {
                    validatorsToReturn.push({
                        id: 'linkToHere',
                        template: "You linked to '{0}'. Links must make sense on their own, out of context. Linking to 'here' doesn't do that. You should normally use the main heading of the destination page as your link text.",
                        validate: function(value) {
                            if (!value) return true;

                            // Check for links which just use the word 'here'
                            var regex = new RegExp("<a [^>]*>(\\s*here\\s*)</a>", "i");
                            var match = regex.exec(value);

                            // If invalid, show a custom message which includes the invalid link text
                            if (match) {
                                this.message = this.template.replace("{0}", match[1]);
                            }
                            return !match;
                        }
                    });
                }

                if (findValidator('visit', validatorsToApply)) {
                    validatorsToReturn.push({
                        id: 'visit',
                        template: "You linked to '{0}'. You don't need to start links with 'visit'. You should normally use the main heading of the destination page as your link text.",
                        validate: function(value) {
                            if (!value) return true;

                            // Regex matches any link starting with the word "visit" in it. 
                            var anythingExceptVisit = "((?!visit).)*";

                            // Check for links where the text starts with 'Visit' but visit isn't in the URL. eg <a href="/page.html">Visit my page</a>
                            var regex = new RegExp("<a [^>]*href=['\"]" + anythingExceptVisit + "['\"][^>]*>(Visit\\s+" + anythingExceptEndAnchor + ")</a>", "i");
                            var match = regex.exec(value);

                            if (match) {
                                this.message = this.template.replace("{0}", match[2]);
                            }
                            return !match;
                        }

                    });
                }

                if (findValidator('more', validatorsToApply)) {
                    validatorsToReturn.push({
                        id: 'more',
                        template: "You linked to '{0}'. Links must make sense on their own, out of context. Linking to 'More' doesn't do that. Link to 'More about [your subject]' instead.",
                        validate: function(value) {
                            if (!value) return true;

                            // Regex matches any link where the A-Z characters are "More". 
                            var match = /<a [^>]*>(More[^A-Z]*)<\/a>/i.exec(value);

                            if (match) {
                                this.message = this.template.replace("{0}", match[1]);
                            }
                            return !match;
                        }
                    });
                }

                if (findValidator('allCaps', validatorsToApply)) {
                    validatorsToReturn.push({
                        id: 'allCaps',
                        template: "You typed '{0}'. Don't write in uppercase as it's seen as <span style=\"text-transform:uppercase\">shouting</span> and, for partially sighted users, it's read out one letter at a time.",
                        validate: function(value) {
                            if (!value) return true;

                            // Check that the HTML does not include consecutive words in all caps.

                            // Strip tags to avoid them getting between words, and to avoid matching anything in attributes. First though, finish certain block elements with a 
                            // fullstop so that it doesn't run into the following paragraph and get counted as consecutive words. 
                            value = value.replace(/<\/(h[1-6]|li)>/ig, ". ");
                            value = value.replace(/(<([^>]+)>)/ig, "");

                            // Strip any common acronyms, to avoid matching them as false positives. eg NHS.
                            var allowed = ["NHS", "GP", "UK", "KPMG LLP"];
                            value = value.replace(new RegExp("\\b(" + allowed.join("|") + ")\\b", "g"), "");

                            // Regex matches two or more consecutive words in all caps. But:
                            //
                            // -- Words with numbers are not included because that traps postcodes. 
                            // -- Because we're looking for space after the second word (to avoid matching "EXAMPLE Example"), we need a second test to trap
                            //    two words in CAPS at the end of a string. 
                            // -- Because we don't want to match "Example) ACRONYM" with ")" counted as the first word, we need to require the A-Z and 
                            //    make the punctuation optional. 
                            // -- Because we don't want to match the end of a sentence (eg "this is PROBABLY. OK for once") the punctuation only includes 
                            //    that which always appears mid-sentence.
                            var punctuationBeforeWord = "['\"(]*",
                                punctuationAfterWord = "[,)'\"]*",
                                word = punctuationBeforeWord + "[A-Z-']{2,}" + punctuationAfterWord;

                            // mid-sentence
                            var match = new RegExp("(" + word + "\\s+){2,}").exec(value);

                            // end of sentence
                            if (!match) {
                                match = new RegExp("(" + word + "\\s+)+" + word + "[.?!:;]").exec(value);
                            }

                            // end of string
                            if (!match) {
                                match = new RegExp("(" + word + "\\s+)+" + word + "$").exec(value);
                            }

                            if (match) {
                                this.message = this.template.replace("{0}", match[0].trim());
                            }
                            return !match;
                        }
                    });
                }

                if (findValidator('urlAsLinkText', validatorsToApply)) {
                    validatorsToReturn.push({
                        id: 'urlAsLinkText',
                        template: "You linked to '{0}'. Don't use the address of a web page as your link text. You should normally use the main heading of the destination page as your link text.",
                        validate: function(value) {
                            if (!value) return true;

                            /// Check that a placeholder does not include any links that use the URL as the link text
                            var match = /<a [^>]*>((http:\/\/|https:\/\/|www.|\/)[^ ]+)<\/a>/i.exec(value);

                            if (match) {
                                this.message = this.template.replace("{0}", match[1]);
                            }
                            return !match;
                        }
                    });
                }

                /// Checks that the HTML placeholder does not contain any text outside links
                if (findValidator('onlyLinks', validatorsToApply)) {
                    validatorsToReturn.push({
                        id: 'onlyLinks',
                        template: 'This field should contain only links.',
                        validate: function(value) {
                            if (!value) return true;

                            // Remove links including link text, remove tags, anything left is an error
                            value = value.replace(/<a [^>]*>.*?<\/a>/gi, '');
                            value = value.replace(/<\/?[^>]*>/gi, '');
                            value = value.trim();
                            return (value == false);
                        }
                    });
                }


                if (findValidator('noDocuments', validatorsToApply)) {
                    validatorsToReturn.push({
                        id: 'noDocuments',
                        template: "You linked to a document, '{0}'. Do not link to documents from here.",
                        validate: function(value) {
                            if (!value) return true;

                            var match, matches = [],
                                mediaLibraryUrl = "/media/[0-9]+[^\"]+",
                                documentUrl = "[A-Za-z0-9_\/:\.?&=#%-]+\.(rtf|xls|xlsx|pdf|doc|docx|dot|dotx|ppt|pps|pptx|ppsx|mp3|wma)";

                            var regex = new RegExp("<a [^>]*href=\"(" + mediaLibraryUrl + "|" + documentUrl + ")\"[^>]*>(" + anythingExceptEndAnchor + ")</a>", "gi");
                            while (match = regex.exec(value)) {
                                matches.push({ url: match[1], text: match[3] });
                            }

                            if (matches.length === 0) {
                                return true;
                            } else {
                                this.message = this.template.replace('{0}', matches[0].text);
                                return false;
                            }
                        }
                    });
                };


                var validator = findValidator('maximumWords', validatorsToApply);
                if (validator) {
                    validatorsToReturn.push({
                        id: "maximumWords",
                        template: "Use " + validator.max + " words or fewer in this section.",
                        validate: function(value) {
                            if (!value) return true;
                          
                            // strip tags
                            value = value.replace(/<\/?[^>]*>/gi, '');
                          
                            // get rid of unusual white space
                            value = value.replace(/\s+/gi, " ");

                            // split into words
                            var words = value.trim().split(' ');

                            // validate word count
                            return (words.length <= validator.max);
                        }
                    });
                }
                

                return validatorsToReturn;
            }

            function findValidator(alias, validatorsToApply) {

                for (var i = 0; i < validatorsToApply.length; i++) {
                    if (alias == validatorsToApply[i].name) {
                        return validatorsToApply[i];
                    }
                }

                return null;
            }
        }
    }



})
.directive("applyFormatters", function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {

            // Get saved prevalues for the datatype
            var editorConfig = scope.model.config.editor;
            if (!editorConfig || angular.isString(editorConfig)) {
                editorConfig = [];
            }
            createFormatters(editorConfig.formatters);

            // Apply formatters to HTML as it is being saved. Normally this is built into Angular, but we need 
            // to get and set the content from the tinyMCE editor rather than $scope.model.value, because the 
            // inherited controller above goes on to set $scope.model.value from tinyMCE, so if we rely on the
            // default behaviour and don't change the tinyMCE value our work will be overwritten.
            //
            // Note: this is done on save rather than on change to avoid moving the cursor unexpectedly in TinyMCE.
            scope.$on("formSubmitting", function (ev, args) {
                var instance = tinymce.get(scope.textAreaHtmlId);
                var html = instance.getContent();

                angular.forEach(ngModel.$formatters, function (format) {
                    html = format(html);
                });

                instance.setContent(html);
            });
            
            // Create the formatters which will be applied to HTML as it is saved.  
            // Each one should be a function which accepts one string argument and returns a string. 
            // Use ngModel.$formatters.push(formatter_function) to register a formatter.
            function createFormatters(formattersToApply) {

                // Normalise spacing in HTML. This also removes non-breaking spaces.
                if (formattersToApply.indexOf('nbsp') != -1) {
                    ngModel.$formatters.push(function(value) {
                        value = value.replace(/\s+/gi, ' ');
                        return value;
                    });
                }

                // Remove empty links, which contain nothing white space, optionally surrounded by a span element
                if (formattersToApply.indexOf('removeEmptyLinks')) {
                    ngModel.$formatters.push(function(value) {
                        if (value) {
                            value = value.replace(new RegExp("<a(| [^>]*)>(\s*|\s*<span[^>]*>\s*<\/span>\s*)<\/a>", "gi"), "");
                        }
                        return value;
                    });
                }

                // Remove any block elements with no content
                // Allow empty TD and TH
                if (formattersToApply.indexOf('removeEmptyBlock') != -1) {
                    ngModel.$formatters.push(function(value) {
                        if (value) {
                            var blockElements = ["address", "blockquote", "dl", "p", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "table", "ul", "dd", "dt", "li", "tbody", "tfoot", "thead", "tr"];
                            angular.forEach(blockElements, function(element) {
                                value = value.replace(new RegExp("<" + element + "[^>]*>(\\s*|&nbsp;)</" + element + ">", "gi"), "");
                            });
                        }
                        return value;
                    });
                }

                // Remove target attribute to ensure *users* get to choose whether to open links in a new window
                if (formattersToApply.indexOf('removeTarget') != -1) {
                    ngModel.$formatters.push(function(value) {
                        return value.replace(/ target=[^>][a-z_]+[^>]/i, "");
                    });
                }

                // Strip tags which require attributes if they don't have any attributes, eg <a>link text</a>
                if (formattersToApply.indexOf('removeIfMissingAttribute') != -1) {
                    ngModel.$formatters.push(function(value) {
                        return value.replace(/<a\s*>([^<]*)<\/a>/i, "$1");
                    });
                }

                // Correct common phrases
                if (formattersToApply.indexOf('autocorrect') != -1) {
                    ngModel.$formatters.push(function(value) {
                        value = value.replace("Brighton and Hove", "Brighton &amp; Hove");
                        value = value.replace("national curriculum", "National Curriculum");
                        value = value.replace(/\sinternet\b/, " Internet");
                        return value;
                    });
                }

                // Move fullstops outside links
                if (formattersToApply.indexOf('fullstopsOutsideLinks') != -1) {
                    ngModel.$formatters.push(function(value) {
                        return value.replace(".</a>", "</a>.");
                    });
                }

                // Move spaces outside links
                if (formattersToApply.indexOf('spacesOutsideLinks') != -1) {
                    ngModel.$formatters.push(function(value) {
                        return value.replace(/\s+<\/a>/, "</a> ");
                    });
                }

                // Convert dumb quotes to smart quotes
                if (formattersToApply.indexOf('smartQuotes') != -1) {
                    ngModel.$formatters.push(function(value) {

                        // HTML entity decoding by mattcasey on http://stackoverflow.com/questions/5796718/html-entity-decode
                        var decodeEntities = (function () {
                            // Remove HTML Entities
                            var element = document.createElement('div');

                            function decode_HTML_entities(str) {

                                if (str && typeof str === 'string') {

                                    // Escape HTML before decoding for HTML Entities
                                    str = escape(str).replace(/%26/g, '&').replace(/%23/g, '#').replace(/%3B/g, ';');

                                    element.innerHTML = str;
                                    if (element.innerText) {
                                        str = element.innerText;
                                        element.innerText = '';
                                    } else {
                                        // Firefox support
                                        str = element.textContent;
                                        element.textContent = '';
                                    }
                                }
                                return unescape(str);
                            }
                            return decode_HTML_entities;
                        })();


                     /* Logic taken from smartquotes.js, adapted to work when saving a string rather than on page load to avoid adding JavaScript to page size.

                     * smartquotes.js v0.1.4
                     * http://github.com/kellym/smartquotesjs
                     * MIT licensed
                     *
                     * Copyright (C) 2013 Kelly Martin, http://kelly-martin.com
                     */

                        var root = new DOMParser().parseFromString(value, "text/html");

                        var node = root.childNodes[0];
                        while (node != null) {
                            if (node.nodeType == 3) {
                                node.nodeValue = node.nodeValue
                                    .replace(/(\W|^)"(\S)/g, '$1\u201c$2') // beginning "
                                    .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2') // ending "
                                    .replace(/([^0-9])"/g, '$1\u201d') // remaining " at end of word
                                    .replace(/(\W|^)'(\S)/g, '$1\u2018$2') // beginning '
                                    .replace(/([a-z])'([a-z])/ig, '$1\u2019$2') // conjunction's possession
                                    .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/ig, '$1\u2019$3') // ending '
                                    .replace(/(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/ig, '\u2019$2$3') // abbrev. years like '93
                                    .replace(/(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/ig, '$1\u2019') // backwards apostrophe
                                    .replace(/'''/g, '\u2034') // triple prime
                                    .replace(/("|'')/g, '\u2033') // double prime
                                    .replace(/'/g, '\u2032'); // prime
                            }
                            if (node.hasChildNodes() && node.firstChild.nodeName != "CODE") {
                                node = node.firstChild;
                            } else {
                                do {
                                    while (node.nextSibling == null && node != root) {
                                        node = node.parentNode;
                                    }
                                    node = node.nextSibling;
                                } while (node && (node.nodeName == "CODE" || node.nodeName == "SCRIPT" || node.nodeName == "STYLE"));
                            }
                        }

                        // Decode entities so that the format is the same as what was receieved by this method
                        return decodeEntities(root.body.innerHTML);
                    });
                }

                // Replace hyphens-used-as-dashes with en-dashes
                if (formattersToApply.indexOf('enDashes') != -1) {
                    ngModel.$formatters.push(function(value) {
                        value = value.replace(/([a-z0-9>)])\s+-\s+([(<a-z0-9])/gi, "$1 &#8211; $2"); // replace between clauses
                        value = value.replace(/([0-9])-([0-9])/gi, "$1&#8211;$2"); // replace numerical ranges

                        // undo previous within urls
                        var urlNDashPattern = /([a-z]:\/)?(\/?)([^\s]*)([0-9]+)(&#8211;|&ndash;)([0-9])/i;
                        while (urlNDashPattern.test(value)) {
                            value = value.replace(urlNDashPattern, "$1$2$3$4-$6");
                        }

                        return value;
                    });
                }

                // ellipsis - this takes several passes as the match stops when it finds 3 rather than greedily matching all consecutive . characters
                if (formattersToApply.indexOf('ellipsis') != -1) {
                    ngModel.$formatters.push(function(value) {
                        value = value.replace("…", "&#8230;");
                        value = value.replace(/\.{3,}/, "&#8230;");
                        value = value.replace(/\&#8230;\.+/, "&#8230;");
                        value = value.replace(/(\&#8230;){2,}/, "&#8230;");
                        return value;
                    });
                }

                // headings should start with a captial letter
                if (formattersToApply.indexOf('startHeadingsWithCapital') != -1) {
                    ngModel.$formatters.push(function(value) {
                        return value.replace(/(<h[1|2|3|4|5|6]>)("|'|&ldquo;|&lsquo;)?([a-z])/, function(match, tag, punc, first) {
                            return tag + (punc || '') + first.toUpperCase();
                        });
                    });
                }

                /// Ensures the first letter in the placeholder is uppercase, eg for placeholders containing a heading
                if (formattersToApply.indexOf('startContentWithCapital') != -1) {
                    ngModel.$formatters.push(function(value) {
                        var index = 0;
                        var length = value.length;
                        var outOfTag = true;

                        while (index < length) {
                            if (value[index] == '<') {
                                outOfTag = false;
                            } else if (value[index] == '>') {
                                outOfTag = true;
                            } else if (outOfTag) {
                                // Include numbers even though toUpperCase() won't change them, because if a placeholder starts with a number
                                // the following letter is probably not the start of a sentence or heading (eg 11am)
                                var match = /^[A-Za-z0-9]$/.test(value[index]);
                                if (match) {
                                    var corrected = (value.substr(0, index) + value.substr(index, 1).toUpperCase());
                                    if (length > index) corrected += value.substr(index + 1);
                                    return corrected;
                                }
                            }
                            index++;
                        }

                        return value;
                    });
                }

                // Automatically format links found in a placeholder as two lists of links, with classes applied to allow display as columns.
                if (formattersToApply.indexOf('twoListsOfLinks') != -1) {
                    ngModel.$formatters.push(function(value) {

                        // Where an entire placeholder should be an unordered list of links, this prevents the author from having to remember.
                        function shouldBeUnorderedList(html, listClass) {
                            var match, matches = [];
                            var regex = /(<a [^>]*>)(.+?)<\/a>/gi;
                            while (match = regex.exec(html)) {
                                matches.push({ tag: match[1], text: match[2] });
                            }
                            
                            if (matches.length == 0) return ''; // we want a list of links so, no links, no list

                            var list = "<ul";
                            if (listClass) list += ' class="' + listClass + '"';
                            list += ">\n";

                            for(var i = 0; i < matches.length;i++)
                            {
                                list += ("<li>" + matches[i].tag + matches[i].text[0].toUpperCase() + matches[i].text.substr(1) + "</a></li>\n");
                            }

                            list += "</ul>";
                            return list;
                    
                        }


                        // grab links and distribute into two lists
                        var listHtml = shouldBeUnorderedList(value, '');

                        var listItems = [];
                        var re = /(<li[^>]*>.*?<\/li>)/g;
                        var match;
                        while (match = re.exec(listHtml)) {
                            listItems.push(match[1]);
                        }
                            
                        if (listItems.length > 1)
                        {
                            var itemsPerList = Math.floor(listItems.length / 2);
                            var extraItem = (listItems.length % 2);
                            var i;

                            var lists = '<ul class="first">';
                            for (i = 0; i < (itemsPerList + extraItem); i++) lists += listItems[i];
                            lists += '</ul><ul class="second">';
                            for (i = (itemsPerList + extraItem); i < ((itemsPerList * 2) + extraItem); i++) lists += listItems[i];
                            lists += "</ul>";

                            value = lists;
                        }
                        else
                        {
                            // unless there's only one link, then leave it in its one list
                            value = listHtml;
                        }
                        

                        return value;
                    });
                }
            }
        }
    }
});