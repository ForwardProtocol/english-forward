import React from 'react';
import ReactDOM from 'react-dom';
import App from './Main/App';
import reportWebVitals from './reportWebVitals';
import { Router, Route } from 'react-router-dom';
import history from './Services/History';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';

import configureStore from './AppRedux/store';
const store = configureStore(/* provide initial state if any */);
const NextApp = () => (
  <Provider store={store}>
    <React.StrictMode>
      <Router history={history}>
        {/* <App /> */}
        <BrowserRouter >
          <Route path="/" component={App} />
        </BrowserRouter>
      </Router>
    </React.StrictMode>
  </Provider>
);
export default NextApp;
