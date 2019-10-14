/**
 *
 * Home
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Link } from 'react-router-dom';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectHome from './selectors';
import reducer from './reducer';
import saga from './saga';
import logo from '../../images/clarity_logo.png'
import HorizontallyCentered from '../../components/HorizontallyCentered';
import { Button } from 'antd';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';

export function Home() {
  useInjectReducer({ key: 'home', reducer });
  useInjectSaga({ key: 'home', saga });

  return <>
    <HorizontallyCentered>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
        <img src={logo} alt='Clarity Singapore Logo' />
        <div style={{ padding: '4em', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Title style={{ textAlign: 'center' }}>Welcome</Title>
          <Text style={{ textAlign: 'center' }}>Talk to a professional counsellor <br />that you can trust</Text>
        </div>
        <Button size='large' style={{ width: '12em' }}>
          Getting Started
        </Button>
        <Link to='/patient/login'>
          <Button size='large' style={{ width: '12em' }}>
            Log in
        </Button>
        </Link>
      </div>
    </HorizontallyCentered>
  </>;
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  home: makeSelectHome(),
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
)(Home);
