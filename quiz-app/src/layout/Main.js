import React, { useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Play from "../pages/Play";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Navbar from "./Navbar";
import Home from "../pages/Home";
import History from "../pages/History";

export const LoginContext = React.createContext();

const initialState = false;

const reducer = (state, action) => {
  switch (action) {
    case "login":
      return true;
    case "logout":
      return false;
    default:
      return state;
  }
};

function Main() {
  const [login, dispatch] = useReducer(reducer, initialState);

  return (
    <BrowserRouter>
      <LoginContext.Provider
        value={{ loginState: login, loginDispatch: dispatch }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/register" element={<Register />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </LoginContext.Provider>
    </BrowserRouter>
  );
}

export default Main;
