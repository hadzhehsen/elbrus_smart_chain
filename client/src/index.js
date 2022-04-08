import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom';
=======
import { BrowserRouter } from 'react-router-dom'
import { ToggleColorMode } from './components/context/themeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from './redux/store';


>>>>>>> origin/testBranch

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>

    <BrowserRouter>
      <ToggleColorMode>
        <App />
      </ToggleColorMode>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
