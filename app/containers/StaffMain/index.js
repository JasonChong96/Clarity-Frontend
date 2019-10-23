/**
 *
 * StaffMain
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectStaffMain from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  Row,
  Col,
  Input,
  Card,
  Icon,
  Button,
  Tabs,
  PageHeader,
  Menu,
  Dropdown,
} from 'antd';

import './index.css';
import Title from 'antd/lib/typography/Title';
import TextArea from 'antd/lib/input/TextArea';
import PendingChats from '../PendingChats';
import ActiveChatList from '../../components/ActiveChatList';
import socketIOClient from 'socket.io-client';

export function StaffMain() {
  useInjectReducer({ key: 'staffMain', reducer });
  useInjectSaga({ key: 'staffMain', saga });
  const [currentMessage, setCurrentMessage] = useState('');
  function connectSocket() {
    const socket = socketIOClient('localhost:3000');
    socket.on('connect_error', data => console.log(data));
    return socket;
  }
  useEffect(() => {
    const socket = connectSocket();
    return () => socket.close();
  }, []);
  const user = { username: 'me' };

  const messages = [
    {
      from: 'me',
      content: 'Dude',
    },
    {
      from: 'notme',
      content: 'Hey!',
    },
    {
      from: 'notme',
      content: 'You there?',
    },
    {
      from: 'notme',
      content: "Hello, how's it going?",
    },
    {
      from: 'me',
      content: 'Great thanks!',
    },
    {
      from: 'me',
      content: 'How about you?',
    },
  ];

  const activeChats = [
    {
      title: 'Joseph',
      description: 'How about you?',
    },
    {
      title: 'Jonathan',
      description:
        'How about you?How about you?How about you?How about you?How about you?How about you?How about you?',
    },
  ];

  const inactiveChats = [
    {
      title: 'Jason',
      description: 'Pls help',
    },
    {
      title: 'Jane',
      description: 'Pls help I am very depressed etceteraaaaa',
    },
  ];

  const messagesDisplay = [];
  var prev;
  for (var i = 0; i < messages.length; i++) {
    if (!prev || prev != messages[i].from) {
      messagesDisplay.push({ from: messages[i].from, contents: [] });
      prev = messages[i].from;
    }
    messagesDisplay[messagesDisplay.length - 1].contents.push(
      messages[i].content,
    );
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
      />
      <Row type="flex" style={{ minWidth: '600px' }}>
        <Col xs={12} md={10} lg={7}>
          <Tabs type="card" defaultActiveKey="1">
            <Tabs.TabPane tab="Active Chats" key="1">
              <ActiveChatList activeChats={activeChats} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Claim Chats" key="2">
              <PendingChats inactiveChats={inactiveChats} />
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col style={{ flexGrow: 1 }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}
          >
            <Card style={{ width: 'auto', height: '120px' }}>
              <Row justify="end" type="flex">
                <Col style={{ flexGrow: 1 }}>
                  <Title level={4}>Joseph</Title>
                  josephodh@gmail.com
                </Col>
                <Col>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item>Leave Chat</Menu.Item>
                        <Menu.Item style={{ color: 'red' }}>
                          Flag Chat
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <Icon
                      type="more"
                      style={{
                        fontSize: '1.5em',
                        cursor: 'pointer',
                        padding: '1em',
                      }}
                    />
                  </Dropdown>
                </Col>
              </Row>
            </Card>
            <div
              className="chat"
              style={{ width: '100%', flexGrow: 1, display: 'flex' }}
            >
              {messagesDisplay.map(messages => {
                var classes = 'messages';
                if (messages.from == user.username) {
                  classes += ' mine';
                } else {
                  classes += ' yours';
                }
                return (
                  <div className={classes}>
                    {messages.from}
                    {messages.contents.map((content, i) => {
                      var classes = 'message';
                      if (i == messages.contents.length - 1) {
                        classes += ' last';
                      }
                      return <div className={classes}>{content}</div>;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <Row
            style={{ border: 'solid 1px #EEE' }}
            type="flex"
            align="middle"
            justify="space-around"
          >
            <Col span={22}>
              <TextArea
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                placeholder="Write a message..."
                onPressEnter={e => {
                  if (!e.shiftKey) {
                    setCurrentMessage('');
                    // Send message
                    e.preventDefault();
                  }
                }}
              />
            </Col>
            <Col>
              <Button icon="right" type="primary" shape="circle" size="large" />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

StaffMain.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  staffMain: makeSelectStaffMain(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(StaffMain);
