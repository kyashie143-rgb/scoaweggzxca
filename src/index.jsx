import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import './style.css'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/Register/RegisterPage'
import LandingPage from './pages/Landing/LandingPage'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminPanel from './pages/Admin/AdminPanel'
import NotFound from './pages/NotFound/NotFound'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route component={LoginPage} exact path="/" />
        <Route component={RegisterPage} exact path="/register" />
        <Route component={LandingPage} exact path="/landing" />
        <Route component={AdminLogin} exact path="/ky1/login" />
        <Route component={AdminPanel} exact path="/ky1/panel" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
