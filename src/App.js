import routes from "./routes";
import "./App.css";
import Navbar from "./components/Navbar";
import axios from "axios";
import { useEffect } from "react";
import {connect, useSelector} from 'react-redux';
import { setUser} from './redux/authReducer';
import {useHistory} from 'react-router-dom';

function App(props) {
  
  const history = useHistory();
  useEffect(() => {
    axios
      .get("/auth/user")
      .then((res) => {
        if (res.status === 200) {
          props.setUser(res.data);
          history.push('/dash')
          return;
        } else {
          history.push('/')
          return;
        }
      })
      .catch((err) => {
        console.log(err);
        history.push('/')
      });
  }, []);
  return (
    <div className="App">
      <Navbar />
      {routes}
    </div>
  );
}

export default connect(null,{setUser})(App);
