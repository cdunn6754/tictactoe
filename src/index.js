import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
     {props.value}
    </button>
  )
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}/>
    );
  }

  render() {
    const counter = [0,1,2];
    
    const board = counter.map((count) => {
      const outerCount = count;
      
      const boardRow = counter.map((count) => {
        return this.renderSquare(count + 3*outerCount);
      });
    
      return (
        <div className="board-row">
          {boardRow}
        </div>
      )
      
    });
    
    return ( 
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveLocation: null,
        playerTurn: 'X'
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
    
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    const symbol = this.state.xIsNext ? 'X' : 'O';
    squares[i] = symbol;
    
    this.setState({
      history: history.concat([{
          squares: squares,
          moveLocation: findCoordinates(i),
          playerTurn: symbol,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  render() {
    
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner =calculateWinner(current.squares);
    const currentStepNumber = this.state.stepNumber
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
        
      const location = step.moveLocation ?
        'at ' + step.moveLocation :
        '';
        
      const playerTurn = move ?
        '; Player ' + step.playerTurn :
        '';
        
      const styleClass = (move === currentStepNumber) ?
        'history-indicator' :
        null;
            
      return (
        <li key={move}>
          <button  
            className={styleClass}
            onClick={() => this.jumpTo(move)}>
              {desc} {playerTurn} {location}
          </button>
        </li>
      );
    });
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Current player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
  
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function findCoordinates(i) {

  const coordinates = {
    0 : "(0,0)",
    1 : "(1,0)",
    2 : "(2,0)",
    3 : "(0,1)",
    4 : "(1,1)",
    5 : "(2,1)",
    6 : "(0,2)",
    7 : "(1,2)",
    8 : "(2,2)",    
  }
  
  return coordinates[i]
}

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
