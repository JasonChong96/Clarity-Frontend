/**
 *
 * SupervisingChats
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { Card, Select, Row, Col, List, Icon } from 'antd';
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

function SupervisingChats({ onClickVisitor, allVisitors, bookmarkedVisitors, loadMoreInAllTab, setVisitorBookmark }) {
  const [tab, setTab] = useState('ongoing');
  let visitors = allVisitors;
  switch (tab) {
    case 'ongoing':
      visitors = []
      break;
    case 'unread':
      visitors = []
      break;
    case 'bookmarked':
      visitors = bookmarkedVisitors
      break;
  }
  return (
    <Card style={{ display: 'flex', flex: '1', flexDirection: 'column', overflow: 'hidden' }} >
      <Select style={{ width: '100%' }} value={tab} onChange={newTab => setTab(newTab)}>
        <Select.Option value="ongoing">Ongoing Chats</Select.Option>
        <Select.Option value="unread">Unread Chats</Select.Option>
        <Select.Option value="bookmarked">Bookmarked Chats</Select.Option>
        <Select.Option value="all">All Chats</Select.Option>
      </Select>
      <div style={{ overflowY: 'auto', height: '42rem', overflowX: 'hidden' }}>
        <InfiniteScroll
          loadMore={() => loadMoreInAllTab()}
          hasMore={tab == 'all'}
          useWindow={false}
          pageStart={1}
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
                    <Row type="flex">
                      <Col span={14}>
                        <Title level={4}>
                          {item.name}
                        </Title>
                      </Col>
                      <Col span={2}>
                        <Icon type="star" theme={isBookmarked ? "filled" : "outlined"} className='bookmark-button' onClick={e => {
                          setVisitorBookmark(item, !isBookmarked);
                          e.stopPropagation();
                        }} />
                      </Col>
                      {/* <Col span={8}>
                  <TimeAgo
                  date={Number(item.contents.slice(-1)[0].content.timestamp)}
                  style={{ width: '100%' }}
                >
                  10 mins ago
                </TimeAgo>
                </Col> */}
                    </Row>

                  </div>
                </Card.Grid>
              )
            }}
          />
        </InfiniteScroll>
      </div>
    </Card>

  );
}

SupervisingChats.propTypes = {};

export default memo(SupervisingChats);
