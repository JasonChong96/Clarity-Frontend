/**
 *
 * Home
 *
 */

import { Button, Col, Icon, Row } from 'antd';
import Text from 'antd/lib/typography/Text';
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import makeSelectHome from './selectors';
import AnonymousLoginModal from '../../components/AnonymousLoginModal';
import { loginAnonymously } from './actions';
import HeaderImage from 'images/home_header.svg';
import Logo from '../../components/Logo';
import HeartLineFooter from '../../components/HeartLineFooter';

export function Home({ loginAnonymously }) {
  useInjectReducer({ key: 'home', reducer });
  useInjectSaga({ key: 'home', saga });
  const [anonymousFormVisible, setAnonymousFormVisible] = useState(false);
  return (
    <>
      <div style={{ display: 'inline-block' }}>
        <div
          style={{ maxWidth: '500px', textAlign: 'center', margin: '0 auto' }}
        >
          <img
            style={{
              width: '100%',
              display: 'inline-block',
              backgroundSize: '100% 100%',
            }}
            src={HeaderImage}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Logo />
        <div style={{ padding: '1em' }}>
          <Link to="/patient/login">
            <Button type="primary" ghost size="large" style={{ width: '12em' }}>
              Login
            </Button>
          </Link>
        </div>

        <div style={{ padding: '1em' }}>
          <Link to="/patient/register">
            <Button type="primary" ghost size="large" style={{ width: '12em' }}>
              Sign Up
            </Button>
          </Link>
        </div>

        <div style={{ padding: '1em' }}>
          <Button
            type="primary"
            ghost
            size="large"
            style={{ width: '12em' }}
            onClick={() => setAnonymousFormVisible(true)}
          >
            Chat Anonymously
          </Button>
        </div>
        {/* <Icon type="down-circle" theme="twoTone" style={{ fontSize: '50px' }} /> */}
      </div>
      <HeartLineFooter />
      <AnonymousLoginModal
        visible={anonymousFormVisible}
        onCancel={() => setAnonymousFormVisible(false)}
        onStart={name => {
          loginAnonymously(name);
          setAnonymousFormVisible(false);
        }}
      />
      {/* <Row>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
          Some descriptions and an image
        </Col>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
          Some descriptions and an image
        </Col>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
          Some descriptions and an image
        </Col>
      </Row> */}
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
    loginAnonymously: name => dispatch(loginAnonymously(name)),
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
