/**
 *
 * ManageVolunteers
 *
 */

import { Button, Card, Col, Form, Input, List, Row, Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import { generate } from 'generate-password';
import React, { memo, useState } from 'react';
import { compose } from 'redux';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

const volunteers = [
  {
    name: 'Volunteer I',
  },
  {
    name: 'Volunteer II',
  },
  {
    name: 'Volunteer III',
  },
];

function ManageVolunteers({
  user,
  onRegister,
  form: {
    getFieldValue,
    getFieldDecorator,
    validateFields,
    validateFieldsAndScroll,
    setFieldsValue,
  },
}) {
  const [filter, setFilter] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        onRegister(values.username, values.email, values.password, values.role);
      }
    });
  };
  return (
    <Row>
      <Col span={12}>
        <Card style={{ height: '70vh' }}>
          <div style={{ padding: '1em' }}>
            <Title level={3}>Existing Volunteers</Title>
            <Input.Search
              allowClear
              placeholder="Search volunteer"
              onChange={e => setFilter(e.target.value)}
            />
            <div style={{ padding: '1em' }} />
            <List
              dataSource={volunteers.filter(volunteer =>
                volunteer.name.toLowerCase().includes(filter.toLowerCase()),
              )}
              style={{ paddingLeft: '1em' }}
              renderItem={item => (
                <List.Item>
                  <Row gutter={24} style={{ width: '100%' }}>
                    <Col sm={20} md={16} lg={12}>
                      <Title ellipsis level={4}>
                        {item.name}
                      </Title>
                    </Col>
                    <Col>
                      <a
                        style={{ display: 'table-cell' }}
                        href="/supervisor/manage/username"
                        target="_blank"
                      >
                        <Button type="primary">View Chats</Button>
                      </a>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </Col>
      <Col span={12}>
        <Card style={{ height: '70vh' }}>
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
                      <Select.Option value={3}>Volunteer</Select.Option>
                      <Select.Option value={2}>Supervisor</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Create Account
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

ManageVolunteers.propTypes = {};

export default compose(
  memo,
  Form.create('register'),
)(ManageVolunteers);
