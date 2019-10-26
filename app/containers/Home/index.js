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
import { Button, Icon, Row, Col } from 'antd';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import makeSelectHome from './selectors';
import reducer from './reducer';
import saga from './saga';
import logo from '../../images/clarity_logo.png';
import HorizontallyCentered from '../../components/HorizontallyCentered';

export function Home() {
  useInjectReducer({ key: 'home', reducer });
  useInjectSaga({ key: 'home', saga });

  return (
    <>
      <div
        style={{
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <img src={logo} alt='Clarity Singapore Logo' /> */}

        <div>
          <Text style={{ textAlign: 'center' }}>logo here</Text>
        </div>

        <div style={{ padding: '2em' }}>
          <Link to="/patient/register">
            <Button type="primary" ghost size="large" style={{ width: '12em' }}>
              Sign Up
            </Button>
          </Link>
        </div>

        <div style={{ padding: '2em' }}>
          <Link to="/patient/login">
            <Button type="primary" ghost size="large" style={{ width: '12em' }}>
              Sign In
            </Button>
          </Link>
        </div>
        <Icon type="down-circle" theme="twoTone" style={{ fontSize: '50px' }} />
      </div>
      <Row>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
          Some descriptions and an image
        </Col>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
          Some descriptions and an image
        </Col>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
          Some descriptions and an image
        </Col>
      </Row>
      ,
    </>
  );
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
