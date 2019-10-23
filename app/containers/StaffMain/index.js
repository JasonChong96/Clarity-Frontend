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
import { Row, Col, Input, Card, Icon, Button, Tabs, PageHeader, Menu } from 'antd';

import './index.css';
import Title from 'antd/lib/typography/Title';
import TextArea from 'antd/lib/input/TextArea';
import Paragraph from 'antd/lib/typography/Paragraph';
import Text from 'antd/lib/typography/Text';
import PendingChats from '../PendingChats';
import ActiveChatList from '../../components/ActiveChatList';


export function StaffMain() {
  useInjectReducer({ key: 'staffMain', reducer });
  useInjectSaga({ key: 'staffMain', saga });
  const [currentMessage, setCurrentMessage] = useState('');
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  function connectSocket(attempts) {
    if (attempts > 5) {
      return;
    }
    console.log(attempts);
    const ws = new WebSocket('ws://localhost:3000/ws');
    var attemptsCount = attempts;
    ws.onopen = () => {
      console.log('Socket connected');
      //attemptsCount = 0;
    }

    ws.onmessage = evt => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data)
      console.log(message)
    }

    ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
    }

    ws.onerror = e => {
      setTimeout(() => connectSocket(attemptsCount + 1), 1000)
    }

    return () => ws.close();
  }
  useEffect(() => {
    return connectSocket(0);
  }, []);
  const user = { username: 'me' }

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
      content: 'Hello, how\'s it going?',
    },
    {
      from: 'me',
      content: 'Great thanks!',
    },
    {
      from: 'me',
      content: 'How about you?',
    },
  ]

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

  const messagesDisplay = []
  var prev;
  for (var i = 0; i < messages.length; i++) {
    if (!prev || prev != messages[i].from) {
      messagesDisplay.push({ from: messages[i].from, contents: [] });
      prev = messages[i].from;
    }
    messagesDisplay[messagesDisplay.length - 1].contents.push(messages[i].content);
  }
  return (
    <>
      <PageHeader extra={[<Button>Log out</Button>]}>
        {/* <Menu mode='horizontal'><Menu.Item key="mail">
          <Icon type="mail" />
          Navigation One
        </Menu.Item></Menu>  */}
      </PageHeader>
      <Row type="flex" style={{ minWidth: '600px' }}>
        <Col xs={12} md={10} lg={7}>
          <Tabs type='card' defaultActiveKey='1'>
            <Tabs.TabPane tab='Unclaimed' key='1'>
              <PendingChats inactiveChats={inactiveChats} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Active' key='2'>
              <ActiveChatList activeChats={activeChats} />
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col style={{ flexGrow: 1 }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}
          >
            <Card style={{ width: 'auto', height: '120px' }}>
              <Title level={4}>Joseph</Title>
              josephodh@gmail.com
          </Card>
            <div
              className="chat"
              style={{ width: '100%', flexGrow: 1, display: 'flex' }}
            >
              {messagesDisplay.map(messages => {
                var classes = 'messages'
                if (messages.from == user.username) {
                  classes += ' mine'
                } else {
                  classes += ' yours'
                }
                return <div className={classes}>
                  {messages.contents.map((content, i) => {
                    var classes = 'message';
                    if (i == messages.contents.length - 1) {
                      classes += ' last';
                    }
                    return <div className={classes}>{content}</div>
                  })}
                </div>
              })}
            </div>
          </div>
          <Row style={{ border: 'solid 1px #EEE' }} type='flex' align='middle' justify='space-around'>
            <Col span={22}>
              <TextArea value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                placeholder="Write a message..." onPressEnter={e => {
                  if (!e.shiftKey) {
                    setCurrentMessage('')
                    // Send message
                    e.preventDefault();
                  }
                }} />
            </Col>
            <Col>
              <Button icon='right' type='primary' shape='circle' size='large'></Button>
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
