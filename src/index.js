import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';

/*  global document: false, console: false */

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
