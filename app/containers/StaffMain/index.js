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
  Radio,
  Modal,
  Divider,
  Spin,
} from 'antd';
import makeSelectStaffMain from './selectors';
import reducer from './reducer';
import saga from './saga';

import './index.css';
import Title from 'antd/lib/typography/Title';
import TextArea from 'antd/lib/input/TextArea';
import PendingChats from '../PendingChats';
import ActiveChatList from '../../components/ActiveChatList';
import socketIOClient from 'socket.io-client';
import ManageVolunteers from '../../components/ManageVolunteers';
import Chat from '../../components/Chat';
import { get } from '../../utils/api';
import { registerStaff } from './actions';

export function StaffMain({ registerStaff }) {
  useInjectReducer({ key: 'staffMain', reducer });
  useInjectSaga({ key: 'staffMain', saga });
  function connectSocket() {
    const socket = socketIOClient('localhost:3000', {
      transportOptions: {
        polling: {
          extraHeaders: {
            'HTTP-AUTHORIZATION': 'Bearer ' + localStorage.getItem('access_token'),
          }
        }
      }
    });
    return socket;
  }
  useEffect(() => {
    const socket = connectSocket();
    get('/', console.log, console.log);
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
      visitor: {
        name: 'Joseph',
        email: 'notafakeemail@u.nus.edu',
      },
      description: 'How about you?',
      online: false,
    },
    {
      visitor: {
        name: 'Jonathan',
        email: 'notafakeemail2@gmail.com',
      },
      online: true,
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

  const [mode, setMode] = useState(0);
  const [handoverMessage, setHandoverMessage] = useState('');
  function showHandoverDialog() {
    Modal.confirm({
      title: 'Flag chat to supervisor',
      okText: 'Flag Chat',
      content: (
        <TextArea
          placeholder="Please type your handover message to be shown to the user"
          value={handoverMessage}
          onChange={e => setHandoverMessage(e.target.value)}
        />
      ),
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }
  function showLeaveDialog() {
    Modal.confirm({
      title: 'Are you sure you want to leave the chat?',
      okText: 'Leave Chat',
      content: 'Please ensure that you have informed the user.',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
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
        title={
          <Radio.Group
            defaultValue={0}
            buttonStyle="solid"
            onChange={e => setMode(e.target.value)}
          >
            <Radio.Button value={0}>Chat</Radio.Button>
            <Radio.Button value={1}>Manage</Radio.Button>
          </Radio.Group>
        }
      />
      <div hidden={mode != 0}>
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
            <Chat messages={messages} user={user} visitor={activeChats[0].visitor} />
          </Col>
        </Row>
      </div>
      <div hidden={mode != 1} style={{ minWidth: '600px' }}>
        <ManageVolunteers onRegister={registerStaff} />
      </div>
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
    registerStaff: (name, email, password, role) => dispatch(registerStaff(name, email, password, role)),
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
