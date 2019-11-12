/**
 *
 * PendingChats
 *
 */

import { Card, Col, Icon, List, Row, Badge } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import makeSelectPendingChats from './selectors';

export function PendingChats({ inactiveChats, onClickRoom, getContents, onlineVisitors, isChosen }) {
  useInjectReducer({ key: 'pendingChats', reducer });
  useInjectSaga({ key: 'pendingChats', saga });
  return (
    <List
      itemLayout="horizontal"
      dataSource={inactiveChats}
      locale={{
        emptyText: 'No chats to claim!'
      }
      }
      renderItem={item => (
        <Card.Grid
          style={{ width: '100%', cursor: 'pointer', background: (isChosen(item) ? '#EAEAEA' : 'white') }}
          onClick={() => {
            onClickRoom(item.visitor.id);
          }}
        >
          <div
            display="flex"
            flexDirection="column"
            style={{ width: '100%', margin: '1em', opacity: onlineVisitors.find(visitor => visitor.id == item.visitor.id) ? 1 : 0.7 }}
          >
            <Row type="flex">
              <Col span={15}>
                <Title level={4}>
                  {item.visitor.severity_level > 0 && (
                    <>
                      <Icon
                        type="exclamation-circle"
                        twoToneColor="red"
                        theme="twoTone"
                      />{' '}
                    </>
                  )}
                  {item.visitor.name}
                </Title>
                {/* <Text style={{ color: 'red' }}>
                  <Icon type="star" theme="filled" /> Previously chatted with
                </Text> */}
                {item.visitor.severity_level > 0 && (
                  <>
                    <Text style={{ color: 'red' }}>
                      <Icon type="warning" theme="twoTone" twoToneColor="red" />{' '}
                      Flagged
                    </Text>
                  </>
                )}
              </Col>
              <Col span={1}>
                {onlineVisitors && <Badge status={onlineVisitors.find(visitor => visitor.id == item.visitor.id) ? 'success' : 'error'} />}
              </Col>
              <Col span={8}>
                {getContents(item).length > 0 && <TimeAgo
                  minPeriod={10}
                  date={Number(getContents(item).slice(-1)[0].content.timestamp)}
                  style={{ width: '100%' }}
                />}
              </Col>
            </Row>
            {getContents(item).length > 0 && <Paragraph ellipsis>
              {getContents(item).slice(-1)[0].content.content}
            </Paragraph>}
          </div>
        </Card.Grid>
      )}
    />
  );
}

PendingChats.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

PendingChats.defaultProps = {
  isChosen: () => false,
}

const mapStateToProps = createStructuredSelector({
  pendingChats: makeSelectPendingChats(),
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
)(PendingChats);
