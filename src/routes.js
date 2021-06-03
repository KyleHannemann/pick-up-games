import {Switch, Route} from 'react-router-dom';
import Login from './components/Login';
import Dash from './components/Dash';
import EditProfile from './components/EditProfile';
import Map from './components/Map'
import CreateGame from './components/CreateGame';
import Game from './components/Game';
import User from './components/User';
import Friends from './components/Friends';

export default(
    <Switch>
        <Route exact path="/" component={Login}/>
        <Route exact path="/dash" component={Dash}/>
        <Route exact path="/edit/profile" component={EditProfile}/>
        <Route exact path="/map" component={Map}/>
        <Route exact path="/create/game" component={CreateGame}/>
        <Route path="/game/:gameId" component={Game}/>
        <Route path="/users/:userId" component={User}/>
        <Route path="/friends" component={Friends}/>
    </Switch>
)