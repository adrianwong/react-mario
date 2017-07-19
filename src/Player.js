import React, { Component } from 'react';
import './Player.css';

class Player extends Component {
  spriteAnimation() {
    let animation = ["Player", "Sprite"];
    let player = this.props.player;

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

  render() {
    const x = this.props.player.x;
    const y = this.props.player.y + this.props.GROUND_HEIGHT;
    const spriteAnimation = this.spriteAnimation();

    return (
      <div className={spriteAnimation} style={{left : x, bottom : y}} />
    );
  }
}

export default Player;
