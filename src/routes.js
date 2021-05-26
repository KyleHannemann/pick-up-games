import {Switch, Route} from 'react-router-dom';
import Login from './components/Login';
import Dash from './components/Dash'

export default(
    <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/dash" component={Dash}/>
    </Switch>
)