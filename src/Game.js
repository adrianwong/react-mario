import React, { Component } from 'react';
import './Game.css';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      playerLives : 3,
      playerScore : 0
    }
  }

  render() {
    return (
      <div className="Game">
        <div className="Background" />
        <div className="Ground" />
        <div className="Hud">
          <span className="PlayerName">Mario</span>
          <span className="PlayerLives">{this.state.playerLives}</span>
          <div className="ItemContainer" />
          <span className="PlayerScore">{this.state.playerScore}</span>
        </div>
      </div>
    );
  }
}

export default Game;
