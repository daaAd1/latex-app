import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: Symbols
**
*/

/*
Komponent, ktorý zobrazuje používané symboly, ktoré nie je jednoduché napísať na klávesnici.
Tieto symboly je možné skopírovať kliknutím.
*/

class Symbols extends React.PureComponent {
  render() {
    // this contains CopyToClipboard component, that receives props,
    // thas why I kept is as PureComponent instead of stateless
    return (
      <div className="symbol-container">
        <pre>
          <CopyToClipboard text="&#8866;">
            <span>⊢</span>
          </CopyToClipboard>
          <CopyToClipboard text="&#8867;">
            <span>⊣</span>
          </CopyToClipboard>
          <CopyToClipboard text="&#8868;">
            <span>⊤</span>
          </CopyToClipboard>
          <CopyToClipboard text="&#8869;">
            <span>⊥</span>
          </CopyToClipboard>
        </pre>
        <pre>
          <CopyToClipboard text="&#8897;">
            <span>&#8897;</span>
          </CopyToClipboard>
          <div>
            <CopyToClipboard text="&#8896;">
              <span>⋀</span>
            </CopyToClipboard>
          </div>
          <CopyToClipboard text="&#8594;">
            <span>→</span>
          </CopyToClipboard>
          <CopyToClipboard text="&#8592;">
            <span>←</span>
          </CopyToClipboard>
        </pre>
      </div>
    );
  }
}

export default Symbols;
