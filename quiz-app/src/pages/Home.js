import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("x-access-token");
    if (token) {
      const headers = { token: token };
      axios
        .get("http://localhost:4000/auth", { headers })
        .then((res) => {
          if (res.data.isLoggedIn === true) {
            setLogin(true);
          } else {
            setLogin(false);
          }
        })
        .catch(() => {
          setLogin(false);
        });
    } else {
      setLogin(false);
    }
  }, []);

  return (
    <main>
      <div className="container">
        <p style={{ fontSize: "25px" }}>
          Welcome to quizzy, where you can test your knowledge on many things
          starting from video games up to historical events
        </p>
        {login === true ? (
          <Link to="/play">
            <button className="green-button">Play now</button>
          </Link>
        ) : (
          <div>
            <Link to="/login">
              <button className="green-button">Login</button>
            </Link>
            <br />
            <Link to="/play">
              <button className="guest">Play as a guest</button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
