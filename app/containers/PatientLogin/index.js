/**
 *
 * PatientLogin
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectPatientLogin from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Form, Button, Checkbox, Input, Icon, PageHeader } from 'antd';
import './index.css';
import HorizontallyCentered from '../../components/HorizontallyCentered';

function PatientLogin({ history, form: { getFieldDecorator, validateFields } }) {
  useInjectReducer({ key: 'patientLogin', reducer });
  useInjectSaga({ key: 'patientLogin', saga });
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  return (
    <>
      <PageHeader onBack={() => history.push('/')} title='Log in'>
        If I can survive the war that I battle with myself, I can survive anything.
      </PageHeader>
      <HorizontallyCentered>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: 'Please input your phone number!' }],
            })(
              <Input
                prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Phone Number (without +65)"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
      </Button>
            Or <Link>register now!</Link>
          </Form.Item>
        </Form>
      </HorizontallyCentered>
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
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default
  compose(
    withConnect,
    memo,
    withRouter,
    Form.create({ name: 'normal_login' })
  )
    (PatientLogin);
