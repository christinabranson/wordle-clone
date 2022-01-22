import React, { useState } from "react";
import { useGameDispatch, useGameState, GAME_ACTIONS } from "./gameContext";
import { validateWord } from "../dictionary/handleWords";

const NewGuess = () => {
  const gameState = useGameState();
  const gameDispatch = useGameDispatch();

  const initialGuess = { 0: "", 1: "", 2: "", 3: "", 4: "" };

  const [guess, setGuess] = useState(initialGuess);
  const [errorMessage, setErrorMessage] = useState(null);

  const getValue = (index) => {
    return guess[index] || "";
  };

  const handleGuessInput = (event, index) => {
    const getValue = () => {
      let value = event.target.value;
      if (value.length > 1) {
        value = value[value.length - 1];
      }
      return value;
    };

    setErrorMessage(null);

    const value = getValue();

    const newGuess = JSON.parse(JSON.stringify(guess));
    newGuess[index] = value;
    setGuess(newGuess);

    if (!value.length) {
      return;
    }

    const form = event.target.form;
    form.elements[index + 1].focus();
  };

  const renderInputBoxes = () =>
    Object.keys(guess).map((item, index) => (
      <span key={index}>
        <input
          value={getValue(index)}
          onChange={(event) => handleGuessInput(event, index)}
          className="letterInput"
        />
      </span>
    ));

  const handleSubmitGuess = async (event) => {
    event.preventDefault();
    const guessAsArray = Object.keys(guess).map((key) => guess[key]);
    const guessAsWord = guessAsArray.join("").toLowerCase();

    handleResetGuess();

    const isWordValid = await validateWord(guessAsWord);

    if (!isWordValid) {
      setErrorMessage("Please use a valid word");
      return;
    }

    if (guessAsWord === gameState.word) {
      gameDispatch({
        type: GAME_ACTIONS.WIN_GAME,
        payload: { guess: guessAsArray },
      });
    } else {
      gameDispatch({
        type: GAME_ACTIONS.MAKE_GUESS,
        payload: { guess: guessAsArray },
      });
    }
  };

  if (gameState.isGameWon) {
    return null;
  }

  const handleResetGuess = () => {
    setGuess(initialGuess);
  };

  return (
    <form>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div>{renderInputBoxes()}</div>
      <div className="btnFooter">
        <button
          onClick={handleSubmitGuess}
          type="submit"
          className="btn btn-outline-primary btn-sm"
        >
          Guess
        </button>
        <button
          onClick={handleResetGuess}
          type="button"
          className="btn btn-outline-danger btn-sm"
        >
          Reset guess
        </button>
      </div>
    </form>
  );
};

export default NewGuess;
