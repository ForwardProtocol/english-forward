import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './Main/App';
import reportWebVitals from './reportWebVitals';
import { Router, Route } from 'react-router-dom';
import history from './Services/History';
import NextApp from './NextApp';
const render = Component => {
  ReactDOM.render(
    <NextApp />,
    document.getElementById('root')
  );
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
render(NextApp);