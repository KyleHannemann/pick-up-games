import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authReducer";
import { Widget } from "@uploadcare/react-widget";
import { IconContext } from "react-icons";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";

const EditProfile = (props) => {
  console.log(props);
  const { user } = useSelector((store) => store.auth);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);

  const [editOptions, setEditOptions] = useState({
    password: false,
    username: false,
    email: false,
    picture: false,
  });
  useEffect(() => {
    if (!user) {
      return;
    } else {
      setUsername(user.username);
      setPicture(user.picture);
      setEmail(user.email);
    }
  }, [user]);
  const handleSuccess = () => {
    setSuccess(true);
  };
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
      }).then((res) => {
        dispatch(setUser(res.data));
        console.log(res.data);
        handleSuccess()
      }).catch((err) => {
        console.log(err);
        alert("email already in use by another user");
      });
  };
  const handlePicture = async (e) => {
    setPicture(e.cdnUrl);
  };

  return (
    <div id="editProfileContainer">
      <h1>Edit Profile</h1>
      <div>
        <span>UserName:</span>
        {editOptions.username ? (
          <div>
            <button
              onClick={() => {
                setEditOptions({ ...editOptions, username: false });
                setUsername(user.username);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <IconContext.Provider
            value={{ style: { height: "20px", width: "20px" } }}
          >
            <AiOutlineEdit
              onClick={() => {
                setEditOptions({ ...editOptions, username: true });
              }}
            />
          </IconContext.Provider>
        )}

        {editOptions.username ? (
          <input
            maxLength="22"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        ) : null}
        <span>{username}</span>
      </div>

      <div>
        <span>Email:</span>
        {editOptions.email ? (
          <div>
            <button
              onClick={() => {
                setEditOptions({ ...editOptions, email: false });
                setEmail(user.email);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <IconContext.Provider
            value={{ style: { height: "20px", width: "20px" } }}
          >
            <AiOutlineEdit
              onClick={() => {
                setEditOptions({ ...editOptions, email: true });
              }}
            />
          </IconContext.Provider>
        )}

        {editOptions.email ? (
          <input
            maxLength="50"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        ) : null}
        <span>{email}</span>
      </div>
      <div>
        <span>Password</span>
        <span></span>
        {editOptions.password ? (
          <div>
            <button
              onClick={() => {
                setEditOptions({ ...editOptions, password: false });
                setPassword(null);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <IconContext.Provider
            value={{ style: { height: "20px", width: "20px" } }}
          >
            <AiOutlineEdit
              onClick={() => {
                setEditOptions({ ...editOptions, password: true });
              }}
            />
          </IconContext.Provider>
        )}

        {editOptions.password ? (
          <input
            maxLength="30"
            placeholder="new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        ) : null}
      </div>
      <div>
        <span>Picture</span>
        <img
        alt={`your profile`}
         className="profilePicExtraLarge" src={picture} />
        {editOptions.picture ? (
          <div>
            <button
              onClick={() => {
                setEditOptions({ ...editOptions, picture: false });
                setPicture(user.picture);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <IconContext.Provider
            value={{ style: { height: "20px", width: "20px" } }}
          >
            <AiOutlineEdit
              onClick={() => {
                setEditOptions({ ...editOptions, picture: true });
              }}
            />
          </IconContext.Provider>
        )}

        {editOptions.picture ? (
          <Widget
            imagesOnly="true"
            previewStep
            onChange={handlePicture}
            crop="1:1"
            publicKey={process.env.REACT_APP_UPLOADCARE_KEY}
            id="pictureUpload"
          />
        ) : null}
      </div>
      {success ? (
        <span className="successContainer">
          <span>Changes Saved!</span>
          <button
            onClick={() => {
              props.closeEdit();
            }}
            className="successButton"
          >
            OK
          </button>
        </span>
      ) : (
        <button id="editProfileSaveChanges" onClick={submitChanges}>
          Save Changes
        </button>
      )}
    </div>
  );
};

export default EditProfile;
