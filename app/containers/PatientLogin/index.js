/**
 *
 * PatientLogin
 *
 */

import { Button, Checkbox, Form, Icon, Input, PageHeader } from 'antd';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { visitorLogin } from './actions';
import './index.css';
import reducer from './reducer';
import saga from './saga';
import makeSelectPatientLogin from './selectors';

function PatientLogin({
  visitorLogin,
  history,
  form: { getFieldDecorator, validateFields },
}) {
  useInjectReducer({ key: 'patientLogin', reducer });
  useInjectSaga({ key: 'patientLogin', saga });
  // Use useLocalStorage for "remember me"
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        visitorLogin(values.email, values.password);
      }
    });
  };

  return (
    <>
      <PageHeader onBack={() => history.push('/')} title="Log in">
        If I can survive the war that I battle with myself, I can survive
        anything.
      </PageHeader>
      <div style={{ margin: '0 auto' }}>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Please input your username!' },
              ],
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="E-mail"
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
            Or <Link to="/patient/register">register now!</Link>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

PatientLogin.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  patientLogin: makeSelectPatientLogin(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    visitorLogin: (email, password) => dispatch(visitorLogin(email, password)),
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
  Form.create({ name: 'normal_login' }),
)(PatientLogin);
