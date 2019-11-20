/**
 *
 * Home
 *
 */

import { Button } from 'antd';
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
import { makeSelectSettings } from '../App/selectors';
import Logo from '../../components/Logo';
import HeartLineFooter from '../../components/HeartLineFooter';
import ParticleBackground from '../../components/ParticleBackground';

export function Home({ loginAnonymously, settings }) {
  useInjectReducer({ key: 'home', reducer });
  useInjectSaga({ key: 'home', saga });
  function onlyAnonymous() {
    return settings.login_type == 0;
  }
  function bothAccAnonymous() {
    return settings.login_type == 2;
  }
  function onlyAccount() {
    return settings.login_type == 1;
  }
  const [anonymousFormVisible, setAnonymousFormVisible] = useState(false);
  const showAnonymousButton = bothAccAnonymous() ? 'block' : 'none';
  const showAccountButtons = onlyAnonymous() ? 'none' : 'block';
  const showOnlyAnonymousButton = onlyAnonymous() ? 'block' : 'none';
  const showPaddingForFooter = onlyAccount() ? 'block' : 'none';
  return (
    <>
      <ParticleBackground />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ height: '3rem' }} />
        <Link to="/">
          <Logo />
        </Link>
        <div style={{ height: '3rem' }} />
        <div style={{display: showAccountButtons}}>
          <div style={{ padding: '1em' }}>
            <Link to="/visitor/login">
              <Button type="primary" size="large" style={{ width: '12em' }}>
                Login
              </Button>
            </Link>
          </div>
          <div style={{ padding: '1em' }}>
            <Link to="/visitor/register">
              <Button size="large" style={{ width: '12em' }}>
                Sign Up
              </Button>
            </Link>
          </div>
          </div>
        <div style={{display: showAnonymousButton}}>
        <div style={{ 
          padding: '1em 1em 0 1em', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center', }}>
          OR
        </div>
        <div style={{ padding: '0 1em 1em 1em' }}>
          <Button
            size="large"
            type='link'
            style={{ width: '12em' }}
            onClick={() => setAnonymousFormVisible(true)}
          >
            Chat Anonymously
          </Button>
        </div>
        </div>
      </div>
      <div style={{display: showOnlyAnonymousButton}}>
        <div style={{ 
          padding: '3em', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Button type="primary" size="large" style={{ width: '12em' }} onClick={() => setAnonymousFormVisible(true)}>
            Chat Anonymously
          </Button>
          <br />
        </div>
      </div>
      <div style={{display: showPaddingForFooter}}>
        <br/>
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
    </>
  );
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  home: makeSelectHome(),
  settings: makeSelectSettings(),
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
