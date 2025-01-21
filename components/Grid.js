import React, { useState, useEffect } from "react";
import Tile from "./Tile";
import styles from "../styles/Home.module.css";

const Grid = ({ setScore }) => {
    const [grid, setGrid] = useState(Array(4).fill(Array(4).fill(0)));
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const newGrid = Array(4).fill(Array(4).fill(0)).map((row) => [...row]);
        addRandomTile(newGrid);
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0); // Reset the score
        setIsGameOver(false); // Reset game-over state
    };

    const addRandomTile = (newGrid) => {
        const emptyTiles = [];
        newGrid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 0) emptyTiles.push({ row: rowIndex, col: colIndex });
            });
        });
        if (emptyTiles.length > 0) {
            const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            newGrid[randomTile.row][randomTile.col] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const handleMove = (direction) => {
        const newGrid = moveTiles(grid, direction);
        if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
            addRandomTile(newGrid);
            setGrid(newGrid);
            if (checkGameOver(newGrid)) {
                setIsGameOver(true); // Trigger game over if no moves left
            }
        } else {
            if (checkGameOver(grid)) {
                setIsGameOver(true); // Trigger game over if no moves left
            }
        }
    };

    const moveTiles = (grid, direction) => {
        let newGrid = [...grid.map((row) => [...row])];

        const combineRow = (row) => {
            const filtered = row.filter((val) => val !== 0);
            for (let i = 0; i < filtered.length - 1; i++) {
                if (filtered[i] === filtered[i + 1]) {
                    filtered[i] *= 2;
                    filtered[i + 1] = 0;
                    setScore((prev) => prev + filtered[i]);
                }
            }
            return filtered.filter((val) => val !== 0);
        };

        if (direction === "left" || direction === "right") {
            newGrid = newGrid.map((row) => {
                const combinedRow = combineRow(direction === "left" ? row : row.reverse());
                return direction === "left"
                    ? [...combinedRow, ...Array(4 - combinedRow.length).fill(0)]
                    : [...Array(4 - combinedRow.length).fill(0), ...combinedRow];
            });
        } else if (direction === "up" || direction === "down") {
            for (let col = 0; col < 4; col++) {
                const column = newGrid.map((row) => row[col]);
                const combinedCol = combineRow(direction === "up" ? column : column.reverse());
                for (let row = 0; row < 4; row++) {
                    newGrid[row][col] =
                        direction === "up"
                            ? combinedCol[row] || 0
                            : combinedCol[3 - row] || 0;
                }
            }
        }

        return newGrid;
    };

    const checkGameOver = (grid) => {
        // Check for any empty cells
        if (grid.some((row) => row.includes(0))) return false;

        // Check for any possible moves
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (
                    (row < 3 && grid[row][col] === grid[row + 1][col]) || // Check downward
                    (col < 3 && grid[row][col] === grid[row][col + 1]) // Check rightward
                ) {
                    return false;
                }
            }
        }

        return true;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    handleMove("up");
                    break;
                case "ArrowDown":
                    handleMove("down");
                    break;
                case "ArrowLeft":
                    handleMove("left");
                    break;
                case "ArrowRight":
                    handleMove("right");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [grid]);

    return (
        <>
            <div className={styles.grid}>
                {grid.map((row, rowIndex) =>
                    row.map((value, colIndex) => (
                        <Tile key={`${rowIndex}-${colIndex}`} value={value} />
                    ))
                )}
            </div>
            {isGameOver && (
                <div className={styles.gameOver}>
                    <div className={styles.gameOverContent}>
                        <h1>Game Over 😢</h1>
                        <button onClick={initializeGame} className={styles.restartButton}>
                            Restart Game
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Grid;
