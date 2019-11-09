/**
 *
 * Home
 *
 */

import { Button, Col, Icon, Row, PageHeader, Dropdown, Menu, Modal } from 'antd';
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
import LandingImg from '../../components/Landing';
import HeartLineFooter from '../../components/HeartLineFooter';
import Logo from '../../components/Logo';
import About from '../../components/About';
import { notifyMe } from '../../utils/notifications';

function openBlog() {
  Modal.info({
    title: 'Blog is Under Construction',
    content: "Our team is currently working hard to deliver a better experience with Ora."
  })
}

export function Landing({ loginAnonymously }) {
  const [mode, setMode] = useState(0);
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        display: 'inline-block',
        zIndex: 1,
      }}
    >
      <PageHeader
        style={{ background: '#0EAFA7' }}
        title={<Logo maxWidth='4rem' />}
        extra={[
          <Button type='link' style={{ color: 'white' }} onClick={() => setMode(0)}>Home</Button>,
          <Button type='link' style={{ color: 'white' }} onClick={() => setMode(1)}>About</Button>,
          <Button type='link' style={{ color: 'white' }} onClick={openBlog}>Blog</Button>,
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <Link to="/staff/login">Staff Login</Link>
                </Menu.Item>
              </Menu>
            }
          >
            <Icon
              style={{
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginLeft: '4rem',
                color: 'white'
              }}
              type="menu"
            />
          </Dropdown>,
        ]}
      />
      {mode == 0 && <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '4rem',
        }}
      >
        <LandingImg />
        <p style={{ color: '#0EAFA7', fontSize: '30px', alignItems: 'center' }}>
          <b>Stressed? Overwhelmed?</b>
        </p>
        <p style={{ color: '#0EAFA7', fontSize: '30px', alignItems: 'center' }}>
          <b>Need a listening ear?</b>
        </p>
        <div style={{ padding: '1em' }}>
          <Link to="/visitor/">
            <Button
              type="primary"
              size='large'
            // onClick={notifyMe}
            >
              CHAT WITH ORA
            </Button>
          </Link>
        </div>
      </div>
      }
      {mode == 1 && <About />}
    </div>
  );
}

Landing.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default compose(memo)(Landing);
