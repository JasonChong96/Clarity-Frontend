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
  Spin,
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
import CreateVolunteer from '../../components/CreateVolunteer';
import { makeSelectCurrentUser } from '../App/selectors';
import PendingChats from '../PendingChats';
import {
  addActiveChat,
  addMessageFromActiveChat,
  addMessageFromActiveChatByVisitorId,
  addMessageFromUnclaimedChat,
  addUnclaimedChat,
  loadChatHistory,
  refreshAuthToken,
  registerStaff,
  removeActiveChat,
  removeUnclaimedChat,
  removeUnclaimedChatByVisitorId,
  reset,
  setUnclaimedChats,
  showLoadedMessageHistory,
  staffLogOut,
  submitSettings,
  incrementUnreadCount,
  clearUnreadCount,
} from './actions';
import './index.css';
import reducer from './reducer';
import saga from './saga';
import makeSelectStaffMain, {
  makeSelectActiveChats,
  makeSelectRegisterStaffClearTrigger,
  makeSelectRegisterStaffPending,
  makeSelectUnclaimedChats,
  makeSelectUnreadCount,
} from './selectors';
import { setSuccess } from '../App/actions';
import SettingsModal from '../../components/SettingsModal';
import HeaderImage from 'images/chat_header.svg';

import LogoImage from 'images/logo.svg';

function showLogOut(onConfirm) {
  Modal.confirm({
    title: 'Log out',
    content: 'Are you sure you want to log out?',
    onOk() {
      onConfirm();
    },
  });
}

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
  loadChatHistory,
  showLoadedMessageHistory,
  registerStaffPending,
  registerStaffClearTrigger,
  logOut,
  showError,
  submitSettings,
  incrementUnreadCount,
  clearUnreadCount,
  unreadCount,
  showSuccess,
}) {
  useInjectReducer({ key: 'staffMain', reducer });
  useInjectSaga({ key: 'staffMain', saga });
  const [currentRoom, setCurrentRoom] = useState(false);
  const [socket, setSocket] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  function connectSocket() {
    const socket = socketIOClient('http://157.230.253.130:8080', {
      // const socket = socketIOClient('http://192.168.1.141:8080', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      },
      transports: ['polling'],
    });
    socket.on('connect', () => {
      console.log('Connected');
      setIsConnected(true);
    });
    socket.on('staff_init', data => {
      const onlineUsers = data.online_users;
      const chats = data.unclaimed_chats;
      const processedData = chats.map(chat => {
        chat.contents = chat.contents.map(content => ({
          ...content,
          user: content.sender ? content.send : chat.user,
        }));
        return chat;
      });
      onStaffInit(processedData);
      processedData.forEach(chat => {
        loadChatHistory(chat.user, chat.contents[0].id);
      });
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('disconnected');
    });
    socket.on('staff_claim_chat', data => {
      removeUnclaimedChat(data.room);
      console.log('staff_claim_chat');
      console.log(data);
    });
    socket.on('append_unclaimed_chats', data => {
      data.contents.forEach(content => {
        content.user = content.sender;
        if (!content.user) {
          content.user = data.user;
        }
      });
      addUnclaimedChat(data);
      loadChatHistory(data.user, data.contents[0].id);
    });
    socket.on('visitor_unclaimed_msg', data => {
      addMessageFromUnclaimedChat(data.user, data.content);
    });
    socket.on('reconnect_error', error => {
      if (error.description == 401 && user) {
        refreshToken();
        setForceUpdate(x => !x);
      }
    });
    socket.on('reconnect', () => {
      setIsConnected(true);
    });
    socket.on('visitor_leave', data => {
      removeActiveChat(data.user);
      notification.info({
        message: `${data.user.name} has left.`,
        description: '',
      });
    });
    socket.on('visitor_leave_queue', data =>
      removeUnclaimedChatByVisitorId(data.user.id),
    );

    // Staff online / offline events
    socket.on('staff_goes_online', data => {
      console.log('staff_goes_online');
      console.log(data);
    });
    socket.on('staff_goes_offline', data => {
      console.log('staff_goes_offline');
      console.log(data);
    });

    // Supervisor / Admin events
    socket.on('agent_new_chat', data => {
      console.log('agent_new_chat');
      console.log(data);
    });
    socket.on('new_visitor_msg_for_supervisor', data => {
      console.log('new_visitor_msg_for_supervisor');
      console.log(data);
    });
    socket.on('new_staff_msg_for_supervisor', data => {
      console.log('new_staff_msg_for_supervisor');
      console.log(data);
    });
    socket.on('visitor_leave_chat_for_supervisor', data => {
      console.log('visitor_leave_chat_for_supervisor');
      console.log(data);
    });
    socket.on('staff_leave_chat_for_supervisor', data => {
      console.log('staff_leave_chat_for_supervisor');
      console.log(data);
    });

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
  useEffect(() => {
    if (displayedChat) {
      clearUnreadCount(displayedChat.user.id);
      socket.off('visitor_send');
      socket.on('visitor_send', data => {
        addMessageFromActiveChatByVisitorId(data.user.id, data);
        if (data.user.id != displayedChat.user.id) {
          incrementUnreadCount(data.user.id);
        }
      });
    }
  }, [currentRoom]);
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

  const leaveChat = !socket
    ? false
    : room => {
        socket.emit('staff_leave_room', { room }, (res, err) => {
          if (res) {
            removeActiveChat(room);
            setSuccess({
              title: 'Left room successfully!',
              description: '',
            });
          }
        });
      };

  useEffect(() => {
    const sock = connectSocket();
    setSocket(sock);
    window.onbeforeunload = function() {
      return true;
    };
    return () => {
      window.onbeforeunload = null;
      sock.close();
    };
  }, [forceUpdate]);

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
      onCancel() {},
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
      onCancel() {},
    });
  }
  return (
    <>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          display: 'inline-block',
          zIndex: 1,
        }}
      >
        <div
          style={{ maxWidth: '500px', textAlign: 'center', margin: '0 auto' }}
        >
          <img
            style={{
              width: '100%',
              display: 'inline-block',
              backgroundSize: '100% 100%',
            }}
            src={HeaderImage}
          />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          display: 'inline-block',
          zIndex: 1,
        }}
      >
        <div
          style={{ maxWidth: '100px', textAlign: 'center', margin: '0 auto' }}
        >
          <img
            style={{
              width: '100%',
              display: 'inline-block',
              backgroundSize: '100% 100%',
            }}
            src={LogoImage}
          />
        </div>
      </div>
      <PageHeader
        extra={[
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <Icon type="user" />
                  Profile
                </Menu.Item>
                <Menu.Item onClick={() => setShowSettings(true)}>
                  <Icon type="setting" />
                  Settings
                </Menu.Item>
                <Menu.Item onClick={() => showLogOut(logOut)}>
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
                <Radio.Button value={1}>Supervise</Radio.Button>
                <Radio.Button value={2}>Manage</Radio.Button>
              </Radio.Group>
            )}
          </>
        }
      />
      <div hidden={mode != 0}>
        <Row type="flex" style={{ minWidth: '600px' }}>
          <Col xs={12} md={10} lg={7}>
            <Spin spinning={!isConnected}>
              <Tabs type="card" defaultActiveKey="1">
                <Tabs.TabPane
                  tab={`Active Chats (${activeChats.length})`}
                  key="1"
                >
                  <ActiveChatList
                    activeChats={activeChats}
                    onClickRoom={setCurrentRoom}
                    getUnreadCount={room => unreadCount[room.user.id]}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={`Claim Chats (${unclaimedChats.length})`}
                  key="2"
                >
                  <PendingChats
                    inactiveChats={unclaimedChats}
                    onClickRoom={setCurrentRoom}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Spin>
          </Col>
          <Col style={{ flexGrow: 1 }}>
            {displayedChat && (
              <Chat
                onSendMsg={sendMsg}
                onLeave={() => leaveChat(displayedChat)}
                messages={displayedChat.contents}
                user={user.user}
                visitor={displayedChat.user}
                onClaimChat={
                  claimChat ? () => claimChat(displayedChat.room.id) : false
                }
                onShowHistory={
                  displayedChat.loadedHistory &&
                  displayedChat.loadedHistory.length > 0
                    ? () => {
                        showLoadedMessageHistory(displayedChat.user.id);
                        loadChatHistory(
                          displayedChat.user,
                          displayedChat.loadedHistory[0].id,
                        );
                      }
                    : false
                }
                isLoading={!isConnected}
              />
            )}
          </Col>
        </Row>
      </div>
      <div hidden={mode != 1} style={{ minWidth: '600px' }}>
        <ManageVolunteers
          onRegister={registerStaff}
          user={user.user}
          registerStaffClearTrigger={registerStaffClearTrigger}
          registerStaffPending={registerStaffPending}
        />
      </div>
      <div hidden={mode != 2} style ={{ minWidth: '600px' }}>
        <CreateVolunteer
          onRegister={registerStaff}
          user={user.user}
          registerStaffClearTrigger={registerStaffClearTrigger}
          registerStaffPending={registerStaffPending}
        />
      </div>
      <SettingsModal
        visible={showSettings}
        title="Account Settings"
        onCancel={() => {
          setShowSettings(false);
        }}
        onOk={() => {
          setShowSettings(false);
        }}
        setError={showError}
        onSubmit={(name, password) => {
          submitSettings(name, password, user.user.id);
          setShowSettings(false);
        }}
      />
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
  registerStaffPending: makeSelectRegisterStaffPending(),
  registerStaffClearTrigger: makeSelectRegisterStaffClearTrigger(),
  unreadCount: makeSelectUnreadCount(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    incrementUnreadCount: visitorId =>
      dispatch(incrementUnreadCount(visitorId)),
    clearUnreadCount: visitorId => dispatch(clearUnreadCount(visitorId)),
    logOut: () => dispatch(staffLogOut()),
    showError: error => dispatch(setError(error)),
    submitSettings: (name, password, id) =>
      dispatch(submitSettings(name, password, id)),
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
    refreshToken: () => dispatch(refreshAuthToken(true)),
    addActiveChat: chat => dispatch(addActiveChat(chat)),
    removeActiveChat: visitor => dispatch(removeActiveChat(visitor)),
    registerStaff: (name, email, password, role) =>
      dispatch(registerStaff(name, email, password, role)),
    showLoadedMessageHistory: visitorId =>
      dispatch(showLoadedMessageHistory(visitorId)),
    loadChatHistory: (visitor, lastMsgId) =>
      dispatch(loadChatHistory(lastMsgId, visitor)),
    showSuccess: msg => dispatch(setSuccess(msg)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(StaffMain);
