/**
 *
 * SupervisingChats
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { Card, Select, Row, Col, List, Icon, Button, Badge, Radio } from 'antd';
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
      <Radio.Group style={{ width: '100%' }} value={tab} onChange={e => setTab(e.target.value)} style={{ marginBottom: '1rem' }}>
        <Radio value="ongoing">My Chats</Radio>
        <Radio value="unread">Unhandled</Radio>
        <Radio value="bookmarked">Flagged</Radio>
        <Radio value="all">Handled</Radio>
      </Radio.Group>
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
                      <Col span={12}>
                        <Title level={4} ellipsis>
                          {item.name}
                        </Title>
                      </Col>
                      <Col span={12} style={{ textAlign: 'end', fontSize: '0.8rem' }}>
                        <p style={{ color: 'red' }}>Un-replied since <b>2 days ago</b>  </p>
                        <p style={{ color: '#0FAAA2' }}>Handling chat: Sharon  </p>
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
