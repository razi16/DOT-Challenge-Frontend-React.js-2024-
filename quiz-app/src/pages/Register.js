import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [takenEmail, setTakenEmail] = useState(null);

  const register = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/register", {
        username: username,
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.message === "This email is already registered") {
          setTakenEmail(true);
        } else {
          setTakenEmail(false);
        }
      });
  };

  return (
    <main>
      <div className="form-container">
        <form method="POST" onSubmit={register}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              className="form-control w-75"
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group  mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control w-75"
              id="email"
              name="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <small id="emailHelp" className="form-text text-muted">
              You don't need to use a registered email address.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control w-75 mb-3"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="green-button" type="submit">
            Register
          </button>
          {takenEmail === null ? (
            <></>
          ) : takenEmail === true ? (
            <div className="alert alert-danger mt-3" role="alert">
              Email has been taken
            </div>
          ) : (
            <div className="alert alert-success mt-3" role="alert">
              Your account has been created
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default Register;
