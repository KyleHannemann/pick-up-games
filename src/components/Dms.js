import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux'

//i need dms in entire app

const Dms = (props) => {
const {socket} = useSelector((store)=>store.socketReducer)
const {user} = useSelector((store)=>store.auth)
const {dms} = useSelector((store)=>store.dmsReducer)
console.log(dms)
const [dmTo, setDmTo] = useState(null)
const [message, setMessage] = useState("")

useEffect(()=>{
    if (props.dmTo === "navDm"){
        //do something
    }
    else{
        setDmTo(props.dmTo)
    }
}, [props.dmTo])

const handleDm = (e) =>{
    e.preventDefault();
    socket.emit("dm", {user_id: user.user_id, dm_to: dmTo, content: message})


}
    return(
        <div>
            {dms ? dms.filter(d=>{
                if(d.user_id === props.dmTo || d.dm_to === props.dmTo){
                    return d
                }
                //check if applies to this user
            }).map(d=>{
                
                let who;
                if (d.user_id === user.user_id){
                    who = "You"
                }
                else{
                   who =  user.friends.filter(f=>{
                       console.log(f.friendInfo.user_id)
                       console.log(d.user_id)
                        if(f.friendInfo.user_id === d.user_id){
                            return f
                        }
                    })
                    console.log(who)
                    who = who[0].friendInfo.username
                }
                return (
                    <div>
                        <div>{d.content}</div>
                        <span>{who}</span>
                    </div>
                )
            }) : null}
            <form>
                <input value={message} onChange={(e)=>{
                    setMessage(e.target.value)
                }} /> 
                <input type="submit" onClick={handleDm} /> 
            </form>
        </div>
    )

}

export default Dms;