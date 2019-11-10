/**
 *
 * VisitorChat
 *
 */

import {
  Col,
  Dropdown,
  Icon,
  Menu,
  Modal,
  PageHeader,
  Row,
  Input,
  Button,
  Divider,
} from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import ReactNotifications from 'react-browser-notifications';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import socketIOClient from 'socket.io-client';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import HeaderImage from 'images/chat_header.svg';
import LogoImage from 'images/logo.svg';
import Chat from '../../components/Chat';
import { makeSelectCurrentUser } from '../App/selectors';
import {
  addChatMessage,
  setFirstMsg,
  setStaffJoined,
  logOut,
  reset,
  convertAnonymousAccount,
  submitSettings,
  loadVisitorChatHistory,
  showVisitorChatHistory,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectVisitorChat, {
  makeSelectChatMessages,
  makeSelectStaffJoined,
  makeSelectFirstMsg,
  makeSelectChatLoadedHistory,
} from './selectors';
import { refreshAuthToken } from '../StaffMain/actions';
import { setError, setSuccess } from '../App/actions';
import ConvertAnonymousModal from '../../components/ConvertAnonymousModal';
import ConvertAnonymousModal2 from '../../components/ConvertAnonymousModal2';
import Logo from '../../components/Logo';
import HeartLineFooter from '../../components/HeartLineFooter';
import SettingsModal from '../../components/SettingsModal';
import { notifyMe } from '../../utils/notifications';

function showNoStaffAnon(showSignUp) {
  Modal.confirm({
    title: 'No volunteers currently available',
    content:
      'Our volunteers are currently still occupied. Since this is taking a little bit longer than we had hoped, would you like to sign up and leave a message? You will be able to log back on from another device next time.',
    okText: 'Sign up',
    onOk() {
      showSignUp();
    },
  });
}

// function showNoStaff() {
//   let secondsToGo = 5 * 60;

//   const timer = setInterval(() => {
//     Modal.confirm({
//       title: 'No volunteers currently available',
//       content:
//         'Our volunteers are currently still occupied. Since this is taking a little bit longer than we had hoped, would you like to come back later? We will let you know as soon as you get a response.',
//       okText: 'Leave Chat',
//       cancelText: 'Wait',
//       onOk(leaveChat) {},
//     });
//   }, 5000 * 60);
//   setTimeout(() => {
//     clearInterval(timer);
//   }, secondsToGo * 1000);
//   {
//     hasStaffJoined && clearInterval(timer);
//   }
// }

function showLoggedOut() {
  Modal.success({
    title: 'Log out successful',
    content:
      'Thank you for chatting with Ora, we hope you had a great conversation and are feeling better :)',
  });
}

function showLogOut(onConfirm) {
  Modal.confirm({
    title: 'Log out',
    content: 'Are you sure you want to log out?',
    onOk() {
      showLoggedOut();
      onConfirm();
    },
  });
}

function showReconnect(onConfirm) {
  Modal.confirm({
    title: 'Welcome Back!',
    content:
      'Your last partner is waiting for you. Would you like to reconnect?',
    cancelText: 'No',
    onOk() {
      onConfirm();
    },
  });
}

function showLeaveChat(onConfirm) {
  Modal.confirm({
    title: 'Are you sure you want to leave this chat?',
    content: 'You may not be taking to the same person the next time you chat',
    iconType: 'warning',
    onOk() {
      onConfirm();
    },
  });
}

function showConnectFailed() {
  Modal.error({
    title: 'Connection failed',
    content: 'Please try again by refreshing the page or logging out.',
  });
}

function showRoomExists() {
  Modal.error({
    title: 'User already connected',
    content: 'Chatting on the same account on two tabs is not allowed.',
  });
}

export function VisitorChat({
  isFirstMsg,
  hasStaffJoined,
  setHasStaffJoined,
  submitSettings,
  loadChatHistory,
  showChatHistory,
  loadedHistory,
  showSuccess,
  setIsFirstMsg,
  user,
  messages,
  addChatMessage,
  refreshToken,
  logOut,
  reset,
  showError,
  convertAnonymousAccount,
}) {
  useInjectReducer({ key: 'visitorChat', reducer });
  useInjectSaga({ key: 'visitorChat', saga });
  const [socket, setSocket] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignUpForLogOut, setShowSignUpForLogOut] = useState(false);
  const [focused, setFocused] = useState(true);
  const timer = useRef(null);
  useEffect(() => {
    if (user.user && user.user.is_anonymous) {
      timer.current = setTimeout(() => showNoStaffAnon(() => setShowSignUp(true)), 5 * 60000)
    } else if (user.user) {

    }
    return () => {
      clearTimeout(timer.current)
    }
  }, [])
  // User has switched back to the tab
  const onFocus = () => {
    setFocused(true)
  };

  // User has switched away from the tab (AKA tab is hidden)
  const onBlur = () => {
    setFocused(false)
  };
  useEffect(() => {
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    // Specify how to clean up after this effect:
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []
  );
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.off('staff_send');
    socket.on('staff_send', data => {
      addChatMessage({
        ...data.content,
        user: data.staff,
      });
      if (!focused) {
        notifyMe('New Message from Ora!');
      }
    });
  }, [focused])
  function connectSocket() {
    const socket = socketIOClient('https://api.chatwithora.com', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      },
      reconnectionDelay: 5000,
      reconnectionAttempts: 10,
      transports: ['polling'],
    });
    socket.on('connect', () => {
      reset();
      loadChatHistory(null, user.user, true);
      console.log('Connected');
    });
    socket.on('visitor_init', data => {
      console.log('visitor_init');
      if (data.staff) {
        showSuccess({
          title: `Same Volunteer!`,
          description: `You are still talking to ${data.staff.full_name}`,
        });
        // showReconnect();
        setIsFirstMsg(false);
        setHasStaffJoined(true);
      } else {
        addChatMessage({
          content: {
            content:
              'Hi there, type in how you feel and someone will get to you shortly :)',
          },
        });
      }
      addChatMessage({
        content: {
          content:
            'As this is a pilot test, we would appreciate it if you could leave feedback for us through the following link:',
        },
      });
      addChatMessage({
        content: {
          link:
            'https://docs.google.com/forms/d/e/1FAIpQLSc_lS3dW5Mq2kZzJqstGaXSzWkTjFc6NbX_ieGg4_KCMBe6OQ/viewform',
          content: 'Feedback Form',
        },
      });
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      // socket.emit('disconnect_request');
      console.log('disconnected');
      setIsConnected(false);
      setIsFirstMsg(true);
      setHasStaffJoined(false);
      addChatMessage({
        content: { content: 'Your connection has been reset' },
      });
      addChatMessage({
        content: {
          content: 'You may send another message to talk to another volunteer!',
        },
      });
    });
    socket.on('staff_join_room', data => {
      setHasStaffJoined(true);
      clearTimeout(timer.current);
      addChatMessage({
        content: { content: `${data.staff.full_name} has joined the chat!` },
      });
    });
    socket.on('staff_leave', data => {
      setIsFirstMsg(true);
      setHasStaffJoined(false);
      addChatMessage({
        content: { content: `${data.staff.full_name} has left the chat.` },
      });
      addChatMessage({
        content: {
          content: 'You may send another message to talk to another volunteer!',
        },
      });
    });
    socket.on('reconnect_error', error => {
      if (error.description == 401 && user) {
        refreshToken();
        setForceUpdate(x => !x);
      }
    });
    socket.on('reconnect', () => {
      reset();
      setIsConnected(true);
    });
    socket.on('reconnect_failed', () => {
      showConnectFailed();
    });
    socket.on('visitor_room_exists', () => {
      showRoomExists();
      setIsConnected(false);
    });
    socket.on('staff_being_taken_over_chat', data => {
      addChatMessage({
        content: {
          content: `${data.staff.full_name} (${
            data.staff.role_id == 2 ? 'Supervisor' : 'Admin'
            }) has taken over the chat.`,
        },
      });
    });
    return socket;
  }
  const sendMsg = !socket
    ? false
    : msg => {
      setIsFirstMsg(false);
      socket.emit(
        isFirstMsg
          ? 'visitor_first_msg'
          : hasStaffJoined
            ? 'visitor_msg'
            : 'visitor_msg_unclaimed',
        msg,
        (res, err) => {
          if (res) {
            addChatMessage({ user: user.user, content: msg });
          } else {
            showError({
              title: 'Failed to send a message',
              description: err,
            });
          }
        },
      );
    };
  const leaveChat = !socket
    ? false
    : () => {
      socket.emit('visitor_leave_room', (res, err) => {
        if (res) {
          setIsFirstMsg(true);
          setHasStaffJoined(false);
          addChatMessage({
            content: { content: 'You have successfully left the chat.' },
          });
          addChatMessage({
            content: {
              content:
                'You may send another message to talk to another volunteer!',
            },
          });
        } else {
          showError({
            title: 'Failed to leave chat',
            description: err,
          });
        }
      });
    };
  useEffect(() => {
    const socket = connectSocket();
    setSocket(socket);
    setIsFirstMsg(true);
    setHasStaffJoined(false);

    window.onbeforeunload = function () {
      return 'Are you sure you want to leave? All chats will be gone if you do not have an account.';
    };
    return () => {
      socket.close();
    };
  }, [forceUpdate]);
  const messagesWithSender = messages.filter(message => message.user);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '1rem',
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
      <Row
        type="flex"
        align="middle"
        justify="center"
        style={{ width: '100%', height: '100%' }}
      >
        <Col
          xs={24}
          md={16}
          lg={12}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <PageHeader
            style={{ backgroundColor: 'rgba(0,0,0,0)', zIndex: 2 }}
            extra={
              <Dropdown
                overlay={
                  <Menu>
                    {hasStaffJoined && (
                      <Menu.Item
                        style={{
                          color: 'red',
                        }}
                        onClick={() => showLeaveChat(leaveChat)}
                      >
                        <Icon type="exclamation-circle" theme="filled" /> Leave
                        chat
                      </Menu.Item>
                    )}
                    <Menu.Item
                      onClick={() =>
                        user.user.is_anonymous
                          ? setShowSignUp(true)
                          : setShowSettings(true)
                      }
                    >
                      <Icon type="setting" />
                      {user.user.is_anonymous ? ' Sign Up' : 'Settings'}
                    </Menu.Item>
                    <Menu.Item
                      onClick={() =>
                        user.user.is_anonymous
                          ? setShowSignUpForLogOut(true)
                          : showLogOut(logOut)
                      }
                    >
                      <Icon type="logout" /> Log out
                    </Menu.Item>
                  </Menu>
                }
              >
                <Icon
                  style={{
                    fontSize: '2em',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: '#0EAFA7',
                    padding: '0 0.5em 0.5em 0.5em',
                  }}
                  type="more"
                />
              </Dropdown>
            }
          />
          <Chat
            messages={messages}
            user={user.user}
            onSendMsg={sendMsg}
            isLoading={!isConnected}
            isVisitor
            onShowHistory={
              loadedHistory && loadedHistory.length > 0
                ? () => {
                  showChatHistory();
                  loadChatHistory(loadedHistory[0].id, user.user);
                }
                : false
            }
            showWelcome={!messagesWithSender.length}
          />
        </Col>
      </Row>
      <ConvertAnonymousModal
        visible={showSignUp}
        onCancel={() => setShowSignUp(false)}
        onCreate={(email, password) => {
          convertAnonymousAccount(user.user.id, email, password);
          setShowSignUp(false);
          clearTimeout(timer.current)
        }}
      />
      <ConvertAnonymousModal2
        visible={showSignUpForLogOut}
        cancelText="Cancel"
        onCancel={() => {
          setShowSignUpForLogOut(false);
        }}
        okText="No thanks, just log me out"
        onOk={() => {
          setShowSignUpForLogOut(false);
          showLoggedOut();
          logOut();
        }}
        onCreate={(email, password) => {
          convertAnonymousAccount(user.user.id, email, password);
          clearTimeout(timer.current)
          setShowSignUp(false);
        }}
      />
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

VisitorChat.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  visitorChat: makeSelectVisitorChat(),
  user: makeSelectCurrentUser(),
  messages: makeSelectChatMessages(),
  hasStaffJoined: makeSelectStaffJoined(),
  isFirstMsg: makeSelectFirstMsg(),
  loadedHistory: makeSelectChatLoadedHistory(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    convertAnonymousAccount: (id, email, password) =>
      dispatch(convertAnonymousAccount(id, email, password)),
    addChatMessage: message => dispatch(addChatMessage(message)),
    setIsFirstMsg: firstMsg => dispatch(setFirstMsg(firstMsg)),
    setHasStaffJoined: staffJoined => dispatch(setStaffJoined(staffJoined)),
    refreshToken: () => dispatch(refreshAuthToken(false)),
    logOut: () => dispatch(logOut()),
    reset: () => dispatch(reset()),
    showError: error => dispatch(setError(error)),
    showSuccess: success => dispatch(setSuccess(success)),
    submitSettings: (name, password, id) =>
      dispatch(submitSettings(name, password, id)),
    loadChatHistory: (lastMsgId, visitor, repeat) =>
      dispatch(loadVisitorChatHistory(lastMsgId, visitor, repeat)),
    showChatHistory: () => dispatch(showVisitorChatHistory()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(VisitorChat);
