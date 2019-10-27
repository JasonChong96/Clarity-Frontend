/**
 *
 * Chat
 *
 */

import { Button, Card, Col, Dropdown, Icon, Menu, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Title from 'antd/lib/typography/Title';
import moment from 'moment';
import React, { memo, useState } from 'react';

function Chat({ user, messages, visitor, onClaimChat, onSendMsg }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesDisplay = [];
  function onSend() {
    const msg = currentMessage.trim();
    if (msg.length > 0) {
      onSendMsg({
        content: currentMessage,
        timestamp: new Date().getTime(),
      });
    }
    setCurrentMessage('');
  }
  var prev;
  for (var i = 0; i < messages.length; i++) {
    if (!prev || !messages[i].user || prev.email != messages[i].user.email) {
      messagesDisplay.push({ from: messages[i].user, contents: [] });
      prev = messages[i].user;
    }
    messagesDisplay[messagesDisplay.length - 1].contents.push(
      messages[i].content,
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '85vh',
        minWidth: '274px',
      }}
    >
      {visitor && (
        <Card style={{ width: 'auto', height: '120px', padding: '12px' }}>
          <Row justify="end" type="flex">
            <Col style={{ flexGrow: 1 }}>
              <Title level={4}>{visitor.name}</Title>
              {visitor.email}
            </Col>
            {!onClaimChat && (
              <Col>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={() => showLeaveDialog()}>
                        Leave Chat
                      </Menu.Item>
                      <Menu.Item
                        style={{ color: 'red' }}
                        onClick={() => showHandoverDialog()}
                      >
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
            )}
          </Row>
        </Card>
      )}
      <div
        className="chat"
        style={{ width: '100%', flexGrow: 1, display: 'flex' }}
      >
        {messagesDisplay.map(messages => {
          var classes = 'messages';
          if (!messages.from) {
            return (
              <>
                {messages.contents.map(content => (
                  <div className="system-message">{content.content}</div>
                ))}
              </>
            );
          } else if (messages.from.email == user.email) {
            classes += ' mine';
          } else {
            classes += ' yours';
          }
          return (
            <div className={classes}>
              {messages.from.full_name
                ? messages.from.full_name
                : messages.from.name}
              {messages.contents.map((content, i) => {
                var classes = 'message';
                if (i == messages.contents.length - 1) {
                  classes += ' last';
                }
                return (
                  <div className={classes}>
                    {content.content}
                    <br />
                    <div className="timestamp">
                      {moment(content ? new Date(content.timestamp) : null)
                        .format('HH:MM')
                        .toString()}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        {onClaimChat && (
          <Button
            style={{ alignSelf: 'center' }}
            type="primary"
            onClick={onClaimChat}
          >
            Claim Chat
          </Button>
        )}
      </div>
      {!onClaimChat && onSendMsg && (
        <Row
          style={{
            border: 'solid 1px #EEE',
            position: 'absolute',
            bottom: '0',
            width: '100%',
          }}
          type="flex"
          align="middle"
          justify="space-between"
        >
          <Col style={{ flexGrow: 1, marginRight: 16 }}>
            <TextArea
              value={currentMessage}
              onChange={e => setCurrentMessage(e.target.value)}
              placeholder="Write a message..."
              onPressEnter={e => {
                if (!e.shiftKey) {
                  onSend();
                  e.preventDefault();
                }
              }}
            />
          </Col>
          <Col style={{ paddingRight: 16 }}>
            <Button
              icon="right"
              type="primary"
              shape="circle"
              size="large"
              onClick={onSend}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

Chat.propTypes = {};

export default memo(Chat);
