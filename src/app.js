import React from 'react'
import ReactDOM from 'react-dom'
import { Editor, Raw, Mark } from 'slate'
import { CantoDict, Jyutping, NotedChar } from './cantonese'
import * as cantonese_dictionary from './cantonese-dictionary'
import initialState from './state.json'

const cantoDict = new CantoDict(cantonese_dictionary.CANTO_DICT)

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
    let in_str = string.slice(i-1, i+3) || ""
    // console.log(string[i], in_str)
    let notedChar = cantoDict.getNotedChar(string[i], in_str)
    // console.log(notedChar)
    if (notedChar) {
      let type = `tone_${notedChar.jyutping.tone}`
      // The order of adding marks affects the color of ruby.
      marks = marks.add(Mark.create({ type: type }))
      marks = marks.add(Mark.create({ type: "pinyin", data: {notedChar: notedChar} }))
      char = char.merge({ marks })
      characters = characters.set(i, char)
      // console.log(marks)
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

const plugins = [
  MarkHotkey({ code: 66, type: 'bold' }),
  MarkHotkey({ code: 73, type: 'italic' }),
  // MarkHotkey({ code: 68, type: 'strikethrough' }),
  MarkHotkey({ code: 85, type: 'underline' })
]

class App extends React.Component {
  state = {
    state: Raw.deserialize(initialState, { terse: true }),
    schema: {
      nodes: {
        paragraph: {
          render: props => <div className="board">{props.children}</div>,
          decorate: paragraphBlockDecorator
        }
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

  render() {
    return (
      <Editor
        schema={this.state.schema}
        state={this.state.state}
        plugins={plugins}
        onChange={this.onChange}
      />
    )
  }

};

ReactDOM.render(
        <App />,
        document.getElementById('app')
);
