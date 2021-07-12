import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { signIn } from '../../../actions/actions';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import './SignIn.css';
// import { useStateValue } from '../../StateProvider';

const SignIn = ({ isOpen, signIn, authError, isSignedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(isOpen);
  let history = useHistory();

  // const [{ user }, dispatch] = useStateValue();
  if (isSignedIn){
    history.push('/')
  }

  const signInButton = (event) => {
    event.preventDefault();
    console.log(email);
    console.log(password);

    signIn({
      email,
      password 
    })
  };

  function handleSignUpClick() {
    history.push('/signup');
  }

  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={() => {
        setOpen(false)
        history.push('/')
      }}
    />
  ];

  return (
    <div>
      {/* <RaisedButton label="Sign in" onClick={(e) => setOpen(true)} /> */}
      <Dialog
          actions={actions}
          modal={true}
          open={open}
          className="dialog__container"
        >
        <div className="login__container">
          <form className="login__form">
            <h2 className="login__title">Log in</h2>
            <div className="login__authError">
              { authError && <p className="login__message">{authError}</p> }
            </div>
            <div className="login__input">
              <span className="login__icon"><MailOutlineIcon /></span>
              <input type="email" placeholder="Enter email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="login__input">
              <span className="login__icon"><LockIcon /></span>
              <input type="password" placeholder="Enter password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="login__button" onClick={(e) => signInButton(e)}>Log in</button>
          </form>

          <div className="login__createAccount">
            <p>Don&apos;t have an account?</p>
            <a onClick={handleSignUpClick} className="signup__link">
              Sign Up
            </a>
          </div>
        </div>  
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authError: state.general.authError,
    isSignedIn: state.firebase.auth.uid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (credentials) => dispatch(signIn(credentials))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);