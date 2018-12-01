// @flow

import './czi-mathquill-editor.css';
import * as MathQuillEditorSymbols from './MathQuillEditorSymbols';
import MathQuill from 'node-mathquill/build/mathquill.js';
import MathQuillEditorSymbolsPanel from './MathQuillEditorSymbolsPanel';
import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import jquery from 'jquery';
import type {MathQuillEditorSymbol} from './MathQuillEditorSymbols';

const MQ = MathQuill.getInterface(2);

class MathQuillElement extends React.Component<any, any, any> {

  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Element<any> {
    return (
      <div
        className="czi-mathquill-editor-element"
        dangerouslySetInnerHTML={{__html: this.props.value}}
      />
    );
  }
}

class MathQuillEditor extends React.PureComponent<any, any, any> {
  props: {
    value: string,
    onChange?: ?(latex: string) => void,
  };

   // MathJax apparently fire 4 edit events on startup.
  _element = null;
  _ignoreEditEvents = 4;
  _mathField = null;
  _latex = '';

  render(): React.Element<any> {
    const {value} = this.props;
    const panels = [
      MathQuillEditorSymbols.OPERATORS,
      MathQuillEditorSymbols.STRUCTURE,
      MathQuillEditorSymbols.SYMBOLS,
      MathQuillEditorSymbols.TRIG,
      MathQuillEditorSymbols.VARIABLES,
    ].map(this._renderPanel);

    const empty = !value;
    const className = cx('czi-mathquill-editor', {empty});
    return (
      <div className={className}>
        <div className="czi-mathquill-editor-main">
          <MathQuillElement
            ref={this._onElementRef}
          />
        </div>
        <div className="czi-mathquill-editor-side">
          {panels}
        </div>
      </div>
    );
  }

  componentDidUpdate(): void {
    const mathField = this._mathField;
    if (this._latex !== this.props.value && mathField) {
      mathField.latex(this.props.value || ' ');
    }
  }

  componentDidMount(): void {
    const config = {
      autoCommands: 'pi theta sqrt sum',
      autoOperatorNames: 'sin cos',
      restrictMismatchedBrackets: true,
      handlers: {
        edit: this._onEdit,
      },
    };

    const mathField = MQ.MathField(this._element, config);
    this._mathField = mathField;
    mathField.latex(this.props.value || ' ');
  }

  _renderPanel = (
    symbols: {title: string, symbols: Array<MathQuillEditorSymbol>},
    ii: number,
  ): React.Element<any> => {
    return (
      <MathQuillEditorSymbolsPanel
        key={`s${ii}`}
        onSelect={this._onSymbolSelect}
        symbols={symbols}
      />
    );
  };

  _onSymbolSelect = (symbol: MathQuillEditorSymbol): void => {
    const {latex, cmd} = symbol;
    const mathField = this._mathField;
    if (!mathField || !cmd || !latex) {
      return;
    }
    if (cmd === 'write') {
      mathField.write(latex);
    } else if (cmd === 'cmd') {
      mathField.cmd(latex);
    }
    mathField.focus();
  };

  _onEdit = (mathField: any): void => {
    if (this._ignoreEditEvents > 0) {
      this._ignoreEditEvents -= 1
      return
    }

    const {onChange} = this.props;
    const latex = mathField.latex();
    this._latex = latex;
    onChange && onChange(latex);
  };

  _onElementRef = (ref: any): void => {
    if (ref) {
      this._element = ReactDOM.findDOMNode(ref);
    } else {
      this._element = null;
    }
  };
}

export default MathQuillEditor;