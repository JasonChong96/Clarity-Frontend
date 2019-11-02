/**
 *
 * Chat
 *
 */

import { Button, Card, Col, Dropdown, Icon, Menu, Row, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Title from 'antd/lib/typography/Title';
import moment from 'moment';
import React, { memo, useState, useEffect, useRef } from 'react';

function showLeaveChat(onConfirm) {
  Modal.confirm({
    title: 'Are you sure you want to leave this chat?',
    content: 'Please make sure that the volunteer is aware of your reason for leaving.',
    iconType: 'warning',
    onOk() {
      onConfirm();
    },
  });
}

function Chat({
  user,
  messages,
  visitor,
  onClaimChat,
  onSendMsg,
  onShowHistory,
  isLoading,
  onLeave,
}) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [lastMessage, setLastMessage] = useState(null);
  const ref = useRef(null);
  const messagesDisplay = [];
  function onSend() {
    const msg = currentMessage.trim();
    if (msg.length > 0) {
      onSendMsg({
        content: currentMessage,
        timestamp: Date.now(),
      });
    }
    setCurrentMessage('');
  }
  useEffect(() => {
    if (ref) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [lastMessage]);
  if (messages.slice(-1)[0] != lastMessage) {
    setLastMessage(messages.slice(-1)[0]);
  }
  var prev;
  for (var i = 0; i < messages.length; i++) {
    let from = messages[i].user;
    let content = { ...messages[i].content };
    if (messages[i].type_id == 0) {
      content.content =
        (from.full_name ? from.full_name : from.name) + ' ' + content.content;
      from = false;
    }
    if (!prev || !from || prev.email != from.email) {
      messagesDisplay.push({ from: from, contents: [] });
      prev = from;
    }
    messagesDisplay[messagesDisplay.length - 1].contents.push(content);
  }
  return (
    <Spin spinning={isLoading} size="large">
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
                        <Menu.Item onClick={() => showLeaveDialog(onLeave)}>
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
          ref={ref}
        >
          {onShowHistory && (
            <Button
              shape="round"
              icon="up-circle"
              size="large"
              style={{ minHeight: '3em', alignSelf: 'center', width: '10em' }}
              onClick={onShowHistory}
            >
              Show History
            </Button>
          )}
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
                {console.log(messages)}
                <div style={{ color: 'white' }}>
                  {messages.from.full_name
                    ? messages.from.full_name
                    : messages.from.name}
                </div>
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
                          .format('HH:mm')
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
              style={{ minHeight: '3em', alignSelf: 'center', width: '10em' }}
              tyle={{ alignSelf: 'center' }}
              type="primary"
              size="large"
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
              // position: 'fixed',
              // bottom: '0',
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
    </Spin>
  );
}

Chat.propTypes = {};

export default memo(Chat);
