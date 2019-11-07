/**
 *
 * SupervisingChats
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { Card, Select, Row, Col, List, Icon, Button, Badge } from 'antd';
import Title from 'antd/lib/typography/Title';
import InfiniteScroll from 'react-infinite-scroller';
import './index.css';

const handleInfiniteOnLoad = () => {
  this.fetchData(res => {
    data = data.concat(res.results);
    this.setState({
      data,
      loading: false,
    });
  });
};

function SupervisingChats({ onClickVisitor, onlineVisitors, onReloadUnread, unreadVisitors, allVisitors, ongoingChats, bookmarkedVisitors, loadMoreInAllTab, loadMoreInBookmarkedTab, setVisitorBookmark }) {
  const [tab, setTab] = useState('ongoing');
  let visitors = allVisitors;
  switch (tab) {
    case 'ongoing':
      visitors = ongoingChats
      break;
    case 'unread':
      visitors = unreadVisitors
      break;
    case 'bookmarked':
      visitors = bookmarkedVisitors
      break;
  }
  return (
    <Card style={{ display: 'flex', flex: '1', flexDirection: 'column', overflow: 'hidden', }} >
      <Select style={{ width: '100%' }} value={tab} onChange={newTab => setTab(newTab)}>
        <Select.Option value="ongoing">Ongoing Chats</Select.Option>
        <Select.Option value="unread">Unread Chats</Select.Option>
        <Select.Option value="bookmarked">Bookmarked Chats</Select.Option>
        <Select.Option value="all">All Chats</Select.Option>
      </Select>
      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '80vh', overflowX: 'hidden', alignItems: 'center' }}>

        <InfiniteScroll
          loadMore={() => {
            switch (tab) {
              case 'all':
                loadMoreInAllTab()
                break;
              case 'bookmarked':
                loadMoreInBookmarkedTab()
                break;
            }
          }}
          hasMore={tab == 'all' || tab == 'bookmarked'}
          useWindow={false}
          pageStart={1}
          style={{ width: '100%' }}
        >
          <List
            itemLayout="horizontal"
            dataSource={visitors}
            locale={{
              emptyText: 'No chats yet!'
            }}
            renderItem={item => {
              const isBookmarked = bookmarkedVisitors.filter(visitor => item.id == visitor.id).length
              return (
                <Card.Grid
                  style={{ width: '100%', cursor: 'pointer' }}
                  onClick={() => {
                    onClickVisitor(item);
                  }}
                >
                  <div
                    display="flex"
                    flexDirection="column"
                    style={{ width: '100%', margin: '1em' }}
                  >
                    <Row type="flex" gutter={8}>
                      <Col span={14}>
                        <Title level={4} ellipsis>
                          {item.name}
                        </Title>
                        {item.email ? item.email : <div style={{ fontStyle: 'italic' }}>Anonymous</div>}
                      </Col>
                      <Col span={2}>
                        {onlineVisitors && <Badge status={onlineVisitors.find(visitor => visitor.id == item.id) ? 'success' : 'error'} />}
                      </Col>
                      <Col span={2}>
                        <Icon type="star" theme={isBookmarked ? "filled" : "outlined"} className='bookmark-button' onClick={e => {
                          setVisitorBookmark(item, !isBookmarked);
                          e.stopPropagation();
                        }} />
                      </Col>
                    </Row>

                  </div>
                </Card.Grid>
              )
            }}
          />
        </InfiniteScroll>
        {tab == 'unread' && <Button onClick={() => onReloadUnread()} type='primary' style={{ minHeight: '2rem', margin: '1rem' }}>
          Reload Unread List
          </Button>}
      </div>
    </Card>

  );
}

SupervisingChats.propTypes = {};

export default memo(SupervisingChats);
