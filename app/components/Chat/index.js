/**
 *
 * Chat
 *
 */

import { Button, Card, Col, Dropdown, Icon, Menu, Row, Spin, Modal, Badge, Divider, List, Radio, Checkbox, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Title from 'antd/lib/typography/Title';
import moment from 'moment';
import React, { memo, useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { send } from 'q';

const TYPING_SEND_DELAY = 2000

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

function showMarkReplied(onMark) {
  Modal.confirm({
    title: 'Are you sure you want to mark this chat as replied?',
    content: 'It will be considered handled.',
    onOk() {
      onMark();
    }
  })
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
  maxStaffs,
  currentStaffs,
  onLeave,
  isVisitor,
  flaggedMessage,
  isVisitorOnline,
  volunteers,
  onSkipToEnd,
  onFlag,
  onUnflag,
  onShowNext,
  onTakeoverChat,
  onReassign,
  showWelcome,
  sendTyping,
  lastTypingTime,
  onMark,
  settings,
}) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [lastMessage, setLastMessage] = useState(null);
  const [chosenStaff, setChosenStaff] = useState([]);
  const [lastSendTyping, setLastSendTyping] = useState(0);
  const [render, rerender] = useState(true);
  const [manageVisible, setManageVisible] = useState(false);
  const [chosenRole, setChosenRole] = useState(3);
  const [flagModalVisible, setFlagModalVisible] = useState(false);
  const [flagMessage, setFlagMessage] = useState('');
  const [filter, setFilter] = useState('');
  const ref = useRef(null);
  const timer = useRef(null);
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
    if (sendTyping) {
      sendTyping(false);
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
  var prevDate;
  for (var i = 0; i < messages.length; i++) {
    let from = messages[i].user;
    let content = { ...messages[i].content };
    if (messages[i].type_id == 0) {
      if (content.content == 'join room') {
        content.content = (from.full_name ? from.full_name : from.name) + ' has joined the room'
      } else {
        content.content =
          (from.full_name ? from.full_name : from.name) + ' ' + content.content;
      }
      from = false;
    }
    if (!prev || !prevDate || !from || prev.email != from.email || moment(content ? new Date(content.timestamp) : null).format('DD MMMM') != prevDate) {
      const curDateMessage = moment(content ? new Date(content.timestamp ? content.timestamp : messages[i].created_at) : null).format('DD MMMM');
      messagesDisplay.push({ from: from, date: curDateMessage, contents: [] });
      prevDate = curDateMessage;
      prev = from;
    }
    messagesDisplay[messagesDisplay.length - 1].contents.push(content);
  }
  useEffect(() => {
    if (lastTypingTime + 10500 - new Date().getTime() > 0) {
      const timeout = setTimeout(() => {
        rerender(val => !val);
      }, lastTypingTime + 10500 - new Date().getTime())
      timer.current = timeout;
      return () => clearTimeout(timeout)
    }
  }, [lastTypingTime])
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
          <Card style={{ width: 'auto', height: '120px', padding: '12px', background: '#FAFAFA' }}>
            <Row type="flex" style={{ alignItems: 'center' }}>
              <Col style={{ flexGrow: 1 }}>
                <Title level={4} style={{ maxWidth: '20rem' }} ellipsis>{visitor.name}
                  <Badge status={isVisitorOnline ? 'success' : 'error'} style={{ paddingLeft: '1rem' }} />
                </Title>
                {visitor.email ? visitor.email : <div style={{ fontStyle: 'italic' }}>Anonymous</div>}
              </Col>
              <Col span={4} style={{ color: '#0EAFA7' }}>
                {currentStaffs && <>Staff Currently Handling Chat: {currentStaffs.map(staff => (staff.full_name + ` (${{ 1: 'A', 2: 'S', 3: 'V' }[staff.role_id]})`)).join(', ')}</>}
              </Col>
              {user.role_id < 3 && <Button
                type='primary'
                style={{ margin: '0 1rem 0 1rem' }}
                onClick={() => {
                  setChosenStaff(currentStaffs);
                  setManageVisible(true);
                }}>
                Manage Chat
                  </Button>}
              {onFlag && <Button
                style={{ background: 'red', color: 'white', borderColor: 'red', margin: '0 1rem 0 1rem' }}
                onClick={() => setFlagModalVisible(true)}
              >
                Flag Chat
                        </Button>}
              {onUnflag && <Button
                style={{ background: 'red', color: 'white', borderColor: 'red', margin: '0 1rem 0 1rem' }}
                onClick={() => showUnflagDialog(onUnflag)}
              >
                Unflag Chat
                        </Button>}
              {visitor.severity_level == 0 && onMark && <Button
                style={{ background: '#F9D835', color: 'black', borderColor: '#F9D835' }}
                onClick={() => showMarkReplied(onMark)}
              >
                Mark as Replied
                        </Button>}
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
                let renderDate = false;
                if (prevDay != messages.date) {
                  prevDay = messages.date
                  renderDate = true;
                }
                if (!messages.from) {
                  return (
                    <>
                      {messages.contents.map(content => {
                        if (content.link) {
                          return <>
                            {renderDate && <div className="system-message" style={{ margin: '0 auto' }}>{prevDay}</div>}
                            <div className="system-message"><a target='_blank' href={content.link}>{content.content}</a></div>
                          </>
                        } else {
                          return <>
                            {renderDate && <div className="system-message" style={{ margin: '0 auto' }}>{prevDay}</div>}
                            <div className="system-message">{content.content}</div>
                          </>
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
                    {renderDate && <div className="system-message" style={{ margin: '0 auto' }}>{prevDay}</div>}
                    <div style={{ color: 'black' }}>
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
                        <>
                          <div className={classes}>
                            {renderText(content.content)}
                          </div>
                          <div className="timestamp">
                            {moment(content ? new Date(content.timestamp) : null)
                              .format('HH:mm')
                              .toString()}
                          </div>
                        </>
                      );
                    })}
                  </div>
                );
              })}
              {lastTypingTime + 10000 > new Date().getTime() && <div className='messages yours'>
                <div className='message last'>
                  <div id="wave">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              </div>}
              {flaggedMessage &&
                <div style={{ padding: '1rem', alignSelf: 'center', borderRadius: '1rem', background: 'rgba(255,101,80,0.30)' }}>
                  <p><b>You have a message from the volunteer who flagged the chat:</b></p>
                  <p>{flaggedMessage}</p>
                </div>
              }
              {onShowNext && (
                <Button
                  shape="round"
                  icon="down-circle"
                  size="large"
                  style={{ minHeight: '3rem', alignSelf: 'center', width: '4em', fontSize: '2em' }}
                  onClick={onShowNext}
                />
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
            <div style={{ margin: '1rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
        {(onTakeoverChat || onClaimChat) && (currentStaffs && !currentStaffs.find(staff => staff.id == user.id)) && <Card>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {onTakeoverChat && <Button type='primary' color='red' onClick={onTakeoverChat}>Takeover chat</Button>}
            {onClaimChat && currentStaffs && !currentStaffs.find(staff => staff.id == user.id) && (
              <Button
                type="primary"
                onClick={onClaimChat}
                disabled={currentStaffs.length >= maxStaffs}
              >
                {currentStaffs.length >= maxStaffs ? "This chat is currently full" : (settings.allow_claiming_chat ? "Claim Chat" : "Join Chat")}
              </Button>
            )}
          </div>
        </Card>}
        {onSendMsg && (
          <Row
            style={{
              border: 'solid 1px #EEE',
              width: '100%',
              flexShrink: 0,
            }}
            type="flex"
            align="middle"
            justify="space-between"
          >
            <Col style={{ flexGrow: 1, marginRight: 16 }}>
              <TextArea
                value={currentMessage}
                onChange={e => {
                  setCurrentMessage(e.target.value)
                  if (sendTyping) {
                    if (e.target.value && e.target.value.length && sendTyping) {
                      if (lastSendTyping + TYPING_SEND_DELAY < new Date().getTime()) {
                        sendTyping(true)
                        setLastSendTyping(new Date().getTime())
                      }
                    } else {
                      sendTyping(false);
                    }
                  }
                }}
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
      <Modal visible={manageVisible} title='Add/Remove Staff from this chat'
        okText='Confirm'
        onOk={() => { onReassign(visitor.id, chosenStaff); setManageVisible(false); }}
        onCancel={() => setManageVisible(false)}>
        {currentStaffs && <p>Staff Currently Handling Chat: {currentStaffs.map(staff => (staff.full_name + ` (${{ 1: 'A', 2: 'S', 3: 'V' }[staff.role_id]})`)).join(', ')} </p>}
        <p style={{ color: 'red', margin: '0.5rem 0 0.5rem 0' }}>New Assignment: {chosenStaff.map(staff => (staff.full_name + ` (${{ 1: 'A', 2: 'S', 3: 'V' }[staff.role_id]})`)).join(', ')}</p>
        <Radio.Group onChange={e => setChosenRole(e.target.value)} value={chosenRole}>
          <Radio value={3}>Volunteer</Radio>
          <Radio value={2}>Supervisor</Radio>
          {user.role_id < 2 && <Radio value={1}>Admin</Radio>}
        </Radio.Group>
        <Input
          style={{ margin: '0.5rem 0 0.5rem 0' }}
          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="Search Name"
          onChange={e => setFilter(e.target.value)}
          value={filter}
          allowClear
        />
        <List
          bordered
          dataSource={volunteers.filter(item => item.role_id == chosenRole && item.full_name.toLowerCase().includes(filter.toLowerCase()))}
          style={{ height: '20rem', overflowY: 'auto' }}
          renderItem={item => <>
            <List.Item>
              <Row gutter={8} style={{ width: '100%' }}>
                <Col span={8}>
                  {item.full_name}
                </Col>
                <Col span={8} style={{ textAlign: 'center', color: '#0EAFA7' }}>
                  {{ 1: 'Admin', 2: 'Supervisor', 3: 'Volunteer' }[item.role_id]}
                </Col>
                <Col span={8}>
                  <Checkbox
                    disabled={!chosenStaff.find(staff => staff.id == item.id) && chosenStaff.length >= maxStaffs}
                    checked={chosenStaff.find(staff => staff.id == item.id)} onChange={() =>
                      setChosenStaff(chosenStaff.find(staff => staff.id == item.id) ? chosenStaff.filter(staff => staff.id != item.id) : [...chosenStaff, item])
                    } />
                </Col>
              </Row>
            </List.Item>
          </>}
        />
      </Modal>
      <Modal
        visible={flagModalVisible}
        title='Would you like to flag this chat to a supervisor?'
        onCancel={() => setFlagModalVisible(false)}
        onOk={() => {
          onFlag(flagMessage)
          setFlagModalVisible(false)
          setFlagMessage('')
        }}
      >
        Please enter your reason for flagging this chat:
        <TextArea rows={3} value={flagMessage} onChange={e => setFlagMessage(e.target.value)} />
      </Modal>
    </div >
  );
}

Chat.defaultProps = {
  volunteers: [],
  lastTypingTime: 0,
}

Chat.propTypes = {};

export default memo(Chat);
