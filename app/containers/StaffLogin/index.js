/**
 *
 * StaffLogin
 *
 */

import { Button, Checkbox, Form, Icon, Input, notification } from 'antd';
import PropTypes from 'prop-types';
import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import HorizontallyCentered from '../../components/HorizontallyCentered';
import { volunteerLogin, volunteerLoginFailure } from './actions';
import './index.css';
import reducer from './reducer';
import saga from './saga';
import makeSelectStaffLogin, { makeSelectError } from './selectors';
import HeaderImage from 'images/chat_header.svg';
import Logo from '../../components/Logo';
import HeartLineFooter from '../../components/HeartLineFooter';

export function StaffLogin({
  error,
  setError,
  form: { validateFields, getFieldDecorator },
  volunteerLogin,
}) {
  useInjectReducer({ key: 'staffLogin', reducer });
  useInjectSaga({ key: 'staffLogin', saga });

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        volunteerLogin(values.username, values.password);
      }
    });
  };
  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Login failed',
        description: error,
      });
      setError(false);
    }
  }, [error]);
  return (
    <>
      <div style={{ height: '4rem' }} />
      {/* <div style={{ display: 'inline-block' }}>
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
      </div> */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Logo />
        <HorizontallyCentered>
          <h1 style={{ textAlign: 'center' }}>Staff Login</h1>
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: 'Please input your username!' },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Email"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </HorizontallyCentered>
      </div>
      <HeartLineFooter />
    </>
  );
}

StaffLogin.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  staffLogin: makeSelectStaffLogin(),
  error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setError: error => dispatch(volunteerLoginFailure(error)),
    volunteerLogin: (email, password) =>
      dispatch(volunteerLogin(email, password)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  withRouter,
  Form.create('normal_login'),
)(StaffLogin);
