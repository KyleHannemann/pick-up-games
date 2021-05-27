import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';


const Dash = (props) => {
    
    const {user} = useSelector((store)=>store.auth);
    console.log(user)
    
    return (
        
        <div id="dashContainer">
            
        
        </div>
        
    )
}

export default Dash
