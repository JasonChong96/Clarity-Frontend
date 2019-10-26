/**
 *
 * PatientRegister
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Form, Button, Input, Icon, PageHeader } from 'antd';
import makeSelectPatientRegister from './selectors';
import reducer from './reducer';
import saga from './saga';
import './index.css';
import HorizontallyCentered from '../../components/HorizontallyCentered';
import { registerPatient } from './actions';
import { validate } from '@babel/types';

function PatientRegister({
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

  return (
    <>
      <PageHeader
        onBack={() => history.goBack()}
        title="Register"
      >
        Please register an account to use our services.
      </PageHeader>
      <HorizontallyCentered>
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            {getFieldDecorator('user', {
              rules: [
                { required: true, message: 'Please input your username!' },
              ],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Username"
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
                  validator: validateToNextPassword
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
                placeholder="Password"
              />,
            )}
          </Form.Item>
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
            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>
          </Form.Item>
          <Form.Item>
            Have an account? <Link to="/patient/login">Sign In.</Link>
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
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    registerPatient: (name, email, password) =>
      dispatch(registerPatient(name, email, password)),
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
