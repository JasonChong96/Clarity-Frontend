/**
 *
 * CreateVolunteer
 *
 */

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Modal,
  Descriptions,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import { generate } from 'generate-password';
import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function showConfirm(name, email, password, role, onSubmit, onOkMain) {
  Modal.confirm({
    title: 'Confirm User Account',
    content: (
      <Descriptions title={name}>
        <Descriptions.Item label="Email" span={3}>
          {email}
        </Descriptions.Item>
        <Descriptions.Item label="Password" span={3}>
          {password}
        </Descriptions.Item>
        <Descriptions.Item label="Role" span={3}>
          {role}
        </Descriptions.Item>
      </Descriptions>
    ),
    onOk() {
      onSubmit();
      onOkMain();
    },
    okText: 'Create Account',
  });
}

function getRoleName(roleId) {
  return {
    3: 'Volunteer',
    2: 'Supervisor',
    1: 'Administrator',
  }[roleId];
}

function CreateVolunteer({
  user,
  onRegister,
  registerStaffClearTrigger,
  registerStaffPending,
  visible,
  onCancel,
  onOk,
  form: {
    getFieldValue,
    getFieldDecorator,
    validateFields,
    validateFieldsAndScroll,
    setFieldsValue,
    resetFields,
  },
}) {
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        showConfirm(
          values.username,
          values.email,
          values.password,
          getRoleName(values.role),
          () =>
            onRegister(
              values.username,
              values.email,
              values.password,
              values.role,
            ),
          onOk,
        );
      }
    });
  };
  useEffect(() => {
    resetFields();
  }, [registerStaffClearTrigger]);
  return (
    <Modal
      visible={visible}
      cancelText='Cancel'
      onCancel={onCancel}
      footer={[]}
    >
          <div style={{ padding: '1em' }}>
            <Title level={3}>Create User Account</Title>
            <Card>
              <Form onSubmit={handleSubmit}>
                <Form.Item>
                  {getFieldDecorator('username', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input a display name!',
                        whitespace: true,
                      },
                    ],
                  })(<Input placeholder="Display Name" />)}
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
                        message: 'Please input a valid E-mail!',
                      },
                    ],
                  })(<Input placeholder="E-mail" />)}
                </Form.Item>
                <Form.Item>
                  <Row gutter={8}>
                    <Col span={12}>
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            required: true,
                            message: 'Please generate a password!',
                            whitespace: false,
                          },
                        ],
                      })(<Input placeholder="Password" disabled />)}
                    </Col>
                    <Col span={12}>
                      <Button
                        onClick={() => {
                          let password = '';
                          while (!/\d/.test(password)) {
                            password = generate({
                              length: 8,
                              numbers: true,
                            });
                          }
                          setFieldsValue({
                            password,
                          });
                        }}
                      >
                        Generate Password
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                Role
                <Form.Item>
                  {getFieldDecorator('role', {
                    rules: [
                      {
                        required: true,
                        message: 'Please choose a role!',
                      },
                    ],
                  })(
                    <Select initialValue={3}>
                      {(
                        <Select.Option value={3}>
                          {getRoleName(3)}
                        </Select.Option>
                      )}
                      {(
                        <Select.Option value={2}>
                          {getRoleName(2)}
                        </Select.Option>
                      )}
                      {(
                        <Select.Option value={1} disabled={user.role_id != 1}>
                          {getRoleName(1)}
                        </Select.Option>
                      )}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                  type="primary"
                  htmlType="submit"
                  block
                  disabled={registerStaffPending}
                  >
                    Create Account
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
      </Modal>
  );
}

CreateVolunteer.propTypes = {};

export default compose(
  memo,
  Form.create('register'),
)(CreateVolunteer);
