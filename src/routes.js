import {Switch, Route} from 'react-router-dom';
import Login from './components/Login';
import Dash from './components/Dash';
import EditProfile from './components/EditProfile'

export default(
    <Switch>
        <Route exact path="/" component={Login}/>
        <Route exact path="/dash" component={Dash}/>
        <Route exact path="/edit/profile" component={EditProfile}/>
    </Switch>
)