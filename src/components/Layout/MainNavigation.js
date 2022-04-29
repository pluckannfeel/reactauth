import { Link, useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { selectIsLoggedIn } from '../../store/auth/authSlice';
import { authActions } from '../../store/auth/authSlice';

import classes from './MainNavigation.module.css';

// get logouttimer to use it to logout button

const MainNavigation = () => {
  const history = useHistory();

  // redux store
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const authDispatch = useDispatch();

  const logoutHandler = () => {
    authDispatch(authActions.logout());
    authDispatch(authActions.setIsLoggedIn(false));
    
    clearTimeout();

    history.replace('/auth');
  };

  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to='/auth'>Login</Link>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
