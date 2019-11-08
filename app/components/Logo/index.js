/**
 *
 * Logo
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import LogoImage from 'images/logo.svg';

function Logo({ maxWidth }) {
  return <img style={{ width: '40vw', maxWidth, height: 'auto' }} src={LogoImage} />;
}

Logo.propTypes = {};

Logo.defaultProps = {
  maxWidth: '200px',
}

export default memo(Logo);
