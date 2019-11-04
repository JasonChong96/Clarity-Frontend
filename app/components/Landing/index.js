/**
 *
 * Logo
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import LandingImage from 'images/landing_img.svg';

function Landing() {
  return <img style={{ width: '100vw', height: 'auto' }} src={LandingImage} />;
}

Landing.propTypes = {};

export default memo(Landing);
