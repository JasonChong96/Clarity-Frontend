/**
 *
 * ActiveChatList
 *
 */

import { Avatar, Badge, Card, Col, Icon, Input, Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import TimeAgo from 'react-timeago';
import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function ActiveChatList({ activeChats, onClickRoom, getUnreadCount }) {
  const [filter, setFilter] = useState('');
  return (
    <>
      <Input
        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
        placeholder="Search Name"
        onChange={e => setFilter(e.target.value)}
        value={filter}
        allowClear
      />
      <div style={{ height: '1em' }} />
      {activeChats
        .filter(chat =>
          chat.user.name.toLowerCase().includes(filter.toLowerCase()),
        )
        .sort(
          (a, b) =>
            b.contents.slice(-1)[0].content.timestamp -
            a.contents.slice(-1)[0].content.timestamp,
        )
        .map(item => (
          <Card.Grid
            className="chat-button-wrapper"
            style={{ width: '100%', cursor: 'pointer' }}
            onClick={() => onClickRoom(item.room.id)}
          >
            <div
              display="flex"
              style={{ width: '100%' /*opacity: item.online ? 1 : 0.5*/ }}
            >
              <Row type="flex" align="middle">
                <Col span={4}>
                  <Avatar size="large" style={{ backgroundColor: 'purple' }}>
                    {item.user.name.substring(0, 1)}
                  </Avatar>
                </Col>
                <Col span={12}>
                  <Title level={4}>{item.user.name}</Title>
                  <Paragraph ellipsis>
                    {item.contents.slice(-1)[0].content.content}
                  </Paragraph>
                </Col>
                <Col
                  span={8}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                >
                  <TimeAgo
                    date={Number(item.contents.slice(-1)[0].content.timestamp)}
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      paddingBottom: '0.5em',
                    }}
                  />
                  <Badge
                    className="chat-listing-unread-count"
                    style={{ backgroundColor: '#1890ff' }}
                    count={getUnreadCount(item) || 0}
                  />
                </Col>
              </Row>
            </div>
          </Card.Grid>
        ))}
    </>
  );
}

ActiveChatList.propTypes = {};

export default memo(ActiveChatList);
