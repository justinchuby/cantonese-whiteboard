'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _slate = require('slate');

var _cantonese = require('cantonese');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var initialState = _slate.Raw.deserialize({
  nodes: [{
    kind: 'block',
    type: 'paragraph',
    nodes: [{
      kind: 'text',
      text: 'A line of text in a paragraph.'
    }]
  }]
}, { terse: true });

// Initialize a plugin for each mark...
var plugins = [MarkHotkey({ tone: 1, type: 'tone_1' }), MarkHotkey({ tone: 2, type: 'tone_2' }), MarkHotkey({ tone: 3, type: 'tone_3' }), MarkHotkey({ tone: 4, type: 'tone_4' }), MarkHotkey({ tone: 5, type: 'tone_5' }), MarkHotkey({ tone: 6, type: 'tone_6' })];

/**
 * Define a decorator for blocks.
 *
 * @param {Text} text
 * @param {Block} block
 */

function codeBlockDecorator(text, block) {
  var characters = text.characters.asMutable();
  // const language = block.data.get('language')
  var string = text.text;
  // const grammar = Prism.languages[language]
  // const tokens = Prism.tokenize(string, grammar)
  // const tokens = Canto.tokenize(string)
  // let offset = 0

  // for (const token of tokens) {
  //   if (typeof token == 'string') {
  //     offset += token.length
  //     continue
  //   }
  //
  //   const length = offset + token.content.length
  //   const type = `${token.type}`

  for (var i = 0; i < characters.length; i++) {
    var char = characters.get(i);
    var _char = char;
    var marks = _char.marks;

    var notedChar = (0, _cantonese.NotedChar)(char);
    var type = 'tone-' + notedChar.jyutping.tone;
    marks = marks.add(_slate.Mark.create({ type: type }));
    char = char.merge({ marks: marks });
    characters = characters.set(i, char);
  }

  //   offset = length
  // }

  return characters.asImmutable();
}

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(App)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
      state: initialState,
      schema: {
        nodes: {
          paragraph: {
            render: function render(props) {
              return _react2.default.createElement(
                'div',
                { className: 'board' },
                props.children
              );
            },
            decorate: codeBlockDecorator
          }
        },
        marks: {
          tone_1: function tone_1(props) {
            return _react2.default.createElement(
              'span',
              { style: 'color:red;' },
              props.children
            );
          },
          tone_2: function tone_2(props) {
            return _react2.default.createElement(
              'span',
              { className: 'tone-2' },
              props.children
            );
          },
          tone_3: function tone_3(props) {
            return _react2.default.createElement(
              'span',
              { className: 'tone-3' },
              props.children
            );
          },
          tone_4: function tone_4(props) {
            return _react2.default.createElement(
              'span',
              { className: 'tone-4' },
              props.children
            );
          },
          tone_5: function tone_5(props) {
            return _react2.default.createElement(
              'span',
              { className: 'tone-5' },
              props.children
            );
          },
          tone_6: function tone_6(props) {
            return _react2.default.createElement(
              'span',
              { className: 'tone-6' },
              props.children
            );
          }
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(_slate.Editor, {
        plugins: plugins,
        schema: this.state.schema,
        state: this.state.state,
        onChange: function onChange(state) {
          return _this2.setState({ state: state });
        }
      });
    }
  }]);

  return App;
}(_react2.default.Component);

;

// function MarkHotkey(options) {
//   const { type, tone } = options
//
//   // Return our "plugin" object, containing the `onKeyDown` handler.
//   return {
//     onKeyDown(event, data, state) {
//       // Toggle the mark `type`.
//       return state
//         .transform()
//         .toggleMark(type)
//         .apply()
//     }
//   }
// }

console.log("here");
_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('test1'));