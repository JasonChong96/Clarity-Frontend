/**
 *
 * ActiveChatList
 *
 */

import React, { memo, useState } from 'react';
import { Input, Icon, Card, Row, Col, Badge, Modal, Avatar } from 'antd';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import Paragraph from 'antd/lib/typography/Paragraph';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function ActiveChatList({ activeChats }) {
  const [filter, setFilter] = useState('');
  return <>
    <Input
      prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
      placeholder="Search Name"
      onChange={e => setFilter(e.target.value)}
      value={filter}
      allowClear
    />
    <div style={{ height: '1em' }} />
    {activeChats.filter(chat => chat.title.toLowerCase().includes(filter.toLowerCase()))
      .map(item => (
        <Card.Grid
          className="chat-button-wrapper"
          style={{ width: '100%', cursor: 'pointer' }}
        >
          <div
            display="flex"
            flexDirection="column"
            style={{ width: '100%', opacity: item.online ? 1 : 0.5 }}
          >
            <Row type="flex" align='middle'>
              <Col span={4}>
                <Avatar size='large' style={{ backgroundColor: 'purple' }}>{item.title.substring(0, 1)}</Avatar>
              </Col>
              <Col span={12}>
                <Title level={4}>{item.title}</Title>
                <Paragraph ellipsis>{item.description}</Paragraph>
              </Col>
              <Col span={8} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                <Text style={{ width: '100%', textAlign: 'center', paddingBottom: '0.5em' }}>10 mins ago</Text>
                <Badge className='chat-listing-unread-count' style={{ backgroundColor: '#1890ff' }} count={1} />
              </Col>
            </Row>
          </div>
        </Card.Grid>
      ))}
  </>
}

ActiveChatList.propTypes = {};

export default memo(ActiveChatList);
