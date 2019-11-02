/**
 *
 * PatientRegister
 *
 */

import { Button, Form, Icon, Input, notification, PageHeader } from 'antd';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import HorizontallyCentered from '../../components/HorizontallyCentered';
import { registerPatient, registerPatientFailure } from './actions';
import './index.css';
import reducer from './reducer';
import saga from './saga';
import makeSelectPatientRegister, { makeSelectError } from './selectors';
import HeaderImage from 'images/chat_header.svg';
import Logo from '../../components/Logo';
import HeartLineFooter from '../../components/HeartLineFooter';

function PatientRegister({
  error,
  setError,
  history,
  form: { getFieldValue, getFieldDecorator, validateFields },
  registerPatient,
}) {
  useInjectReducer({ key: 'patientRegister', reducer });
  useInjectSaga({ key: 'patientRegister', saga });
  const [confirmDirty, setConfirmDirty] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        registerPatient(values.user, values.email, values.password);
      }
    });
  };

  // Password field validation
  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('password')) {
      callback('Password is different!');
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value && value.length < 8) {
      callback('Must be of 8 characters or more');
    }
    if (value && !/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value)) {
      callback('Need at least 1 number 1 alphabet');
    }
    if (value && confirmDirty) {
      validateFields(['confirm'], { force: true });
    }
    callback();
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
      <div style={{ padding: '1em' }}>
        <Link to="/">
          <Button type="primary" ghost size="large" style={{ width: '12em' }}>
            <Icon
              style={{
                color: '#0EAFA7',
              }}
              type="arrow-left"
            />
            Back
          </Button>
        </Link>
      </div>
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
      <div style={{ margin: '0 auto', padding: '1em' }}>
        <Logo />
      </div>
      <HorizontallyCentered>
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not a valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
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
            {getFieldDecorator('user', {
              rules: [
                { required: true, message: 'Please input your display name!' },
              ],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Display Name"
              />,
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your Password!',
                },
                {
                  validator: validateToNextPassword,
                },
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
          <Form.Item hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your Password!',
                },
                {
                  validator: compareToFirstPassword,
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Confirm Password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>
          </Form.Item>
          <Form.Item>
            Have an account? <Link to="/patient/login">SIGN IN.</Link>
          </Form.Item>
        </Form>
      </HorizontallyCentered>
    </>
  );
}

PatientRegister.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  patientRegister: makeSelectPatientRegister(),
  error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    registerPatient: (name, email, password) =>
      dispatch(registerPatient(name, email, password)),
    setError: error => dispatch(registerPatientFailure(error)),
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
  Form.create('register'),
)(PatientRegister);
