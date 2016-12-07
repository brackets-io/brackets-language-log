define(function(require, exports, module) {
  "use strict";

  var LanguageManager = brackets.getModule("language/LanguageManager");
  var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");
  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");


  CodeMirror.defineSimpleMode("log", {

    start: [ // The start state contains the rules that are intially used

      //string
      {regex: '[“"].*?["”]', token: "string"}, // string double
      {regex: '\'.*?\'', token: "string"}, // string single

      //comment
      {regex: /\/\/.*/, token: "comment"},
      {regex: /\/\*/, token: "comment", next: "comment"},

      // level
      {regex: /(?:notice)/i, token: "atom"},
      {regex: /(?:warning)/i, token: "header"},
      {regex: /(?:(error|fatal error|uncaught error))/i, token: "error"},

      // paths
      {regex: /[A-Z|a-z]:\\[^*|"<>?\n]*/g, token: "link"}, // file path -> http://stackoverflow.com/questions/24192199/java-regular-expression-for-file-path
      {regex: /[-a-zA-Z0-9:_\+.~#?&//=]{2,256}\.[^@\ ][a-z]{2,12}\b(\/[-a-zA-Z0-9:%_\+.~#?&//=]*)?/ig, token: "link"}, // url -> http://regexr.com/3b392
      {regex: /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/ig, token: "link"}, // ip -> http://regexr.com/38odc

      // TODO date
      // {regex: /((([A-Z][a-z]{2}\\s\\s?){1,2})|(^[0-9]{2}:?)|(^\\[)|((?!\\b)\\[[0-9]{2}\\))\ ([A-Z][a-z]{2} [A-Z][a-z]{2} .{1})?\ ([0-9]{2}?\\?[A-Z][a-z]{2})?\ [0-9./-]+ ?\ ([A-Z][a-z]{2} [0-9]{4} )?\ [0-9T.:\\/+]+\ (,[0-9]{3})?\ ( 20[0-9]{2}( :|\\]))?\ ( [A-Z]{3,4}\\])?\ ((\\]| [-+][0-9]{4}\\]))?/gmi, token: "comment"},
      // {regex: /(([A-Z][a-z]{2}\\s\\s?){1,2})|(^[0-9]{2}:?)/gmi, token: "comment"},
      // {regex: /^\\[[0-9]+\\.[0-9]+\\]/gmi, token: "comment"},
      // {regex: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/g, token: "comment"}, // highlight all caracters into square brace
      {regex: /\[(.*?)\]/, token: "comment"}, // highlight all char into square brace


      // TODO apache
      // {regex: /([2|3]0[0-9]{1}) [0-9]*$/gmi, token: "string"}, // highlight http response code (200, 300...)
    ],

    comment: [
      {regex: /.*?\*\//, token: "comment", next: "start"},
      {regex: /.*/, token: "comment"}
    ],

    // meta config
    meta: {
      dontIndentStates: ["comment"],
      lineComment: "//"
    }
  });

  CodeMirror.defineMIME("text/x-log", "log");

  LanguageManager.defineLanguage("log", {
    name: "Log",
    mode: "log",
    fileExtensions: ['log', 'syslog', 'out', 'output']
  });
});
