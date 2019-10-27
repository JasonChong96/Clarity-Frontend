/**
 *
 * StaffMain
 *
 */

import {
  Col,
  Dropdown,
  Icon,
  Menu,
  Modal,
  notification,
  PageHeader,
  Radio,
  Row,
  Tabs,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import socketIOClient from 'socket.io-client';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import ActiveChatList from '../../components/ActiveChatList';
import Chat from '../../components/Chat';
import ManageVolunteers from '../../components/ManageVolunteers';
import { makeSelectCurrentUser } from '../App/selectors';
import PendingChats from '../PendingChats';
import {
  addActiveChat,
  addMessageFromActiveChat,
  addMessageFromUnclaimedChat,
  addUnclaimedChat,
  refreshAuthToken,
  registerStaff,
  removeActiveChat,
  removeUnclaimedChat,
  reset,
  setUnclaimedChats,
  removeUnclaimedChatByVisitorId,
  addMessageFromActiveChatByVisitorId,
} from './actions';
import './index.css';
import reducer from './reducer';
import saga from './saga';
import makeSelectStaffMain, {
  makeSelectActiveChats,
  makeSelectUnclaimedChats,
} from './selectors';

export function StaffMain({
  addMessageFromActiveChat,
  addMessageFromActiveChatByVisitorId,
  addMessageFromUnclaimedChat,
  addUnclaimedChat,
  removeUnclaimedChat,
  refreshToken,
  registerStaff,
  unclaimedChats,
  onStaffInit,
  user,
  activeChats,
  addActiveChat,
  removeActiveChat,
  removeUnclaimedChatByVisitorId,
}) {
  useInjectReducer({ key: 'staffMain', reducer });
  useInjectSaga({ key: 'staffMain', saga });
  const [currentRoom, setCurrentRoom] = useState(false);
  const [socket, setSocket] = useState(false);
  function connectSocket() {
    const socket = socketIOClient('http://157.230.253.130:8080', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
        },
      },
      transports: ['polling'],
    });
    socket.on('connect', () => console.log('Connected'));
    socket.on('staff_init', data => {
      const processedData = data.map(chat => {
        chat.contents = chat.contents.map(content => ({
          content,
          user: chat.user,
        }));
        return chat;
      });
      console.log('proc', processedData);
      onStaffInit(processedData);
    });
    socket.on('disconnect', () => {
      //socket.emit('disconnect_request');
      console.log('disconnected');
    });
    socket.on('staff_claim_chat', data => removeUnclaimedChat(data.room.id));
    socket.on('append_unclaimed_chats', data => {
      data.contents = data.contents.map(content => ({
        content,
        user: data.user,
      }));
      addUnclaimedChat(data);
    });
    socket.on('visitor_unclaimed_msg', data => {
      addMessageFromUnclaimedChat(data.user, data.content);
    });
    socket.on('visitor_send', data =>
      addMessageFromActiveChatByVisitorId(data.user.id, data));
    socket.on('reconnect_error', error =>
      error.description == 401 ? refreshToken() : null,
    );
    socket.on('visitor_leave', data => {
      removeActiveChat(data.user);
      notification.info({
        message: user.name + ' has left.',
        description: '',
      });
    });
    socket.on('visitor_leave_queue', data =>
      removeUnclaimedChatByVisitorId(data.user.id),
    );
    return socket;
  }
  const sendMsg = !socket
    ? false
    : msg => {
      socket.emit(
        'staff_msg',
        { room: currentRoom, content: msg },
        (response, error) => {
          if (!error) {
            addMessageFromActiveChat(currentRoom, {
              user: user.user,
              content: msg,
            });
          }
        },
      );
    };

  let displayedChat;
  const matchingActiveChats = activeChats.filter(
    chat => chat.room.id == currentRoom,
  );
  if (matchingActiveChats.length > 0) {
    displayedChat = matchingActiveChats[0];
  } else if (unclaimedChats) {
    const matchingUnclaimedChats = unclaimedChats.filter(
      chat => chat.room.id == currentRoom,
    );
    if (matchingUnclaimedChats.length > 0) {
      displayedChat = matchingUnclaimedChats[0];
    }
  }
  const claimChat =
    !socket || matchingActiveChats.length > 0
      ? false
      : room => {
        socket.emit('staff_join', { room }, (res, err) => {
          if (res) {
            addActiveChat(
              unclaimedChats.filter(chat => chat.room.id == room)[0],
            );
            removeUnclaimedChat(room);
          }
        });
      };

  useEffect(() => {
    const sock = connectSocket();
    setSocket(sock);
    return () => sock.close();
  }, []);

  const [mode, setMode] = useState(0);
  const [handoverMessage, setHandoverMessage] = useState('');
  function showHandoverDialog() {
    Modal.confirm({
      title: 'Flag chat to supervisor',
      okText: 'Flag Chat',
      content: (
        <TextArea
          placeholder="Please type your handover message to be shown to the user"
          value={handoverMessage}
          onChange={e => setHandoverMessage(e.target.value)}
        />
      ),
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }
  function showLeaveDialog() {
    Modal.confirm({
      title: 'Are you sure you want to leave the chat?',
      okText: 'Leave Chat',
      content: 'Please ensure that you have informed the user.',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }
  return (
    <>
      <PageHeader
        extra={[
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <Icon type="user" />
                  Profile
                </Menu.Item>
                <Menu.Item>
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
              type="menu"
            />
          </Dropdown>,
        ]}
        title={
          <>
            {user.user.role_id && user.user.role_id < 3 && (
              <Radio.Group
                defaultValue={0}
                buttonStyle="solid"
                onChange={e => setMode(e.target.value)}
              >
                <Radio.Button value={0}>Chat</Radio.Button>
                <Radio.Button value={1}>Manage</Radio.Button>
              </Radio.Group>
            )}
          </>
        }
      />
      <div hidden={mode != 0}>
        <Row type="flex" style={{ minWidth: '600px' }}>
          <Col xs={12} md={10} lg={7}>
            <Tabs type="card" defaultActiveKey="1">
              <Tabs.TabPane tab="Active Chats" key="1">
                <ActiveChatList
                  activeChats={activeChats}
                  onClickRoom={setCurrentRoom}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Claim Chats" key="2">
                <PendingChats
                  inactiveChats={unclaimedChats}
                  onClickRoom={setCurrentRoom}
                />
              </Tabs.TabPane>
            </Tabs>
          </Col>
          <Col style={{ flexGrow: 1 }}>
            {displayedChat && (
              <Chat
                onSendMsg={sendMsg}
                messages={displayedChat.contents}
                user={user.user}
                visitor={displayedChat.user}
                onClaimChat={
                  claimChat ? () => claimChat(displayedChat.room.id) : false
                }
              />
            )}
          </Col>
        </Row>
      </div>
      <div hidden={mode != 1} style={{ minWidth: '600px' }}>
        <ManageVolunteers onRegister={registerStaff} user={user} />
      </div>
    </>
  );
}

StaffMain.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  staffMain: makeSelectStaffMain(),
  unclaimedChats: makeSelectUnclaimedChats(),
  user: makeSelectCurrentUser(),
  activeChats: makeSelectActiveChats(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onStaffInit: unclaimedChats => {
      dispatch(reset());
      dispatch(setUnclaimedChats(unclaimedChats));
    },
    addMessageFromActiveChatByVisitorId: (visitorId, data) =>
      dispatch(addMessageFromActiveChatByVisitorId(visitorId, data)),
    addMessageFromActiveChat: (roomId, data) =>
      dispatch(addMessageFromActiveChat(roomId, data)),
    addMessageFromUnclaimedChat: (visitor, content) =>
      dispatch(addMessageFromUnclaimedChat(visitor, content)),
    removeUnclaimedChat: room => dispatch(removeUnclaimedChat(room)),
    removeUnclaimedChatByVisitorId: visitorId =>
      dispatch(removeUnclaimedChatByVisitorId(visitorId)),
    addUnclaimedChat: room => dispatch(addUnclaimedChat(room)),
    refreshToken: () => dispatch(refreshAuthToken()),
    addActiveChat: chat => dispatch(addActiveChat(chat)),
    removeActiveChat: visitor => dispatch(removeActiveChat(visitor)),
    registerStaff: (name, email, password, role) =>
      dispatch(registerStaff(name, email, password, role)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(StaffMain);
