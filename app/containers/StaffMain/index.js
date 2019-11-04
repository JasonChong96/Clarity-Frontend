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
  Select,
  Card,
  List,
  Badge,
} from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import TextArea from 'antd/lib/input/TextArea';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import socketIOClient from 'socket.io-client';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import TimeAgo from 'react-timeago';
import ActiveChatList from '../../components/ActiveChatList';
import Chat from '../../components/Chat';
import ManageVolunteers from '../../components/ManageVolunteers';
import CreateVolunteer from '../../components/CreateVolunteer';
import StaffManage from '../../components/StaffManage';
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
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  loadAllVisitors,
  setLastSeenMessageId,
  removeActiveChatByRoomId,
  loadBookmarkedChats,
  setOnlineVisitors,
  addOnlineVisitor,
  removeOnlineVisitor,
  loadLastUnread,
  loadMessagesAfterForSupervisorPanel,
  loadMessagesBeforeForSupervisorPanel,
  showMessagesBeforeForSupervisorPanel,
  showMessagesAfterForSupervisorPanel,
  setVisitorBookmark,
  addMessageForSupervisorPanel,
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
  makeSelectAllVisitors,
  makeSelectOngoingChats,
  makeSelectBookmarkedChats,
  makeSelectUnreadChats,
  makeSelectSupervisorPanelChats,
  makeSelectOnlineVisitors,
} from './selectors';
import { setSuccess, setError } from '../App/actions';
import SupervisingChats from '../../components/SupervisingChats';
import SettingsModal from '../../components/SettingsModal';

function showLogOut(onConfirm) {
  Modal.confirm({
    title: 'Log out',
    content: 'Are you sure you want to log out?',
    onOk() {
      onConfirm();
    },
  });
}

const data = [
  {
    content: 'aaa',
    timestamp: '12 mins ago',
  },
  {
    content: 'aaa',
    timestamp: '12 mins ago',
  },
  {
    content: 'aaa',
    timestamp: '12 mins ago',
  },
];

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
  setOnlineVisitors,
  addOnlineVisitor,
  removeOnlineVisitor,
  registerStaffPending,
  registerStaffClearTrigger,
  loadMessagesBeforeForSupervisorPanel,
  loadMessagesAfterForSupervisorPanel,
  supervisorPanelChats,
  logOut,
  showError,
  submitSettings,
  incrementUnreadCount,
  clearUnreadCount,
  unreadCount,
  showSuccess,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  loadAllVisitors,
  loadLastUnread,
  allVisitors,
  setLastSeenMessageId,
  bookmarkedChats,
  removeActiveChatByRoomId,
  loadBookmarkedChats,
  showMessagesAfterForSupervisorPanel,
  showMessagesBeforeForSupervisorPanel,
  onlineVisitors,
  addMessageForSupervisorPanel,
  setVisitorBookmark,
}) {
  useInjectReducer({ key: 'staffMain', reducer });
  useInjectSaga({ key: 'staffMain', saga });
  const [currentRoom, setCurrentRoom] = useState(false);
  const [socket, setSocket] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [
    currentSupervisorPanelVisitor,
    setCurrentSupervisorPanelVisitor,
  ] = useState(false);
  function connectSocket() {
    const socket = socketIOClient('https://api.chatwithora.com', {
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
      const onlineVisitorss = data.online_visitors;
      const processedData = chats.map(chat => {
        chat.contents = chat.contents.map(content => ({
          ...content,
          user: content.sender ? content.send : chat.user,
        }));
        return chat;
      });
      onStaffInit(processedData);
      setOnlineUsers(onlineUsers);
      setOnlineVisitors(onlineVisitorss);
      loadAllVisitors();
      loadBookmarkedChats();
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
      addOnlineVisitor(data.user);
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
      addOnlineUser(data.user);
    });
    socket.on('staff_goes_offline', data => {
      removeOnlineUser(data.user.id);
    });

    // Supervisor / Admin events
    socket.on('agent_new_chat', data => {
      // Do nothing
      // console.log('agent_new_chat');
      // console.log(data);
    });
    socket.on('new_visitor_msg_for_supervisor', data => {
      addMessageForSupervisorPanel(data.user.id, {
        ...data.content,
        user: user.data,
      });
    });
    socket.on('new_staff_msg_for_supervisor', data => {
      addMessageForSupervisorPanel(data.user.id, {
        ...data.content,
        user: user.data,
      });
    });
    socket.on('visitor_leave_chat_for_supervisor', data => {
      removeOnlineVisitor(data.user.id);
    });
    socket.on('staff_leave_chat_for_supervisor', data => {
      // removeOnlineVisitor
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
              addMessageForSupervisorPanel(user.user.id, {
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
        if (data.user.id == displayedChat.user.id) {
          setLastSeenMessageId(data.user.id, data.id);
        } else {
          incrementUnreadCount(data.user.id);
        }
      });
      setLastSeenMessageId(
        displayedChat.user.id,
        displayedChat.contents.slice(-1)[0].id,
      );
    }
  }, [currentRoom]);
  useEffect(() => {
    if (
      currentSupervisorPanelVisitor &&
      supervisorPanelChats[currentSupervisorPanelVisitor.id] &&
      supervisorPanelChats[currentSupervisorPanelVisitor.id].contents.length
    ) {
      const id = supervisorPanelChats[
        currentSupervisorPanelVisitor.id
      ].contents.slice(-1)[0].id;
      if (id) {
        setLastSeenMessageId(currentSupervisorPanelVisitor.id, id);
      }
    }
  });
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
            } else {
              showError({
                title: 'Failed to claim chat',
                description: 'err',
              });
            }
          });
        };

  const leaveChat = !socket
    ? false
    : room => {
        socket.emit('staff_leave_room', { room }, (res, err) => {
          if (res) {
            removeActiveChatByRoomId(room);
            showSuccess({
              title: 'Left room successfully!',
              description: '',
            });
          }
        });
      };

  const flagChat = !socket
    ? false
    : room => {
        socket.emit(
          'change_chat_priority',
          { severity_level: 1, room },
          (res, err) => {
            if (res) {
              showSuccess({
                title: 'Flagged chat successfully',
                description: '',
              });
            } else {
              showError({
                title: 'Failed to flag chat',
                description: err,
              });
            }
          },
        );
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

  return (
    <>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          display: 'inline-block',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '100%',
          display: 'inline-block',
          zIndex: 1,
        }}
      />

      <PageHeader
        extra={[
          <Dropdown
            overlayStyle={{ width: '20%' }}
            overlay={
              <Menu>
                <List
                  dataSource={data}
                  renderItem={item => (
                    <Card>
                      <Row type="flex" justify="start" align="top">
                        {item.content}
                      </Row>
                      <Row type="flex" justify="end" align="bottom">
                        {item.timestamp}
                      </Row>
                    </Card>
                  )}
                />
              </Menu>
            }
          >
            <Badge
              dot
              style={{
                padding: '0.1em',
              }}
            >
              <Icon
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                type="bell"
              />
            </Badge>
          </Dropdown>,

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
              style={{
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginLeft: '4rem',
              }}
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
      {mode == 0 && (
        <div>
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
                  onLeave={() => leaveChat(currentRoom)}
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
                  chatId={currentRoom}
                  onFlag={
                    displayedChat.room.severity_level
                      ? false
                      : () => flagChat(currentRoom)
                  }
                />
              )}
            </Col>
          </Row>
        </div>
      )}
      {mode == 1 && (
        <div style={{ minWidth: '600px' }}>
          <Row type="flex" style={{ minWidth: '600px' }}>
            <Col xs={12} md={10} lg={7}>
              <SupervisingChats
                onClickVisitor={visitor => {
                  if (!supervisorPanelChats[visitor.id]) {
                    loadLastUnread(visitor);
                  }
                  setCurrentSupervisorPanelVisitor(visitor);
                }}
                allVisitors={allVisitors}
                loadMoreInAllTab={() =>
                  allVisitors.length
                    ? loadAllVisitors(allVisitors.slice(-1)[0].id)
                    : false
                }
                bookmarkedVisitors={bookmarkedChats}
                loadMoreInBookmarkedTab={() =>
                  bookmarkedChats.length
                    ? loadBookmarkedChats(bookmarkedChats.slice(-1)[0].id)
                    : false
                }
                setVisitorBookmark={setVisitorBookmark}
                ongoingChats={onlineVisitors.filter(
                  onlineVisitor =>
                    unclaimedChats.filter(
                      unclaimedChat =>
                        unclaimedChat.user.id == onlineVisitor.id,
                    ).length == 0,
                )}
              />
            </Col>
            <Col style={{ flexGrow: 1 }}>
              {currentSupervisorPanelVisitor &&
                supervisorPanelChats[currentSupervisorPanelVisitor.id] && (
                  <Chat
                    messages={
                      supervisorPanelChats[currentSupervisorPanelVisitor.id]
                        .contents
                    }
                    isLoading={false}
                    onShowHistory={
                      supervisorPanelChats[currentSupervisorPanelVisitor.id]
                        .prev
                        ? () => {
                            showMessagesBeforeForSupervisorPanel(
                              currentSupervisorPanelVisitor.id,
                            );
                            loadMessagesBeforeForSupervisorPanel(
                              currentSupervisorPanelVisitor,
                              supervisorPanelChats[
                                currentSupervisorPanelVisitor.id
                              ].prev[0].id,
                            );
                          }
                        : false
                    }
                    onShowNext={
                      supervisorPanelChats[currentSupervisorPanelVisitor.id]
                        .next
                        ? () => {
                            if (
                              supervisorPanelChats[
                                currentSupervisorPanelVisitor.id
                              ].next.length
                            ) {
                              setLastSeenMessageId(
                                supervisorPanelChats[
                                  currentSupervisorPanelVisitor.id
                                ].next.slice(-1)[0],
                              );
                            }
                            showMessagesAfterForSupervisorPanel(
                              currentSupervisorPanelVisitor.id,
                            );
                            loadMessagesAfterForSupervisorPanel(
                              currentSupervisorPanelVisitor,
                              supervisorPanelChats[
                                currentSupervisorPanelVisitor.id
                              ].next.slice(-1)[0].id,
                            );
                          }
                        : false
                    }
                  />
                )}
            </Col>
          </Row>
        </div>
      )}
      {mode == 2 && (
        <div style={{ minWidth: '600px' }}>
          <StaffManage
            onRegister={registerStaff}
            user={user.user}
            registerStaffClearTrigger={registerStaffClearTrigger}
            registerStaffPending={registerStaffPending}
          />
        </div>
      )}
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
  allVisitors: makeSelectAllVisitors(),
  ongoingChats: makeSelectOngoingChats(),
  bookmarkedChats: makeSelectBookmarkedChats(),
  unreadChats: makeSelectUnreadChats(),
  supervisorPanelChats: makeSelectSupervisorPanelChats(),
  onlineVisitors: makeSelectOnlineVisitors(),
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
    removeActiveChatByRoomId: room => dispatch(removeActiveChatByRoomId(room)),
    registerStaff: (name, email, password, role) =>
      dispatch(registerStaff(name, email, password, role)),
    showLoadedMessageHistory: visitorId =>
      dispatch(showLoadedMessageHistory(visitorId)),
    loadChatHistory: (visitor, lastMsgId) =>
      dispatch(loadChatHistory(lastMsgId, visitor)),
    showSuccess: msg => dispatch(setSuccess(msg)),
    setOnlineUsers: users => dispatch(setOnlineUsers(users)),
    addOnlineUser: user => dispatch(addOnlineUser(user)),
    removeOnlineUser: id => dispatch(removeOnlineUser(id)),
    showError: msg => dispatch(setError(msg)),
    setOnlineVisitors: visitors => dispatch(setOnlineVisitors(visitors)),
    setVisitorBookmark: (visitor, isBookmarked) =>
      dispatch(setVisitorBookmark(visitor, isBookmarked)),
    loadLastUnread: visitor => dispatch(loadLastUnread(visitor)),
    addOnlineVisitor: visitor => dispatch(addOnlineVisitor(visitor)),
    removeOnlineVisitor: visitorId => dispatch(removeOnlineVisitor(visitorId)),
    loadAllVisitors: lastVisitorId => dispatch(loadAllVisitors(lastVisitorId)),
    loadBookmarkedChats: lastVisitorId =>
      dispatch(loadBookmarkedChats(lastVisitorId)),
    showMessagesBeforeForSupervisorPanel: visitorId =>
      dispatch(showMessagesBeforeForSupervisorPanel(visitorId)),
    showMessagesAfterForSupervisorPanel: visitorId =>
      dispatch(showMessagesAfterForSupervisorPanel(visitorId)),
    loadMessagesBeforeForSupervisorPanel: (visitor, firstMessageId) =>
      dispatch(loadMessagesBeforeForSupervisorPanel(visitor, firstMessageId)),
    loadMessagesAfterForSupervisorPanel: (visitor, lastMessageId) =>
      dispatch(loadMessagesAfterForSupervisorPanel(visitor, lastMessageId)),
    setLastSeenMessageId: (visitorId, messageId) =>
      dispatch(setLastSeenMessageId(visitorId, messageId)),
    showSuccess: msg => dispatch(setSuccess(msg)),
    addMessageForSupervisorPanel: (visitorId, content) =>
      dispatch(addMessageForSupervisorPanel(visitorId, content)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(StaffMain);
