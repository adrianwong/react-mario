import React, { Component } from 'react';
import './Game.css';

const KEY = {
  LEFT  : 37,
  RIGHT : 39,
  UP    : 38
};

const ZOOM_LEVEL = 3;

const MAX_MOVE_SPEED = 2.5;
const GROUND_ACCEL = 0.06;
const GROUND_FRICTION = 0.1;
const AIR_ACCEL = 0.04;
const AIR_FRICTION = 0.02;
const GRAVITY = 0.25;
const MIN_JUMP_SPEED = 4.0;
const JUMP_COEFFICIENT = 0.8;

const GROUND_HEIGHT = 40;

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
      dy : 0.0,
      facing : "Right"
    }
  }

  spriteAnimation() {
    let animation = ["Player", "Sprite"];
    let dx = this.state.dx;
    let y = this.state.y;
    let dy = this.state.dy;
    let facing = this.state.facing;

    if (y <= -dy) {
      if (dx !== 0.0) {
        animation.push("Walk");
      } else {
        animation.push("Stand");
      }
    } else {
      animation.push("Jump");
    }

    animation.push(facing);

    return animation.join(" ");
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

  // Player is continually pulled downwards if above ground
  applyGravity() {
    let y = this.state.y;
    let dy = this.state.dy;

    if (y <= -dy) {
      y = 0.0;
      dy = 0.0;
    } else {
      dy = dy - GRAVITY;
    }

    this.setState({y : y, dy : dy});
  }

  walk(left, right) {
    let dx = this.state.dx;
    let facing = this.state.facing;

    if (left && !right) {
      facing = "Left";
      dx = Math.max(-MAX_MOVE_SPEED, (dx - GROUND_ACCEL));
    } else if (right && !left) {
      facing = "Right";
      dx = Math.min(MAX_MOVE_SPEED, (dx + GROUND_ACCEL));
    } else {
      // Apply friction when player is:
      // 1. not moving left or right
      // 2. attempting to move left and right simultaneously
      if (Math.abs(dx) <= this.friction()) {
        dx = 0.0;
      } else if (dx > 0.0) {
        dx = dx - this.friction();
      } else {
        dx = dx + this.friction();
      }
    }

    this.setState({dx : dx, facing : facing});
  }

  jump(up) {
    let dx = this.state.dx;
    let dy = this.state.dy;

    if (up) {
      if (!this.isAirborne()) {
        dy = MIN_JUMP_SPEED + JUMP_COEFFICIENT * Math.abs(dx);
      }
    }

    this.setState({dy : dy});
  }

  update() {
    let x = this.state.x;
    let y = this.state.y;
    let keys = this.state.keys;

    this.applyGravity();

    const screenWidth = window.innerWidth / ZOOM_LEVEL;
    const playerWidth = this.refs.player.offsetWidth;
    const rightBoundary = screenWidth;
    const leftBoundary = -playerWidth;

    // Wrap the player around if they move off-screen
    this.walk(keys.left, keys.right);
    if (x > rightBoundary) {
      x -= screenWidth + playerWidth;
    } else if (x < leftBoundary) {
      x += screenWidth + playerWidth;
    }
    x += this.state.dx;

    this.jump(keys.up);
    y += this.state.dy;

    this.setState({x : x, y : y});

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
    const y = this.state.y + GROUND_HEIGHT;
    const spriteAnimation = this.spriteAnimation();

    return (
      <div className="Game" style={{zoom : ZOOM_LEVEL}}>
        <div className="Ground" />
        <div className="Hud">
          <span className="PlayerName">Mario</span>
          <span className="PlayerLives">{playerLives}</span>
          <div className="ItemContainer" />
          <span className="PlayerScore">{playerScore}</span>
        </div>
        <div ref="player" className={spriteAnimation} style={{left : x, bottom : y}} />
      </div>
    );
  }
}

export default Game;
