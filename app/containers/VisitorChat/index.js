/**
 *
 * VisitorChat
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectVisitorChat from './selectors';
import reducer from './reducer';
import saga from './saga';
import { PageHeader, Dropdown, Menu, Icon } from 'antd';
import Chat from '../../components/Chat';

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

export function VisitorChat() {
  useInjectReducer({ key: 'visitorChat', reducer });
  useInjectSaga({ key: 'visitorChat', saga });

  return <>
    <PageHeader extra={<Dropdown
      overlay={
        <Menu>
          <Menu.Item style={{
            color: 'red'
          }}>
            <Icon type="exclamation-circle" theme="filled" />
            Leave chat
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
        type="more"
      />
    </Dropdown>
    } />
    < Chat messages={messages} user={user} />
  </>;
}

VisitorChat.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  visitorChat: makeSelectVisitorChat(),
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
)(VisitorChat);
