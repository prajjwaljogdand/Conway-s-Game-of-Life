import "./App.css";
import React, { useCallback, useRef, useState } from "react";
import produce from "immer";

const numRows = 30;
const numCols = 69;

const operation = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);

  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbours = 0;
            operation.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;

              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbours += g[newI][newJ];
              }
            });

            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbours === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <h2>Game of Life</h2>
      <button
        onClick={() => {
          setRunning(!running);

          runningRef.current = true;
          runSimulation();
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button onClick={() => setGrid(generateEmptyGrid())}>clear</button>
      <button
        onClick={() => {
          const rows = [];

          for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => Math.random() > 0.85 ? 1 : 0));
          }

          setGrid(rows);
        }}
      >
        random
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 21px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "white" : undefined,
                boxShadow: grid[i][k] ? "0 0 1px #fff, 0 0 2px #fff, 0 0 4px #fff, 0 0 5px #ff1177,0 0 8px #ff1177, 0 0 10px #ff1177, 0 0 15px #ff1177, 0 0 30px #ff1177" : undefined,
                zIndex : 1,
                border: grid[i][k] ? "solid 0.1px white" : "solid 0.1px grey",
               
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
