import React, { useState } from "react";
import Grid from "../components/Grid";
import styles from "../styles/Home.module.css";

export default function Home() {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
    };

    return (
        <div className={styles.container}>
            <h1>2048</h1>
            {gameOver && <div className={styles.gameOver}>Game Over!</div>}
            <div className={styles.score}>Score: {score}</div>
            {!gameStarted ? (
                <button className={styles.startButton} onClick={startGame}>
                    Start Game
                </button>
            ) : (
                <Grid setScore={setScore} onGameOver={() => setGameOver(true)} />
            )}
        </div>
    );
}
