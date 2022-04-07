
import Auth from './pages/Auth/Auth'
import Requests from './pages/requests/index'
import { RequireAuth } from './pages/Auth/RequireAuth';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; 
import { Redirect } from 'react-router'

function App() {
  return (
    <Router>
    <Switch>    
      <Route exact path="/"   render={() => (  RequireAuth() ?<Requests />  : <Redirect to="/auth"/> )}  />    
      <Route exact path="/auth" component={Auth} />     
    </Switch>
  </Router>
  ) 
}

export default App;
