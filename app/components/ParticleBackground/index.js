/**
 *
 * ParticleBackground
 *
 */

import React, { memo } from 'react';
import Particles from 'react-particles-js';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function ParticleBackground() {
  return <Particles
    style={{
      position: 'absolute',
      height: 'inherit',
      width: 'inherit',
      zIndex: 0,
    }}
    params={{
      "particles": {
        "number": {
          "value": 10,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "line_linked": {
          "enable": false
        },
        "move": {
          "speed": 1,
          "out_mode": "out"
        },
        "shape": {
          "type": [
            "circle",
          ],
        },
        "color": {
          "value": "#A1EDE9"
        },
        "size": {
          "value": 100,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 4,
            "size_min": 120,
            "sync": false
          }
        }
      },
      "retina_detect": false
    }} />
}

ParticleBackground.propTypes = {};

export default memo(ParticleBackground);
