import React, { } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';

class Symbols extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        copied: false,
        //innerHtml: props.code,
      }

      this.copyText = this.copyText.bind(this);
    }

    /*componentWillReceiveProps(nextProps) {
      if (nextProps.code !== this.state.innerHtml) {
          this.setState({ 
              innerHtml: nextProps.code 
          });
      }
      if (nextProps.copied !== this.state.copied) {
          this.setState({ 
              copied: nextProps.copied
            });
      }
    }*/

    copyText() {
      return this.state.innerHtml.replace(new RegExp("&#92;", 'g'), '\\');
    }

    render() {
        return(
            <div className="symbol-container">
                <pre >
                    <CopyToClipboard text="&#8866;"
                    onCopy={() => this.setState({copied: true})}>
                    <span>⊢</span>
                    </CopyToClipboard>
                    <CopyToClipboard text="&#8867;"
                    onCopy={() => this.setState({copied: true})}>
                    <span>⊣</span>
                    </CopyToClipboard>
                    <CopyToClipboard text="&#8868;"
                    onCopy={() => this.setState({copied: true})}>
                    <span>⊤</span>
                    </CopyToClipboard>
                    <CopyToClipboard text="&#8869;"
                    onCopy={() => this.setState({copied: true})}>
                    <span>⊥</span>
                    </CopyToClipboard>
                    </pre>
                    <pre>
                    <CopyToClipboard text="&#8897;"
                    onCopy={() => this.setState({copied: true})}>
                    <span>⋁</span>
                    </CopyToClipboard>
                    <div>
                    <CopyToClipboard text="&#8896;"
                    onCopy={() => this.setState({copied: true})}>
                    <span>⋀</span>
                    </CopyToClipboard>
                    </div>
                    <CopyToClipboard text="&#8594;"
                    onCopy={() => this.setState({copied: true})}>
                    <span>→</span>
                    </CopyToClipboard>
                    <CopyToClipboard text="&#8592;"
                    onCopy={() => this.setState({copied: true})}>
                    <span>←</span>
                    </CopyToClipboard>
                </pre>                
            </div>
        )
    }
}

export default Symbols;