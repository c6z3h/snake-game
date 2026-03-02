import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

/**
 * Requirements
 * 1. Game board
 * 2. Snake that moves
 * 3. Apple randomly placed
 * 4. Snake eats apple = increase in size
 *
 */
const BOARD_LENGTH = 20;
// cell values
const EMPTY_CELL = null;
const SNAKE_CELL = "S";
const INIT_SNAKE_LENGTH = 3;
const INIT_SNAKE_POSITION_R = Math.floor(BOARD_LENGTH / 2);
const INIT_SNAKE_POSITION_C = Math.floor(BOARD_LENGTH / 2);
const INIT_SNAKE: ISnake = [
  [INIT_SNAKE_POSITION_R, INIT_SNAKE_POSITION_C],
  [INIT_SNAKE_POSITION_R, INIT_SNAKE_POSITION_C + 1],
  [INIT_SNAKE_POSITION_R, INIT_SNAKE_POSITION_C + 2],
];
const APPLE = "A";

type ICell = 0 | "S" | "A"; // todo update typing
type IBoard = Array<Array<ICell>>;
type ISnake = Array<[number, number]>;
type IDirection = "left" | "right" | "up" | "down";

const paintAll = (board: IBoard, snake: ISnake, apple: [number, number]) => {
  const ROW = board.length;
  const COL = board[0].length;
  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COL; c++) {
      board[r][c] = EMPTY_CELL;
    }
  }
  for (const snakepart of snake) {
    const [r, c] = snakepart;
    board[r][c] = SNAKE_CELL;
  }
  const [apple_r, apple_c] = apple;
  board[apple_r][apple_c] = APPLE;
  return [...board];
};

const initBoard = (apple: [number, number]) => {
  const board: IBoard = [[]];
  for (let r = 0; r < BOARD_LENGTH; r++) {
    board[r] = [];
    for (let c = 0; c < BOARD_LENGTH; c++) {
      board[r].push(EMPTY_CELL);
    }
  }
  // console.log("board", board, INIT_SNAKE_POSITION_R, INIT_SNAKE_POSITION_C);
  // assuming it starts at center. if not conditional need math.min
  const finalBoard = paintAll(board, INIT_SNAKE, apple);
  return finalBoard;
};

const getApple = (snake: ISnake) => {
  let row = Math.floor(Math.random() * BOARD_LENGTH);
  let col = Math.floor(Math.random() * BOARD_LENGTH);
  while (snake.find(([R, C]) => R === row && C === col)) {
    row = Math.floor(Math.random() * BOARD_LENGTH);
    col = Math.floor(Math.random() * BOARD_LENGTH);
  }
  return [row, col] as [number, number];
};

function App() {
  const [snake, setSnake] = useState<ISnake>(INIT_SNAKE);
  const [apple, setApple] = useState<[number, number]>(getApple(snake));
  const [board, setBoard] = useState<IBoard>(initBoard(apple));
  // snake head direction, and snake head position (queue of [r,c])
  const [snakeDir, setSnakeDir] = useState<IDirection>("left"); // todo magic string remove
  console.log("board outer", board[INIT_SNAKE_POSITION_R]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("snakeDir", snakeDir);
      const snakeHead = snake[0];
      let nextHead: [number, number] = [-1, -1];
      if (snakeDir === "left") {
        nextHead = [snakeHead[0], snakeHead[1] - 1];

        // todo: hint combine the layers in computer graphics
        // use the snake to re-render the board completely
        // setBoard()
        // todo steering of snake
        // ctrl + D
      }
      if (snakeDir === "right") {
        nextHead = [snakeHead[0], snakeHead[1] + 1];
      }
      if (snakeDir === "up") {
        nextHead = [snakeHead[0] - 1, snakeHead[1]];
      }
      if (snakeDir === "down") {
        nextHead = [snakeHead[0] + 1, snakeHead[1]];
      }
      const newSnake = [nextHead, ...snake];
      if (nextHead[0] !== apple[0] || nextHead[1] !== apple[1]) {
        newSnake.pop();
      } else {
        setApple(getApple(newSnake));
      }
      setSnake(newSnake);
      console.log("snake", newSnake);
      console.log("nextHead", nextHead);
      const newBoard = paintAll(board, snake, apple);
      setBoard(newBoard);
      if (
        nextHead[0] < 0 ||
        nextHead[1] < 0 ||
        nextHead[0] === BOARD_LENGTH ||
        nextHead[1] === BOARD_LENGTH
      ) {
        alert("you lose!");
        setSnakeDir(null);
        return;
      }
    }, 500);
    return () => dclearTimeout(timeoutId);
  }, [board, snake, snakeDir]);

  useEffect(() => {
    const changeDirection = (e) => {
      const key = e.key;
      if (key === "ArrowUp" && snakeDir !== "down") {
        setSnakeDir("up");
      }
      if (key === "ArrowDown" && snakeDir !== "up") {
        setSnakeDir("down");
      }
      if (key === "ArrowLeft" && snakeDir !== "right") {
        setSnakeDir("left");
      }
      if (key === "ArrowRight" && snakeDir !== "left") {
        setSnakeDir("right");
      }
    };
    // global listener for arrow key direction
    window.addEventListener("keydown", changeDirection);

    return () => window.removeEventListener("keydown", changeDirection);
  }, [snakeDir]);

  return (
    <div>
      {board.map((row, r) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {row.map((col, c) => {
            // console.log("col", col);
            return (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "white",
                  backgroundColor: "grey",
                }}
              >
                {col}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default App;
