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
import { setError, userLoggedIn } from './actions';
import './index.less';
import { makeSelectError, makeSelectCurrentUser } from './selectors';



const AppWrapper = styled.div`
  // max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  // padding: 0 16px;
  flex-direction: column;
`;

function App({ error, setError, user, userLoggedIn }) {
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

  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      {/* <Header /> */}
      {loaded && <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/patient/login" component={PatientLogin} />
        <Route path="/patient/register" component={PatientRegister} />
        <Route path="/patient/main" component={VisitorChat} />
        <Route
          path="/patient/getting-started"
          component={PatientGettingStarted}
        />
        <Route path="/features" component={FeaturePage} />
        <Route path="/staff/login" component={StaffLogin} />
        <Route path="/staff/main" component={StaffMain} />
        <Route path="" component={NotFoundPage} />
      </Switch>}
      <GlobalStyle />
    </AppWrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  user: makeSelectCurrentUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setError: error => dispatch(setError(error)),
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
