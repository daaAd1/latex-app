import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import copyIcon from '../../img/content-copy.svg';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: LatexCode
**
*/

/*
Tento komponent má na starosti zobrazenie vygenerovaného LaTeX kódu v samostatnom kontajneri.
Taktiež umožňuje kopírovanie tohto kódu pomocou tlačidla na to určeného alebo kliknutím na samotný text.
Komponent dostáva vygenerovaný kód od rodiča.
*/

class LatexCode extends React.PureComponent {
  static checkCodeForSpecialSymbolsAndReplaceThem(string) {
    // top, bot, lor, land, rightarrow, leftarrow, \char"1D205, 0x22a2, 0x22a3
    return string
      .replace(new RegExp('⋁', 'g'), '\\land')
      .replace(new RegExp('⋀', 'g'), '\\lor')
      .replace(new RegExp('→', 'g'), '\\rightarrow')
      .replace(new RegExp('←', 'g'), '\\leftarrow')
      .replace(new RegExp('⊤', 'g'), '\\top')
      .replace(new RegExp('⊥', 'g'), '\\bot');
  }

  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      innerHtml: LatexCode.checkCodeForSpecialSymbolsAndReplaceThem(props.code),
    };

    this.copyText = this.copyText.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.code !== this.state.innerHtml) {
      this.setState({
        innerHtml: LatexCode.checkCodeForSpecialSymbolsAndReplaceThem(nextProps.code),
      });
    }
    if (nextProps.copied !== this.state.copied) {
      this.setState({
        copied: nextProps.copied,
      });
    }
  }

  generateDangerousHTML() {
    return { __html: this.state.innerHtml };
  }

  copyText() {
    return this.state.innerHtml.replace(new RegExp('&#92;', 'g'), '\\');
  }

  render() {
    return (
      <div className="code-container">
        <pre>
          <CopyToClipboard text={this.copyText()} onCopy={() => this.setState({ copied: true })}>
            <span dangerouslySetInnerHTML={this.generateDangerousHTML()} />
          </CopyToClipboard>
          <div className="copied-container">
            <CopyToClipboard
              text={this.copyText()}
              onCopy={() => {
                this.setState({ copied: true });
              }}
            >
              <img alt="copy-icon" src={copyIcon} className="copy-button" />
            </CopyToClipboard>
            {this.state.copied ? (
              <span className="copied-text" style={{ color: 'green' }}>
                Copied.
              </span>
            ) : null}
          </div>
        </pre>
      </div>
    );
  }
}

LatexCode.propTypes = {
  code: PropTypes.string.isRequired,
  copied: PropTypes.bool,
};

LatexCode.defaultProps = {
  copied: false,
};

export default LatexCode;
