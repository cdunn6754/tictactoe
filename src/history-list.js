import React from 'react'

function HistoryList(props) {
  const history = props.history;
  const currentStepNumber = props.currentStepNumber
  
  const historyList = history.map((step, turnNumber) => {
    const desc = turnNumber ?
      "Go to move #" + turnNumber :
      "Go to start of game";
      
    const location = step.moveLocation ?
      'at ' + step.moveLocation :
      '';
      
    const playerTurn = turnNumber ?
      '; Player ' + step.playerTurn :
      '';
      
    const styleClass = (turnNumber === currentStepNumber) ?
      'history-indicator' :
      null;
      
    return (
        <li key={turnNumber}>
          <button  
            className={styleClass}
            onClick={() => props.onHistoryClick(turnNumber)}>
              {desc} {playerTurn} {location}
          </button>
        </li>
      );
  });
  
  if (props.listInverted) {
    historyList.reverse()
  };
  
  return historyList;
}

export default HistoryList;