import React, { useRef, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './../assets/style.css';
import './../assets/App.scss';
//import 'font-awesome/css/font-awesome.min.css';
import MainApp from './MainApp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App(props) {
  let { match } = props;
  
  return (
    <>
      <BrowserRouter>
        <Switch>
          {/* <Route path="/register" component={SignUp} />
      <Route path="/dashboard" component={Dashboard} isPrivate /> */}
          {/* redirect user to SignIn page if route does not exist and user is not authenticated */}
          <Route path={`${match.url}`} component={MainApp} {...props} />
        </Switch>
      </BrowserRouter>
      <ToastContainer hideProgressBar={true} autoClose={3000} />
    </>
  )
}

export default App;
