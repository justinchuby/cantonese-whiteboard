import React from 'react'
import ReactDOM from 'react-dom'
import { Editor, Raw, Mark, Plain } from 'slate'
import { CantoDict, Jyutping, NotedChar } from './cantonese'
import 'whatwg-fetch'
import initialState from './state.json'

let cantoDict = new CantoDict("")

/**
 * Define a decorator for blocks.
 *
 * @param {Text} text
 * @param {Block} block
 */

function paragraphBlockDecorator(text, block) {
  let characters = text.characters.asMutable()
  const string = text.text
  for (let i = 0; i < string.length; i++) {
    let char = characters.get(i)
    let { marks } = char
    let in_str = ""
    if (string.length <= 4) {
      in_str = string
    } else {
      in_str = string.slice((i-2 >= 0) ? i-2 : 0, i+3) || ""
    }
    // console.log(string[i], in_str)
    let notedChar = cantoDict.getNotedChar(string[i], in_str)
    // console.log(notedChar)
    if (notedChar) {
      // The order of adding marks affects the color of ruby.
      let type = `tone_${notedChar.jyutping.tone}`
      marks = marks.add(Mark.create({ type: type }))
      marks = marks.add(Mark.create({ type: "pinyin", data: {notedChar: notedChar} }))
      char = char.merge({ marks })
      characters = characters.set(i, char)
    }
  }
  return characters.asImmutable()
}

function MarkHotkey(options) {
  const { type, code } = options
  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, data, state) {
      // Check that the key pressed matches our `code` option.
      if (!event.metaKey || event.which != code) return
      // Toggle the mark `type`.
      return state
        .transform()
        .toggleMark(type)
        .apply()
    }
  }
}

function BlockHotkey(options) {
  const { type, code } = options
  const typeTransition = {
    "line": "colored_jyutping_paragraph",
    "colored_jyutping_paragraph": "colored_paragraph",
    "colored_paragraph": "line"
  }
  return {
    onKeyDown(event, data, state) {
      // Check that the key pressed matches our `code` option.
      if (event.which != code) return
      if (!event.metaKey) {
        if (type == "") {
          event.preventDefault()
          let currentType = state.blocks.get(0).type
          let nextType = typeTransition[currentType]
          return state
            .transform()
            .setBlock(nextType)
            .apply()
        } else {
          return
        }
      }
      return state
        .transform()
        .setBlock(type)
        .apply()
    }
  }
}

const plugins = [
  MarkHotkey({ code: 66, type: 'bold' }), // Key B
  MarkHotkey({ code: 73, type: 'italic' }), // Key I
  // MarkHotkey({ code: 68, type: 'strikethrough' }),
  MarkHotkey({ code: 85, type: 'underline' }), // Key U
  BlockHotkey({ code: 74, type: 'colored_jyutping_paragraph' }), // Key J
  BlockHotkey({ code: 75, type: 'colored_paragraph' }), // Key K
  BlockHotkey({ code: 9, type: '' }), // Key Tab
]

class App extends React.Component {
  state = {
    state: Raw.deserialize(initialState, { terse: true }),
    schema: {
      nodes: {
        line: {
          render: props => <div className="board line">{props.children}</div>,
        },
        colored_jyutping_paragraph: {
          render: props => <div className="board colored jyutping">{props.children}</div>,
          decorate: paragraphBlockDecorator
        },
        colored_paragraph: {
          render: props => <div className="board colored no-jyutping">{props.children}</div>,
          decorate: paragraphBlockDecorator
        },
        wrapper: {
          render: props => <div>{props.children}</div>,
        },
        // jyutping_paragraph: {
        //   render: props => <div className="board jyutping">{props.children}</div>,
        //   decorate: paragraphBlockDecorator
        // }
      },
      marks: {
        // props.mark.data.get("notedChar").jyutping.pinyin
        tone_1: props => <span className="tone-1">{props.children}</span>,
        tone_2: props => <span className="tone-2">{props.children}</span>,
        tone_3: props => <span className="tone-3">{props.children}</span>,
        tone_4: props => <span className="tone-4">{props.children}</span>,
        tone_5: props => <span className="tone-5">{props.children}</span>,
        tone_6: props => <span className="tone-6">{props.children}</span>,
        pinyin: props => <ruby>{props.children}<rt>{props.mark.data.get("notedChar").jyutping.pinyin}</rt></ruby>,
        bold: props => <strong>{props.children}</strong>,
        italic: props => <em>{props.children}</em>,
        // strikethrough: props => <del>{props.children}</del>,
        underline: props => <u>{props.children}</u>,
        // pinyin: props => <div className="popup" title={props.mark.data.get("notedChar").jyutping.pinyin}>{props.children}</div>
      }
    }
  }

  onChange = (state) => {
    this.setState({ state })
  }

  onDocumentChange(document, state) {
    const string = JSON.stringify(Raw.serialize(state, { terse: true }))
    // console.log(string)
    const encodedContent = encodeURIComponent(string)
    window.location.hash = "#" + encodedContent
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange(this));
    let fetched = false
    let self = this
    // Load dictionary
    fetch('./data/cantonese-dictionary.json')
      .then(function(response) {
        return response.json()
      }).catch(function(ex) {
        console.warn('parsing failed', ex)
      }).then(function(json) {
        cantoDict = new CantoDict(json.dictionary)
      }).then(function() {
        self.refreshDocument(self)
      })
  }

  refreshDocument(self) {
    let next = self.state.state
      .transform()
      .wrapBlock('wrapper')
      .apply()
    self.onChange(next)
    next = self.state.state
      .transform()
      .unwrapBlock('wrapper')
      .apply()
    self.onChange(next)
  }

  onHashChange(self) {
    const hashContent = decodeURIComponent(location.hash.slice(1))
    if (hashContent) {
      try {
        const stateObj = JSON.parse(hashContent);
        const hashState = Raw.deserialize(stateObj, { terse: true })
        self.onChange(hashState)
      } catch (err) {
        console.warn(err)
        let hashState = Plain.deserialize(hashContent)
        hashState = hashState
          .transform()
          .setBlock('paragraph')
          .apply()
        self.onChange(hashState)
      }
    }
  }

  render() {
    return (
      <Editor
        schema={this.state.schema}
        state={this.state.state}
        plugins={plugins}
        onChange={this.onChange}
        onDocumentChange={(document, state) => this.onDocumentChange(document, state)}
        componentDidMount={this.componentDidMount}
      />
    )
  }
};

ReactDOM.render(
        <App />,
        document.getElementById('app')
);
