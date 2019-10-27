/**
 *
 * VisitorChat
 *
 */

import { Col, Dropdown, Icon, Menu, Modal, PageHeader, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import socketIOClient from 'socket.io-client';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Chat from '../../components/Chat';
import { makeSelectCurrentUser } from '../App/selectors';
import { addChatMessage } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectVisitorChat, { makeSelectChatMessages } from './selectors';



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

export function VisitorChat({ user, messages, addChatMessage }) {
  useInjectReducer({ key: 'visitorChat', reducer });
  useInjectSaga({ key: 'visitorChat', saga });
  const [sendMsg, setSendMsg] = useState(null);
  const [firstMsg, setFirstMsg] = useState(true);
  const [staffJoined, setStaffJoined] = useState(false);
  function connectSocket() {
    const socket = socketIOClient('157.230.253.130:8000', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
        },
      },
      reconnectionDelay: 5000,
    });
    socket.on('connect', () => console.log('Connected'));
    socket.on('disconnect', () => console.log('disconnected'));
    socket.on('staff_join_room', data => {
      setStaffJoined(true);
      addChatMessage({
        content: data.user.full_name + ' has joined the chat!',
      });
    });
    socket.on('staff_leave', data => {
      setStaffJoined(false);
      addChatMessage({ content: data.user.full_name + ' has left the chat.' });
      addChatMessage({
        content: 'You may send another message to talk to another volunteer!',
      });
    });
    return socket;
  }
  useEffect(() => {
    const socket = connectSocket();
    setSendMsg(() => msg => {
      if (firstMsg) {
        setFirstMsg(false);
      }
      socket.emit(
        firstMsg
          ? 'visitor_first_msg'
          : staffJoined
            ? 'visitor_msg'
            : 'visitor_unclaimed_msg',
        msg,
        (res, err) => {
          if (res) {
            addChatMessage(msg);
          }
        },
      );
    });
    return () => socket.close();
  }, []);

  return (
    <Row type="flex" align="middle" justify="center" style={{ width: '100%' }}>
      <Col xs={24} md={16} lg={12}>
        <PageHeader
          extra={
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    style={{
                      color: 'red',
                    }}
                  >
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
          }
        />
        <Chat messages={messages} user={user.user} onSendMsg={sendMsg} />
      </Col>
    </Row>
  );
}

VisitorChat.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  visitorChat: makeSelectVisitorChat(),
  user: makeSelectCurrentUser(),
  messages: makeSelectChatMessages(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    addChatMessage: message => dispatch(addChatMessage(message)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(VisitorChat);
