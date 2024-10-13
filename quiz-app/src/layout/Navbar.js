import React, { useEffect, useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "./Main";

function Navbar() {
  const loginContext = useContext(LoginContext);
  const [username, setUsername] = useState("user");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("x-access-token");
    loginContext.loginDispatch("logout");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("x-access-token");
    if (!token) {
      loginContext.loginDispatch("logout");
    } else {
      const headers = {
        token: token,
      };
      axios.get("http://localhost:4000/auth", { headers }).then((res) => {
        if (res.data.isLoggedIn === true) {
          loginContext.loginDispatch("login");
          setUsername(res.data.username);
        } else {
          loginContext.loginDispatch("logout");
        }
      });
    }
  }, [loginContext]);

  if (loginContext.loginState === false) {
    return (
      <header>
        <nav className="navbar">
          <ul>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/play">Play</NavLink>
            <NavLink to="/History">History</NavLink>
            <NavLink to="/login">Login</NavLink>
          </ul>
        </nav>
      </header>
    );
  } else {
    return (
      <header>
        <nav className="navbar">
          <ul>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/play">Play</NavLink>
            <NavLink to="/History">History</NavLink>
          </ul>
          <div>
            <p style={{ fontWeight: "bolder" }}>Welcome {username}</p>
            <p style={{ fontWeight: "bolder" }} id="logout" onClick={logout}>
              Logout
            </p>
          </div>
        </nav>
      </header>
    );
  }
}

export default Navbar;
