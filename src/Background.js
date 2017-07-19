import React, { Component } from 'react';
import './Background.css';

import BgMorning from './assets/bg-morning.png';
import BgDay from './assets/bg-day.png';
import BgEvening from './assets/bg-evening.png';
import BgNight from './assets/bg-night.png';

const BACKGROUNDS = [BgMorning, BgDay, BgEvening, BgNight];
const BACKGROUND_TIMER = 10000;

class Background extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgRotation : 0
    }

    this.changeBackground = this.changeBackground.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.changeBackground, BACKGROUND_TIMER);
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
    const background = "url(" + BACKGROUNDS[this.state.bgRotation] + ") center/cover repeat-x fixed #B0E9F8";

    return (
      <div className="Background" style={{background : background}} />
    );
  }
}

export default Background;
