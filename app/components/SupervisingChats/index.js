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
import TimeAgo from 'react-timeago';
import Text from 'antd/lib/typography/Text';

const handleInfiniteOnLoad = () => {
  this.fetchData(res => {
    data = data.concat(res.results);
    this.setState({
      data,
      loading: false,
    });
  });
};

function SupervisingChats({ onClickVisitor, allUnhandledChats, getStaffsHandlingVisitor, onlineVisitors, onReloadUnread, unreadVisitors, allVisitors, ongoingChats, flaggedChats, loadMoreInAllTab, loadMoreInBookmarkedTab, setVisitorBookmark }) {
  const [tab, setTab] = useState('ongoing');
  let visitors = allVisitors;
  let getTimestamp;
  switch (tab) {
    case 'flagged':
      getTimestamp = visitor => visitor.flagged_timestamp;
      break;
    default:
      getTimestamp = visitor => visitor.unhandled_timestamp;
      break;
  }
  switch (tab) {
    case 'ongoing':
      visitors = ongoingChats
      break;
    case 'unhandled':
      visitors = allUnhandledChats.map(chat => chat.visitor)
      break;
    case 'flagged':
      visitors = flaggedChats.map(chat => chat.visitor)
      break;
  }
  return (
    <Card style={{ display: 'flex', flex: '1', flexDirection: 'column', overflow: 'hidden', }} >
      <Radio.Group style={{ width: '100%' }} value={tab} onChange={e => setTab(e.target.value)} style={{ marginBottom: '1rem' }}>
        <Radio value="ongoing">My Chats</Radio>
        <Radio value="unhandled">Unhandled</Radio>
        <Radio value="flagged">Flagged</Radio>
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
                        <Title level={4} ellipsis>{item.name}</Title>
                        {item.severity_level > 0 && (
                          <>
                            <Text style={{ color: 'red' }}>
                              <Icon type="warning" theme="twoTone" twoToneColor="red" />{' '}
                              Flagged
                    </Text>
                          </>
                        )}
                      </Col>
                      <Col span={12} style={{ textAlign: 'end', fontSize: '0.8rem' }}>
                        {getTimestamp(item) > 0 && <p style={{ color: 'red' }}>{tab == 'flagged' ? "Flagged " : 'Un-replied since'}<b><TimeAgo
                          minPeriod={10}
                          date={getTimestamp(item)} /></b>  </p>}
                        {getStaffsHandlingVisitor(item) && <p style={{ color: '#0FAAA2' }}>Handling chat: {getStaffsHandlingVisitor(item)[0].full_name} </p>}
                        {getStaffsHandlingVisitor(item) && getStaffsHandlingVisitor(item).length > 1 && <p style={{ color: '#0FAAA2' }} >& {getStaffsHandlingVisitor(item).length - 1} others </p>}
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
