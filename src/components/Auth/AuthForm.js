import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth/authSlice';
import { calculateRemainingTime } from '../../store/auth/authFunctions';

// react router
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';


const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // react router
  const history = useHistory();

  // redux store
  const authDispatch = useDispatch();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    //optional: add validation
    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4gsMQHeSwXOqTawYthxSqZfXy-SUd6-4';
    } else {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA4gsMQHeSwXOqTawYthxSqZfXy-SUd6-4';
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            // show an error modal
            let errorMessage = 'Authentication failed!';

            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // set token and expiration time
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authDispatch(
          authActions.login({
            token: data.idToken,
            expirationTime: expirationTime.toISOString(),
          })
        );
        // set isLogged in to true
        authDispatch(authActions.setIsLoggedIn(true));

        // set up auto logout for expiration
        setTimeout(() => {
          authDispatch(authActions.logout());
          authDispatch(authActions.setIsLoggedIn(false));
          history.replace('/auth');
        }, calculateRemainingTime(expirationTime));

        // redirect to profile page
        history.replace('/');
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          {isLoading && <p>Loading...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
