import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import MetamaskProvider from './components/MetamaskProvider';

ReactDOM.render(
  <React.StrictMode>
    {/* <MetamaskProvider> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </MetamaskProvider> */}
  </React.StrictMode>,
  document.getElementById('root'),
);
