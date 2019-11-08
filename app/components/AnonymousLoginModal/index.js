/**
 *
 * AnonymousLoginModal
 *
 */

import React, { memo } from 'react';
import { Modal, Form, Input, Descriptions } from 'antd';
import { compose } from 'redux';
import disclaimer from 'utils/disclaimer';
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
      By clicking <b>Start</b> you agree to the following:
      <ul>
        {disclaimer.map(line => (<li>{line}</li>))}
      </ul>
    </Modal>
  );
}

AnonymousLoginModal.propTypes = {};

export default compose(
  memo,
  Form.create({ name: 'form_in_modal' }),
)(AnonymousLoginModal);
