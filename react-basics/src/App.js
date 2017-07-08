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
      <button>
        <i className="fa fa-refresh"></i>
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

Numbers.list = _.range(1, 10);

class Game extends Component {
  state = {
    selectedNumbers: [],
    numberOfStars: 1 + Math.floor(Math.random() * 9),
    usedNumber: [],
    answerIsCorrect: null,
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
      usedNumber: prevState.selectedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      numberOfStars: 1 + Math.floor(Math.random() * 9)
    }))
  }

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.numberOfStars ===
      prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }))
  }
  render() {
    const { selectedNumbers,
      numberOfStars, answerIsCorrect, usedNumber } = this.state;
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={numberOfStars} />
          <Button selectedNumbers={selectedNumbers}
            checkAnswer={this.checkAnswer}
            acceptAnswer={this.acceptAnswer}
            answerIsCorrect={answerIsCorrect} />
          <Answer selectedNumbers={selectedNumbers}
            unselectedNumber={this.unselectedNumber} />
        </div>
        <br />
        <Numbers selectedNumbers={selectedNumbers}
          selectNumber={this.selectNumber}
          usedNumber={usedNumber} />
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
