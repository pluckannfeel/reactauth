import { useRef } from 'react';

import { useSelector } from 'react-redux';
import {selectToken} from '../../store/auth/authSlice';

// react router
import { useHistory } from 'react-router-dom';

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();

  const token = useSelector(selectToken);

  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    // add validation

    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA4gsMQHeSwXOqTawYthxSqZfXy-SUd6-4',
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then(res => {
      
      history.replace('/');
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
