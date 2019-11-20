/**
 *
 * StaffMain
 *
 */

import { Badge, Card, Col, Dropdown, Icon, List, Menu, Modal, notification, PageHeader, Radio, Row, Spin, Tabs, Divider, Drawer, Button } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { SOCKET_URL } from 'utils/api'
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import socketIOClient from 'socket.io-client';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import ActiveChatList from '../../components/ActiveChatList';
import Chat from '../../components/Chat';
import SettingsModal from '../../components/SettingsModal';
import StaffManage from '../../components/StaffManage';
import AdminToggle from '../../components/AdminToggle';
import TimeAgo from 'react-timeago';
import SupervisingChats from '../../components/SupervisingChats';
import { setError, setSuccess } from '../App/actions';
import { makeSelectCurrentUser, makeSelectNotifications, makeSelectSettings } from '../App/selectors';
import PendingChats from '../PendingChats';
import { addActiveChat, addMessageForSupervisorPanel, addMessageFromActiveChat, addMessageFromActiveChatByVisitorId, addMessageFromUnclaimedChat, addOnlineUser, addOnlineVisitor, addUnclaimedChat, clearUnreadCount, incrementUnreadCount, loadAllSupervisors, loadAllVisitors, loadAllVolunteers, loadBookmarkedChats, loadChatHistory, loadLastUnread, loadMessagesAfterForSupervisorPanel, loadMessagesBeforeForSupervisorPanel, loadUnreadChats, refreshAuthToken, registerStaff, removeActiveChat, removeActiveChatByRoomId, removeOnlineUser, removeOnlineVisitor, removeUnclaimedChat, removeUnclaimedChatByVisitorId, reset, setLastSeenMessageId, setOnlineUsers, setOnlineVisitors, setUnclaimedChats, setVisitorBookmark, setVisitorTalkingTo, showLoadedMessageHistory, showMessagesAfterForSupervisorPanel, showMessagesBeforeForSupervisorPanel, staffLogOut, submitSettings, updateUser, setFlaggedChats, addFlaggedChat, removeFlaggedChat, changeChatPriority, addMessageForStaffPanel, setMessagesForStaffPanel, showHistoryForStaffPanel, loadMostRecentForSupervisorPanel, setOfflineUnclaimedChats, addOfflineUnclaimedChat, removeOfflineUnclaimedChat, setVisitorTypingStatus, loadUnhandled, loadFlaggedChats, loadStaffsHandlingVisitor, setActiveChatUnhandledTime, loadAllUnhandledChats } from './actions';
import './index.css';
import reducer from './reducer';
import saga from './saga';
import { usePageVisibility } from 'react-page-visibility';
import makeSelectStaffMain, { makeSelectActiveChats, makeSelectAllSupervisors, makeSelectAllVisitors, makeSelectAllVolunteers, makeSelectBookmarkedChats, makeSelectOngoingChats, makeSelectOnlineVisitors, makeSelectRegisterStaffClearTrigger, makeSelectRegisterStaffPending, makeSelectSupervisorPanelChats, makeSelectUnclaimedChats, makeSelectUnreadChats, makeSelectUnreadCount, makeSelectFlaggedChats, makeSelectStaffPanelChats, makeSelectOfflineUnclaimedChats, makeSelectVisitorTypingStatus, makeSelectStaffsHandlingVisitor, makeSelectAllUnhandledChats } from './selectors';
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
  addUnclaimedChat,
  refreshToken,
  registerStaff,
  unclaimedChats,
  allVolunteers,
  allSupervisors,
  loadAllUnhandledChats,
  setVisitorTalkingTo,
  onStaffInit,
  setVisitorTypingStatus,
  visitorTypingStatus,
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
  updateUser,
  incrementUnreadCount,
  clearUnreadCount,
  notifications,
  unreadCount,
  showSuccess,
  loadAllVolunteers,
  loadAllSupervisors,
  setOnlineUsers,
  setActiveChatUnhandledTime,
  allUnhandledChats,
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
  loadFlaggedChats,
  setMessagesForStaffPanel,
  loadMostRecentForSupervisorPanel,
  showHistoryForStaffPanel,
  removeFlaggedChat,
  offlineUnclaimedChats,
  addOfflineUnclaimedChat,
  setOfflineUnclaimedChats,
  settings,
  removeOfflineUnclaimedChat,
  staffsHandlingVisitor,
  loadStaffsHandlingVisitor,
  loadUnhandled,
}) {
  useInjectReducer({ key: 'staffMain', reducer });
  useInjectSaga({ key: 'staffMain', saga });
  const [currentVisitor, setCurrentVisitor] = useState(false);
  const [socket, setSocket] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [
    currentSupervisorPanelVisitor,
    setCurrentSupervisorPanelVisitor,
  ] = useState(false);
  function connectSocket() {
    const socket = socketIOClient(SOCKET_URL, {
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
    });
    socket.on('staff_init', data => {
      console.log('staff_init', data);
      setIsConnected(true);
      const onlineUsers = data.online_users;
      // const chats = data.unclaimed_chats;
      const onlineVisitorss = data.online_visitors;
      // const offlineChats = data.offline_unclaimed_chats;
      // const processedData = chats.map(chat => {
      //   chat.contents = chat.contents.map(content => ({
      //     ...content,
      //     user: content.sender ? content.send : chat.visitor,
      //   }));
      //   return chat;
      // });
      // const processedFlaggedChats = data.flagged_chats
      //   .map(visitor => { return { visitor } })
      // const activeChats = data.active_chats.concat(data.active_chats_unhandled);
      onStaffInit();
      setOnlineUsers(Object.values(onlineUsers));
      setOnlineVisitors(onlineVisitorss);
      // setFlaggedChats(processedFlaggedChats);
      loadFlaggedChats();
      loadAllVisitors();
      loadUnreadChats();
      loadBookmarkedChats();
      if (user.user.role_id == 3) {
        loadUnhandled();
      } else {
        loadAllUnhandledChats();
      }
      // processedData.forEach(chat => {
      //   loadChatHistory(chat.visitor, chat.contents[0].id);
      //   setMessagesForStaffPanel(chat.visitor.id, chat.contents);
      // });
      // processedFlaggedChats.forEach(chat => {
      //   loadChatHistory(chat.visitor, null, true);
      // })
      // offlineChats.forEach(visitor => {
      //   loadChatHistory(visitor, null, true);
      // })
      // activeChats.forEach(visitor => {
      //   addActiveChat({ visitor });
      //   loadChatHistory(visitor, null, true);
      // })
      // setOfflineUnclaimedChats(offlineChats.map(visitor => { return { visitor } }));
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('disconnected');
    });
    socket.on('staff_claim_chat', data => {
      console.log('staff_claim_chat', data);
      removeUnclaimedChatByVisitorId(data.visitor.id);
      removeOfflineUnclaimedChat(data.visitor.id);
      if (data.next_offline_unclaimed_visitor && !activeChats.find(chat => chat.visitor.id == data.visitor.id)) {
        addOfflineUnclaimedChat({ visitor: data.next_offline_unclaimed_visitor })
      }
    });
    socket.on('staff_already_online', data => {
      function showRoomExists() {
        Modal.error({
          title: 'User already connected',
          content: 'Using the same account on two tabs is not allowed.',
        });
      }
      showRoomExists();
    })
    socket.on('staff_send', data => {
      addMessageForStaffPanel(data.visitor.id, {
        ...data.content,
        user: data.staff,
      })
    })
    socket.on('visitor_send', data => {
      console.log('visitor_send')
      addMessageForStaffPanel(data.visitor.id, {
        ...data.content,
        user: data.visitor,
      });
      if (!activeChats.find(chat => chat.visitor.id == data.visitor.id)) {
        addActiveChat({ visitor: { ...data.visitor, unhandled_timestamp: data.content.created_at } })
        loadChatHistory(data.visitor, null, true)
      }
      if (activeChats.find(chat => chat.visitor.id == data.visitor.id && !data.visitor.unhandled_timestamp)) {
        setActiveChatUnhandledTime(data.visitor.id, data.content.created_at)
      }
    });
    socket.on('append_unclaimed_chats', data => {
      console.log('append_unclaimed_chats')
      data.contents.forEach(content => {
        content.user = content.sender;
        if (!content.user) {
          content.user = data.visitor;
        }
      });
      setMessagesForStaffPanel(data.visitor.id, data.contents);
      if (!activeChats.find(chat => chat.visitor.id == data.visitor.id)) {
        addUnclaimedChat(data);
        loadChatHistory(data.visitor, data.contents[0].id);
      }
    });
    socket.on('visitor_unclaimed_msg', data => {
      console.log('visitor_unclaimed_msg')
      addMessageForStaffPanel(data.visitor.id, {
        ...data.content,
        user: data.visitor,
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
    socket.on('visitor_leave_queue', data => {
      console.log('visitor_leave_queue')
      if (activeChats.find(chat => chat.visitor.id == data.visitor.id)) {
        removeActiveChat(data.visitor);
        showError({
          title: `${data.visitor.name} has left.`,
          description: '',
        });
      }
      removeUnclaimedChatByVisitorId(data.visitor.id)
    });

    // Staff online / offline events
    socket.on('staff_goes_online', data => {
      addOnlineUser(data.staff);
    });
    socket.on('staff_goes_offline', data => {
      removeOnlineUser(data.staff.id);
    });
    socket.on('reconnect_failed', () => [
      showError({
        title: 'Connection failed',
        description: 'Please try again by refreshing the page or logging out.'
      })
    ])
    socket.on('staff_being_taken_over_chat', data => {
      removeActiveChat(data.visitor);
      if (currentVisitor == data.visitor.id) {
        setCurrentVisitor(null);
      }
      showError({
        title: `${data.staff.full_name} has taken over your chat with ${data.visitor.name}`,
        description: '',
      })
    })
    socket.on('remove_visitor_offline_chat', data => {
      removeOfflineUnclaimedChat(data.visitor.id);
    })
    socket.on('unclaimed_chat_to_offline', data => {
      console.log('unclaimed_chat_to_offline')
      const chat = unclaimedChats.find(chatt => chatt.visitor.id == data.visitor.id)
      if (chat) {
        addOfflineUnclaimedChat(chat);
        removeUnclaimedChatByVisitorId(data.visitor.id);
      }
    })
    socket.on('visitor_goes_online', data => {
      addOnlineVisitor(data.visitor);
    })

    socket.on('visitor_goes_offline', data => {
      removeOnlineVisitor(data.visitor.id);
    })

    socket.on('user_typing_receive', data => {
      setVisitorTypingStatus(data.visitor.id, new Date().getTime());
    })

    socket.on('user_stop_typing_receive', data => {
      setVisitorTypingStatus(data.visitor.id, 0);
    })

    // Supervisor / Admin events
    socket.on('agent_new_chat', data => {
      setVisitorTalkingTo(data.visitor.id, data.staff);
    });
    socket.on('new_visitor_msg_for_supervisor', data => {
      addMessageForSupervisorPanel(data.visitor.id, {
        ...data.content,
        user: data.visitor,
      })
    });
    socket.on('new_staff_msg_for_supervisor', data => {
      addMessageForSupervisorPanel(data.visitor.id, {
        ...data.content,
        user: data.staff,
      })
    });
    socket.on('visitor_leave_chat_for_supervisor', data => {
      // removeOnlineVisitor(data.visitor.id);
    });
    socket.on('staff_leave_chat_for_supervisor', data => {
      setVisitorTalkingTo(data.visitor.id, 0);
    });

    socket.on('staff_take_over_chat', data => {
      setVisitorTalkingTo(data.visitor.id, data.staff);
    })

    socket.on('chat_has_changed_priority_for_supervisor', data => {
      if (data.visitor.severity_level) {
        addFlaggedChat({
          visitor: { ...data.visitor, severity_level: data.visitor.severity_level }
        });
        showError({
          title: 'A chat has been flagged!',
          description: `${data.visitor.name} has been flagged and is in your queue!`
        })
      } else {
        removeFlaggedChat(data.visitor.id)
      }
    })

    return socket;
  }


  let displayedChat;
  const matchingActiveChats = activeChats.filter(
    chat => chat.visitor.id == currentVisitor,
  );
  if (matchingActiveChats.length > 0) {
    displayedChat = matchingActiveChats[0];
  }
  if (unclaimedChats.length || offlineUnclaimedChats.length) {
    const matchingUnclaimedChats = unclaimedChats.concat(offlineUnclaimedChats).filter(
      chat => chat.visitor.id == currentVisitor,
    );
    if (matchingUnclaimedChats.length > 0) {
      displayedChat = matchingUnclaimedChats[0];
    }
  }
  if (flaggedChats.length) {
    const matchingFlaggedChats = flaggedChats.filter(
      chat => chat.visitor.id == currentVisitor,
    );
    if (matchingFlaggedChats.length > 0) {
      displayedChat = matchingFlaggedChats[0];
    }
  }


  const sendMsg = !socket || !displayedChat || !matchingActiveChats.length
    ? false
    : (msg, visitor) => {
      socket.emit(
        'staff_msg',
        { visitor, content: msg },
        (response, error, message) => {
          if (!error && message) {
            addMessageForStaffPanel(displayedChat.visitor.id, {
              user: user.user,
              ...message,
            });
            addMessageForSupervisorPanel(displayedChat.visitor.id, {
              user: user.user,
              ...message,
            });
            setLastSeenMessageId(visitor, message.id);
            setActiveChatUnhandledTime(visitor, 0);
          }
        },
      );
    };

  const sendMsgSupervisor = !socket || !currentSupervisorPanelVisitor
    ? false
    : (msg) => {
      socket.emit(
        'staff_msg',
        { visitor: currentSupervisorPanelVisitor.id, content: msg },
        (response, error, message) => {
          if (!error && message) {
            addMessageForStaffPanel(currentSupervisorPanelVisitor.id, {
              user: user.user,
              ...message,
            });
            if (supervisorPanelChats[currentSupervisorPanelVisitor.id].next) {
              loadMostRecentForSupervisorPanel(currentSupervisorPanelVisitor, true);
            } else {
              addMessageForSupervisorPanel(currentSupervisorPanelVisitor.id, {
                user: user.user,
                ...message,
              });
              setLastSeenMessageId(currentSupervisorPanelVisitor.id, message.id);
            }
          }
        },
      );
    };

  const sendTyping = !socket || !currentVisitor
    ? false
    : status => {
      if (status) {
        socket.emit('user_typing_send', {
          visitor: currentVisitor
        })
      } else {
        socket.emit('user_stop_typing_send', {
          visitor: currentVisitor
        })
      }
    }

  useEffect(() => {
    if (displayedChat) {
      if (staffPanelChats[currentVisitor] && staffPanelChats[currentVisitor].length) {
        setLastSeenMessageId(
          displayedChat.visitor.id,
          displayedChat.contents.slice(-1)[0].id,
        );
      }
    }
  }, [currentVisitor]);
  // useEffect(() => {
  //   if (
  //     currentSupervisorPanelVisitor &&
  //     supervisorPanelChats[currentSupervisorPanelVisitor.id] &&
  //     supervisorPanelChats[currentSupervisorPanelVisitor.id].contents.length
  //   ) {
  //     const id = supervisorPanelChats[
  //       currentSupervisorPanelVisitor.id
  //     ].contents.slice(-1)[0].id;
  //     if (id) {
  //       setLastSeenMessageId(currentSupervisorPanelVisitor.id, id, true);
  //     }
  //   }
  // });
  const claimChat =
    !socket
      ? false
      : chat => {
        socket.emit('staff_join', { visitor: chat.visitor.id }, (res, err) => {
          if (res) {
            addActiveChat(
              chat
            );
            removeFlaggedChat(chat.visitor.id);
            removeUnclaimedChatByVisitorId(chat.visitor.id);
            removeOfflineUnclaimedChat(chat.visitor.id);
          } else {
            showError({
              title: 'Failed to join chat',
              description: err,
            });
          }
        });
      };

  const leaveChat = !socket
    ? false
    : room => {
      socket.emit('staff_leave_room', { visitor: currentVisitor }, (res, err) => {
        if (res) {
          removeActiveChat({ id: currentVisitor });
          showSuccess({
            title: 'Left room successfully!',
            description: '',
          });
        } else {
          showError({
            title: 'Failed to leave room',
            description: err,
          })
        }
      });
    };

  const flagChat = !socket
    ? false
    : (severity, msg) => {
      socket.emit(
        'change_chat_priority',
        { severity_level: severity, visitor: currentVisitor, flag_message: msg },
        (res, err) => {
          if (res) {
            changeChatPriority(currentVisitor, severity);
            showSuccess({
              title: `${severity ? 'Flagg' : 'Unflagg'}ed chat successfully`,
              description: '',
            });
          } else {
            showError({
              title: `Failed to ${severity ? 'flag' : 'unflag'} chat`,
              description: err,
            });
          }
        },
      );
    };
  const takeoverChat = !socket
    ? false
    : chat => {
      socket.emit(
        'take_over_chat',
        { visitor: chat.visitor.id },
        (res, err) => {
          if (res) {
            removeFlaggedChat(chat.visitor.id);
            addActiveChat(chat);
            setVisitorTalkingTo(chat.visitor.id, user.user);
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
  useEffect(() => {
    if (socket) {
      socket.off('visitor_leave_queue');
      socket.on('visitor_leave_queue', data => {
        console.log('visitor_leave_queue')
        if (activeChats.find(chat => chat.visitor.id == data.visitor.id)) {
          removeActiveChat(data.visitor);
          showError({
            title: `${data.visitor.name} has left.`,
            description: '',
          });
        }
        removeUnclaimedChatByVisitorId(data.visitor.id)
      });
    }
  }, [activeChats, socket]);

  const [mode, setMode] = useState(0);
  let queue = unclaimedChats.concat(offlineUnclaimedChats);
  if (user.user.role_id < 3) {
    queue = flaggedChats.filter(chat => onlineVisitors.find(visitor => visitor.id == chat.visitor.id && visitor.staff && visitor.staff.role_id > user.user.role_id)).concat(queue)
  } else {
    queue = queue.filter(chat => !chat.visitor.severity_level);
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '0.5rem',
          display: 'inline-block',
          zIndex: 1,
          left: '50%',
        }}
      >
        <div
          style={{ maxWidth: '100px', textAlign: 'center', margin: '0 auto' }}
        >
          <img
            style={{
              width: '75%',
              height: '75%',
              display: 'inline-block',
              left: '-50%',
              backgroundSize: '100% 100%',
              marginTop: '0.35rem',
            }}
            src={LogoImage}
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
        className='staff-main-header'
        style={{ background: '#0EAFA7', width: '100%' }}
        extra={[
          <Dropdown
            key='Notifications'
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
              style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'white' }}
              type="bell"
            />
          </Dropdown>,
          <Drawer
            drawerStyle={{
              background: '#EAF7F6'
            }}
            visible={drawerVisible}
            onClose={() => setDrawerVisible(false)}
            placement='right'
            closable={false}
          >
            <Menu
              style={{background: '#EAF7F6'}}
            >
              <Menu.Item onClick={() => {
                setMode(0);
                setDrawerVisible(false);
              }}>
                <Icon type="home" style={{marginLeft: '2rem'}}/>
                <b>Homepage</b>
              </Menu.Item>
              <Menu.Item onClick={() => {
                setMode(2);
                setDrawerVisible(false);
              }}>
                <Icon type="user-add" style={{marginLeft: '2rem'}}/>
                <b>Manage Users</b>
              </Menu.Item>
              <Menu.Item onClick={() => {
                setMode(3);
                setDrawerVisible(false);
              }}>
                <Icon type="edit" style={{marginLeft: '2rem'}}/>
                <b>Admin Toggles</b>
              </Menu.Item>
              <div style={{ background: '#d3d3d3', height: '0.1rem', marginTop: '1rem', marginLeft: '2.3rem', width: '70%', }} />
              <Menu.Item style={{marginTop: '1rem'}} onClick={() => setShowSettings(true)}>
                <Icon type="user" style={{marginLeft: '2rem'}}/>
                <b>My Profile</b>
              </Menu.Item>
            {/*  <Menu.Item>
                <Button type='link'></Button>
                <Icon type="setting" />
                <b>Settings</b>
            </Menu.Item> */}
              <Menu.Item onClick={() => showLogOut(logOut)}>
                <Icon type="logout" style={{marginLeft: '2rem'}}/>
                <b>Log out</b>
              </Menu.Item>
            </Menu>
          </Drawer>,
          <Icon
            style={{
              fontSize: '1.5rem',
              cursor: 'pointer',
              marginLeft: '2rem',
              marginTop: '0.25rem',
              color: 'white',
            }}
            onClick={() => setDrawerVisible(true)}
            type="menu"
          />,
        ]}
      />
      {mode == 0 && user.user.role_id == 3 && (
        <div>
          <Row type="flex" style={{ minWidth: '600px', height: '100%' }}>
            <Col xs={12} md={10} lg={7}>
              <Spin spinning={!isConnected}>
                <Tabs type="card" defaultActiveKey="1">
                  <Tabs.TabPane
                    tab={<>Unhandled Chats <Badge count={activeChats.filter(chat => chat.visitor.unhandled_timestamp).length} /> </>}
                    key="1"
                  >
                    <ActiveChatList
                      activeChats={activeChats}
                      onClickRoom={setCurrentVisitor}
                      getContents={chat => staffPanelChats[chat.visitor.id] ? staffPanelChats[chat.visitor.id].contents : []}
                      getUnreadCount={room => unreadCount[room.visitor.id]}
                      onlineVisitors={onlineVisitors}
                      isChosen={chat => chat.visitor.id == currentVisitor}
                      getStaffsHandlingVisitor={chat => staffsHandlingVisitor[chat.visitor.id]}
                    />
                  </Tabs.TabPane>
                  {settings.allow_claim_chats && <Tabs.TabPane
                    tab={`Queue (${queue.length})`}
                    key="2"
                  >
                    <PendingChats
                      getContents={chat => staffPanelChats[chat.visitor.id] ? staffPanelChats[chat.visitor.id].contents : []}
                      inactiveChats={queue}
                      onClickRoom={setCurrentVisitor}
                      onlineVisitors={onlineVisitors}
                      isChosen={chat => chat.visitor.id == currentVisitor}
                    />
                  </Tabs.TabPane>}
                </Tabs>
              </Spin>
            </Col>
            <Divider type='vertical' style={{ height: 'calc(100vh - 100px)' }} />
            <Col style={{ flexGrow: 1 }}>
              {displayedChat && (
                <Chat
                  onSendMsg={matchingActiveChats.length ? msg => sendMsg(msg, currentVisitor) : false}
                  onLeave={() => leaveChat(displayedChat.visitor.id)}
                  messages={staffPanelChats[displayedChat.visitor.id] ? staffPanelChats[displayedChat.visitor.id].contents : []}
                  user={user.user}
                  visitor={displayedChat.visitor}
                  isVisitorOnline={onlineVisitors.find(visitor => visitor.id == currentVisitor)}
                  onClaimChat={
                    claimChat && matchingActiveChats.length == 0 ? () => claimChat(displayedChat) : false
                  }
                  onShowHistory={
                    staffPanelChats[displayedChat.visitor.id] &&
                      staffPanelChats[displayedChat.visitor.id].loadedHistory &&
                      staffPanelChats[displayedChat.visitor.id].loadedHistory.length > 0
                      ? () => {
                        showHistoryForStaffPanel(displayedChat.visitor.id);
                        loadChatHistory(
                          displayedChat.visitor,
                          staffPanelChats[displayedChat.visitor.id].loadedHistory[0].id,
                        );
                      }
                      : false
                  }
                  isLoading={!isConnected || !staffPanelChats[displayedChat.visitor.id]}
                  onFlag={
                    (!displayedChat.visitor.severity_level && user.user.role_id == 3)
                      ? (msg) => flagChat(1, msg)
                      : false
                  }
                  onUnflag={
                    (displayedChat.visitor.severity_level && user.user.role_id < 3)
                      ? () => flagChat(0)
                      : false
                  }
                  onTakeoverChat={
                    onlineVisitors.find(visitor => displayedChat.visitor.id == visitor.id && visitor.staff && visitor.staff.role_id > user.user.role_id)
                      ? () => takeoverChat(displayedChat)
                      : false
                  }
                  volunteers={allVolunteers}
                  sendTyping={sendTyping}
                  lastTypingTime={visitorTypingStatus[currentVisitor]}
                  currentStaffs={staffsHandlingVisitor[currentVisitor]}
                />
              )}
            </Col>
          </Row>
        </div>
      )}
      {mode == 0 && user.user.role_id < 3 && <div style={{ minWidth: '1000px', }}>
        <Row type="flex" style={{ minWidth: '100%' }}>
          <Col xs={12} md={10} lg={7}>
            <SupervisingChats
              getStaffsHandlingVisitor={chat => staffsHandlingVisitor[chat.id]}
              onClickVisitor={visitor => {
                if (!supervisorPanelChats[visitor.id]) {
                  loadLastUnread(visitor);
                }
                setCurrentSupervisorPanelVisitor(visitor);
              }}
              unreadVisitors={unreadChats}
              allUnhandledChats={allUnhandledChats}
              allVisitors={allVisitors}
              flaggedChats={flaggedChats}
              onReloadUnread={loadUnreadChats}
              loadMoreInAllTab={() => allVisitors.length ? loadAllVisitors(allVisitors.slice(-1)[0].id) : false}
              bookmarkedVisitors={bookmarkedChats}
              loadMoreInBookmarkedTab={() => bookmarkedChats.length ? loadBookmarkedChats(bookmarkedChats.slice(-1)[0].id) : false}
              setVisitorBookmark={setVisitorBookmark}
              ongoingChats={onlineVisitors.filter(onlineVisitor => onlineVisitor.staff)}
              onlineVisitors={onlineVisitors}
            />
          </Col>
          <Col style={{ flexGrow: 1 }}>
            {currentSupervisorPanelVisitor && staffPanelChats[currentSupervisorPanelVisitor.id] &&
              <Chat
                onSendMsg={sendMsgSupervisor}
                onClaimChat={
                  !activeChats.find(x => x.visitor.id == currentSupervisorPanelVisitor.id) ? () => {
                    claimChat({ visitor: currentSupervisorPanelVisitor });
                    loadChatHistory(currentSupervisorPanelVisitor, null, true);
                  } : false
                }
                messages={staffPanelChats[currentSupervisorPanelVisitor.id].contents}
                isLoading={false}
                currentStaffs={staffsHandlingVisitor[currentSupervisorPanelVisitor.id]}
                isVisitorOnline={onlineVisitors.find(visitor => visitor.id == currentSupervisorPanelVisitor.id)}
                onShowHistory={
                  staffPanelChats[currentSupervisorPanelVisitor.id] &&
                    staffPanelChats[currentSupervisorPanelVisitor.id].loadedHistory &&
                    staffPanelChats[currentSupervisorPanelVisitor.id].loadedHistory.length > 0
                    ? () => {
                      showHistoryForStaffPanel(currentSupervisorPanelVisitor.id);
                      loadChatHistory(
                        currentSupervisorPanelVisitor,
                        staffPanelChats[currentSupervisorPanelVisitor.id].loadedHistory[0].id,
                      );
                    }
                    : false
                }
                // onShowNext={
                //   supervisorPanelChats[currentSupervisorPanelVisitor.id].next
                //     ? () => {
                //       if (supervisorPanelChats[currentSupervisorPanelVisitor.id].next.length) {
                //         setLastSeenMessageId(currentSupervisorPanelVisitor.id, supervisorPanelChats[currentSupervisorPanelVisitor.id].next.slice(-1)[0].id);
                //       }
                //       showMessagesAfterForSupervisorPanel(currentSupervisorPanelVisitor.id)
                //       loadMessagesAfterForSupervisorPanel(currentSupervisorPanelVisitor,
                //         supervisorPanelChats[currentSupervisorPanelVisitor.id].next.slice(-1)[0].id)
                //     }
                //     : false
                // }
                // onSkipToEnd={
                //   supervisorPanelChats[currentSupervisorPanelVisitor.id].next
                //     ? () =>
                //       loadMostRecentForSupervisorPanel(currentSupervisorPanelVisitor, true)
                //     : false
                // }
                visitor={currentSupervisorPanelVisitor}
                onTakeoverChat={
                  onlineVisitors.find(visitor => currentSupervisorPanelVisitor.id == visitor.id && visitor.staff && visitor.staff.role_id > user.user.role_id)
                    ? () => takeoverChat({ visitor: currentSupervisorPanelVisitor })
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
          updateUser={updateUser}
        />
      </div>}
      {mode == 3 && <div style={{ minWidth: '600px' }}>
        <AdminToggle setMode={setMode}/>  
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
        onSubmit={(name, email, password) => {
          submitSettings(name, email, password, user.user.id);
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
  offlineUnclaimedChats: makeSelectOfflineUnclaimedChats(),
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
  visitorTypingStatus: makeSelectVisitorTypingStatus(),
  staffsHandlingVisitor: makeSelectStaffsHandlingVisitor(),
  settings: makeSelectSettings(),
  allUnhandledChats: makeSelectAllUnhandledChats(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadAllUnhandledChats: () => dispatch(loadAllUnhandledChats()),
    incrementUnreadCount: visitorId =>
      dispatch(incrementUnreadCount(visitorId)),
    clearUnreadCount: visitorId => dispatch(clearUnreadCount(visitorId)),
    logOut: () => dispatch(staffLogOut()),
    showError: error => dispatch(setError(error)),
    submitSettings: (name, email, password, id) =>
      dispatch(submitSettings(name, email, password, id)),
    updateUser: (name, role, disableFlag, id) =>
      dispatch(updateUser(name, role, disableFlag, id)),
    onStaffInit: () => {
      dispatch(reset());
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
    setLastSeenMessageId: (visitorId, messageId, reload) =>
      dispatch(setLastSeenMessageId(visitorId, messageId, reload)),
    showSuccess: msg => dispatch(setSuccess(msg)),
    setVisitorTalkingTo: (visitorId, user) => dispatch(setVisitorTalkingTo(visitorId, user)),
    addMessageForSupervisorPanel: (visitorId, content) => dispatch(addMessageForSupervisorPanel(visitorId, content)),
    loadUnreadChats: () => dispatch(loadUnreadChats()),
    setFlaggedChats: chats => dispatch(setFlaggedChats(chats)),
    addFlaggedChat: chat => dispatch(addFlaggedChat(chat)),
    setActiveChatUnhandledTime: (visitorId, handled) => dispatch(setActiveChatUnhandledTime(visitorId, handled)),
    removeFlaggedChat: visitorId => dispatch(removeFlaggedChat(visitorId)),
    changeChatPriority: (visitorId, priority) => dispatch(changeChatPriority(visitorId, priority)),
    addMessageForStaffPanel: (visitorId, content) => dispatch(addMessageForStaffPanel(visitorId, content)),
    setMessagesForStaffPanel: (visitorId, contents) => dispatch(setMessagesForStaffPanel(visitorId, contents)),
    showHistoryForStaffPanel: (visitorId) => dispatch(showHistoryForStaffPanel(visitorId)),
    setOfflineUnclaimedChats: chats => dispatch(setOfflineUnclaimedChats(chats)),
    addOfflineUnclaimedChat: chat => dispatch(addOfflineUnclaimedChat(chat)),
    removeOfflineUnclaimedChat: visitorId => dispatch(removeOfflineUnclaimedChat(visitorId)),
    setVisitorTypingStatus: (visitorId, time) => dispatch(setVisitorTypingStatus(visitorId, time)),
    loadUnhandled: () => dispatch(loadUnhandled()),
    loadStaffsHandlingVisitor: visitorId => dispatch(loadStaffsHandlingVisitor(visitorId)),
    loadFlaggedChats: () => dispatch(loadFlaggedChats()),
    loadMostRecentForSupervisorPanel: (visitor, shouldSetLastSeen) => dispatch(loadMostRecentForSupervisorPanel(visitor, shouldSetLastSeen)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(StaffMain);
