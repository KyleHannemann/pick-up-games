import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux'

//i need dms in entire app

const Dms = (props) => {
const {socket} = useSelector((store)=>store.socketReducer)
const {user} = useSelector((store)=>store.auth)
const {dms, dmToState, dmDrop} = useSelector((store)=>store.dmsReducer)
console.log(dms, dmToState, dmDrop)
const [dmTo, setDmTo] = useState(null)
const [message, setMessage] = useState("")

useEffect(()=>{
    if (dmToState === null){
        //do something
        //show list of friends to dm or not
    }
    else{
        setDmTo(dmToState)
    }
}, [dmToState])

const handleDm = (e) =>{
    e.preventDefault();
    socket.emit("dm", {user_id: user.user_id, dm_to: dmTo, content: message})


}
    return(
        <div id="dmsContainer">
            <div id="dmsChatBox">
                {dmTo ? user.friends.map(f=>{
                    if (f.friendInfo.user_id === dmTo){
                        return (
                            <div className="dmToUsername">{f.friendInfo.username}</div>
                        )
                    }
                }) :null}
                <div id="dmsChatBoxChat">
            {dms && dmTo !== null ? dms.filter(d=>{
                if(d.user_id === dmTo || d.dm_to === dmTo){
                    return d
                }
                //check if applies to this user
            }).map(d=>{
                let classCss;
                if (d.user_id === user.user_id){
                    classCss = "rightChatBubble";
                }
                else{
                
                    classCss = "leftChatBubble"
                } 
                return (
                    <div className={classCss}>
                    <div >
                        {d.content}
                        
                    </div>
                    </div>

                )
                
            }) : null}
            </div>
            {dmTo ? <form>
                <input value={message} onChange={(e)=>{
                    setMessage(e.target.value)
                }} /> 
                <input type="submit" onClick={handleDm} /> 
            </form> : null}
            </div>
            <div id="dmsFriendsContainer">
            
            </div>
        </div>
    )

}

export default Dms;