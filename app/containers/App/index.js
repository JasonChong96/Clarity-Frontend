/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { notification } from 'antd';
import 'antd/dist/antd.less';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import GlobalStyle from '../../global-styles';
import Home from '../Home';
import PatientGettingStarted from '../PatientGettingStarted';
import PatientLogin from '../PatientLogin';
import PatientRegister from '../PatientRegister';
import StaffLogin from '../StaffLogin';
import StaffMain from '../StaffMain';
import VisitorChat from '../VisitorChat';
import { setError, userLoggedIn, setSuccess } from './actions';
import './index.less';
import { makeSelectError, makeSelectCurrentUser, makeSelectSuccess } from './selectors';
import PrivateRoute from '../../components/PrivateRoute';
import PublicRoute from '../../components/PublicRoute';

const AppWrapper = styled.div`
  // max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  // padding: 0 16px;
  flex-direction: column;
`;

function App({ error, setError, user, userLoggedIn, success }) {
  const [loaded, setLoaded] = useState(false);
  const storedUser = localStorage.getItem('user');
  useEffect(() => {
    if (!user && storedUser) {
      userLoggedIn(JSON.parse(storedUser));
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (error) {
      notification.error({
        message: error.title,
        description: error.description,
      });
      setError(false);
    }
  }, [error]);
  useEffect(() => {
    if (success) {
      notification.success({
        message: success.title,
        description: success.description,
      });
      setSuccess(false);
    }
  }, [success]);
  const userType = user ? (user.user.role_id ? 'staff' : 'patient') : '';
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      {/* <Header /> */}
      {loaded && (
        <Switch>
          <PublicRoute exact path="/" component={Home} isAuthenticated={user} type={userType} />
          <PublicRoute path="/patient/login" component={PatientLogin} isAuthenticated={user} type={userType} />
          <PublicRoute path="/patient/register" component={PatientRegister} isAuthenticated={user} type={userType} />
          <PrivateRoute path="/patient/main"
            isAuthenticated={user}
            type='patient' component={VisitorChat} />
          <PublicRoute path="/staff/login" component={StaffLogin} isAuthenticated={user} type={userType} />
          <PrivateRoute path="/staff/main"
            isAuthenticated={user}
            type='staff' component={StaffMain} />
          <Route path="" component={NotFoundPage} />
        </Switch>
      )}
      <GlobalStyle />
    </AppWrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  user: makeSelectCurrentUser(),
  success: makeSelectSuccess(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setError: error => dispatch(setError(error)),
    setSuccess: error => dispatch(setSuccess(error)),
    userLoggedIn: user => dispatch(userLoggedIn(user)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(App);
