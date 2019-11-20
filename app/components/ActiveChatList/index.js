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

function ActiveChatList({ activeChats, getStaffsHandlingVisitor, onClickRoom, getUnreadCount, getContents, onlineVisitors, isChosen }) {
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
          chat.visitor.name.toLowerCase().includes(filter.toLowerCase()),
        )
        .sort(
          (a, b) => {
            if (!getContents(a).length) {
              return -1;
            } else if (!getContents(b).length) {
              return 1;
            } else {
              return getContents(b).slice(-1)[0].content.timestamp -
                getContents(a).slice(-1)[0].content.timestamp;
            }
          }
        )
        .map(item => (
          <Card.Grid
            className="chat-button-wrapper"
            style={{ width: '100%', cursor: 'pointer', background: (isChosen(item) ? '#EAEAEA' : 'white'), opacity: (item.visitor.unhandled_timestamp ? 1 : 0.5) }}
            onClick={() => onClickRoom(item.visitor.id)}
          >
            <div
              display="flex"
              style={{ width: '100%', opacity: onlineVisitors.find(visitor => visitor.id == item.visitor.id) ? 1 : 0.7 }}
            >
              <Row type="flex" align="middle">
                <Col span={12}>
                  <Title level={4} ellipsis>{item.visitor.name}</Title>
                  {item.visitor.severity_level > 0 && (
                    <>
                      <Text style={{ color: 'red' }}>
                        <Icon type="warning" theme="twoTone" twoToneColor="red" />{' '}
                        Flagged
                    </Text>
                    </>
                  )}
                </Col>
                <Col span={12} style={{ textAlign: 'end', fontSize: '0.8rem' }}>
                  {item.visitor.unhandled_timestamp > 0 && <p style={{ color: 'red' }}>Un-replied since <b><TimeAgo
                    minPeriod={10}
                    date={item.visitor.unhandled_timestamp} /></b>  </p>}
                  {getStaffsHandlingVisitor(item) && <p style={{ color: '#0FAAA2' }}>Handling chat: {getStaffsHandlingVisitor(item)[0].full_name} </p>}
                  {getStaffsHandlingVisitor(item) && getStaffsHandlingVisitor(item).length > 1 && <p style={{ color: '#0FAAA2' }} >& {getStaffsHandlingVisitor(item).length - 1} others </p>}
                </Col>
              </Row>
            </div>
          </Card.Grid>
        ))
      }
    </>
  );
}

ActiveChatList.propTypes = {};

ActiveChatList.defaultProps = {
  isChosen: () => false,
}

export default memo(ActiveChatList);
