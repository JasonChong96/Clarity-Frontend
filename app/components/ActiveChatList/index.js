/**
 *
 * ActiveChatList
 *
 */

import React, { memo } from 'react';
import { Input, Icon, Card, Row, Col } from 'antd';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import Paragraph from 'antd/lib/typography/Paragraph';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function ActiveChatList({ activeChats }) {
  return <>
    <Input
      prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
      placeholder="Search Message or Name..."
      onSearch={value => console.log(value)}
      enterButton
    />
    <div style={{ height: '1em' }} />
    {activeChats.map(item => (
      <Card.Grid
        className="chat-button-wrapper"
        style={{ width: '100%', cursor: 'pointer' }}
      >
        <div
          display="flex"
          flexDirection="column"
          style={{ width: '100%' }}
        >
          <Row type="flex">
            <Col span={16}>
              <Title level={4}>{item.title}</Title>
            </Col>
            <Col span={8}>
              <Text style={{ width: '100%' }}>10 mins ago</Text>
            </Col>
          </Row>
          <Paragraph ellipsis>{item.description}</Paragraph>
        </div>
      </Card.Grid>
    ))}
  </>
}

ActiveChatList.propTypes = {};

export default memo(ActiveChatList);
