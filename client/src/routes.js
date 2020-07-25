import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './components/pages/home';
import Register from './components/pages/register';
import Patient from './components/pages/patient';
import Owner from './components/pages/owner';
import Download from './components/pages/getDocument';
import Doctor from './components/pages/doctor';

// RETRIVES COMPONENTS BASED ON STATUS
const Status = function ({ code, children }) {
  return (
    <Route render={function ({ staticContext }) {
      if (staticContext)
        staticContext.status = code
      return children
    }} />
  )
}
//NOT-FOUND COMPONENT
const NotFound = function () {
  return (
    <Status code={404}>
      <div>
        <h2> Sorry, cannot find this page</h2>
      </div>
    </Status>
  )
}


const routes = (
  <div>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path='/patient' component={Patient} />
      <Route path='/owner' component ={Owner} />
      <Route path='/download' component={Download}/>
      <Route path='/doctor' component={Doctor}/>
      <Route component={NotFound} />
    </Switch>
  </div>
);

export default routes;