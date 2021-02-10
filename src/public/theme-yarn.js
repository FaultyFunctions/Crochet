define("ace/theme/yarn",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-yarn";
exports.cssText = "\
.ace-yarn .ace_gutter {\
background: #e8e8e8;\
color: #AAA;\
}\
.ace-yarn  {\
background: #fff;\
color: #000;\
}\
.ace-yarn .ace_comment {\
color: #00c171;\
}\
.ace-yarn .ace_hashtag {\
color: #00c171;\
}\
.ace-yarn .ace_keyword {\
color: #e93ecf;\
}\
.ace-yarn .ace_variable {\
color: #e93ecf;\
}\
.ace-yarn .ace_function {\
color: #e93ecf;\
}\
.ace-yarn .ace_numeric {\
color: #e93ecf;\
}\
.ace-yarn .ace_boolean {\
color: #e93ecf;\
}\
.ace-yarn .ace_shortcut {\
color: #e93ecf;\
}\
.ace-yarn .ace_string {\
color: #e93ecf;\
}\
.ace-yarn .ace_nametag {\
color: #e93ecf;\
}\
.ace-yarn .ace_node_name {\
color: #e93ecf;\
}\
.ace-yarn .ace_command_open, .ace-yarn .ace_command_close {\
color: #e00ec0;\
}\
.ace-yarn .ace_expression_open, .ace-yarn .ace_expression_close {\
color: #e00ec0;\
}\
.ace-yarn .ace_variable.ace_instance {\
color: teal;\
}\
.ace-yarn .ace_cursor {\
color: black;\
}\
.ace-yarn .ace_marker-layer .ace_active-line {\
background: rgb(255, 255, 204);\
}\
.ace-yarn .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-yarn.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px white;\
border-radius: 2px;\
}\
.ace-yarn.ace_nobold .ace_line > span {\
font-weight: normal !important;\
}\
.ace-yarn .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-yarn .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-yarn .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-yarn .ace_gutter-active-line {\
background-color : rgba(0, 0, 0, 0.07);\
}\
.ace-yarn .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-yarn .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-yarn .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}";

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});