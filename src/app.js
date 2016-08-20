
import React from 'react'
import ReactDOM from 'react-dom'
import { Editor, Raw, Mark } from 'slate'
import Canto from 'canto'


const initialState = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'A line of text in a paragraph.'
        }
      ]
    }
  ]
}, { terse: true })

// Initialize a plugin for each mark...
const plugins = [
  MarkHotkey({ tone: 1, type: 'tone_1' }),
  MarkHotkey({ tone: 2, type: 'tone_2' }),
  MarkHotkey({ tone: 3, type: 'tone_3' }),
  MarkHotkey({ tone: 4, type: 'tone_4' }),
  MarkHotkey({ tone: 5, type: 'tone_5' }),
  MarkHotkey({ tone: 6, type: 'tone_6' })
]


/**
 * Define a decorator for blocks.
 *
 * @param {Text} text
 * @param {Block} block
 */

function codeBlockDecorator(text, block) {
  let characters = text.characters.asMutable()
  // const language = block.data.get('language')
  const string = text.text
  // const grammar = Prism.languages[language]
  // const tokens = Prism.tokenize(string, grammar)
  const tokens = Canto.tokenize(string)
  let offset = 0

  // for (const token of tokens) {
  //   if (typeof token == 'string') {
  //     offset += token.length
  //     continue
  //   }
  //
  //   const length = offset + token.content.length
  //   const type = `${token.type}`

    for (let i = 0; i < characters.length; i++) {
      let char = characters.get(i)
      let { marks } = char
      let jyutping = Canto.getJyut(char)
      // jyut = {
      content: string,
      tone: string,

    }
      let type = Canto.getToneFromJyut(jyut)
      marks = marks.add(Mark.create({ type }))
      char = char.merge({ marks })
      characters = characters.set(i, char)
    }

  //   offset = length
  // }

  return characters.asImmutable()
}

class App extends React.Component {

  state = {
    state: initialState,
    schema = {
      nodes: {
        paragraph: {
          render: props => <div class="board">{props.children}</div>,
          decorate: toneHigh
        },
      marks: {
        tone_1: props => <span class="tone-1">{props.children}</span>,
        tone_2: props => <span class="tone-2">{props.children}</span>,
        tone_3: props => <span class="tone-3">{props.children}</span>,
        tone_4: props => <span class="tone-4">{props.children}</span>,
        tone_5: props => <span class="tone-5">{props.children}</span>,
        tone_6: props => <span class="tone-6">{props.children}</span>,
      }
    }
  }

  render() {
    return (
      <Editor
        plugins={plugins}
        schema={this.state.schema}
        state={this.state.state}
        onChange={state => this.setState({ state })}
      />
    )
  }

};


function MarkHotkey(options) {
  const { type, tone } = options

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, data, state) {


      // Toggle the mark `type`.
      return state
        .transform()
        .toggleMark(type)
        .apply()
    }
  }
}

console.log("here");
ReactDOM.render(
        <App />,
        document.getElementById('test1')
);
