/**
 *
 * ConvertAnonymousModal2
 *
 */

import React, { memo } from 'react';
import { Modal, Form, Input, Icon, Button } from 'antd';
import { compose } from 'redux';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function ConvertAnonymousModal2({
  title,
  okText,
  cancelText,
  visible,
  onCancel,
  onCreate,
  onOk,
  form: { getFieldValue, resetFields, getFieldDecorator, validateFields },
}) {
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
    if (value) {
      validateFields(['confirm'], { force: true });
    }
    callback();
  };

  return (
    <Modal
      visible={visible}
      title={title}
      okText={okText}
      cancelText={cancelText}
      onCancel={onCancel}
      onOk={onOk}
      onCreate={onCreate}
    >
      Want to save the chat and use on other devices? Create an account today!
      <br />
      <br />
      <Form layout="vertical">
        <Form.Item label="Email">
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
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />,
          )}
        </Form.Item>
        <Form.Item hasFeedback label="Password">
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
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
            />,
          )}
        </Form.Item>
        <Form.Item hasFeedback label="Confirm Password">
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
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
            />,
          )}
        </Form.Item>
        <Button
          type="primary"
          ghost
          size="large"
          style={{ width: '12em' }}
          onClick={() =>
            validateFields((err, values) => {
              if (err) {
                return;
              }

              onCreate(values.email, values.password);
              resetFields();
            })
          }
        >
          Create Account
        </Button>
      </Form>
    </Modal>
  );
}

ConvertAnonymousModal2.propTypes = {};

ConvertAnonymousModal2.defaultProps = {
  okText: 'Create Account',
  cancelText: 'Cancel',
  title: 'Would you like to sign up for an account?',
};

export default compose(
  memo,
  Form.create({ name: 'form_in_modal' }),
)(ConvertAnonymousModal2);
