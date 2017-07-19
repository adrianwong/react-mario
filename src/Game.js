import React, { Component } from 'react';
import './Game.css';

import Background from './Background';
import Ground from './Ground';
import Hud from './Hud';
import Player from './Player';

const KEY = {
  LEFT  : 37,
  RIGHT : 39,
  UP    : 38,
  SPACE : 32
};

const SCALE_FACTOR = 3;

const MAX_MOVE_SPEED = 2.5;
const GROUND_ACCEL = 0.06;
const GROUND_FRICTION = 0.1;
const AIR_ACCEL = 0.04;
const AIR_FRICTION = 0.02;
const GRAVITY = 0.25;
const MIN_JUMP_SPEED = 4.0;
const JUMP_COEFFICIENT = 0.8;

const GROUND_HEIGHT = 40;
const PLAYER_WIDTH = 27;

class Game extends Component {
  constructor() {
    super();
    this.state = {
      playerLives : 3,
      playerScore : 0,
      keys : {
        left  : 0,
        right : 0,
        up    : 0,
        space : 0
      },
      player : {
        x  : 0.0,
        dx : 0.0,
        y  : 0.0,
        dy : 0.0,
        facing : "Right",
        isBoosted : false
      }
    }
  }

  handleKeys(value, event) {
    let keys = this.state.keys;

    if (event.keyCode === KEY.LEFT) keys.left = value;
    if (event.keyCode === KEY.RIGHT) keys.right = value;
    if (event.keyCode === KEY.UP) keys.up = value;
    if (event.keyCode === KEY.SPACE) keys.space = value;

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
      player.isBoosted = false;
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

  boost(space) {
    let player = this.state.player;

    if (space) {
      if (this.isAirborne() && !player.isBoosted) {
        player.dy = MIN_JUMP_SPEED + JUMP_COEFFICIENT * Math.abs(player.dx) * 2;
        player.isBoosted = true;
      }
    }

    this.setState({player : player});
  }

  update() {
    let player = this.state.player;
    let keys = this.state.keys;

    this.applyGravity();

    const screenWidth = window.innerWidth / SCALE_FACTOR;
    const rightBoundary = screenWidth;
    const leftBoundary = -PLAYER_WIDTH;

    // Wrap the player around if they move off-screen
    this.walk(keys.left, keys.right);
    if (player.x > rightBoundary) {
      player.x -= screenWidth + PLAYER_WIDTH;
    } else if (player.x < leftBoundary) {
      player.x += screenWidth + PLAYER_WIDTH;
    }
    player.x += this.state.player.dx;

    this.jump(keys.up);
    this.boost(keys.space);
    player.y += this.state.player.dy;

    this.setState({player : player});

    requestAnimationFrame(() => {this.update()});
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    this.update();
  }

  render() {
    return (
      <div className="Game">
        <Background />
        <div className="Scale">
          <Ground />
          <Hud playerLives={this.state.playerLives} playerScore={this.state.playerScore} />
          <Player player={this.state.player} GROUND_HEIGHT={GROUND_HEIGHT} />
        </div>
      </div>
    );
  }
}

export default Game;
