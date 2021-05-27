import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios'
import { setUser} from '../redux/authReducer';
import {useHistory} from 'react-router-dom';
import {Link} from 'react-router-dom';

const Navbar = () => {
    const {user} = useSelector((store=>store.auth));
    const history = useHistory();
    const dispatch = useDispatch();
    const logout = () => {
        axios.get('/auth/logout').then(res=>{
            if (res.status === 200){
                dispatch(setUser(null));
                history.push('/')
            }
        })
    }
    return(
        <div>
        {user? <div id="navBar">
        <div><img className="profilePicLarge" src={user.picture}/></div>
        <div>{user.username}</div>
        <Link to="/dash"><div>Home</div></Link>
        <div>Friends</div>
        <div>Create Game</div>
        <div>Invites</div>
        <div>Discover Games</div>
        <Link to="/edit/profile"><div>Edit Profile</div></Link>
        <div onClick={logout}>Logout</div>
    </div>:
    <div></div>
}
</div>
     
    )
}
export default Navbar;
