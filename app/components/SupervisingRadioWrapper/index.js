/**
 *
 * SupervisingRadioWrapper
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function SupervisingRadioWrapper({ children }) {
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '6.5rem' }}>{children}</div>;
}

SupervisingRadioWrapper.propTypes = {};

export default memo(SupervisingRadioWrapper);
