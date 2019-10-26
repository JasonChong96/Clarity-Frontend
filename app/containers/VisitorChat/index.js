/**
 *
 * VisitorChat
 *
 */


import React, { memo, useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectVisitorChat from './selectors';
import reducer from './reducer';
import saga from './saga';
import { PageHeader, Dropdown, Menu, Icon, Row, Col, Modal } from 'antd';
import Chat from '../../components/Chat';
import HorizontallyCentered from '../../components/HorizontallyCentered';

const user = { username: 'me' };

const messages = [
  {
    from: 'me',
    content: 'Dude',
  },
  {
    from: 'notme',
    content: 'Hey!',
  },
  {
    from: 'notme',
    content: 'You there?',
  },
  {
    from: 'notme',
    content: "Hello, how's it going?",
  },
  {
    from: 'me',
    content: 'Great thanks!',
  },
  {
    from: 'me',
    content: 'How about you?',
  },
];


function leaveChat() {
  Modal.confirm({
    title: 'Are you sure you want to leave this chat?',
    content: 'You may not be taking to the same person the next time you chat',
    iconType: 'warning',
    okButtonProps: {},
    cancelButtonProps: {},
    okText: 'Leave',
    cancelText: 'Go back to chat',
    okType: 'danger',
    onOk() {
      console.log('Leave');
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

function Settings() {
  Modal.confirm({
    title: 'Settings',
    content: 'Change password',
    iconType: 'setting',
    okButtonProps: {},
    cancelButtonProps: {},
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

export function VisitorChat() {
  useInjectReducer({ key: 'visitorChat', reducer });
  useInjectSaga({ key: 'visitorChat', saga });

  return <Row type='flex' align='middle' justify='center' style={{ width: '100%' }}>
    <Col xs={24} md={16} lg={12}>
      <PageHeader extra={<Dropdown
        overlay={
          <Menu>
            <Menu.Item style={{
              color: 'red'
            }}>
              <Icon type="exclamation-circle" theme="filled" />
              Leave chat
                </Menu.Item>
            <Menu.Item onClick={Settings}>
              <Icon type="setting" />
              Settings
                </Menu.Item>
            <Menu.Item>
              <Icon type="logout" />
              Log out
                </Menu.Item>
          </Menu>
        }
      >
        <Icon
          style={{ fontSize: '1.5rem', cursor: 'pointer' }}
          type="more"
        />
      </Dropdown>
      } />
      < Chat messages={messages} user={user} />
    </Col>
  </Row>
}

VisitorChat.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  visitorChat: makeSelectVisitorChat(),
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


export default compose(withConnect)(VisitorChat);
