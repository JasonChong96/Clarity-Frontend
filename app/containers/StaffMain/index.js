/**
 *
 * StaffMain
 *
 */

import { Badge, Card, Col, Dropdown, Icon, List, Menu, Modal, notification, PageHeader, Radio, Row, Spin, Tabs } from 'antd';
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
import SettingsModal from '../../components/SettingsModal';
import StaffManage from '../../components/StaffManage';
import TimeAgo from 'react-timeago';
import SupervisingChats from '../../components/SupervisingChats';
import { setError, setSuccess } from '../App/actions';
import { makeSelectCurrentUser, makeSelectNotifications } from '../App/selectors';
import PendingChats from '../PendingChats';
import { addActiveChat, addMessageForSupervisorPanel, addMessageFromActiveChat, addMessageFromActiveChatByVisitorId, addMessageFromUnclaimedChat, addOnlineUser, addOnlineVisitor, addUnclaimedChat, clearUnreadCount, incrementUnreadCount, loadAllSupervisors, loadAllVisitors, loadAllVolunteers, loadBookmarkedChats, loadChatHistory, loadLastUnread, loadMessagesAfterForSupervisorPanel, loadMessagesBeforeForSupervisorPanel, loadUnreadChats, refreshAuthToken, registerStaff, removeActiveChat, removeActiveChatByRoomId, removeOnlineUser, removeOnlineVisitor, removeUnclaimedChat, removeUnclaimedChatByVisitorId, reset, setLastSeenMessageId, setOnlineUsers, setOnlineVisitors, setUnclaimedChats, setVisitorBookmark, setVisitorTalkingTo, showLoadedMessageHistory, showMessagesAfterForSupervisorPanel, showMessagesBeforeForSupervisorPanel, staffLogOut, submitSettings } from './actions';
import './index.css';
import reducer from './reducer';
import saga from './saga';
import makeSelectStaffMain, { makeSelectActiveChats, makeSelectAllSupervisors, makeSelectAllVisitors, makeSelectAllVolunteers, makeSelectBookmarkedChats, makeSelectOngoingChats, makeSelectOnlineVisitors, makeSelectRegisterStaffClearTrigger, makeSelectRegisterStaffPending, makeSelectSupervisorPanelChats, makeSelectUnclaimedChats, makeSelectUnreadChats, makeSelectUnreadCount } from './selectors';


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
  allVolunteers,
  allSupervisors,
  setVisitorTalkingTo,
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
  notifications,
  unreadCount,
  showSuccess,
  loadAllVolunteers,
  loadAllSupervisors,
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
  loadUnreadChats,
  unreadChats,
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
      reconnectionDelay: 5000,
      reconnectionAttempts: 10,
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
      loadUnreadChats();
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
      showError({
        title: `${data.user.name} has left.`,
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
    socket.on('reconnect_failed', () => [
      showError({
        title: 'Connection failed',
        description: 'Please try again by refreshing the page or logging out.'
      })
    ])
    // Supervisor / Admin events
    socket.on('agent_new_chat', data => {
      setVisitorTalkingTo(data.visitor.id, data.user);
    });
    socket.on('new_visitor_msg_for_supervisor', data => {
      addMessageForSupervisorPanel(data.user.id, {
        ...data.content,
        user: data.user,
      })
    });
    socket.on('new_staff_msg_for_supervisor', data => {
      addMessageForSupervisorPanel(data.user.id, {
        ...data.content,
        user: data.user,
      })
    });
    socket.on('visitor_leave_chat_for_supervisor', data => {
      removeOnlineVisitor(data.user.id);
    });
    socket.on('staff_leave_chat_for_supervisor', data => {
      setVisitorTalkingTo(data.visitor.id, 0);
    });

    return socket;
  }


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
            addMessageForSupervisorPanel(displayedChat.user.id, {
              user: user.user,
              content: msg,
            });
          }
        },
      );
    };
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
              description: err,
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
    window.onbeforeunload = function () {
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
                  locale={
                    {
                      emptyText: 'No notifications'
                    }
                  }
                  dataSource={notifications}
                  renderItem={item => (
                    <Card>
                      <Row type="flex" justify="start" align="top">
                        {item.title}
                      </Row>
                      <Row type="flex" justify="start" align="top">
                        {item.description}
                      </Row>
                      <Row type="flex" justify="end" align="bottom">
                        <TimeAgo date={item.timestamp} />
                      </Row>
                    </Card>
                  )}
                />
              </Menu>
            }
          >
            <Icon
              style={{ fontSize: '1.5rem', cursor: 'pointer' }}
              type="bell"
            />
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
      {mode == 1 && <div style={{ minWidth: '1000px' }}>
        <Row type="flex" style={{ minWidth: '100%' }}>
          <Col xs={12} md={10} lg={7}>
            <SupervisingChats
              onClickVisitor={visitor => {
                if (!supervisorPanelChats[visitor.id]) {
                  loadLastUnread(visitor);
                }
                setCurrentSupervisorPanelVisitor(visitor);
              }}
              unreadVisitors={unreadChats}
              allVisitors={allVisitors}
              onReloadUnread={loadUnreadChats}
              loadMoreInAllTab={() => allVisitors.length ? loadAllVisitors(allVisitors.slice(-1)[0].id) : false}
              bookmarkedVisitors={bookmarkedChats}
              loadMoreInBookmarkedTab={() => bookmarkedChats.length ? loadBookmarkedChats(bookmarkedChats.slice(-1)[0].id) : false}
              setVisitorBookmark={setVisitorBookmark}
              ongoingChats={onlineVisitors.filter(onlineVisitor => onlineVisitor.staff)}
            />
          </Col>
          <Col style={{ flexGrow: 1 }}>
            {currentSupervisorPanelVisitor && supervisorPanelChats[currentSupervisorPanelVisitor.id] &&
              <Chat
                messages={supervisorPanelChats[currentSupervisorPanelVisitor.id].contents}
                isLoading={false}
                onShowHistory={
                  supervisorPanelChats[currentSupervisorPanelVisitor.id].prev
                    ? () => {
                      showMessagesBeforeForSupervisorPanel(currentSupervisorPanelVisitor.id)
                      loadMessagesBeforeForSupervisorPanel(currentSupervisorPanelVisitor,
                        supervisorPanelChats[currentSupervisorPanelVisitor.id].prev[0].id)
                    }
                    : false
                }
                onShowNext={
                  supervisorPanelChats[currentSupervisorPanelVisitor.id].next
                    ? () => {
                      if (supervisorPanelChats[currentSupervisorPanelVisitor.id].next.length) {
                        setLastSeenMessageId(supervisorPanelChats[currentSupervisorPanelVisitor.id].next.slice(-1)[0].id);
                      }
                      showMessagesAfterForSupervisorPanel(currentSupervisorPanelVisitor.id)
                      loadMessagesAfterForSupervisorPanel(currentSupervisorPanelVisitor,
                        supervisorPanelChats[currentSupervisorPanelVisitor.id].next.slice(-1)[0].id)
                    }
                    : false
                }
                visitor={currentSupervisorPanelVisitor}
                onTakeoverChat={() => console.log("TAKEOVER")}
              />}
          </Col>
        </Row>
      </div>}
      {mode == 2 && <div style={{ minWidth: '600px' }}>
        <StaffManage
          onRegister={registerStaff}
          user={user.user}
          registerStaffClearTrigger={registerStaffClearTrigger}
          registerStaffPending={registerStaffPending}
          volunteerList={allVolunteers}
          loadAllVolunteers={loadAllVolunteers}
          supervisorList={allSupervisors}
          loadAllSupervisors={loadAllSupervisors}
        />
      </div>}
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
  allVolunteers: makeSelectAllVolunteers(),
  allSupervisors: makeSelectAllSupervisors(),
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
  notifications: makeSelectNotifications(),
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
      dispatch(loadAllVolunteers());
      dispatch(loadAllSupervisors());
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
    loadAllVolunteers: () =>
      dispatch(loadAllVolunteers()),
    loadAllSupervisors: () =>
      dispatch(loadAllSupervisors()),
    showSuccess: (msg) => dispatch(setSuccess(msg)),
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
    setVisitorTalkingTo: (visitorId, user) => dispatch(setVisitorTalkingTo(visitorId, user)),
    addMessageForSupervisorPanel: (visitorId, content) => dispatch(addMessageForSupervisorPanel(visitorId, content)),
    loadUnreadChats: () => dispatch(loadUnreadChats()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(StaffMain);
