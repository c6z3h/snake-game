import React, { useEffect, useState } from "react";
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
const INIT_SNAKE_POSITION_R = Math.floor(BOARD_LENGTH / 2);
const INIT_SNAKE_POSITION_C = Math.floor(BOARD_LENGTH / 2);
const INIT_SNAKE: ISnake = [
  [INIT_SNAKE_POSITION_R, INIT_SNAKE_POSITION_C],
  [INIT_SNAKE_POSITION_R, INIT_SNAKE_POSITION_C + 1],
  [INIT_SNAKE_POSITION_R, INIT_SNAKE_POSITION_C + 2],
];
const APPLE_CELL = "A";
const DIR_LEFT = "left";
const DIR_RIGHT = "right";
const DIR_UP = "up";
const DIR_DOWN = "down";

type ICell = typeof EMPTY_CELL | typeof SNAKE_CELL | typeof APPLE_CELL;
type IBoard = Array<Array<ICell>>;
type ISnake = Array<[number, number]>;
type IDirection =
  | typeof DIR_LEFT
  | typeof DIR_RIGHT
  | typeof DIR_DOWN
  | typeof DIR_UP
  | null;

const getDefaultBoard = () => {
  const board: IBoard = [];
  for (let r = 0; r < BOARD_LENGTH; r++) {
    board[r] = [];
    for (let c = 0; c < BOARD_LENGTH; c++) {
      board[r][c] = EMPTY_CELL;
    }
  }
  return board;
};

const paintAll = (
  snake: ISnake,
  apple: [number, number],
  board: IBoard = getDefaultBoard(),
) => {
  for (const snakepart of snake) {
    const [r, c] = snakepart;
    board[r][c] = SNAKE_CELL;
  }
  const [apple_r, apple_c] = apple;
  board[apple_r][apple_c] = APPLE_CELL;
  return [...board];
};

const initBoard = (apple: [number, number]) => {
  // assuming it starts at center. if not conditional need math.min
  const finalBoard = paintAll(INIT_SNAKE, apple);
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

const Cell: React.FC<{ val: ICell }> = React.memo(({ val }) => {
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
      {val}
    </div>
  );
});

function App() {
  const [snake, setSnake] = useState<ISnake>(INIT_SNAKE);
  const [apple, setApple] = useState<[number, number]>(getApple(snake));
  const [board, setBoard] = useState<IBoard>(initBoard(apple));
  // snake head direction, and snake head position (queue of [r,c])
  const [snakeDir, setSnakeDir] = useState<IDirection>(DIR_LEFT);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (snakeDir === null) {
        clearTimeout(timeoutId);
        return;
      }
      const snakeHead = snake[0];
      let nextHead: [number, number] = [0, 0];
      if (snakeDir === DIR_LEFT) {
        nextHead = [snakeHead[0], snakeHead[1] - 1];

        // todo: hint combine the layers in computer graphics
        // use the snake to re-render the board completely
        // todo: hint ctrl + D
      }
      if (snakeDir === DIR_RIGHT) {
        nextHead = [snakeHead[0], snakeHead[1] + 1];
      }
      if (snakeDir === DIR_UP) {
        nextHead = [snakeHead[0] - 1, snakeHead[1]];
      }
      if (snakeDir === DIR_DOWN) {
        nextHead = [snakeHead[0] + 1, snakeHead[1]];
      }
      const newSnake = [nextHead, ...snake];
      if (nextHead[0] !== apple[0] || nextHead[1] !== apple[1]) {
        newSnake.pop();
      } else {
        setApple(getApple(newSnake));
      }
      setSnake(newSnake);
      const newBoard = paintAll(snake, apple);
      setBoard(newBoard);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [snake, snakeDir]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const snakeOutOfBounds =
        snake[0][0] < 0 ||
        snake[0][1] < 0 ||
        snake[0][0] === BOARD_LENGTH ||
        snake[0][1] === BOARD_LENGTH;
      const snakeAteItself = snake.find(
        ([R, C], i) => R === snake[0][0] && C === snake[0][1] && i !== 0,
      );

      if (snakeOutOfBounds || snakeAteItself) {
        setSnake(snake.slice(1));
        alert("you lose!");
        setSnakeDir(null);
        return;
      }
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [board]);

  useEffect(() => {
    const changeDirection = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === "ArrowUp" && snakeDir !== DIR_DOWN) {
        setSnakeDir(DIR_UP);
      }
      if (key === "ArrowDown" && snakeDir !== DIR_UP) {
        setSnakeDir(DIR_DOWN);
      }
      if (key === "ArrowLeft" && snakeDir !== DIR_RIGHT) {
        setSnakeDir(DIR_LEFT);
      }
      if (key === "ArrowRight" && snakeDir !== DIR_LEFT) {
        setSnakeDir(DIR_RIGHT);
      }
    };
    // global listener for arrow key direction
    window.addEventListener("keydown", changeDirection);

    return () => window.removeEventListener("keydown", changeDirection);
  }, [snakeDir]);
  // TODO it doesn't show up correct, it terminate before ending
  return (
    <div>
      {board.map((row, r) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {row.map((val, c) => {
            return <Cell key={`${r}_${c}`} val={val} />;
          })}
        </div>
      ))}
    </div>
  );
}

export default App;
