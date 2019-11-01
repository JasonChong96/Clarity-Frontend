/**
 *
 * Logo
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import LogoImage from 'images/logo.svg';

function Logo() {
  return <img style={{ width: '40vw', maxWidth: '200px', height: 'auto' }} src={LogoImage} />;
}

Logo.propTypes = {};

export default memo(Logo);
