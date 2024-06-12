import {BrowserRouter,Route,Switch} from 'react-router-dom'
import './App.css'
import Login from './Component/Login'
import Register from './Component/Register'
import Home  from './Component/Home'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route  path="/login" component={Login} />
      <Route  path="/register" component={Register} />
      <Route path="/" component={Home} />
    </Switch>
  </BrowserRouter>
)


export default App;
