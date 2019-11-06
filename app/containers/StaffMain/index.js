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
import { addActiveChat, addMessageForSupervisorPanel, addMessageFromActiveChat, addMessageFromActiveChatByVisitorId, addMessageFromUnclaimedChat, addOnlineUser, addOnlineVisitor, addUnclaimedChat, clearUnreadCount, incrementUnreadCount, loadAllSupervisors, loadAllVisitors, loadAllVolunteers, loadBookmarkedChats, loadChatHistory, loadLastUnread, loadMessagesAfterForSupervisorPanel, loadMessagesBeforeForSupervisorPanel, loadUnreadChats, refreshAuthToken, registerStaff, removeActiveChat, removeActiveChatByRoomId, removeOnlineUser, removeOnlineVisitor, removeUnclaimedChat, removeUnclaimedChatByVisitorId, reset, setLastSeenMessageId, setOnlineUsers, setOnlineVisitors, setUnclaimedChats, setVisitorBookmark, setVisitorTalkingTo, showLoadedMessageHistory, showMessagesAfterForSupervisorPanel, showMessagesBeforeForSupervisorPanel, staffLogOut, submitSettings, setFlaggedChats, addFlaggedChat, removeFlaggedChat, changeChatPriority, addMessageForStaffPanel, setMessagesForStaffPanel, showHistoryForStaffPanel } from './actions';
import './index.css';
import reducer from './reducer';
import saga from './saga';
import makeSelectStaffMain, { makeSelectActiveChats, makeSelectAllSupervisors, makeSelectAllVisitors, makeSelectAllVolunteers, makeSelectBookmarkedChats, makeSelectOngoingChats, makeSelectOnlineVisitors, makeSelectRegisterStaffClearTrigger, makeSelectRegisterStaffPending, makeSelectSupervisorPanelChats, makeSelectUnclaimedChats, makeSelectUnreadChats, makeSelectUnreadCount, makeSelectFlaggedChats, makeSelectStaffPanelChats } from './selectors';


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
  staffPanelChats,
  showMessagesAfterForSupervisorPanel,
  showMessagesBeforeForSupervisorPanel,
  onlineVisitors,
  addMessageForSupervisorPanel,
  loadUnreadChats,
  unreadChats,
  setVisitorBookmark,
  flaggedChats,
  setFlaggedChats,
  addFlaggedChat,
  changeChatPriority,
  addMessageForStaffPanel,
  setMessagesForStaffPanel,
  showHistoryForStaffPanel,
  removeFlaggedChat,
}) {
  useInjectReducer({ key: 'staffMain', reducer });
  useInjectSaga({ key: 'staffMain', saga });
  const [currentVisitor, setCurrentVisitor] = useState(false);
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
      const processedFlaggedChats = data.flagged_chats
        .filter(chat => onlineVisitorss
          .find(visitor => (visitor.id == chat.user.id && visitor.staff)))
        .map(chat => ({
          ...chat,
          contents: [],
        }));
      onStaffInit(processedData);
      setOnlineUsers(onlineUsers);
      setOnlineVisitors(onlineVisitorss);
      setFlaggedChats(processedFlaggedChats);
      loadAllVisitors();
      loadUnreadChats();
      loadBookmarkedChats();
      processedData.forEach(chat => {
        loadChatHistory(chat.user, chat.contents[0].id);
        setMessagesForStaffPanel(chat.user.id, chat.contents);
      });
      processedFlaggedChats.forEach(chat => {
        loadChatHistory(chat.user, null, true);
      })
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
      setMessagesForStaffPanel(data.user.id, data.contents);
      addUnclaimedChat(data);
      addOnlineVisitor(data.user);
      loadChatHistory(data.user, data.contents[0].id);
    });
    socket.on('visitor_unclaimed_msg', data => {
      addMessageForStaffPanel(data.user.id, {
        ...data.content,
        user: data.user,
      });
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
    socket.on('staff_being_taken_over_chat', data => {
      console.log("staff_being_taken_over_chat")
      removeActiveChatByRoomId(data.room.id);
      const chatTaken = activeChats.find(chat => chat.room.id == data.room.id)
      if (chatTaken) {
        showError({
          title: `${data.user.full_name} has taken over your chat with ${chatTaken.user.name}`,
          description: '',
        })
      }
    })

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
      const visitor = onlineVisitors.find(visitor => visitor.room);
      if (!visitor) {
        return;
      }
      addMessageForSupervisorPanel(visitor.id, {
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
    socket.on('chat_has_changed_priority_for_supervisor', data => {
      console.log('chat_has_changed_priority_for_supervisor')
      //changeChatPriority(data.room.visitor_id, data.room.severity_level);
    })

    socket.on('staff_take_over_chat', data => {
      console.log('staff_take_over_chat');
    })

    return socket;
  }


  let displayedChat;
  const matchingActiveChats = activeChats.filter(
    chat => chat.user.id == currentVisitor,
  );
  if (matchingActiveChats.length > 0) {
    displayedChat = matchingActiveChats[0];
  } else if (unclaimedChats.length) {
    const matchingUnclaimedChats = unclaimedChats.filter(
      chat => chat.user.id == currentVisitor,
    );
    if (matchingUnclaimedChats.length > 0) {
      displayedChat = matchingUnclaimedChats[0];
    }
  } else if (flaggedChats.length) {
    const matchingFlaggedChats = flaggedChats.filter(
      chat => chat.user.id == currentVisitor,
    );
    if (matchingFlaggedChats.length > 0) {
      displayedChat = matchingFlaggedChats[0];
    }
  }

  const sendMsg = !socket || !displayedChat || !matchingActiveChats.length
    ? false
    : msg => {
      socket.emit(
        'staff_msg',
        { room: displayedChat.room.id, content: msg },
        (response, error) => {
          if (!error) {
            addMessageForStaffPanel(displayedChat.user.id, {
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
        addMessageForStaffPanel(data.user.id, {
          ...data.content,
          user: data.user,
        });
        if (data.user.id == displayedChat.user.id) {
          setLastSeenMessageId(data.user.id, data.id);
        } else {
          incrementUnreadCount(data.user.id);
        }
      });
      if (displayedChat.contents.length) {
        setLastSeenMessageId(
          displayedChat.user.id,
          displayedChat.contents.slice(-1)[0].id,
        );
      }
    }
  }, [currentVisitor]);
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
    !socket || matchingActiveChats.length > 0 || (displayedChat && onlineVisitors.find(visitor => displayedChat.user.id == visitor.id && visitor.staff))
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
  const takeoverChat = !socket
    ? false
    : chat => {
      console.log("CALLED")
      socket.emit(
        'take_over_chat',
        { visitor: chat.user.id },
        (res, err) => {
          console.log('aaaa');
          if (res) {
            removeFlaggedChat(chat.user.id);
            addActiveChat(chat);
            showSuccess({
              title: 'Took over chat successfully',
              description: '',
            });
          } else {
            showError({
              title: 'Failed to takeover chat',
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
                        <TimeAgo date={item.timestamp}
                          minPeriod={10} />
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
                      onClickRoom={setCurrentVisitor}
                      getContents={chat => staffPanelChats[chat.user.id].contents}
                      getUnreadCount={room => unreadCount[room.user.id]}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={`Claim Chats (${unclaimedChats.length})`}
                    key="2"
                  >
                    <PendingChats
                      getContents={chat => staffPanelChats[chat.user.id].contents}
                      inactiveChats={flaggedChats.filter(chat => onlineVisitors.find(visitor => visitor.id == chat.user.id)).concat(unclaimedChats)}
                      onClickRoom={setCurrentVisitor}
                    />
                  </Tabs.TabPane>
                </Tabs>
              </Spin>
            </Col>
            <Col style={{ flexGrow: 1 }}>
              {displayedChat && (
                <Chat
                  onSendMsg={sendMsg}
                  onLeave={() => leaveChat(displayedChat.room.id)}
                  messages={staffPanelChats[displayedChat.user.id].contents}
                  user={user.user}
                  visitor={displayedChat.user}
                  isVisitorOnline={onlineVisitors.find(visitor => visitor.id == currentVisitor)}
                  onClaimChat={
                    claimChat ? () => claimChat(displayedChat.room.id) : false
                  }
                  onShowHistory={
                    staffPanelChats[displayedChat.user.id].loadedHistory &&
                      staffPanelChats[displayedChat.user.id].loadedHistory.length > 0
                      ? () => {
                        showHistoryForStaffPanel(displayedChat.user.id);
                        loadChatHistory(
                          displayedChat.user,
                          staffPanelChats[displayedChat.user.id].loadedHistory[0].id,
                        );
                      }
                      : false
                  }
                  isLoading={!isConnected}
                  onFlag={
                    displayedChat.room.severity_level
                      ? false
                      : () => flagChat(displayedChat.room.id)
                  }
                  onTakeoverChat={
                    onlineVisitors.find(visitor => displayedChat.user.id == visitor.id && visitor.staff && visitor.staff.role_id < user.user.role_id)
                      ? () => takeoverChat(displayedChat)
                      : false
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
              getIsVisitorOnline={visitor => onlineVisitors.find(visitor2 => visitor2.id == visitor.id)}
            />
          </Col>
          <Col style={{ flexGrow: 1 }}>
            {currentSupervisorPanelVisitor && supervisorPanelChats[currentSupervisorPanelVisitor.id] &&
              <Chat
                messages={supervisorPanelChats[currentSupervisorPanelVisitor.id].contents}
                isLoading={false}
                isVisitorOnline={onlineVisitors.find(visitor => visitor.id == currentSupervisorPanelVisitor.id)}
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
                        setLastSeenMessageId(currentSupervisorPanelVisitor.id, supervisorPanelChats[currentSupervisorPanelVisitor.id].next.slice(-1)[0].id);
                      }
                      showMessagesAfterForSupervisorPanel(currentSupervisorPanelVisitor.id)
                      loadMessagesAfterForSupervisorPanel(currentSupervisorPanelVisitor,
                        supervisorPanelChats[currentSupervisorPanelVisitor.id].next.slice(-1)[0].id)
                    }
                    : false
                }
                visitor={currentSupervisorPanelVisitor}
                onTakeoverChat={
                  onlineVisitors.find(visitor => currentSupervisorPanelVisitor.id == visitor.id && visitor.staff && visitor.staff.role_id < user.user.role_id)
                    ? () => console.log("takeover from supervisor panel")
                    : false
                }
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
  flaggedChats: makeSelectFlaggedChats(),
  staffPanelChats: makeSelectStaffPanelChats(),
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
    loadChatHistory: (visitor, lastMsgId, repeat) =>
      dispatch(loadChatHistory(lastMsgId, visitor, repeat)),
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
    setFlaggedChats: chats => dispatch(setFlaggedChats(chats)),
    addFlaggedChat: chat => dispatch(addFlaggedChat(chat)),
    removeFlaggedChat: visitorId => dispatch(removeFlaggedChat(visitorId)),
    changeChatPriority: (visitorId, priority) => dispatch(changeChatPriority(visitorId, priority)),
    addMessageForStaffPanel: (visitorId, content) => dispatch(addMessageForStaffPanel(visitorId, content)),
    setMessagesForStaffPanel: (visitorId, contents) => dispatch(setMessagesForStaffPanel(visitorId, contents)),
    showHistoryForStaffPanel: (visitorId) => dispatch(showHistoryForStaffPanel(visitorId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(StaffMain);
