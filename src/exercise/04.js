// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, selectSquare}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div style={{padding: '1rem'}}>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
    </div>
  )
}

function Game() {
  const [LSSquaresHistory, setLSSquaresHistory] = useLocalStorageState(
    'tic-toe-game-history',
    [Array(9).fill(null)],
  )
  const [LSStepHistory, setLSStepHistory] = useLocalStorageState(
    'tic-toe-game-step',
    0,
  )
  const currentSquares = LSSquaresHistory[LSStepHistory]

  const winner = calculateWinner(currentSquares)
  const nextValue = calculateNextValue(currentSquares) // X || O
  const status = calculateStatus(winner, currentSquares, nextValue)
  const showHistoryGame = LSSquaresHistory.length > 1

  function selectSquare(squareIndex) {
    const isPrevSelected = currentSquares[squareIndex]
    if (isPrevSelected || winner) return

    const newHistory = LSSquaresHistory.slice(0, LSStepHistory + 1)
    const squaresCopy = [...currentSquares]
    squaresCopy[squareIndex] = nextValue
    setLSSquaresHistory([...newHistory, squaresCopy])
    setLSStepHistory(newHistory.length)
  }

  function restart() {
    const defaultValue = Array(9).fill(null)
    setLSSquaresHistory([defaultValue])
    setLSStepHistory(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{status}</div>
        <Board squares={currentSquares} selectSquare={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      {showHistoryGame && (
        <History
          historyGames={LSSquaresHistory}
          currentStep={LSStepHistory}
          updateStep={setLSStepHistory}
        />
      )}
    </div>
  )
}

function History({historyGames, currentStep, updateStep}) {
  const renderSteps = historyGames.map((squareGame, index) => {
    const isCurrentStep = index === currentStep
    const description = index === 0 ? 'Game start' : index
    return (
      <button
        disabled={isCurrentStep}
        key={index}
        onClick={() => updateStep(index)}
        style={{padding: '0.325rem', margin: '0.25rem'}}
      >
        {description}
      </button>
    )
  })

  return (
    <div style={{padding: '1rem', textAlign: 'center'}}>
      <p>History Game</p>
      <p>Steps</p>
      {renderSteps}
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
