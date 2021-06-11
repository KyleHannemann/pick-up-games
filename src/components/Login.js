import { useState } from "react";
import { Widget } from "@uploadcare/react-widget";
import axios from "axios";
import user from "../miscImgs/user.svg";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { setUser } from "../redux/authReducer";
import { connect } from "react-redux";

const Login = (props) => {
  //login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //register
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedInPic, setLoggedInPic] = useState(user);
  //decided not to use gender or age, could change in future

  // const [birthDate, setBirthDate] = useState(null);

  // const [gender, setGender] = useState(null);
  const [picture, setPicture] = useState("/static/media/user.80f5bb20.svg");

  const [demo, setDemo] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleDemo = (e) => {
    setLoading(true);
    e.preventDefault();

    axios
      .post("/auth/login", {
        email: "demo_account@email.com",
        password: "demo",
      })
      .then((res) => {
        setLoggedInPic(res.data.picture);
        setPicture(res.data.picture);
        setTimeout(()=>{
          setLoading(false);
          setDemo(true);
        }, 500)
        setTimeout(() => {
          props.setUser(res.data);
          props.history.push("/dash");
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
        setSuccess("invalid");
      });
  };
  const handleLogin = (e) => {
    setLoading(true);
    e.preventDefault();
    if (email === "" || password === "") {
      setLoading(false)
      alert("please enter your email and password");
      return;
    }

    axios
      .post("/auth/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        setSuccess(res.data.username);
        setLoggedInPic(res.data.picture);
        setPicture(res.data.picture);
        setLoading(false);
        setTimeout(() => {
          props.setUser(res.data);
          props.history.push("/dash");
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setSuccess("invalid");
        setLoading(false)
        alert('invalid email and/or password')
      });
  };
  const handlePicture = async (e) => {
    await setPicture(e.cdnUrl);
    document.getElementById("authProfilePic").src = e.cdnUrl;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (email === "" || password === "" || username === "") {
      alert("please enter an email, password, username, gender, and age ");
      return;
    }

    axios
      .post("/auth/register", {
        username: username,
        password: password,
        email: email,
        birth_year: null,
        gender: null,
        picture: picture,
      })
      .then((res) => {
        setSuccess(res.data.username);
        setTimeout(() => {
          props.setUser(res.data);
          props.history.push("/dash");
        }, 1000);
      })
      .catch((err) => {
        alert('email already in use')
        console.log(err);
      });
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
          {success !== null && success !== "invalid" ? (
            <h2 id="loginSuccess" style={{ textAlign: "center" }}>
              Welcome {success}!
            </h2>
          ) : null}
          <div>
            <img
              id="authProfilePic"
              style={{ backgroundColor: "#efe9f4" }}
              className="profilePicLarge"
              src={user}
              alt="profile pic"
            />
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
              autoComplete="on"
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

          <div id="uploadImageWidget">
            <Widget
              buttons={{
                choose: {},
              }}
              imagesOnly="true"
              previewStep
              onChange={handlePicture}
              crop="1:1"
              publicKey={process.env.REACT_APP_UPLOADCARE_KEY}
              id="pictureUpload"
            />
          </div>
          <div>
            <input
              type="submit"
              value="Register"
              id="regSubmitButton"
              onClick={handleRegister}
            />
          </div>
        </form>
      ) : (
        //login
        <form id="login">
          {success !== null && success !== "invalid" && demo === false ? (
            <h2 id="loginSuccess" style={{ textAlign: "center" }}>
              Welcome Back {success}!
            </h2>
          ) : success === "invalid" ? (
            <h2 style={{ color: "red", textAlign: "center" }}>
              Invalid Email and/or Password
            </h2>
          ) : null}
          {demo === true ? (
            <h2 id="loginSuccess" style={{ textAlign: "center" }}>
              Welcome To The Demo Version!
            </h2>
          ) : null}
          <div>
            {!loading ? (
              <img
                style={{ backgroundColor: "#efe9f4" }}
                id="loginPic"
                className="profilePicLarge"
                src={loggedInPic}
                alt="profile pic"
              />
            ) : (
                <div className="loadingBar" id="mapLoadingBar"></div>
                
              
            )}
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
              autoComplete="on"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div>
            <div>
              <input
                type="submit"
                value="Login"
                className="submitButton"
                onClick={handleLogin}
              />
            </div>
          </div>
          <div>
            <button onClick={handleDemo} className="submitButton">
              Demo Version
            </button>
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

export default connect(null, { setUser })(Login);
