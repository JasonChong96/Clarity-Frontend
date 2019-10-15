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
import './index.css';

const pages = [{
  title: 'Getting Started'
}, {
  title: 'Getting Started 2'
}, {
  title: 'Getting Started 3'
}, {
  title: 'Getting Started 4'
},
]

export function PatientGettingStarted() {
  useInjectReducer({ key: 'patientGettingStarted', reducer });
  useInjectSaga({ key: 'patientGettingStarted', saga });

  return <Carousel dotPosition='top' dotsClass='carousel-dot'>
    {pages.map(page => (<div>
      <Title>{page.title}</Title>
      <Title level={2}>Insert cool image</Title>
    </div>))}
  </Carousel>
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
