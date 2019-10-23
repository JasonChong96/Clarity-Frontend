/**
 *
 * ChatContainer
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectChatContainer from './selectors';
import reducer from './reducer';
import saga from './saga';

export function ChatContainer() {
  useInjectReducer({ key: 'chatContainer', reducer });
  useInjectSaga({ key: 'chatContainer', saga });

  return <div />;
}

ChatContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  chatContainer: makeSelectChatContainer(),
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
)(ChatContainer);
