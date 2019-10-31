/**
 *
 * AnonymousLoginModal
 *
 */

import React, { memo } from 'react';
import { Modal, Form, Input } from 'antd';
import { compose } from 'redux';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function AnonymousLoginModal({
  visible,
  onCancel,
  onStart,
  form: { resetFields, getFieldDecorator, validateFields },
}) {
  return (
    <Modal
      visible={visible}
      title="Chat Anonymously"
      okText="Start"
      onCancel={onCancel}
      onOk={() =>
        validateFields((err, values) => {
          if (err) {
            return;
          }

          onStart(values.name);
          resetFields();
        })
      }
    >
      <Form layout="vertical">
        <Form.Item label="Name">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Please input the name you wish to be addressed by.',
              },
            ],
          })(<Input />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

AnonymousLoginModal.propTypes = {};

export default compose(
  memo,
  Form.create({ name: 'form_in_modal' }),
)(AnonymousLoginModal);
