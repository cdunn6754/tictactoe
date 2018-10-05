import React from 'react';
import ReactDOM from 'react-dom';
import HistoryList from './history-list.js';
import './index.css';

function Square(props){
  
  const squareStyle = props.winnerSquare ?
    {color : 'red'} :
    null;
  
  return (
    <button className="square" onClick={props.onClick}>
      <span style={squareStyle}> 
        {props.value}
      </span>
    </button>
  )
}

function ListToggle(props) {

  const toggleText = props.listInverted ?
    "Reset List" :
    "Invert List";

  return(
    <button className="toggle-switch" onClick={props.onClick}>
     {toggleText}
    </button>
  )
}



class Board extends React.Component {
  
  renderSquare(i) {
    const winners = this.props.winners;
    
    const winnerSquare = (winners) && (winners.includes(i));
      
    return (
      <Square 
        key={i}
        value={this.props.squares[i]}
        winnerSquare = {winnerSquare}
        onClick={() => this.props.onClick(i)}
      />
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
        <div key={outerCount} className="board-row">
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
      listInverted: false,
      noWinner: false,
    };
  }
    
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares)[0]
    const noWinner = checkNoWinner(squares);
    
    if (winner || squares[i] || noWinner) {
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
  
  handleHistoryClick(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  render() {
    
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerResults = calculateWinner(current.squares);
    const winner = winnerResults[0];
    const winners = winnerResults[1];
    const currentStepNumber = this.state.stepNumber;
    const listInverted = this.state.listInverted;
    
    const noWinner = checkNoWinner(current.squares);
    
      
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (noWinner){
      status = 'Draw, game over:'
    } else {
      status = 'Current player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
      
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            winners = {winners}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>
            <HistoryList
              history = {history}
              currentStepNumber = {currentStepNumber}
              listInverted = {this.state.listInverted}
              onHistoryClick = {(i) => this.handleHistoryClick(i)}
            />
          </ol>
        </div>
        <div className="toggle-container">
          <div>
            <ListToggle 
              listInverted = {listInverted}
              onClick = {() => {this.setState({
                listInverted: !listInverted,
                })
              }}
            />
          </div>
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
      return [squares[a], [a,b,c]];
    }
  }
  return [null, null];
}

function checkNoWinner(squares) {
  return ( ! squares.includes(null)) ?
    true :
    false;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
