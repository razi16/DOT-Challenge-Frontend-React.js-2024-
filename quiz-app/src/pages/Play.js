import React, { useState, useEffect } from "react";
import axios from "axios";
import he from "he";

function Play() {
  const [login, setLogin] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(() => {
    const saved = localStorage.getItem("timer");
    const initalValue = JSON.parse(saved);
    return initalValue || 30;
  });
  const [questions, setQuestions] = useState([]);
  const [play, setPlay] = useState(false);
  const [questionCount, setQuestionCount] = useState(() => {
    const saved = localStorage.getItem("questionCount");
    const initalValue = JSON.parse(saved);
    return initalValue || 0;
  });
  const [results, setResults] = useState({ answered: 0, correct: 0 });
  const [correctAnswerRandomizer, setCorrectAnswerRandomizer] = useState(
    Math.floor(Math.random() * 4)
  );

  const playNow = () => {
    setPlay(true);
    setTimer(30);
    setScore(0);
    setResults({ answered: 0, correct: 0 });
    setQuestionCount(0);
    axios.get("https://opentdb.com/api.php?amount=10").then((res) => {
      console.log(res.data.results);
      setQuestions(res.data.results);

      localStorage.setItem("questions", JSON.stringify(res.data.results));
    });
    console.log(questionCount);
  };

  const postScore = () => {
    if (login === true) {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        const headers = { token: token };

        axios.post(
          "http://localhost:4000/score",
          {
            score: score,
          },
          {
            headers: headers,
          }
        );
      }
    }
  };

  const answer = () => {
    setResults((prevState) => ({
      ...prevState,
      answered: prevState.answered + 1,
    }));
    setQuestionCount((prevState) => prevState + 1);
  };

  const correctAnswer = () => {
    setResults((prevState) => ({
      ...prevState,
      answered: prevState.answered + 1,
      correct: prevState.correct + 1,
    }));
    setScore((prevState) => prevState + 10);
    setQuestionCount((prevState) => prevState + 1);
  };

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
    const savedQuestions = JSON.parse(localStorage.getItem("questions"));
    if (savedQuestions) {
      const savedQuestionCount = JSON.parse(
        localStorage.getItem("questionCount")
      );

      setQuestions(savedQuestions);
      setPlay(true);
      setQuestionCount(savedQuestionCount);
    }
  }, []);

  useEffect(() => {
    setCorrectAnswerRandomizer(Math.floor(Math.random() * 4));

    localStorage.setItem("questionCount", questionCount);

    if (questionCount > 9) {
      postScore();
      setQuestions([]);
      localStorage.removeItem("questions");
      localStorage.removeItem("questionCount");
    }
  }, [questionCount]);

  useEffect(() => {
    if (questions.length > 0) {
      const timerId = setInterval(() => {
        setTimer((prevState) => prevState - 1);
        localStorage.setItem("timer", timer);
        if (timer === 0) {
          setQuestionCount(10);
        }
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timer, questions]);

  if (play === false) {
    return (
      <div>
        <div className="quiz-container">
          <button className="play" onClick={playNow}>
            Play
          </button>
        </div>
      </div>
    );
  } else {
    if (questionCount < 10) {
      if (questions.length === 0) {
        return (
          <div className="quiz-container">
            <p>Loading</p>
          </div>
        );
      }
      return (
        <div className="quiz-container">
          <p>
            Question {questionCount + 1} of {questions.length}
          </p>
          <p id="timer">{timer}</p>
          <p>{he.decode(questions[questionCount].question)}</p>
          <div>
            {questions[questionCount].type === "multiple" ? (
              correctAnswerRandomizer === 0 ? (
                <div className="answers-container">
                  <p className="answer" onClick={correctAnswer}>
                    {he.decode(questions[questionCount].correct_answer)}
                  </p>

                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[0])}
                  </p>

                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[1])}
                  </p>

                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[2])}
                  </p>
                </div>
              ) : correctAnswerRandomizer === 1 ? (
                <div className="answers-container">
                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[0])}
                  </p>

                  <p className="answer" onClick={correctAnswer}>
                    {he.decode(questions[questionCount].correct_answer)}
                  </p>

                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[1])}
                  </p>

                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[2])}
                  </p>
                </div>
              ) : correctAnswerRandomizer === 2 ? (
                <div className="answers-container">
                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[0])}
                  </p>

                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[1])}
                  </p>

                  <p className="answer" onClick={correctAnswer}>
                    {he.decode(questions[questionCount].correct_answer)}
                  </p>

                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[2])}
                  </p>
                </div>
              ) : (
                <div className="answers-container">
                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[0])}
                  </p>

                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[1])}
                  </p>

                  <p className="answer" onClick={answer}>
                    {he.decode(questions[questionCount].incorrect_answers[2])}
                  </p>

                  <p className="answer" onClick={correctAnswer}>
                    {he.decode(questions[questionCount].correct_answer)}
                  </p>
                </div>
              )
            ) : questions[questionCount].correct_answer === "True" ? (
              <div className="answers-container">
                <p className="answer" onClick={correctAnswer}>
                  True
                </p>

                <p className="answer" onClick={answer}>
                  False
                </p>
              </div>
            ) : (
              <div className="answers-container">
                <p className="answer" onClick={answer}>
                  True
                </p>

                <p className="answer" onClick={correctAnswer}>
                  False
                </p>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="quiz-container">
          {results.answered === 1 ? (
            <p>You answered 1 question</p>
          ) : (
            <p>You answered {results.answered} questions</p>
          )}
          {results.correct === 1 ? (
            <p>You correctly answered 1 question</p>
          ) : (
            <p>You correctly answered {results.correct} questions</p>
          )}
          {results.answered - results.correct === 1 ? (
            <p>You incorrectly answered 1 question</p>
          ) : (
            <p>
              You incorrectly answered {results.answered - results.correct}{" "}
              questions
            </p>
          )}
          <p>Your final score is {score}</p>
          <button className="play-again" onClick={playNow}>
            Play Again
          </button>
        </div>
      );
    }
  }
}

export default Play;
