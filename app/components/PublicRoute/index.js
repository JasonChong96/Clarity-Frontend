/**
 *
 * PublicRoute
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Route, Redirect } from 'react-router-dom';

function PublicRoute({ component: Component, isAuthenticated, type, ...rest }) {
  return (
    <Route {...rest} render={(props) => (
      isAuthenticated
        ? <Redirect to={`/${type}/main`} />
        : <Component {...props} />
    )} />
  )
}

PublicRoute.propTypes = {};

export default PublicRoute;
