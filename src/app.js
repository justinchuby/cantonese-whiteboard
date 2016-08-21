import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, Raw, Mark } from 'slate';
import { CantoDict, Jyutping, NotedChar } from './cantonese';
import * as cantonese_dictionary from './cantonese-dictionary';

console.log(Jyutping, NotedChar, CantoDict)
let cantoDict = new CantoDict(cantonese_dictionary.CANTO_DICT)

const initialState = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: '一个字 A line of text in a paragraph.'
        }
      ]
    }
  ]
}, { terse: true })

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
    let notedChar = cantoDict.getNotedChar(string[i])
    if (notedChar) {
      let type = `tone_${notedChar.jyutping.tone}`
      console.log(type)
      marks = marks.add(Mark.create({ type }))
      char = char.merge({ marks })
      characters = characters.set(i, char)
    }
  }
  return characters.asImmutable()
}


class App extends React.Component {

  state = {
    state: initialState,
    schema: {
      nodes: {
        paragraph: {
          render: props => <div className="board">{props.children}</div>,
          decorate: paragraphBlockDecorator
        }
      },
      marks: {
        tone_1: props => <span className="tone-1">{props.children}</span>,
        tone_2: props => <span className="tone-2">{props.children}</span>,
        tone_3: props => <span className="tone-3">{props.children}</span>,
        tone_4: props => <span className="tone-4">{props.children}</span>,
        tone_5: props => <span className="tone-5">{props.children}</span>,
        tone_6: props => <span className="tone-6">{props.children}</span>,
      }
    }
  }

  onChange = (state) => {
    this.setState({ state })
  }

  onKeyDown(event, data, state) {
    if (!event.metaKey) return

    switch (event.which) {
      case 66: {
        return state
          .transform()
          .toggleMark('tone_1')
          .apply()
      }
    }
  }

  render() {
    return (
      <Editor
        schema={this.state.schema}
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={(e, data, state) => this.onKeyDown(e, data, state)}
      />
    )
  }

};

ReactDOM.render(
        <App />,
        document.getElementById('test1')
);
