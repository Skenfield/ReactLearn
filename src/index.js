import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {calculateWinner} from './modules/calculateWinner.js'
import {range} from './modules/utils.js'

function Square(props){
  return(
    <button 
    className="square"
    onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square
        key = {"col" + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const RowSize = this.props.RawSize; 
    const raws = range(0, 9, RowSize).map(element => range(element, element + RowSize))

    const board = raws.map(raw => {
      return (
        <div
        key = {"raw" + raw[0]}
        className="board-row">
          {raw.map(index => {
            return (
              this.renderSquare(index)
            )
          })}
        </div>
      )
    })

    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0, 
      xIsNext: true, 
    };
  }

  handleClick(i){
    
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1]
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move}` : 'Go to game start';
      return (
       <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
       </li> 
      )
    })

    let status; 
    const name = this.state.xIsNext ? 'X' : 'O';
    const full = current.squares.every(element => element != null)

    if(winner){
      status = `Winner: ${winner}`; 
    }else{
      if(full){
       status = "Draw";   
      }else{
      status = `Next player: ${name}`;
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            RawSize={3}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} 
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


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);