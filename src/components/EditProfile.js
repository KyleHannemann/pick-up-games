import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authReducer";
import { Widget } from "@uploadcare/react-widget";
import axios from "axios";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const [editOptions, setEditOptions] = useState({
    password: false,
    username: false,
    email: false,
    picture: false,
  });
  const submitChanges = () => {
    let newUsername = user.username;
    let newEmail = user.email;
    let newPicture = user.picture;
    let newPassword = null;
    if (editOptions.username === true) {
      newUsername = username;
    }
    if (editOptions.password === true) {
      newPassword = password;
    }
    if (editOptions.email === true) {
      newEmail = email;
    }
    if (editOptions.picture === true) {
      newPicture = picture;
    }

    axios
      .put("/auth/edit/profile", {
        username: newUsername,
        password: newPassword,
        email: newEmail,
        picture: newPicture,
      })
      .then((res) => {
        dispatch(setUser(res.data));
        alert("update success");
      })
      .catch((err) => {
        console.log(err);
        alert("update failed");
      });
  };
  const handlePicture = async (e) => {
    setPicture(e.cdnUrl);
  };

  return (
    <div id="editProfileContainer">
      <div id="chooseProfileEditOptions">
        <h3>Choose edit options</h3>
        <div>
          <div>
            <span>Username</span>
            <input
              className="slider"
              onClick={() => {
                setEditOptions({
                  ...editOptions,
                  username: !editOptions.username,
                });
              }}
              type="checkbox"
              value="Username"
              id="usernameEditSlider"
            />
            <label className="sliderLabel" htmlFor="usernameEditSlider"></label>
          </div>
          <div>
            <span>Email</span>
            <input
              className="slider"
              onClick={() => {
                setEditOptions({ ...editOptions, email: !editOptions.email });
              }}
              type="checkbox"
              value="Email"
              id="emailEditSlider"
            />
            <label className="sliderLabel" htmlFor="emailEditSlider"></label>
          </div>
          <div>
            <span>Profile picture</span>
            <input
              className="slider"
              onClick={() => {
                setEditOptions({
                  ...editOptions,
                  picture: !editOptions.picture,
                });
              }}
              type="checkbox"
              value="picture"
              id="pictureEditSlider"
            />
            <label className="sliderLabel" htmlFor="pictureEditSlider"></label>
          </div>
          <div>
            <span>Password</span>
            <input
              className="slider"
              onClick={() => {
                setEditOptions({
                  ...editOptions,
                  password: !editOptions.password,
                });
              }}
              type="checkbox"
              value="Password"
              id="passwordEditSlider"
            />
            <label className="sliderLabel" htmlFor="passwordEditSlider"></label>
          </div>
        </div>
        <button onClick={submitChanges}>Submit Changes</button>
      </div>
      <div id="editOptions">
        {editOptions.username ? (
          <div>
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="New Username"
            />
          </div>
        ) : (
          <p></p>
        )}

        {editOptions.email ? (
          <div>
            <input
              className="slider"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="New Email"
            />
          </div>
        ) : (
          <p></p>
        )}
        {editOptions.password ? (
          <div>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="New Password"
            />
          </div>
        ) : (
          <p></p>
        )}
        {editOptions.picture ? (
          <div>
            <Widget
              imagesOnly="true"
              previewStep
              onChange={handlePicture}
              crop="1:1"
              publicKey={process.env.REACT_APP_UPLOADCARE_KEY}
              id="pictureUpload"
            />
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
