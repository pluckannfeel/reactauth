import { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from './store/auth/authSlice';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

import { useDispatch } from 'react-redux/es/exports';
import { authActions } from './store/auth/authSlice';

import { retrieveStoredToken } from './store/auth/authFunctions';

function App() {
  const tokenData = retrieveStoredToken();
  const authDispatch = useDispatch();

  // set logout timer on useeffect if tokendata is changed
  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      setTimeout(() => {
        authDispatch(authActions.logout());
        authDispatch(authActions.setIsLoggedIn(false));
        clearTimeout();

      }, tokenData.duration);
    }
    // return () => {
    //   cleanup
    // };
  }, [tokenData, authDispatch]);

  // redux store
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        <Route path='/auth'>
          <AuthPage />
        </Route>
        <Route path='/profile'>
          {isLoggedIn && <UserProfile />}
          {!isLoggedIn && <Redirect to='/auth' />}
        </Route>
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
