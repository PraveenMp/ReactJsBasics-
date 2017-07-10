import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var _ = require('lodash');

const Stars = (props) => {
  //const numberOfStars = 1 + Math.floor(Math.random() * 9);
  return (
    <div className="col-md-5">
      {_.range(props.numberOfStars).map(i =>
        <i key={i} className="fa fa-star"></i>
      )}
    </div>
  );
}
var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};
const Button = (props) => {
  let button;

  switch (props.answerIsCorrect) {
    case true:
      button = <button className="btn btn-success"
        onClick={props.acceptAnswer}
      ><i className="fa fa-check"></i></button>;
      break;
    case false:
      button = <button className="btn btn-danger"
      ><i className="fa fa-times"></i></button>;
      break;
    default:
      button = <button className="btn"
        disabled={props.selectedNumbers.length === 0}
        onClick={props.checkAnswer}>=</button>;
      break;
  }
  return (
    <div className="col-md-2">
      {button}
      <br /><br />
      <button className="btn btn-warning btn-sm"
        onClick={props.redraw} 
        disabled={props.redraws ===0 }>
        <i className="fa fa-refresh"></i> {props.redraws}
      </button>
    </div>
  );
}


const Answer = (props) => {
  return (
    <div className="col-md-5">
      {props.selectedNumbers.map((number, i) =>
        <span key={i} onClick={() => props.unselectedNumber(number)}>{number}</span>
      )}
    </div>
  );
};

const Numbers = (props) => {
  const numberClassName = (number) => {
    if (props.usedNumber.indexOf(number) >= 0) {
      return 'used';
    }
    if (props.selectedNumbers.indexOf(number) >= 0) {
      return 'selected';
    }
  }
  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((number, i) =>
          <span key={i} className={numberClassName(number)}
            onClick={() => props.selectNumber(number)}>
            {number}</span>
        )}
      </div>
    </div>
  );
}
const DoneFrame = (props) => {
  return (
    <div className="text-center">
      <h2>{props.doneStatus}</h2>
      <button 
      className="btn btn-secondary"
      onClick={props.resetGame} >Play Again</button>
      </div>
  )
}
Numbers.list = _.range(1, 10);

class Game extends Component {
  static initialState = () => ({
    selectedNumbers: [],
    numberOfStars: 1 + Math.floor(Math.random() * 9),
    usedNumber: [],
    answerIsCorrect: null,
    redraws: 5,
    doneStatus:null
  })
  state=Game.initialState();

  resetGame = () => {
    this.setState(Game.initialState());
  }

  selectNumber = (clickedNumber) => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }))
  }
  unselectedNumber = (clickedNumber) => {
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers
        .filter(number => number !== clickedNumber)
    }))
  }
  acceptAnswer = () => {
    this.setState(prevState => ({
      usedNumber: prevState.usedNumber.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      numberOfStars: 1 + Math.floor(Math.random() * 9)
    }),this.updateDoneStatus);
  }

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.numberOfStars ===
      prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }),this.updateDoneStatus);
  }
  redraw = () => {
    if(this.state.redraws === 0) {return;}
    this.setState(
      prevState => ({
        numberOfStars: 1 + Math.floor(Math.random() * 9),
        answerIsCorrect: null,
        selectedNumbers: [],
        redraws:prevState.redraws-1,

      }));
  }
  possibleSolutions=({numberOfStars,usedNumber})=> {
   const possibleNumbers=_.range(1,10).filter(number => 
   usedNumber.indexOf(number)===-1);

   return possibleCombinationSum(possibleNumbers,numberOfStars);
  }
  updateDoneStatus = () => {
    this.setState(prevState => {
      if(prevState.usedNumber.length === 9) {
            return { doneStatus:'Well Done :) .. ' }
      }
      if (prevState.redraws===0 && !this.possibleSolutions(prevState)) {
        return { doneStatus:'Game Over!'};
      }
    });
  }
  render() {
    const { selectedNumbers, redraws,
      numberOfStars, answerIsCorrect, usedNumber, doneStatus } = this.state;
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={numberOfStars} />
          <Button selectedNumbers={selectedNumbers}
            checkAnswer={this.checkAnswer}
            redraws={redraws}
            acceptAnswer={this.acceptAnswer}
            redraw={this.redraw}
            answerIsCorrect={answerIsCorrect} />
          <Answer selectedNumbers={selectedNumbers}
            unselectedNumber={this.unselectedNumber} />
        </div>
        <br />
        {doneStatus ?
        <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus} /> :
        <Numbers selectedNumbers={selectedNumbers}
          selectNumber={this.selectNumber}
          usedNumber={usedNumber} />
        }          
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Game />
    );
  }
}
//ReactDOM.render(<App/>,mountNode);
export default App;
