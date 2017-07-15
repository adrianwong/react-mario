import React, { Component } from 'react';
import './Game.css';

const KEY = {
  LEFT  : 37,
  RIGHT : 39,
  UP    : 38
};

const MAX_MOVE_SPEED = 2.5;
const GROUND_ACCEL = 0.06;
const GROUND_FRICTION = 0.1;
const AIR_ACCEL = 0.04;
const AIR_FRICTION = 0.02;

class Game extends Component {
  constructor() {
    super();
    this.state = {
      playerLives : 3,
      playerScore : 0,
      keys : {
        left  : 0,
        right : 0,
        up    : 0
      },
      x  : 0.0,
      dx : 0.0,
      y  : 0.0,
      dy : 0.0
    }
  }

  handleKeys(value, event) {
    let keys = this.state.keys;

    if (event.keyCode === KEY.LEFT) keys.left = value;
    if (event.keyCode === KEY.RIGHT) keys.right = value;
    if (event.keyCode === KEY.UP) keys.up = value;

    this.setState({keys : keys});
  }

  acceleration() {
    return this.isAirborne() ? AIR_ACCEL : GROUND_ACCEL;
  }

  friction() {
    return this.isAirborne() ? AIR_FRICTION : GROUND_FRICTION;
  }

  isAirborne() {
    return this.state.y > 0.0;
  }

  walk(left, right) {
    let dx = this.state.dx;

    if (left) {
      dx = Math.max(-MAX_MOVE_SPEED, (dx - GROUND_ACCEL));
    } else if (right) {
      dx = Math.min(MAX_MOVE_SPEED, (dx + GROUND_ACCEL));
    } else {
      if (Math.abs(dx) < this.friction()) {
        dx = 0.0;
      } else if (dx > 0.0) {
        dx = dx - this.friction();
      } else {
        dx = dx + this.friction();
      }
    }

    this.setState({dx : dx});
  }

  update() {
    let x = this.state.x;
    let keys = this.state.keys;

    this.walk(keys.left, keys.right);
    x += this.state.dx;

    this.setState({x : x});

    requestAnimationFrame(() => {this.update()});
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    this.update();
  }

  render() {
    const playerLives = this.state.playerLives;
    const playerScore = this.state.playerScore;
    const x = this.state.x;

    return (
      <div className="Game">
        <div className="Background" />
        <div className="Ground" />
        <div className="Hud">
          <span className="PlayerName">Mario</span>
          <span className="PlayerLives">{playerLives}</span>
          <div className="ItemContainer" />
          <span className="PlayerScore">{playerScore}</span>
        </div>
        <div className="Player Sprite Stand Right" style={{left : x}} />
      </div>
    );
  }
}

export default Game;
