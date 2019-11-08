/**
 *
 * Chat
 *
 */

import { Button, Card, Col, Dropdown, Icon, Menu, Row, Spin, Modal, Badge, Divider } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Title from 'antd/lib/typography/Title';
import moment from 'moment';
import React, { memo, useState, useEffect, useRef } from 'react';
import styles from './index.css';

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

function showHandoverDialog(onFlag) {
  Modal.confirm({
    title: 'Are you sure you want to flag this chat to a supervisor?',
    content: 'A supervisor will take over this chat whenever he/she is available.',
    iconType: 'warning',
    onOk() {
      onFlag();
    },
  });
}

function showUnflagDialog(onUnflag) {
  Modal.confirm({
    title: 'Are you sure you want to unflag this chat?',
    content: '',
    iconType: 'warning',
    onOk() {
      onUnflag();
    },
  });
}

function renderText(text) {
  return text.split('\n').map((item, i) => <p key={i}>{item}</p>)
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
  isVisitor,
  isVisitorOnline,
  onSkipToEnd,
  onFlag,
  onUnflag,
  onShowNext,
  onTakeoverChat,
  showWelcome
}) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [lastMessage, setLastMessage] = useState(null);
  const ref = useRef(null);
  const messagesDisplay = [];
  let prevDay;
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
    <div
      className='chat-component-wrapper'
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isVisitor ? '100%' : '85vh',
        minWidth: '274px',
      }}
    >
      <Spin spinning={isLoading} size="large" className={styles.className}>
        {visitor && (
          <Card style={{ width: 'auto', height: '120px', padding: '12px' }}>
            <Row justify="end" type="flex">
              <Col style={{ flexGrow: 1 }}>
                <Title level={4} style={{ maxWidth: '20rem' }} ellipsis>{visitor.name}
                  <Badge status={isVisitorOnline ? 'success' : 'error'} style={{ paddingLeft: '1rem' }} />
                </Title>
                {visitor.email ? visitor.email : <div style={{ fontStyle: 'italic' }}>Anonymous</div>}
              </Col>
              {!onClaimChat && (
                <Col>
                  {(onLeave || onFlag || onUnflag) && <Dropdown
                    overlay={
                      <Menu>
                        {onLeave && <Menu.Item onClick={() => showLeaveChat(onLeave)}>
                          Leave Chat
                        </Menu.Item>}
                        {onFlag && <Menu.Item
                          style={{ color: 'red' }}
                          onClick={() => showHandoverDialog(onFlag)}
                        >
                          Flag Chat
                        </Menu.Item>}
                        {onUnflag && <Menu.Item
                          style={{ color: 'red' }}
                          onClick={() => showUnflagDialog(onUnflag)}
                        >
                          Unflag Chat
                        </Menu.Item>}
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
                  </Dropdown>}
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
          {!showWelcome &&
            <>
              {onShowHistory && (
                <Button
                  shape="round"
                  icon="up-circle"
                  size="large"
                  style={{ minHeight: '3rem', alignSelf: 'center', width: '4em', fontSize: '2em' }}
                  onClick={onShowHistory}
                />
              )}
              {messagesDisplay.map(messages => {
                var classes = 'messages';
                if (!messages.from) {
                  return (
                    <>
                      {messages.contents.map(content => {
                        if (content.link) {
                          return <div className="system-message"><a target='_blank' href={content.link}>{content.content}</a></div>
                        } else {
                          return <div className="system-message">{content.content}</div>
                        }
                      })}
                    </>
                  );
                } else if ((messages.from.role_id && !isVisitor) || (!messages.from.role_id && isVisitor)) {
                  classes += ' mine';
                } else {
                  classes += ' yours';
                }
                return (
                  <div className={classes}>
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
                      let renderDate = false;
                      const day = moment(content ? new Date(content.timestamp) : null).format('DD MMMM');
                      if (prevDay != day) {
                        prevDay = day
                        renderDate = true;
                      }
                      return (
                        <>
                          {renderDate && <div className="system-message" style={{ margin: '0 auto' }}>{prevDay}</div>}
                          <div className={classes}>
                            {renderText(content.content)}
                            <div className="timestamp">
                              {moment(content ? new Date(content.timestamp) : null)
                                .format('HH:mm')
                                .toString()}
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                );
              })}
              {onShowNext && (
                <Button
                  shape="round"
                  icon="down-circle"
                  size="large"
                  style={{ minHeight: '3rem', alignSelf: 'center', width: '4em', fontSize: '2em' }}
                  onClick={onShowNext}
                />
              )}
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
              {onSkipToEnd && (
                <Button
                  style={{ minHeight: '3em', alignSelf: 'center', width: '10em' }}
                  icon="down-circle"
                  style={{ alignSelf: 'flex-end' }}
                  size="large"
                  onClick={onSkipToEnd}
                >
                  Skip to end
          </Button>
              )}</>}
          {showWelcome && <>
            <div style={{ margin: '1rem', textAlign: 'center', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '24px', color: '#0EAFA7', fontWeight: 'bold' }}>
                <p>Welcome to Ora</p>
                <p>Your Online Emotional Support Service</p>
              </div>
              <div style={{ height: '3px', width: '40%', background: '#0EAFA7', margin: '2rem' }} />
              <div style={{ fontSize: '18px' }}>
                <p>Hi, what brought you here today?</p>
                <p>Type in your feelings and someone will get to you shortly :)</p>
              </div>
            </div>
          </>}
        </div>
        {onTakeoverChat && <Card>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type='primary' color='red' onClick={onTakeoverChat}>Takeover chat</Button>
          </div>
        </Card>}
        {!onClaimChat && onSendMsg && (
          <Row
            style={{
              border: 'solid 1px #EEE',
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
                maxLength={255}
                onPressEnter={e => {
                  if (!e.shiftKey) {
                    onSend();
                    e.preventDefault();
                  }
                }}
                style={{ resize: 'none' }}
                autoSize={{ minRows: 3, maxRows: 3 }}
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
      </Spin>
    </div>
  );
}

Chat.propTypes = {};

export default memo(Chat);
