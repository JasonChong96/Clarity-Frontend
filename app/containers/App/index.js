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
import Landingpage from '../LandingPage';
import PatientGettingStarted from '../PatientGettingStarted';
import PatientLogin from '../PatientLogin';
import PatientRegister from '../PatientRegister';
import StaffLogin from '../StaffLogin';
import StaffMain from '../StaffMain';
import VisitorChat from '../VisitorChat';
import { setError, userLoggedIn, setSuccess, addNotification } from './actions';
import './index.less';
import {
  makeSelectError,
  makeSelectCurrentUser,
  makeSelectSuccess,
} from './selectors';
import PrivateRoute from '../../components/PrivateRoute';
import PublicRoute from '../../components/PublicRoute';

const AppWrapper = styled.div`
  // max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  max-height: 100vh;
  // padding: 0 16px;
  flex-direction: column;
  background-color: black;
`;

function App({ error, setError, user, addNotification, userLoggedIn, success }) {
  const [loaded, setLoaded] = useState(false);
  const storedUser = localStorage.getItem('user');
  useEffect(() => {
    if (!user && storedUser) {
      const temp = JSON.parse(storedUser);
      if (temp.data && !temp.user) {
        temp.user = temp.data
      }
      userLoggedIn(temp);
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
      addNotification({ timestamp: new Date().getTime(), ...error });
    }
  }, [error]);
  useEffect(() => {
    if (success) {
      notification.success({
        message: success.title,
        description: success.description,
      });
      setSuccess(false);
      addNotification({ timestamp: new Date().getTime(), ...success });
    }
  }, [success]);
  const userType = user ? (user.user.role_id ? 'staff' : 'visitor') : '';
  return (
    <AppWrapper>
      <Helmet titleTemplate="Ora" defaultTitle="Ora">
        <meta
          name="description"
          content="Your mental health chat application!"
        />
      </Helmet>
      {/* <Header /> */}
      {loaded && (
        <Switch>
          <PublicRoute
            exact
            path="/"
            component={Landingpage}
            isAuthenticated={user}
            type={userType}
          />
          <PublicRoute
            exact
            path="/visitor"
            component={Home}
            isAuthenticated={user}
            type={userType}
          />
          <PublicRoute
            path="/visitor/login"
            component={PatientLogin}
            isAuthenticated={user}
            type={userType}
          />
          <PublicRoute
            path="/visitor/register"
            component={PatientRegister}
            isAuthenticated={user}
            type={userType}
          />
          <PrivateRoute
            path="/visitor/main"
            isAuthenticated={user}
            type="visitor"
            component={VisitorChat}
          />
          <PublicRoute
            path="/staff/login"
            component={StaffLogin}
            isAuthenticated={user}
            type={userType}
          />
          <PrivateRoute
            path="/staff/main"
            isAuthenticated={user}
            type="staff"
            component={StaffMain}
          />
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
    addNotification: notification => dispatch(addNotification(notification)),
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
