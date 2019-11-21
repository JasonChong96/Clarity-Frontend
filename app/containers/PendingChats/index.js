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

export function PendingChats({ inactiveChats, isUnread, onClickRoom, getContents, onlineVisitors, isChosen }) {
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
          className="chat-button-wrapper"
          style={{ width: '100%', cursor: 'pointer', background: (isUnread(item) ? 'white' : '#EAEAEA'), boxSizing: 'border-box', border: (isChosen(item) ? '1px solid #F9D835' : '') }}
          onClick={() => onClickRoom(item.visitor.id)}
        >
          <div
            display="flex"
            style={{ width: '100%', opacity: onlineVisitors.find(visitor => visitor.id == item.visitor.id) ? 1 : 0.7 }}
          >
            <Row type="flex" align="middle">
              <Col span={12}>
                <Title level={4} ellipsis>{item.visitor.name}</Title>
              </Col>
              <Col span={12} style={{ textAlign: 'end', fontSize: '0.8rem' }}>
                {item.visitor.unhandled_timestamp > 0 && <p style={{ color: 'red' }}>Un-replied since <b><TimeAgo
                  minPeriod={10}
                  date={item.visitor.unhandled_timestamp} /></b>  </p>}
              </Col>
            </Row>
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
