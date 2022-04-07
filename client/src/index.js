import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { ToggleColorMode } from './components/context/themeContext';



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToggleColorMode>
        <App />
      </ToggleColorMode>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

