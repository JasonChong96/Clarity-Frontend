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
import { addChatMessage, setFirstMsg, setStaffJoined } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectVisitorChat, { makeSelectChatMessages, makeSelectStaffJoined, makeSelectFirstMsg } from './selectors';



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

export function VisitorChat({ isFirstMsg, hasStaffJoined, setHasStaffJoined, setIsFirstMsg, user, messages, addChatMessage }) {
  useInjectReducer({ key: 'visitorChat', reducer });
  useInjectSaga({ key: 'visitorChat', saga });
  const [socket, setSocket] = useState(null);
  function connectSocket() {
    const socket = socketIOClient('157.230.253.130:8080', {
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
      setHasStaffJoined(true);
      addChatMessage({
        content: data.user.full_name + ' has joined the chat!',
      });
    });
    socket.on('staff_leave', data => {
      setHasStaffJoined(false);
      addChatMessage({ content: data.user.full_name + ' has left the chat.' });
      addChatMessage({
        content: 'You may send another message to talk to another volunteer!',
      });
    });
    socket.on('staff_send', addChatMessage);
    return socket;
  }
  const sendMsg = !socket ? false : msg => {
    setIsFirstMsg(false);
    console.log(isFirstMsg
      ? 'visitor_first_msg'
      : hasStaffJoined
        ? 'visitor_msg'
        : 'visitor_msg_unclaimed')
    socket.emit(
      isFirstMsg
        ? 'visitor_first_msg'
        : hasStaffJoined
          ? 'visitor_msg'
          : 'visitor_msg_unclaimed',
      msg,
      (res, err) => {
        console.log(res, err);
        if (res) {
          addChatMessage({ user: user.user, content: msg });
        } else {
          console.log(err);
        }
      },
    );
  }
  useEffect(() => {
    const socket = connectSocket();
    setSocket(socket);
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
  hasStaffJoined: makeSelectStaffJoined(),
  isFirstMsg: makeSelectFirstMsg(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    addChatMessage: message => dispatch(addChatMessage(message)),
    setIsFirstMsg: firstMsg => dispatch(setFirstMsg(firstMsg)),
    setHasStaffJoined: staffJoined => dispatch(setStaffJoined(staffJoined)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(VisitorChat);
