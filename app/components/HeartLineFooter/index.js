/**
 *
 * HeartLineFooter
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import FooterImage from 'images/heart_line.svg';

function HeartLineFooter() {
  return <div style={{ display: 'inline-block' }}>
    <div style={{ maxWidth: '500px', textAlign: 'center', margin: '0 auto' }}>
      <img style={{ width: '100%', display: 'inline-block', backgroundSize: '100% 100%', }} src={FooterImage} />
    </div>
  </div>
}

HeartLineFooter.propTypes = {};

export default memo(HeartLineFooter);
