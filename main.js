define(function(require, exports, module) {
  "use strict";

  var LanguageManager = brackets.getModule("language/LanguageManager");
  var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");
  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");


  CodeMirror.defineSimpleMode("log", {

    start: [ // The start state contains the rules that are intially used

      // string
      {regex: '[“"].*?["”]', token: "string"}, // string double
      {regex: '\'.*?\'', token: "string"}, // string single

      // comment
      {regex: /\/\/.*/, token: "comment"},
      {regex: /\/\*/, token: "comment", next: "comment"},

      // level
      {regex: /(?:(notice|note))/i, token: "rangeinfo"},
      {regex: /(?:warning)/i, token: "header"},
      {regex: /(?:(error|fatal error|uncaught error))/i, token: "error"},

      // email
      {regex: /\<(.*?)\>/, token: "string"}, // highlight all caracters into <> (smtp.log)
      {regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/im, token: "string"}, // highlight email adress

      // paths
      {regex: /[A-Z|a-z]:\\[^*|"<>?\n]*/, token: "link"}, // file path -> http://stackoverflow.com/questions/24192199/java-regular-expression-for-file-path
      {regex: /[-a-zA-Z0-9:_\+.~#?&//=]{2,256}\.[^@\ ][a-z]{2,12}\b(\/[-a-zA-Z0-9:%_\+.~#?&//=]*)?/, token: "link"}, // url -> http://regexr.com/3b392
      {regex: /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/, token: "link"}, // ip -> http://regexr.com/38odc

      // TODO date
      // date (alternative)
      {regex: /\[(.*?)\]/, token: "comment"}, // highlight all caracters into square brace []

      // apache
      {regex: / ([2|3]0[0-9]{1}) /gm, token: "rangeinfo"}, // highlight http response code (200, 300...)
      {regex: / ([4|5][0-9]{2}) /gm, token: "error"}, // highlight http response code (400, 500...)

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
