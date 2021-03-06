﻿(function () {
    'use strict';

    // Validators which will be checked before the field can be saved. 
    // Each one should be an object with the following interface:
    //
    // { 
    //      id: 'a unique alias',
    //      template: 'an error message',
    //      validate: function (value) { return true if value is valid; false if not; }
    // }
    //
    // The validate function can optionally set this.message to a custom error message, which will be used instead of .template.
    //
    // The view should include an element similar to the following as a direct child of the element invoking the directive which applies the validators. 
    // Replace 'alias' with the unique alias specified in the interface above:
    //
    //      <p ng-show="propertyForm.$error.alias" class="alert alert-error alias"></p>
    // 
    var RichTextValidators = function () {

        var anythingExceptEndAnchor = "((?!</a>).)*";

        var clickHereValidator = {
            id: 'clickHere',
            template: "You linked to '{0}'. Links must make sense on their own, out of context. Linking to 'click here' doesn't do that. You should normally use the main heading of the destination page as your link text.",
            validate: function (value) {
                if (!value) return true;

                var regex, match;

                // Check for links involving the phrase 'click here'
                regex = new RegExp("<a [^>]*>(" + anythingExceptEndAnchor + "\\bclick(ing)?\\s+here\\b" + anythingExceptEndAnchor + ")</a>", "i");
                match = regex.exec(value);

                // If invalid, show a custom message which includes the invalid link text
                if (match) {
                    this.message = this.template.replace("{0}", match[1]);
                }
                return !match;
            }
        }

        var linkToHereValidator = {
            id: 'linkToHere',
            template: "You linked to '{0}'. Links must make sense on their own, out of context. Linking to 'here' doesn't do that. You should normally use the main heading of the destination page as your link text.",
            validate: function (value) {
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
        }

        var visitValidator = {
            id: 'visit',
            template: "You linked to '{0}'. You don't need to start links with 'visit'. You should normally use the main heading of the destination page as your link text.",
            validate: function (value) {
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

        }

        var moreValidator = {
            id: 'more',
            template: "You linked to '{0}'. Links must make sense on their own, out of context. Linking to 'More' doesn't do that. Link to 'More about [your subject]' instead.",
            validate: function (value) {
                if (!value) return true;

                // Regex matches any link where the A-Z characters are "More". 
                var match = /<a [^>]*>(More[^A-Z]*)<\/a>/i.exec(value);

                if (match) {
                    this.message = this.template.replace("{0}", match[1]);
                }
                return !match;
            }
        }

        var allCapsValidator = {
            id: 'allCaps',
            template: "You typed '{0}'. Don't write in uppercase as it's seen as <span style=\"text-transform:uppercase\">shouting</span> and, for partially sighted users, it's read out one letter at a time.",
            validate: function (value) {
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
        }

        var urlAsLinkTextValidator = {
            id: 'urlAsLinkText',
            template: "You linked to '{0}'. Don't use the address of a web page as your link text. You should normally use the main heading of the destination page as your link text.",
            validate: function (value) {
                if (!value) return true;

                /// Check that a placeholder does not include any links that use the URL as the link text
                var match = /<a [^>]*>((http:\/\/|https:\/\/|www.|\/)[^ ]+)<\/a>/i.exec(value);

                if (match) {
                    this.message = this.template.replace("{0}", match[1]);
                }
                return !match;
            }
        }

        // Checks that the HTML placeholder does not contain any text outside links
        var onlyLinksValidator = {
            id: 'onlyLinks',
            template: 'This field should contain only links.',
            validate: function (value) {
                if (!value) return true;

                // Remove links including link text, remove tags, anything left is an error
                value = value.replace(/<a [^>]*>.*?<\/a>/gi, '');
                value = value.replace(/<\/?[^>]*>/gi, '');
                value = value.trim();
                return (value == false);
            }
        }

        var noDocumentsValidator = {
            id: 'noDocuments',
            template: "You linked to a document, '{0}'. Do not link to documents from here.",
            validate: function (value) {
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
        }

        var maximumWordsValidator = {
            id: "maximumWords",
            template: "Use {0} words or fewer in this section.",
            validate: function (value) {
                if (!value) return true;

                // update error message template with configured maximum
                this.template = this.template.replace('{0}', this.max);

                // strip tags
                value = value.replace(/<\/?[^>]*>/gi, '');

                // get rid of unusual white space
                value = value.replace(/\s+/gi, " ");

                // split into words
                var words = value.trim().split(' ');

                // validate word count
                return (words.length <= this.max);
            },
            max: 1000
        }

        return {
            clickHere: clickHereValidator,
            linkToHere: linkToHereValidator,
            visit: visitValidator,
            more: moreValidator,
            allCaps: allCapsValidator,
            urlAsLinkText: urlAsLinkTextValidator,
            onlyLinks: onlyLinksValidator,
            noDocuments: noDocumentsValidator,
            maximumWords: maximumWordsValidator
        }
    }

    // Formatters which will be applied to HTML as it is saved.  
    // Each one should be a function which accepts one string argument and returns a string. 
    var RichTextFormatters = function () {

        /**
         * Gets all the text nodes in an HTMLElement.
         * From https://gist.github.com/Daniel-Hug/1415b4d027e3e9854456f4e812ea2ce1
         * @param HTMLElement parent
         */
        function getTextNodes(parent) {
            let all = [];
            for (parent = parent.firstChild; parent; parent = parent.nextSibling) {
                if (['SCRIPT', 'STYLE'].indexOf(parent.tagName) >= 0) continue;
                if (parent.nodeType === Node.TEXT_NODE) all.push(parent);
                else all = all.concat(getTextNodes(parent));
            }
            return all;
        }

        /**
         * Applies a function to all the text nodes in an HTML string
         * @param string html
         * @param function func
         */
        function updateTextNodesInHtml(html, func) {
            let dom = document.createElement("div");
            dom.innerHTML = html;
            let textNodes = getTextNodes(dom);
            for (let i = 0; i < textNodes.length; i++) {
                textNodes[i].nodeValue = func(textNodes[i].nodeValue);
            }
            return dom.innerHTML;
        }

        // Normalise spacing in HTML text nodes. This also removes non-breaking spaces.
        var nbspFormatter = function (value) {
            return updateTextNodesInHtml(value, function (text) {
                return text.replace(/\s+/gi, ' ');
            });
        }

        // Remove empty links, which contain nothing white space, optionally surrounded by a span element
        var removeEmptyLinksFormatter = function (value) {
            if (value) {
                value = value.replace(new RegExp("<a(| [^>]*)>(\s*|\s*<span[^>]*>\s*<\/span>\s*)<\/a>", "gi"), "");
            }
            return value;
        }

        // Remove any block elements with no content
        // Allow empty TD and TH
        var removeEmptyBlockFormatter = function (value) {
            if (value) {
                var blockElements = ["address", "blockquote", "dl", "p", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "table", "ul", "dd", "dt", "li", "tbody", "tfoot", "thead", "tr"];
                angular.forEach(blockElements, function (element) {
                    value = value.replace(new RegExp("<" + element + "[^>]*>(\\s*|&nbsp;)</" + element + ">", "gi"), "");
                });
            }
            return value;
        }

        // Remove unwanted elements - tinymceconfig.config has an <invalidElements /> setting for this but it is not applied.
        var removeElementFormatter = function (value) {
            if (value) {
                var removeElements = ["font", "div"];
                angular.forEach(removeElements, function (element) {
                    var regEx = new RegExp("</?" + element + "( [^>]+)*>", "gi");
                    value = value.replace(regEx, "");
                });
            }
            return value;
        }

        // Remove target attribute to ensure *users* get to choose whether to open links in a new window
        var removeTargetFormatter = function (value) {
            return value.replace(/ target=[^>][a-z_]+[^>]/i, "");
        }

        // Strip tags which require attributes if they don't have any attributes, eg <a>link text</a>
        var removeIfMissingAttributeFormatter = function (value) {
            return value.replace(/<a\s*>([^<]*)<\/a>/i, "$1");
        }

        // Correct common phrases
        var autocorrectFormatter = function (value) {
            value = value.replace("Brighton and Hove", "Brighton &amp; Hove");
            value = value.replace("national curriculum", "National Curriculum");
            value = value.replace(/\sinternet\b/, " Internet");
            return value;
        }

        // Move fullstops outside links
        var fullstopsOutsideLinksFormatter = function (value) {
            return value.replace(".</a>", "</a>.");
        }

        // Move spaces outside links
        var spacesOutsideLinksFormatter = function (value) {
            return value.replace(/\s+<\/a>/, "</a> ");
        }

        // Convert dumb quotes to smart quotes
        var smartQuotesFormatter = function (value) {

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
        }

        // Replace hyphens-used-as-dashes with en-dashes
        var enDashesFormatter = function (value) {
            return updateTextNodesInHtml(value, function (text) {
                text = text.replace(/([a-z0-9>)])\s+-\s+([(<a-z0-9])/gi, "$1 – $2"); // replace between clauses
                text = text.replace(/([0-9])-([0-9])/gi, "$1–$2"); // replace numerical ranges
                return text;
            });
        }

        // ellipsis - this takes several passes as the match stops when it finds 3 rather than greedily matching all consecutive . characters
        var ellipsisFormatter = function (value) {
            value = value.replace("…", "&#8230;");
            value = value.replace(/\.{3,}/, "&#8230;");
            value = value.replace(/\&#8230;\.+/, "&#8230;");
            value = value.replace(/(\&#8230;){2,}/, "&#8230;");
            return value;
        }

        // headings should start with a captial letter
        var startHeadingsWithCapitalFormatter = function (value) {
            return value.replace(/(<h[1|2|3|4|5|6]>)("|'|&ldquo;|&lsquo;)?([a-z])/, function (match, tag, punc, first) {
                return tag + (punc || '') + first.toUpperCase();
            });
        }

        /// Ensures the first letter in the placeholder is uppercase, eg for placeholders containing a heading
        var startContentWithCapitalFormatter = function (value) {
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
        }

        // Automatically format links found in a placeholder as two lists of links, with classes applied to allow display as columns.
        var twoListsOfLinksFormatter = function (value) {

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

                for (var i = 0; i < matches.length; i++) {
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

            if (listItems.length > 1) {
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
            else {
                // unless there's only one link, then leave it in its one list
                value = listHtml;
            }


            return value;
        }

        return {
            nbsp: nbspFormatter,
            removeEmptyLinks: removeEmptyLinksFormatter,
            removeEmptyBlock: removeEmptyBlockFormatter,
            removeUnwantedElements: removeElementFormatter,
            removeTarget: removeTargetFormatter,
            removeIfMissingAttribute: removeIfMissingAttributeFormatter,
            autocorrect: autocorrectFormatter,
            fullstopsOutsideLinks: fullstopsOutsideLinksFormatter,
            spacesOutsideLinks: spacesOutsideLinksFormatter,
            smartQuotes: smartQuotesFormatter,
            enDashes: enDashesFormatter,
            ellipsis: ellipsisFormatter,
            startHeadingsWithCapital: startHeadingsWithCapitalFormatter,
            startContentWithCapital: startContentWithCapitalFormatter,
            twoListsOfLinks: twoListsOfLinksFormatter
        };
    }

    /**
     * Builds a collection of objects (validators, formatters) to apply based on an array of ids from configuration,
    *  and a container object with properties for each of the objects which may be applied
     * @param AngularScope scope
     * @param string configSection
     * @param object objectsContainer
     */
    function ReadConfigForGridEditor(scope, configSection, objectsContainer) {

        function readConfiguredObjectsFromObjectContainer(objectIdsToSelect, objectsContainer) {
            var configuredObjects = [];

            angular.forEach(objectIdsToSelect, function (objectId) {
                if (objectsContainer.hasOwnProperty(objectId)) {
                    configuredObjects.push(objectsContainer[objectId]);
                }
            });

            return configuredObjects;
        }

        // Loop through the grid editors looking for any that have 'configSection' configured in package.manifest.
        // Where it's found, read properties from 'objectsContainer' that match the ids specified as a string array in 'configSection'
        var configuredValues = [];
        if (scope.model.value && scope.model.value.sections) {
            _.each(scope.model.value.sections, function (section) {
                if (section.rows) {
                    _.each(section.rows, function (row) {
                        if (row.areas) {
                            _.each(row.areas, function (area) {
                                if (area.controls) {
                                    _.each(area.controls, function (control) {
                                        if (control.editor && control.editor.config && control.editor.config[configSection]) {
                                            configuredValues[control.editor.alias] = readConfiguredObjectsFromObjectContainer(control.editor.config[configSection], objectsContainer);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };
        return configuredValues;
    }

    /**
     * Applies a collection of objects (validators, formatters) to a grid editor control
     * @param AngularScope scope
     * @param object[] configuredObjects
     * @param function action
     * @param function init(alias)
     */
    function ApplyConfigToGridEditorOnSave(scope, configuredObjects, action, init) {
        var unsubscribe = scope.$on('formSubmitting', function (event) {
            let initAliases = [];
            if (scope.model.value && scope.model.value.sections) {
                _.each(scope.model.value.sections, function (section) {
                    if (section.rows) {
                        _.each(section.rows, function (row) {
                            if (row.areas) {
                                _.each(row.areas, function (area) {
                                    if (area.controls) {
                                        _.each(area.controls, function (control) {
                                            if (control.editor && configuredObjects.hasOwnProperty(control.editor.alias)) {

                                                // Run an init function the first time any given grid editor alias is encountered for this form submission
                                                if (init && initAliases.indexOf(control.editor.alias) == -1) {
                                                    init(control.editor.alias);
                                                    initAliases.push(control.editor.alias);
                                                }

                                                // Run the action for each of the objects configured for this grid editor
                                                angular.forEach(configuredObjects[control.editor.alias], function (configuredObject) { action(control, configuredObject); });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        //when the scope is destroyed we need to unsubscribe
        scope.$on('$destroy', function () {
            unsubscribe();
        });
    }

    angular.module('umbraco').controller("Escc.Umbraco.PropertyEditors.RichTextPropertyEditor.Controller", function ($scope, $controller, assetsService) {

        // Controller for a rich text editor when it's used as the property editor for a data type

        // Inherit the behaviour of the standard rich text editor
        $controller("Umbraco.PropertyEditors.RTEController", { $scope: $scope });

        // While loading in edit view, wire up the hide label property to the corresponding pre-value,
        // taking care because "0" means false but is a truthy value when tested.
        $scope.model.hideLabel = ($scope.model.config.hideLabel === "1");

        // Load custom CSS for this editor
        assetsService.loadCss("/App_Plugins/Escc.Umbraco.PropertyEditors.RichTextPropertyEditor/styles.css");
    })
        .controller('Escc.Umbraco.PropertyEditors.RichTextPropertyEditor.GridController', function ($scope, tinyMceService, macroService, assetsService) {

            // Controller for a rich text editor when it's used as a grid editor
            var vm = this;
            vm.openLinkPicker = openLinkPicker;
            function openLinkPicker(editor, currentTarget, anchorElement) {
                vm.linkPickerOverlay = {
                    view: 'linkpicker',
                    currentTarget: currentTarget,
                    show: true,
                    submit: function (model) {
                        tinyMceService.insertLinkInEditor(editor, model.target, anchorElement);
                        vm.linkPickerOverlay.show = false;
                        vm.linkPickerOverlay = null;
                    }
                };
            }

            // Load custom CSS for this editor
            assetsService.loadCss("/App_Plugins/Escc.Umbraco.PropertyEditors.RichTextPropertyEditor/styles.css");
        })
        .directive("validateRichText", function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    // Validate a rich text editor when it's used as the property editor for a data type

                    // Get saved prevalues for the datatype
                    var editorConfig = scope.model.config.editor;
                    if (!editorConfig || angular.isString(editorConfig)) {
                        editorConfig = [];
                    }

                    // Set up validators matching the selected prevalues for the datatype
                    // then apply those validators when the page is saved. Use Angular $setValidity to 
                    // allow or cancel the save operation.
                    var allValidators = new RichTextValidators();
                    var activeValidators = [];

                    angular.forEach(editorConfig.validators, function (validatorConfig) {
                        if (validatorConfig && validatorConfig.hasOwnProperty("max")) {
                            allValidators[validatorConfig.name].max = validatorConfig.max;
                        }
                        activeValidators.push(allValidators[validatorConfig.name]);
                    });


                    // Validation using the $parsers pipeline wasn't working with tinyMCE, but can be done by watching for 
                    // changes to $scope.model.value, which is updated from tinyMCE by the inherited controller. 
                    // Remove the watch when done to avoid a memory leak.
                    var stopWatching = scope.$watch('model.value', function () {
                        angular.forEach(activeValidators, function (validator) {
                            var valid = validator.validate(scope.model.value);
                            $("." + validator.id, elem).html(validator.message || validator.template);
                            scope.propertyForm.$setValidity(validator.id, valid);
                        });
                    });

                    scope.$on('$destroy', function () {
                        stopWatching();
                    });
                }
            }
        })
        .directive("validateRichTextGrid", function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    // Validate rich text when it's used as a grid editor

                    // Read validators for each grid editor from configuration in package.manifest,
                    // then apply those validators when the page is saved. Use Angular $setValidity to 
                    // allow or cancel the save operation.
                    var activeValidators = ReadConfigForGridEditor(scope, "validators", new RichTextValidators());

                    ApplyConfigToGridEditorOnSave(scope, activeValidators, function (control, validator) {
                        var valid = validator.validate(control.value);
                        $("." + validator.id, elem).html(validator.message || validator.template);

                        // We only need one validator to fail for the property to be invalid, so we are only testing if we haven't yet
                        // found a failure. This is important as one grid property can have multiple grid editors, and we want to make sure 
                        // that if one grid editor fails validation, it's not overridden by a success on a subsequent editor.
                        if (scope.propertyForm.$valid) {
                            scope.propertyForm.$setValidity(validator.id, valid);
                        }
                    }, function (alias) {
                        // On each form submission, the first time a particular grid editor alias is encountered reset the valid state to true.
                        // This allows validation to start again when resubmitting a page that has previously failed validation. By default it
                        // starts from the previous result, which is false.
                        for (var i = 0; i < activeValidators[alias].length; i++) {
                            let validator = activeValidators[alias][i];
                            scope.propertyForm.$setValidity(validator.id, true);
                        }
                    });
                }
            }
        })
        .directive("applyFormatters", function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {

                    // Format HTML in a rich text editor when it's used as the property editor for a data type

                    // Get saved prevalues for the datatype
                    var editorConfig = scope.model.config.editor;
                    if (!editorConfig || angular.isString(editorConfig)) {
                        editorConfig = [];
                    }

                    // Create the formatters which will be applied to HTML as it is saved.  
                    // Each one should be a function which accepts one string argument and returns a string. 
                    // Use ngModel.$formatters.push(formatter_function) to register a formatter.
                    var allFormatters = new RichTextFormatters();

                    angular.forEach(editorConfig.formatters, function (formatterId) {
                        ngModel.$formatters.push(allFormatters[formatterId]);
                    });

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
                }
            }
        })
        .directive("applyGridFormatters", function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    // Validate HTML in a rich text editor when it's used as a grid editor

                    // Read formatters for each grid editor from configuration in package.manifest,
                    // then apply those formatters to HTML as it is being saved. This is done on save rather 
                    // than on change to avoid moving the cursor unexpectedly in TinyMCE.
                    // Formatters are run only after all validators have passed.
                    var activeFormatters = ReadConfigForGridEditor(scope, "formatters", new RichTextFormatters());

                    ApplyConfigToGridEditorOnSave(scope, activeFormatters, function (control, format) {
                        control.value = format(control.value);
                    });
                }
            }
        })
}());