//list of friends
//includes username, email, picture, (gamesplayed? scheduled games)
//button to see page

//discover people

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import {Link} from 'react-router-dom'


const Friends = (props) => {
    
  const {user} = useSelector((store)=>store.auth)
  
  const [discoverPeople, setDiscoverPeople] = useState(false);
  const [allUsers, setAllUsers] = useState([])
  const [friends, setFriends] = useState([])
  
  useEffect(()=>{
    axios.get("/users/friends/all").then(res=>{
      // let data = res.data;
      // // let friendsArr = [{key: 'invite all friends', id: 'all'}]
      // // for (let i = 0; i < data.length; i++){
      // //   if(parseInt(data[i].user_id) !== parseInt(user.user_id)){
      // //      friendsArr.push({
      // //        key: data[i].username,
      // //        id: data[i].user_id
      // //      })
      // //   }
      // // }
      // console.log(friendsArr)
      let data = res.data.filter(el=>el.user_id !== user.user_id)
      
      setFriends(data)
      axios.get("/users/get/all").then(res=>{
        setAllUsers(res.data)
        console.log(res.data)
      }).catch(err=>{
          console.log(err)
      })
      console.log(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }, [])
  
  return (
    <div id="friendsPageContainer">
        <div id="friendsPageSearchContainer">
            <input
                className="sliderFriends"
                onChange={() => {
                  setDiscoverPeople(!discoverPeople);
                }}
                type="checkbox"
                id="friendsSearch"
              />
              <label className="sliderLabelFriends" htmlFor="friendsSearch"></label>
              </div>
      {discoverPeople ? <div>
          {allUsers.filter(u=>{
          for (let i = 0; i < friends.length; i++){
              if (friends[i].user_id === u.user_id){
                  return;
              }
              if (u.user_id === user.user_id){
                  return
              }
              return u;
          }}).map(u=>{    
              return(
                  <div key={u.user_id}className="friendsPageFriendsContainer">
                      <h1>{u.username}</h1>
                      <img className="profilePicLarge" src={u.picture}/>
                      <Link to={`users/${u.user_id}`}>view profile</Link>
                  </div>
              )
          })}
      </div> 
      :
       <div>
           {friends.map(f=>{
               return(
                   <div key={f.user_id}className="friendsPageFriendsContainer">
                       <h1>{f.username}</h1>
                       <img className="profilePicLarge" src={f.picture}/>
                   </div>
               )
           })}
        </div>}
    </div>
  );
};
export default Friends;
