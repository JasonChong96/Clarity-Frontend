/**
 *
 * PatientGettingStarted
 *
 */

import { Button, Card } from 'antd';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import './index.css';
import reducer from './reducer';
import saga from './saga';
import makeSelectPatientGettingStarted from './selectors';

export function PatientGettingStarted() {
  useInjectReducer({ key: 'patientGettingStarted', reducer });
  useInjectSaga({ key: 'patientGettingStarted', saga });

  return (
    <div
      style={{
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card title="Terms and Conditions" style={{ width: 300 }}>
        <div style={{ padding: '2em' }}>
          <p>Blablabla</p>
          <Button type="primary" ghost size="large" style={{ width: '12em' }}>
            Agree
          </Button>
        </div>
      </Card>
    </div>
  );
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
