/**
 *
 * PendingChats
 *
 */

import { Card, Col, Icon, List, Row } from 'antd';
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


export function PendingChats({ inactiveChats, onClickRoom }) {
  useInjectReducer({ key: 'pendingChats', reducer });
  useInjectSaga({ key: 'pendingChats', saga });
  return (
    <List
      itemLayout="horizontal"
      dataSource={inactiveChats}
      renderItem={item => (
        <Card.Grid
          style={{ width: '100%', cursor: 'pointer' }}
          onClick={() => {
            onClickRoom(item.room.id);
          }}
        >
          <div
            display="flex"
            flexDirection="column"
            style={{ width: '100%', margin: '1em' }}
          >
            <Row type="flex">
              <Col span={16}>
                <Title level={4}>
                  {item.room.severity_level > 0 && (
                    <>
                      <Icon
                        type="exclamation-circle"
                        twoToneColor="red"
                        theme="twoTone"
                      />{' '}
                    </>
                  )}
                  {item.user.name}
                </Title>
                <Text style={{ color: 'red' }}>
                  <Icon type="star" theme="filled" /> Previously chatted with
                </Text>
                {item.room.severity_level > 0 && (
                  <>
                    <br />
                    <Text style={{ color: 'red' }}>
                      <Icon type="warning" theme="twoTone" twoToneColor="red" />{' '}
                      Flagged
                    </Text>
                  </>
                )}
              </Col>
              <Col span={8}>
                <TimeAgo
                  date={Number(item.contents.slice(-1)[0].content.timestamp)}
                  style={{ width: '100%' }}
                >
                  10 mins ago
                </TimeAgo>
              </Col>
            </Row>
            <Paragraph ellipsis>{item.contents.slice(-1)[0].content.content}</Paragraph>
          </div>
        </Card.Grid>
      )}
    />
  );
}

PendingChats.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

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
