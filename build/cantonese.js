"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Jyutping = function Jyutping(jyutString) {
  _classCallCheck(this, Jyutping);

  this.content = jyutString;

  var _ref = function (content) {
    var match = content.match(/([a-zA-Z]+)(\d)/);
    var ping = null;
    var tone = null;
    if (match) {
      ping = match[1];
      tone = match[2];
    }
    return {
      ping: ping,
      tone: tone
    };
  }(this.content);

  var ping = _ref.ping;
  var tone = _ref.tone;


  this.ping = ping;
  this.tone = tone;
};

var NotedChar = function NotedChar(char) {
  _classCallCheck(this, NotedChar);

  this.content = "我";
  this.jyutping = new Jyutping("ngo5");
};