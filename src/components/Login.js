import { useState } from "react";
import { Widget } from "@uploadcare/react-widget";
import axios from "axios";
import user from "../miscImgs/user.svg";
import loading from "../miscImgs/loading-wheel-trans.svg";
import { AiOutlineArrowLeft } from "react-icons/ai";
import {setUser} from '../redux/authReducer';
import {connect} from 'react-redux';


const Login = (props) => {
  //login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //register
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState(null);
  const [picture, setPicture] = useState("/static/media/user.80f5bb20.svg");

  const ageOptions = [];
  for (let i = 0; i < 100; i++) {
    ageOptions.push(i);
  }
  
  const [success, setSuccess] = useState(null)

  const handleLogin = (e) => {
   
      e.preventDefault();
    if (email === "" || password === "") {
      alert("please enter your email and password");
      return;
    }
    document.getElementById("loginPic").src = loading;
    document.getElementById("loginPic").classList.add("active")
    
    axios
      .post("/auth/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        setSuccess(res.data.username)
       document.getElementById("loginPic").src = res.data.picture;
       document.getElementById("loginPic").classList.remove("active")
        setPicture(res.data.picture)
        setTimeout(()=>{
          props.setUser(res.data)
          props.history.push('/dash')
        }, 1000 )

      })
      .catch((err) => {
        document.getElementById("loginPic").classList.remove("active")
        document.getElementById("loginPic").src = user;

        console.log(err);
        setSuccess("invalid")
      });
  };
  const handlePicture = async (e) => {
    await setPicture(e.cdnUrl);
    document.getElementById("authProfilePic").src = e.cdnUrl;
  };

  const handleRegister = (e) => {
    e.preventDefault()

    if (
      email === "" ||
      password === "" ||
      username === "" ||
      birthDate === "" ||
      gender === ""
    ) {
      alert("please enter an email, password, username, gender, and age ");
      return;
    }
   
    axios.post("/auth/register", {
      username: username,
      password: password,
      email: email,
      birth_year: birthDate,
      gender: gender,
      picture: picture,
    }).then(res=>{
      setSuccess(res.data.username)
      setTimeout(()=>{
        props.setUser(res.data)
        props.history.push('/dash')
      }, 1000 )
     
    }).catch(err=>{
      console.log(err)
    })

  };
  return (
    <div id="authContainer">
      
      {register ? (
        
        //register
        <form id="register">
          <AiOutlineArrowLeft
            onClick={() => {
              setRegister(false);
            }}
          />
          {success !== null && success !== "invalid"? <h2 id="loginSuccess"style={{textAlign: "center"}}>Welcome {success}!</h2> : null}
          <div>
            <img id="authProfilePic" style={{backgroundColor: "#efe9f4"}} className="profilePicLarge" src={user} alt="profile pic" />
          </div>
          <div>
            <input
            maxLength="150"
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
            maxLength="100"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div>
            <input
            maxLength="20"
              type="text"
              name="Username"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div>
            <select
              onChange={(e) => {
                let currentYear = new Date().getFullYear();
                setBirthDate(parseInt(currentYear) - e.target.value);
              }}
              id="ageSelect"
            >
              <option value="">Age</option>
              {ageOptions.map((el) => {
                return (
                  <option key={el} value={el}>
                    {el}
                  </option>
                );
              })}
            </select>
          </div>
          <div id="uploadImageWidget">
            <Widget
            
              buttons={{
                choose:{}
              }
              }
              imagesOnly="true"
              previewStep
              onChange={handlePicture}
              crop="1:1"
              publicKey={process.env.REACT_APP_UPLOADCARE_KEY}
              id="pictureUpload"
            />
          </div>
          <div>
            <div className="submitButton" onClick={handleRegister}>
              Submit
            </div>
          </div>
        </form>
      ) : (
        //login
        <form id="login">
          {success !== null && success !== "invalid" ?<h2 id="loginSuccess"style={{textAlign: "center"}}>Welcome Back {success}!</h2>
          : success === "invalid"? <h2 style={{color: "red", textAlign:"center"}}>Invalid Email and/or Password</h2> : null }
          <div>
            <img style={{backgroundColor: "#efe9f4"}} id="loginPic" className="profilePicLarge" src={user} alt="profile pic" />
          </div>
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="submitButton" onClick={handleLogin}>
              Submit
            </div>
          </div>
          <div id="newUserRegister">
            <span>Not a Member?</span>

            <span
              onClick={() => {
                setRegister(true);
              }}
            >
              Sign Up Here
            </span>
          </div>
        </form>
      )}
    </div>
  );
};

export default connect(null, {setUser})(Login);
