import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios'
import { setUser} from '../redux/authReducer';
import {useHistory} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {GiHamburgerMenu} from 'react-icons/gi';
import {IoIosNotificationsOutline} from 'react-icons/io';
import {useState} from 'react';

const Navbar = () => {
    const {user} = useSelector((store=>store.auth));
    const history = useHistory();
    const dispatch = useDispatch();
    const logout = () => {
        axios.get('/auth/logout').then(res=>{
            if (res.status === 200){
                if (navDrop === false){
                   
                    dispatch(setUser(null));
                    history.push('/')
                    return;
                }
                navDropDown()
                dispatch(setUser(null));
                history.push('/')
               
            }
        })
    }
    
    const [navDrop, setNavDrop] = useState(false);
    const navDropDown = () =>{
        if (navDrop === false){
        document.getElementById("navBar").classList.add("active");
        document.getElementById("navBarPageLinks").classList.add("active");
        document.getElementById("navBarAuthLinks").classList.add("active");
        document.getElementById("navHamburger").classList.add("active");
        document.getElementById("websiteLogoName").classList.add("active");
        setNavDrop(true)
        }
        else{
            document.getElementById("navBarPageLinks").classList.remove("active");
            document.getElementById("navBarAuthLinks").classList.remove("active");
            document.getElementById("navHamburger").classList.remove("active");
            document.getElementById("websiteLogoName").classList.remove("active");
            document.getElementById("navBar").classList.remove("active");

            setNavDrop(false);
        }
    }
    const linkClick = () =>{
        if (navDrop === false){
            return;
        }
        navDropDown()
    }
    return(
        <div>
        {user? <div id="navBar">
        <div id="websiteLogoName">
            <IoIosNotificationsOutline id="logo"/>
            
        </div>
        <div onClick={()=>{
            history.push(`/users/${user.user_id}`)
        }}id="navBarUserInfo"><img className="profilePicMedium" src={user.picture}/>
        <div>{user.username}</div>
        </div>
        <div id="navBarPageLinks">
        <Link className="navBarLink" onClick={linkClick}to="/dash"><div>Home</div></Link>
        <div>Friends</div>
        <Link onClick={linkClick} className="navBarLink" to="/create/game"><div>Create Game</div></Link>
        
        <Link onClick={linkClick} className="navBarLink" to="/map"><div>Discover Games</div></Link>
        </div>
        <div id="navBarAuthLinks">
        <Link className="navBarLink"onClick={linkClick} to="/edit/profile"><div>Edit Profile</div></Link>
        <div id="logout"onClick={logout}>Logout</div>
        </div>
        <GiHamburgerMenu onClick={navDropDown}id="navHamburger"/>
    </div>:
    <div></div>
}
</div>
     
    )
}
export default Navbar;
