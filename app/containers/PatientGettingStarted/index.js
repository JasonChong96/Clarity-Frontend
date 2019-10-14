/**
 *
 * PatientGettingStarted
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectPatientGettingStarted from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Carousel } from 'antd';
import Title from 'antd/lib/typography/Title';

export function PatientGettingStarted() {
  useInjectReducer({ key: 'patientGettingStarted', reducer });
  useInjectSaga({ key: 'patientGettingStarted', saga });

  return <Carousel dotPosition='top'>
    <div>
      <Title >How it works</Title>
    </div>
    <div>
      <Title>Page 2</Title>
    </div>
    <div>
      <Title>Page 3</Title>
    </div>
  </Carousel>;
}

PatientGettingStarted.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  patientGettingStarted: makeSelectPatientGettingStarted(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(PatientGettingStarted);
