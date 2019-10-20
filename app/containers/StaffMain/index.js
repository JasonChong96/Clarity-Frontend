/**
 *
 * StaffMain
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectStaffMain from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Row, Col, Input, Card, Icon, Button } from 'antd';

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
  const [currentMessage, setCurrentMessage] = useState('');
  return (
    <Row type="flex" style={{ minWidth: '1366px' }}>
      <Col span={5}>
        <Card style={{ height: '100%', padding: '0px' }}>
          <PendingChats inactiveChats={inactiveChats} />
        </Card>
      </Col>
      <Col span={5}>
        <Card style={{ height: '100%', padding: '0px' }}>
          <ActiveChatList activeChats={activeChats} />
          <Card.Grid style={{ display: 'none' }} />
        </Card>
      </Col>
      <Col span={14}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}
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
        <Row type='flex' align='middle' justify='space-around'>
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
