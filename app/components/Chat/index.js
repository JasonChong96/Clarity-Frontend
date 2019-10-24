/**
 *
 * Chat
 *
 */

import { Button, Card, Col, Dropdown, Icon, Menu, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Title from 'antd/lib/typography/Title';
import React, { memo, useState } from 'react';

function Chat({ user, messages }) {
  const [currentMessage, setCurrentMessage] = useState('');
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
  return <div
    style={{ display: 'flex', flexDirection: 'column', height: '85vh' }}
  >
    <Card style={{ width: 'auto', height: '120px', padding: '12px' }}>
      <Row justify="end" type="flex">
        <Col style={{ flexGrow: 1 }}>
          <Title level={4}>Joseph</Title>
          josephodh@gmail.com
    </Col>
        <Col>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => showLeaveDialog()}>Leave Chat</Menu.Item>
                <Menu.Item style={{ color: 'red' }} onClick={() => showHandoverDialog()}>
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
      <Button style={{ alignSelf: 'center' }} type='primary'>Claim Chat</Button>
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
  </div>;
}

Chat.propTypes = {};

export default memo(Chat);
