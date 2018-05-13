import React from 'react';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: Documentation
**
*/

/*
Časť, ktorá ma na starosti dokumentáciu aplikácie. Konkrétne popisuje, aké balíky používateľ
potrebuje k tomu, aby mohol používať vygenerovaný kód zo sekventových dôkazov a Taylorovych diagramov
vo vlastnom projekte.
*/

export const Documentation = () => {
  return (
    <div className="docs-container">
      <h1>Documentation</h1>
      <h2>Sequence math - LaTeX package</h2>
      <p>
        To use generated code in your own LaTeX project, you have to download and add package to
        your project. You can download package{' '}
        <a href="http://math.ucsd.edu/~sbuss/ResearchWeb/bussproofs/">here</a>. Then you should add
        package to your project like this:
        <pre>
          <code>\usepackage&#123;bussproofs&#125;</code>
        </pre>
      </p>
      <h2>Taylor diagram - LaTeX package</h2>
      To use generated code in your own LaTeX project, you have to download and add package to your
      project. You can download package <a href="http://www.paultaylor.eu/diagrams/">here</a>. Then
      you should add package to your project like this:
      <pre>
        <code>\usepackage[small,nohug,heads=vee]&#123;diagrams&#125;</code>
      </pre>
    </div>
  );
};

export default Documentation;
