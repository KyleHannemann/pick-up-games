import {Switch, Route} from 'react-router-dom';
import Login from './components/Login';
import Dash from './components/Dash';
import EditProfile from './components/EditProfile';
import Map from './components/Map'
import CreateGame from './components/CreateGame';

export default(
    <Switch>
        <Route exact path="/" component={Login}/>
        <Route exact path="/dash" component={Dash}/>
        <Route exact path="/edit/profile" component={EditProfile}/>
        <Route exact path="/map" component={Map}/>
        <Route exact path="/create/game" component={CreateGame}/>
    </Switch>
)