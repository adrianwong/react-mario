import React, { Component } from 'react';
import './Game.css';

class Game extends Component {
  render() {
    return (
      <div className="Game">
        <div className="Background" />
        <div className="Ground" />
      </div>
    );
  }
}

export default Game;
