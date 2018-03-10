import React, { } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import copyIcon from "./content-copy.svg";

class LatexCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            innerHtml: props.code
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.code !== this.state.innerHtml) {
          this.setState({ 
              innerHtml: nextProps.code 
            })
        }
      }

    generateDangerousHTML() {
        return {__html: this.state.innerHtml}
    }

    render() {
        return(
            <div className="code-container">
                <pre >
                    <CopyToClipboard text={this.copyText}
                    onCopy={() => this.setState({copied: true})}>
                    <span  dangerouslySetInnerHTML= 
                    {this.generateDangerousHTML()}></span>
                    </CopyToClipboard>
            
                    <div className="copied-container">
                    <CopyToClipboard text={this.copyText}
                        onCopy={() =>{this.setState({copied: true})} }>
                        <img alt="copy-icon" src={copyIcon} className="copy-button"/>
                    </CopyToClipboard>
            
                    {this.state.copied ? <span className="copied-text" style={{color: 'green'}}>Copied.</span> : null}
                    </div>
                </pre>
            </div>
        )
    }
}

export default LatexCode;