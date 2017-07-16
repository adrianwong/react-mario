import React, { Component } from 'react';
import './Game.css';

import BgMorning from './assets/bg-morning.png';
import BgDay from './assets/bg-day.png';
import BgEvening from './assets/bg-evening.png';
import BgNight from './assets/bg-night.png';

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

const BACKGROUNDS = [BgMorning, BgDay, BgEvening, BgNight];
const BACKGROUND_TIMER = 10000;

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
      player : {
        x  : 0.0,
        dx : 0.0,
        y  : 0.0,
        dy : 0.0,
        facing : "Right",
      },
      bgRotation : 0
    }

    this.changeBackground = this.changeBackground.bind(this);
  }

  spriteAnimation() {
    let animation = ["Player", "Sprite"];
    let player = this.state.player;

    // If the player is not airborne, they are walking or standing
    if (player.y <= -player.dy) {
      if (player.dx !== 0.0) {
        animation.push("Walk");
      } else {
        animation.push("Stand");
      }
    } else {
      animation.push("Jump");
    }

    // Use the last direction the player was facing, which is set
    // by pressing the "left" or "right" keys
    animation.push(player.facing);

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
    return this.state.player.y > 0.0;
  }

  // Player is continually pulled downwards if above ground
  applyGravity() {
    let player = this.state.player;

    if (player.y <= -player.dy) {
      player.y = 0.0;
      player.dy = 0.0;
    } else {
      player.dy = player.dy - GRAVITY;
    }

    this.setState({player : player});
  }

  walk(left, right) {
    let player = this.state.player;

    if (left && !right) {
      player.facing = "Left";
      player.dx = Math.max(-MAX_MOVE_SPEED, (player.dx - GROUND_ACCEL));
    } else if (right && !left) {
      player.facing = "Right";
      player.dx = Math.min(MAX_MOVE_SPEED, (player.dx + GROUND_ACCEL));
    } else {
      // Apply friction when player is:
      // 1. not moving left or right
      // 2. attempting to move left and right simultaneously
      if (Math.abs(player.dx) <= this.friction()) {
        player.dx = 0.0;
      } else if (player.dx > 0.0) {
        player.dx = player.dx - this.friction();
      } else {
        player.dx = player.dx + this.friction();
      }
    }

    this.setState({player : player});
  }

  jump(up) {
    let player = this.state.player;

    if (up) {
      if (!this.isAirborne()) {
        player.dy = MIN_JUMP_SPEED + JUMP_COEFFICIENT * Math.abs(player.dx);
      }
    }

    this.setState({player : player});
  }

  update() {
    let player = this.state.player;
    let keys = this.state.keys;

    this.applyGravity();

    const screenWidth = window.innerWidth / ZOOM_LEVEL;
    const playerWidth = this.refs.player.offsetWidth;
    const rightBoundary = screenWidth;
    const leftBoundary = -playerWidth;

    // Wrap the player around if they move off-screen
    this.walk(keys.left, keys.right);
    if (player.x > rightBoundary) {
      player.x -= screenWidth + playerWidth;
    } else if (player.x < leftBoundary) {
      player.x += screenWidth + playerWidth;
    }
    player.x += this.state.player.dx;

    this.jump(keys.up);
    player.y += this.state.player.dy;

    this.setState({player : player});

    requestAnimationFrame(() => {this.update()});
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    this.timer = setInterval(this.changeBackground, BACKGROUND_TIMER);
    this.update();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // Sequentially change the background every 10s
  changeBackground() {
    let bgRotation = this.state.bgRotation;
    if (bgRotation === BACKGROUNDS.length - 1) {
      bgRotation = 0;
    } else {
      bgRotation++;
    }

    this.setState({bgRotation : bgRotation});
  }

  render() {
    const playerLives = this.state.playerLives;
    const playerScore = this.state.playerScore;
    const x = this.state.player.x;
    const y = this.state.player.y + GROUND_HEIGHT;
    const spriteAnimation = this.spriteAnimation();
    const background = "url(" + BACKGROUNDS[this.state.bgRotation] + ") center/cover repeat-x fixed #B0E9F8";

    return (
      <div className="Game" style={{zoom : ZOOM_LEVEL, background : background}}>
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
