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

export function Home({ loginAnonymously }) {
  useInjectReducer({ key: 'home', reducer });
  useInjectSaga({ key: 'home', saga });
  const [anonymousFormVisible, setAnonymousFormVisible] = useState(false);

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

        <div style={{ padding: '2em' }}>
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
        <Icon type="down-circle" theme="twoTone" style={{ fontSize: '50px' }} />
      </div>
      <AnonymousLoginModal
        visible={anonymousFormVisible}
        onCancel={() => setAnonymousFormVisible(false)}
        onStart={name => {
          loginAnonymously(name);
          setAnonymousFormVisible(false);
        }}
      />
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
