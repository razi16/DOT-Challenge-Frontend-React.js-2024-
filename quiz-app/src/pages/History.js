import React, { useState, useEffect } from "react";
import axios from "axios";

function History() {
  const [login, setLogin] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("x-access-token");
    if (token) {
      const headers = { token: token };
      axios
        .get("http://localhost:4000/auth", { headers })
        .then((res) => {
          if (res.data.isLoggedIn === true) {
            setLogin(true);
            axios
              .get("http://localhost:4000/score", { headers })
              .then((res) => {
                setHistory(res.data.history);
              });
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
    <div className="history-container">
      {login === false ? (
        <p>Login to see your last 5 quiz scores</p>
      ) : history.length === 0 ? (
        <p>Your last 5 quiz scores will be displayed here</p>
      ) : (
        history.map((score) => (
          <p>{`${score.score}  (${new Date(score.time).toLocaleString()})`}</p>
        ))
      )}
    </div>
  );
}

export default History;
