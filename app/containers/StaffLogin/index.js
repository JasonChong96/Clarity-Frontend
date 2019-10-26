/**
 *
 * StaffLogin
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { withRouter } from 'react-router-dom';
import { Form, Button, Checkbox, Input, Icon, PageHeader, notification } from 'antd';
import makeSelectStaffLogin, { makeSelectError } from './selectors';
import reducer from './reducer';
import saga from './saga';
import './index.css';
import HorizontallyCentered from '../../components/HorizontallyCentered';
import { volunteerLogin, volunteerLoginFailure } from './actions';

export function StaffLogin({ error, setError, form: { validateFields, getFieldDecorator }, volunteerLogin }) {
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
      })
      setError(false);
    }
  }, [error])
  return (
    <>

      <PageHeader onBack={() => history.push('/')} title="Staff Log In">
        Thank you for your service.
        <br />
        This is a very long motivational quote. This is a very long motivational
        quote. This is a very long motivational quote. This is a very long
        motivational quote. This is a very long motivational quote. This is a
        very long motivational quote.
      </PageHeader>
      <HorizontallyCentered>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
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
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>Remember me</Checkbox>)}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Please contact Clarity Singapore for support.
          </Form.Item>
        </Form>
      </HorizontallyCentered>

      <div
        style={{
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Insert logo here
        <HorizontallyCentered>
          <h1>Volunteer Login</h1>
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
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>Remember me</Checkbox>)}
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
    volunteerLogin: (email, password) => dispatch(volunteerLogin(email, password)),
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
