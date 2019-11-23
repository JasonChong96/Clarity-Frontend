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
import { setError, setSuccess, loadNotification, updateNotificationUnread, addNotification } from '../App/actions';
import { makeSelectCurrentUser, makeSelectNotifications, makeSelectSettings, makeSelectNotificationsUnread } from '../App/selectors';
import PendingChats from '../PendingChats';
import { addActiveChat, addMessageForSupervisorPanel, addMessageFromActiveChat, addMessageFromActiveChatByVisitorId, addMessageFromUnclaimedChat, addOnlineUser, addOnlineVisitor, addUnclaimedChat, clearUnreadCount, incrementUnreadCount, loadAllSupervisors, loadAllVisitors, loadAllVolunteers, loadBookmarkedChats, loadChatHistory, loadLastUnread, loadMessagesAfterForSupervisorPanel, loadMessagesBeforeForSupervisorPanel, loadUnreadChats, refreshAuthToken, registerStaff, removeActiveChat, removeActiveChatByRoomId, removeOnlineUser, removeOnlineVisitor, removeUnclaimedChat, removeUnclaimedChatByVisitorId, reset, setLastSeenMessageId, setOnlineUsers, setOnlineVisitors, setUnclaimedChats, setVisitorBookmark, setVisitorTalkingTo, showLoadedMessageHistory, showMessagesAfterForSupervisorPanel, showMessagesBeforeForSupervisorPanel, staffLogOut, submitSettings, updateUser, setFlaggedChats, addFlaggedChat, removeFlaggedChat, changeChatPriority, addMessageForStaffPanel, setMessagesForStaffPanel, showHistoryForStaffPanel, loadMostRecentForSupervisorPanel, setOfflineUnclaimedChats, addOfflineUnclaimedChat, removeOfflineUnclaimedChat, setVisitorTypingStatus, loadUnhandled, loadFlaggedChats, loadStaffsHandlingVisitor, setActiveChatUnhandledTime, loadAllUnhandledChats, setStaffsHandlingVisitor, loadMyHandledChats, removeFromMyHandledChats, addToMyHandledChats, removeFromMyUnhandledChats, addToMyUnhandledChats, addToAllUnhandledChats, removeFromAllUnhandledChats, removeFromAllVisitors, addToAllVisitors, setChatUnread } from './actions';
import { submitGlobalSettings } from '../App/actions';
import './index.css';
import reducer from './reducer';
import saga from './saga';
import { usePageVisibility } from 'react-page-visibility';
import makeSelectStaffMain, { makeSelectActiveChats, makeSelectAllSupervisors, makeSelectAllVisitors, makeSelectAllVolunteers, makeSelectBookmarkedChats, makeSelectOngoingChats, makeSelectOnlineVisitors, makeSelectRegisterStaffClearTrigger, makeSelectRegisterStaffPending, makeSelectSupervisorPanelChats, makeSelectUnclaimedChats, makeSelectUnreadChats, makeSelectUnreadCount, makeSelectFlaggedChats, makeSelectStaffPanelChats, makeSelectOfflineUnclaimedChats, makeSelectVisitorTypingStatus, makeSelectStaffsHandlingVisitor, makeSelectAllUnhandledChats, makeSelectMyUnhandledChats, makeSelectMyHandledChats, makeSelectUnreadStatus } from './selectors';
import LogoImage from 'images/logo.svg';
import { set } from 'react-ga';


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
  loadMyHandledChats,
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
  notificationsUnread,
  updateNotificationUnread,
  unreadCount,
  showSuccess,
  loadAllVolunteers,
  loadAllSupervisors,
  setOnlineUsers,
  setActiveChatUnhandledTime,
  allUnhandledChats,
  addOnlineUser,
  removeOnlineUser,
  addToMyHandledChats,
  addToMyUnhandledChats,
  removeFromMyHandledChats,
  removeFromMyUnhandledChats,
  addToAllUnhandledChats,
  addToAllVisitors,
  removeFromAllVisitors,
  removeFromAllUnhandledChats,
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
  myHandledChats,
  myUnhandledChats,
  loadUnreadChats,
  unreadChats,
  setVisitorBookmark,
  flaggedChats,
  setFlaggedChats,
  addFlaggedChat,
  setStaffsHandlingVisitor,
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
  submitGlobalSettings,
  removeOfflineUnclaimedChat,
  staffsHandlingVisitor,
  loadStaffsHandlingVisitor,
  setChatUnread,
  loadUnhandled,
  unreadStatus,
  loadNotification,
}) {
  useInjectReducer({ key: 'staffMain', reducer });
  useInjectSaga({ key: 'staffMain', saga });
  const [currentVisitor, setCurrentVisitor] = useState(false);
  const [socket, setSocket] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [onlineUserList, setOnlineUserList] = useState([]);
  const [showOnlineList, setShowOnlineList] = useState('none');
  const [onlineListIcon, setOnlineListIcon] = useState('down');
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
      setOnlineUserList(Object.values(onlineUsers));
      setOnlineVisitors(onlineVisitorss);
      // setFlaggedChats(processedFlaggedChats);
      loadFlaggedChats();
      loadAllVisitors();
      loadUnreadChats();
      loadBookmarkedChats();
      loadAllUnhandledChats();
      loadUnhandled();
      loadMyHandledChats();
      loadNotification();
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
      setActiveChatUnhandledTime(data.visitor.id, 0)
      if (currentSupervisorPanelVisitor.id != data.visitor.id && currentVisitor != data.visitor.id) {
        setChatUnread(data.visitor.id, true)
      } else {
        setLastSeenMessageId(data.visitor.id, data.content.id)
      }
    })

    socket.on('append_unclaimed_chats', data => {
      console.log('append_unclaimed_chats')
      data.contents.forEach(content => {
        content.user = content.sender;
        if (!content.user) {
          content.user = data.visitor;
        }
      });
      setMessagesForStaffPanel(data.visitor.id, data.contents);
      addToAllUnhandledChats({ visitor: { ...data.visitor, unhandled_timestamp: new Date().getTime() } });
      setStaffsHandlingVisitor(data.visitor.id, []);
    });
    socket.on('visitor_unclaimed_msg', data => {
      console.log('visitor_unclaimed_msg')
      if (user.user.role_id == 3) {
        addMessageForStaffPanel(data.visitor.id, {
          ...data.content,
          user: data.visitor,
        });
      }
    });
    socket.on('staff_auto_assigned_chat', data => {
      console.log('staff_auto_assigned_chat')
      addActiveChat(data);
      addToMyUnhandledChats(data);
      loadStaffsHandlingVisitor(data.visitor.id);
      loadChatHistory(data.visitor, null, true);
      showSuccess({
        title: 'New Assigned Chat',
        description: `${data.visitor.name} has been assigned to you!`
      })
    })
    socket.on('reconnect_error', error => {
      if (error.description == 401 && user) {
        refreshToken();
        setForceUpdate(x => !x);
      }
    });
    socket.on('reconnect', () => {
      setIsConnected(true);
    });
    // socket.on('visitor_leave_queue', data => {
    //   console.log('visitor_leave_queue')
    //   if (activeChats.find(chat => chat.visitor.id == data.visitor.id)) {
    //     removeActiveChat(data.visitor);
    //     showError({
    //       title: `${data.visitor.name} has left.`,
    //       description: '',
    //     });
    //   }
    //   removeUnclaimedChatByVisitorId(data.visitor.id)
    // });

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
    // socket.on('unclaimed_chat_to_offline', data => {
    //   console.log('unclaimed_chat_to_offline')
    //   const chat = unclaimedChats.find(chatt => chatt.visitor.id == data.visitor.id)
    //   if (chat) {
    //     addOfflineUnclaimedChat(chat);
    //     removeUnclaimedChatByVisitorId(data.visitor.id);
    //   }
    // })
    socket.on('visitor_goes_online', data => {
      addOnlineVisitor(data.visitor);
    })

    socket.on('staff_being_removed_from_chat', data => {
      console.log('staff_being_removed_from_chat')
      if (data.staff.id == user.user.id) {
        removeActiveChat(data.visitor);
        removeFromMyUnhandledChats(data.visitor.id)
        removeFromMyHandledChats(data.visitor.id)
        showError({
          title: 'You have been removed from the chat with ' + data.visitor.name
        })
      }
      loadStaffsHandlingVisitor(data.visitor.id)
    })

    socket.on('staff_being_added_to_chat', data => {
      if (data.staff.id == user.user.id) {
        addActiveChat({ visitor: data.visitor });
        if (data.visitor.unhandled_timestamp) {
          addToMyUnhandledChats({ visitor: data.visitor })
        } else {
          addToMyHandledChats({ visitor: data.visitor })
        }
        showSuccess({
          title: data.visitor.name + ' has been assigned to you.',
        })
      }
      loadStaffsHandlingVisitor(data.visitor.id)
    })
    socket.on('visitor_send', data => {
      console.log('visitor_send')
      if (user.user.role_id < 3) {
        return;
      }
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
      if (myHandledChats.find(chat => chat.visitor.id == data.visitor.id)) {
        addToMyUnhandledChats({ visitor: { ...data.visitor, unhandled_timestamp: data.content.created_at } });
        removeFromMyHandledChats(data.visitor.id)
      }
      if (allVisitors.find(chat => chat.visitor.id == data.visitor.id)) {
        removeFromAllVisitors(data.visitor.id)
      }
      if (currentSupervisorPanelVisitor.id != data.visitor.id && currentVisitor != data.visitor.id) {
        setChatUnread(data.visitor.id, true)
      } else {
        setLastSeenMessageId(data.visitor.id, data.content.id)
      }
      setChatUnread(data.visitor.id, true)
    });
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
      loadStaffsHandlingVisitor(data.visitor.id);
    });

    socket.on('visitor_leave_chat_for_supervisor', data => {
      // removeOnlineVisitor(data.visitor.id);
    });
    socket.on('staff_leave_chat_for_supervisor', data => {
      loadStaffsHandlingVisitor(data.visitor.id);
    });

    socket.on('staff_take_over_chat', data => {
      loadStaffsHandlingVisitor(data.visitor.id);
    })

    socket.on('staffs_in_chat_changed', data => {
      loadStaffsHandlingVisitor(data.visitor.id);
    })

    socket.on('chat_has_changed_priority_for_supervisor', data => {
      console.log('chat_has_changed_priority_for_supervisor', data)
      if (data.visitor.severity_level) {
        addFlaggedChat({
          visitor: { ...data.visitor, severity_level: data.visitor.severity_level, flag_message: data.flag_message }
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
  if (allUnhandledChats.length) {
    const matchingUnclaimedChats = allUnhandledChats.filter(
      chat => chat.visitor.id == currentVisitor,
    );
    if (matchingUnclaimedChats.length > 0) {
      displayedChat = matchingUnclaimedChats[0];
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
            setCurrentSupervisorPanelVisitor(curVisitor => {
              if (currentSupervisorPanelVisitor.id == curVisitor.id) {
                return { ...currentSupervisorPanelVisitor, unhandled_timestamp: 0 }
              } else {
                return curVisitor;
              }
            })
            setLastSeenMessageId(currentSupervisorPanelVisitor.id, message.id);
            if (myUnhandledChats.find(chat => chat.visitor.id == currentSupervisorPanelVisitor.id)) {
              removeFromMyUnhandledChats(currentSupervisorPanelVisitor.id)
              addToMyHandledChats({ visitor: { ...currentSupervisorPanelVisitor, unhandled_timestamp: 0 } })
            }
            if (allUnhandledChats.find(chat => chat.visitor.id == currentSupervisorPanelVisitor.id)) {
              removeFromAllUnhandledChats(currentSupervisorPanelVisitor.id)
              addToAllVisitors({ visitor: { ...currentSupervisorPanelVisitor, unhandled_timestamp: 0 } });
            }
          } else {
            console.log(error, message)
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
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.off('staff_send');
    socket.on('staff_send', data => {
      addMessageForStaffPanel(data.visitor.id, {
        ...data.content,
        user: data.staff,
      })
      setActiveChatUnhandledTime(data.visitor.id, 0)
      if (currentSupervisorPanelVisitor.id != data.visitor.id && currentVisitor != data.visitor.id) {
        setChatUnread(data.visitor.id, true)
      } else {
        setLastSeenMessageId(data.visitor.id, data.content.id)
      }
    })
  }, [socket, currentVisitor, currentSupervisorPanelVisitor])

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.off('append_unclaimed_chats')
    socket.on('append_unclaimed_chats', data => {
      console.log('append_unclaimed_chats')
      data.contents.forEach(content => {
        content.user = content.sender;
        if (!content.user) {
          content.user = data.visitor;
        }
      });
      if (!allUnhandledChats.find(chat => chat.visitor.id == data.visitor.id)) {
        setMessagesForStaffPanel(data.visitor.id, data.contents);
        addToAllUnhandledChats({ visitor: { ...data.visitor, unhandled_timestamp: new Date().getTime() } });
        setStaffsHandlingVisitor(data.visitor.id, []);
      } else if (user.user.role_id == 3 && data.contents.length) {
        addMessageForStaffPanel(data.visitor.id, data.contents[0])
      }
    });
    socket.off('new_visitor_msg_for_supervisor')
    socket.off('new_staff_msg_for_supervisor')
    socket.on('new_visitor_msg_for_supervisor', data => {
      addMessageForStaffPanel(data.visitor.id, {
        ...data.content,
        user: data.visitor,
      })
      if (myHandledChats.find(chat => chat.visitor.id == data.visitor.id)) {
        addToMyUnhandledChats({ visitor: { ...data.visitor, unhandled_timestamp: data.content.created_at } });
        removeFromMyHandledChats(data.visitor.id)
      }
      if (allVisitors.find(chat => chat.visitor.id == data.visitor.id)) {
        addToAllUnhandledChats({ visitor: { ...data.visitor, unhandled_timestamp: data.content.created_at } });
        removeFromAllVisitors(data.visitor.id)
      }
    });
    socket.on('new_staff_msg_for_supervisor', data => {
      if (staffPanelChats[data.visitor.id]) {
        addMessageForStaffPanel(data.visitor.id, {
          ...data.content,
          user: data.staff,
        })
      }
      if (myUnhandledChats.find(chat => chat.visitor.id == data.visitor.id)) {
        removeFromMyUnhandledChats(data.visitor.id)
        addToMyHandledChats({ visitor: { ...data.visitor, unhandled_timestamp: 0 } })
      }
      if (allUnhandledChats.find(chat => chat.visitor.id == data.visitor.id)) {
        removeFromAllUnhandledChats(data.visitor.id)
        addToAllVisitors([{ visitor: { ...data.visitor, unhandled_timestamp: 0 } }], true);
      }
    });
    socket.off('visitor_send');
    socket.on('visitor_send', data => {
      console.log('visitor_send')
      if (user.user.role_id < 3) {
        return;
      }
      addMessageForStaffPanel(data.visitor.id, {
        ...data.content,
        user: data.visitor,
      });
      console.log(activeChats.find(chat => chat.visitor.id == data.visitor.id))
      if (!activeChats.find(chat => chat.visitor.id == data.visitor.id)) {
        addActiveChat({ visitor: { ...data.visitor, unhandled_timestamp: data.content.created_at } })
        loadChatHistory(data.visitor, null, true)
      }
      if (activeChats.find(chat => chat.visitor.id == data.visitor.id && !data.visitor.unhandled_timestamp)) {
        setActiveChatUnhandledTime(data.visitor.id, data.content.created_at)
      }
      if (myHandledChats.find(chat => chat.visitor.id == data.visitor.id)) {
        addToMyUnhandledChats({ visitor: { ...data.visitor, unhandled_timestamp: data.content.created_at } });
        removeFromMyHandledChats(data.visitor.id)
      }
      if (allVisitors.find(chat => chat.visitor.id == data.visitor.id)) {
        removeFromAllVisitors(data.visitor.id)
      }
      if (currentSupervisorPanelVisitor.id != data.visitor.id && currentVisitor != data.visitor.id) {
        setChatUnread(data.visitor.id, true)
      } else {
        setLastSeenMessageId(data.visitor.id, data.content.id)
      }
      setChatUnread(data.visitor.id, true)
    });
  }, [allVisitors, myUnhandledChats, allUnhandledChats, myHandledChats, activeChats, currentVisitor, currentSupervisorPanelVisitor, socket]);
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
          console.log(res, err)
          if (res) {
            // addActiveChat(
            //   chat
            // );
            // addToMyUnhandledChats(chat)
            setStaffsHandlingVisitor(chat.visitor.id, staffsHandlingVisitor[chat.visitor.id] ? [...staffsHandlingVisitor[chat.visitor.id], user.user] : [user.user]);
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

  const markChat = !socket
    ? false
    : (visitor) => {
      socket.emit('staff_handled_chat', { visitor: visitor.id }, (success, error) => {
        if (success) {
          if (user.user.role_id < 3) {
            setCurrentSupervisorPanelVisitor(curVisitor => {
              if (visitor.id == curVisitor.id) {
                return { ...visitor, unhandled_timestamp: 0 }
              } else {
                return curVisitor;
              }
            })
          }
          showSuccess({
            title: "Marked as handled!"
          });
          if (activeChats.find(chat => chat.visitor.id == visitor.id)) {
            setActiveChatUnhandledTime(visitor.id, 0)
          }
          if (myUnhandledChats.find(chat => chat.visitor.id == visitor.id)) {
            removeFromMyUnhandledChats(visitor.id)
            addToMyHandledChats({ visitor: { ...visitor, unhandled_timestamp: 0 } })
          }
          if (allUnhandledChats.find(chat => chat.visitor.id == visitor.id)) {
            removeFromAllUnhandledChats(visitor.id)
            addToAllVisitors([{ visitor: { ...visitor, unhandled_timestamp: 0 } }], true);
          }
        } else {
          showError({
            title: "Failed to mark as handled",
            description: error,
          })
        }
      })
    }

  const flagChat = !socket
    ? false
    : (visitor, severity, msg) => {
      socket.emit(
        'change_chat_priority',
        { severity_level: severity, visitor, flag_message: msg },
        (res, err) => {
          if (res) {
            changeChatPriority(visitor, severity);
            if (!severity && user.user.role_id < 3) {
              setCurrentSupervisorPanelVisitor(curVisitor => {
                if (currentSupervisorPanelVisitor.id == curVisitor.id) {
                  return { ...currentSupervisorPanelVisitor, flagged_timestamp: 0, severity_level: 0 }
                } else {
                  return curVisitor;
                }
              })
            }
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

  const reassignChat = !socket
    ? false
    : (visitorId, staffs) => {
      if (!staffs.length) {
        showError({
          title: 'Failed to update staff',
          description: 'Staff list must not be empty'
        })
        return
      }
      socket.emit('update_staffs_in_chat', { visitor: visitorId, staffs: staffs.map(staff => staff.id) }, (success, error) => {
        if (success) {
          setStaffsHandlingVisitor(visitorId, staffs);
          showSuccess({
            title: 'Updated staff successfully!'
          })
        } else {
          showError({
            title: 'Failed to update staff',
            description: error
          })
        }
      })
    }
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
  //userTest is for testing list
  const userTest = ['Travis', 'Ming Sheng', 'John Low', 'Jay Lam', 'Joey Fernandez', "Richard Antonio Carlos", "Ricky", "Nita", "Primo"];
  let queue = allUnhandledChats.filter(chat => (staffsHandlingVisitor[chat.visitor.id] && staffsHandlingVisitor[chat.visitor.id].length == 0));

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '0.5rem',
          display: 'inline-block',
          zIndex: 1,
          left: '46.5%',
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

          <Badge count={notificationsUnread}>
            <Dropdown
              key='Notifications'
              trigger={['click']}
              onClick={() => updateNotificationUnread()}
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
                          {item.content.content}
                        </Row>
                        <Row type="flex" justify="end" align="bottom">
                          <TimeAgo date={item.created_at}
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
                type="bell" />
            </Dropdown>
          </Badge>,
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
              style={{ background: '#EAF7F6' }}
            >
              <Menu.Item onClick={() => {
                setMode(0);
                setDrawerVisible(false);
              }}>
                <Icon type="home" style={{ marginLeft: '2rem' }} />
                <b>Homepage</b>
              </Menu.Item>
              {user.user.role_id && user.user.role_id < 3 && (
                <Menu.Item onClick={() => {
                  setMode(2);
                  setDrawerVisible(false);
                }}>
                  <Icon type="user-add" style={{ marginLeft: '2rem' }} />
                  <b>Manage Users</b>
                </Menu.Item>)}
              {user.user.role_id && user.user.role_id < 2 && (
                <Menu.Item onClick={() => {
                  setMode(3);
                  setDrawerVisible(false);
                }}>
                  <Icon type="edit" style={{ marginLeft: '2rem' }} />
                  <b>Admin Toggles</b>
                </Menu.Item>)}
              <div style={{ background: '#d3d3d3', height: '0.1rem', marginTop: '1.5rem', marginLeft: '2.3rem', width: '70%', }} />
              <Menu.Item style={{ marginTop: '1.5rem' }} onClick={() => setShowSettings(true)}>
                <Icon type="user" style={{ marginLeft: '2rem' }} />
                <b>My Profile</b>
              </Menu.Item>
              {/*  <Menu.Item>
                <Button type='link'></Button>
                <Icon type="setting" />
                <b>Settings</b>
            </Menu.Item> */}
              <Menu.Item onClick={() => showLogOut(logOut)}>
                <Icon type="logout" style={{ marginLeft: '2rem' }} />
                <b>Log out</b>
              </Menu.Item>
              <div style={{ background: '#d3d3d3', height: '0.1rem', marginTop: '1.5rem', marginLeft: '2.3rem', width: '70%', marginBottom: '2.5rem' }} />
            </Menu>
            <b style={{ marginLeft: '3.5rem' }}>Who's Online?</b>
            <br />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '1rem',
            }}>
              <Icon
                type={onlineListIcon}
                onClick={() => {
                  if (onlineListIcon == 'down') {
                    setOnlineListIcon('up');
                    setShowOnlineList('block');
                  } else {
                    setOnlineListIcon('down');
                    setShowOnlineList('none');
                  }
                }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '1rem',
                  display: showOnlineList,
                }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <b>Volunteers: {onlineUserList.filter(user => user['role_id'] == 3).length}</b>
                  <div style={{ background: '#d3d3d3', height: '0.1rem', marginTop: '0.2rem', width: '30%', marginBottom: '0.2rem' }} />
                </div>
                <div
                  style={{
                    marginTop: '1rem',
                    color: '#0EAFA7',
                    marginLeft: '0.5rem',
                    marginBottom: '1rem',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    height: '6rem'
                  }}
                >
                  {/*Only take substring to prevent overflowing out of menu drawer */}
                  {/*userTest is for testing list*/}
                  {/*userTest.map(user => <li><b style={{color:'#707070'}}>{user.substring(0, 15)}<br /></b></li>)*/}
                  {onlineUserList.filter(user => user['role_id'] == 3)
                    .map(user => <li><b style={{ color: '#707070' }}>{user['full_name'].substring(0, 16)}<br /></b></li>)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <b style={{ marginLeft: '0.3rem' }}>Supervisors: {onlineUserList.filter(user => user['role_id'] < 3).length}</b>
                  <div style={{ background: '#d3d3d3', height: '0.1rem', marginTop: '0.2rem', width: '30%', marginBottom: '0.2rem' }} />
                </div>
                <div
                  style={{
                    marginTop: '1rem',
                    color: '#0EAFA7',
                    marginLeft: '0.5rem',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    height: '6rem'
                  }}
                >
                  {/*Only take substring to prevent overflowing out of menu drawer */}
                  {/*userTest is for testing list*/}
                  {/*userTest.map(user => <li><b style={{color:'#707070'}}>{user.substring(0, 15)}<br /></b></li>)*/}
                  {onlineUserList.filter(user => user['role_id'] < 3)
                    .map(user => <li><b style={{ color: '#707070' }}>{user['full_name'].substring(0, 16)}<br /></b></li>)}
                </div>
              </div>
            </div>
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
                      onClickRoom={id => {
                        setCurrentVisitor(id);
                        setChatUnread(id, false);
                        if (staffPanelChats[id]
                          && staffPanelChats[id].contents
                          && staffPanelChats[id].contents.length) {
                          setLastSeenMessageId(id, staffPanelChats[id].contents.slice(-1)[0].id)
                        }
                      }}
                      getContents={chat => staffPanelChats[chat.visitor.id] ? staffPanelChats[chat.visitor.id].contents : []}
                      getUnreadCount={room => unreadCount[room.visitor.id]}
                      onlineVisitors={onlineVisitors}
                      isChosen={chat => chat.visitor.id == currentVisitor}
                      isUnread={chat => unreadStatus[chat.visitor.id]}
                      getStaffsHandlingVisitor={chat => staffsHandlingVisitor[chat.visitor.id]}
                    />
                  </Tabs.TabPane>
                  {settings.allow_claiming_chat && <Tabs.TabPane
                    tab={`Queue (${queue.length})`}
                    key="2"
                  >
                    <PendingChats
                      getContents={chat => staffPanelChats[chat.visitor.id] ? staffPanelChats[chat.visitor.id].contents : []}
                      inactiveChats={queue}
                      onClickRoom={visitor => {
                        setCurrentVisitor(visitor)
                        setChatUnread(visitor, false);
                        setCurrentSupervisorPanelVisitor(visitor);
                        if (staffPanelChats[visitor]
                          && staffPanelChats[visitor].contents
                          && staffPanelChats[visitor].contents.length) {
                          setLastSeenMessageId(visitor, staffPanelChats[visitor].contents.slice(-1)[0].id)
                        }
                      }}
                      onlineVisitors={onlineVisitors}
                      isUnread={chat => unreadStatus[chat.visitor.id]}
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
                  onMark={displayedChat.visitor.unhandled_timestamp > 0 ? () => markChat(displayedChat.visitor) : false}
                  onSendMsg={matchingActiveChats.length ? msg => sendMsg(msg, currentVisitor) : false}
                  onLeave={() => leaveChat(displayedChat.visitor.id)}
                  messages={staffPanelChats[displayedChat.visitor.id] ? staffPanelChats[displayedChat.visitor.id].contents : []}
                  user={user.user}
                  maxStaffs={settings.max_staffs_in_chat}
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
                      ? (msg) => flagChat(currentVisitor, 1, msg)
                      : false
                  }
                  onUnflag={
                    (displayedChat.visitor.severity_level && user.user.role_id < 3)
                      ? () => flagChat(currentVisitor, 0)
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
      {mode == 0 && user.user.role_id < 3 && <div style={{ minWidth: '1200px', }}>
        <Row type="flex" style={{ minWidth: '100%' }}>
          <Col xs={10} md={10} lg={10} style={{ minWidth: '380px', maxWidth: '420px' }}>
            <SupervisingChats
              isClaimChats={settings.allow_claiming_chat != 0}
              myChats={myUnhandledChats.concat(myHandledChats)}
              getStaffsHandlingVisitor={chat => staffsHandlingVisitor[chat.id]}
              onClickVisitor={visitor => {
                setChatUnread(visitor.id, false);
                setCurrentSupervisorPanelVisitor(visitor);
                if (staffPanelChats[visitor.id]
                  && staffPanelChats[visitor.id].contents
                  && staffPanelChats[visitor.id].contents.length) {
                  setLastSeenMessageId(visitor.id, staffPanelChats[visitor.id].contents.slice(-1)[0].id)
                }
              }}
              isUnread={visitor => unreadStatus[visitor.id]}
              isSelected={visitor => visitor.id == currentSupervisorPanelVisitor.id}
              unreadVisitors={unreadChats}
              allUnhandledChats={allUnhandledChats}
              queue={queue}
              allVisitors={allVisitors}
              flaggedChats={flaggedChats}
              onReloadUnread={loadUnreadChats}
              loadMoreInAllTab={() => allVisitors.length ? loadAllVisitors(allVisitors.slice(-1)[0].visitor.id) : false}
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
                onSendMsg={(staffsHandlingVisitor[currentSupervisorPanelVisitor.id] && staffsHandlingVisitor[currentSupervisorPanelVisitor.id].find(x => x.id == user.user.id)) ? sendMsgSupervisor : false}
                flaggedMessage={currentSupervisorPanelVisitor.severity_level != 0 && currentSupervisorPanelVisitor.flag_message}
                onMark={currentSupervisorPanelVisitor.unhandled_timestamp > 0 ? () => markChat(currentSupervisorPanelVisitor) : false}
                maxStaffs={settings.max_staffs_in_chat}
                onClaimChat={
                  (staffsHandlingVisitor[currentSupervisorPanelVisitor.id] && !staffsHandlingVisitor[currentSupervisorPanelVisitor.id].find(x => x.id == user.user.id)) ? () => {
                    claimChat({ visitor: currentSupervisorPanelVisitor });
                  } : false
                }
                volunteers={allVolunteers}
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
                user={user.user}
                onUnflag={
                  (currentSupervisorPanelVisitor.severity_level && user.user.role_id < 3)
                    ? () => flagChat(currentSupervisorPanelVisitor.id, 0)
                    : false
                }
                visitor={currentSupervisorPanelVisitor}
                onReassign={reassignChat}
                onTakeoverChat={
                  (settings.max_staffs_in_chat == 1 && staffsHandlingVisitor[currentSupervisorPanelVisitor.id] && !staffsHandlingVisitor[currentSupervisorPanelVisitor.id].find(x => x.id == user.user.id))
                    ? () => reassignChat(currentSupervisorPanelVisitor.id, [user.user])
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
        <AdminToggle globalSettings={settings} submitGlobalSettings={submitGlobalSettings} />
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
  notificationsUnread: makeSelectNotificationsUnread(),
  flaggedChats: makeSelectFlaggedChats(),
  staffPanelChats: makeSelectStaffPanelChats(),
  visitorTypingStatus: makeSelectVisitorTypingStatus(),
  staffsHandlingVisitor: makeSelectStaffsHandlingVisitor(),
  settings: makeSelectSettings(),
  allUnhandledChats: makeSelectAllUnhandledChats(),
  myUnhandledChats: makeSelectMyUnhandledChats(),
  myHandledChats: makeSelectMyHandledChats(),
  unreadStatus: makeSelectUnreadStatus(),
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
    loadNotification: () => dispatch(loadNotification()),
    updateNotificationUnread: () => dispatch(updateNotificationUnread()),
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
    loadMyHandledChats: () => dispatch(loadMyHandledChats()),
    setStaffsHandlingVisitor: (visitorId, staffs) => dispatch(setStaffsHandlingVisitor(visitorId, staffs)),
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
    submitGlobalSettings: settings => dispatch(submitGlobalSettings(settings)),
    loadUnhandled: () => dispatch(loadUnhandled()),
    loadStaffsHandlingVisitor: visitorId => dispatch(loadStaffsHandlingVisitor(visitorId)),
    loadFlaggedChats: () => dispatch(loadFlaggedChats()),
    addToMyHandledChats: (chat) => dispatch(addToMyHandledChats(chat)),
    addToMyUnhandledChats: (chat) => dispatch(addToMyUnhandledChats(chat)),
    addToAllUnhandledChats: (chat) => dispatch(addToAllUnhandledChats(chat)),
    addToAllVisitors: (chat, addToStart) => dispatch(addToAllVisitors(chat, addToStart)),
    removeFromAllVisitors: (visitorId) => dispatch(removeFromAllVisitors(visitorId)),
    addNotification: (notif) => dispatch(addNotification(notif)),
    removeFromAllUnhandledChats: (visitorId) => dispatch(removeFromAllUnhandledChats(visitorId)),
    removeFromMyUnhandledChats: (visitorId) => dispatch(removeFromMyUnhandledChats(visitorId)),
    removeFromMyHandledChats: (visitorId) => dispatch(removeFromMyHandledChats(visitorId)),
    setChatUnread: (visitorId, isUnread) => dispatch(setChatUnread(visitorId, isUnread)),
    loadMostRecentForSupervisorPanel: (visitor, shouldSetLastSeen) => dispatch(loadMostRecentForSupervisorPanel(visitor, shouldSetLastSeen)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(StaffMain);
