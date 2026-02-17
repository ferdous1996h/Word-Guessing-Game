import { languages } from "./languages.js";
import { getFarewellText } from "./utils.js";
import { getRandomWord } from "./utils.js";
import { useState } from "react";
import { clsx } from "clsx";
import Confetti from 'confetti-react';

export default function App() {
  const [guessWord, setGuessWord] = useState([]);
  const [gword, setGword] = useState(() => getRandomWord());
  const [wrongSelect, setWrongSelect] = useState([]);
  const [gameOn, setGameOn] = useState(true);

  console.log(gword);
  const gameWon = new Set(gword.split("")).size === guessWord.length;
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const langVarient = languages.map((lang, index) => {
    const langCondi = index + 1 <= wrongSelect.length;
    const langCls = clsx(langCondi && "disqualified");
    return (
      <span
        key={index}
        style={{ background: lang.backgroundColor, color: lang.color }}
        className={langCls}
      >
        {lang.name}
      </span>
    );
  });

  const handleClk = function (e) {
    const selected = e.currentTarget.textContent.toLowerCase();
    if (
      gword.split("").includes(selected.toLowerCase()) &&
      !guessWord.includes(selected)
    ) {
      setGuessWord((prev) => {
        const newGuessWord = [...prev, selected];
        if (new Set(gword.split("")).size === newGuessWord.length) {
          setGameOn(false);
        }
        return newGuessWord;
      });
    } else {
      setWrongSelect((prev) => {
        const newWrongSelect = [...prev, selected];
        if (newWrongSelect.length > 7) {
          setGameOn(false);
        }
        return newWrongSelect;
      });
    }
  };

  const buttonEle = alphabet.split("").map((word, i) => {
    const buttonCls = clsx(
      guessWord.includes(word.toLowerCase()) && "correct",
      wrongSelect.includes(word.toLowerCase()) && "incorrect",
    );
    return (
      <button
        key={i}
        onClick={handleClk}
        className={buttonCls}
        disabled={!gameOn}
      >
        {word.toUpperCase()}
      </button>
    );
  });

  const spanEle = gword.split("").map((word, i) => {
    const slkt = guessWord.includes(word);
    const highlight = clsx(!guessWord.includes(word) && "markWord");
  
    return (
      <span key={i} className={highlight}>
        {!gameOn || slkt ? word.toUpperCase() : null}
      </span>
    );
  });

  function handleReset() {
    setGameOn((prev) => !prev);
    setGword(() => getRandomWord());
    setGuessWord([]);
    setWrongSelect([]);
  }

  return (
    <main className="game_surface">
      {gameWon && <Confetti numberOfPieces={600} recycle={false}/>}
      <section className="game_top">
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under {8 - wrongSelect.length} attempts to keep the
          programming world safe from Assembly!
        </p>
      </section>

      {wrongSelect.length > 0 && gameOn && (
        <section className="notice">
          {getFarewellText(languages[wrongSelect.length - 1]?.name)}
        </section>
      )}
      {!gameOn && gameWon && (
        <section style={{ background: "#10A95B", padding: "26px" }}>
          <h3>You win!</h3>
          <p>Well done! 🎉</p>
        </section>
      )}

      {!gameOn && !gameWon && (
        <section style={{ background: "#BA2A2A", padding: "26px" }}>
          <h3>Game over!</h3>
          <p>You lose! Better start learning Assembly 😭</p>
        </section>
      )}

      <section className="language_varient">{langVarient}</section>

      <section className="word_collection">{spanEle}</section>

      <section className="btn_ele">{buttonEle}</section>

      {!gameOn && (
        <button className="replay" onClick={handleReset}>
          Play Again
        </button>
      )}
    </main>
  );
}
