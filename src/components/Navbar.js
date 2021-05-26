import React from 'react';
import {useSelector} from 'react-redux';

const Navbar = () => {
    const {user} = useSelector((store=>store.auth));
    console.log(user)
    return(
        <div>
        {user? <div id="navBar">
        <div><img className="profilePicLarge" src={user.picture}/></div>
        <div>{user.username}</div>
        <div>Home</div>
        <div>Friends</div>
        <div>Create Game</div>
        <div>Invites</div>
        <div>Discover Games</div>
        <div>Edit Profile</div>
        <div>Logout</div>
    </div>:
    <div></div>
}
</div>
     
    )
}
export default Navbar;
