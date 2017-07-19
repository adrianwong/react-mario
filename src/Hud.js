import React, { Component } from 'react';
import './Hud.css';

class Hud extends Component {
  render() {
    return (
      <div className="Hud">
        <span className="PlayerName">Mario</span>
        <span className="PlayerLives">{this.props.playerLives}</span>
        <div className="ItemContainer" />
        <span className="PlayerScore">{this.props.playerScore}</span>
      </div>
    );
  }
}

export default Hud;
