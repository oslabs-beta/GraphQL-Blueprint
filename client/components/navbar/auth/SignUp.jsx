import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import RaisedButton from 'material-ui/RaisedButton';
import { signUp } from '../../../actions/actions';
import './SignUp.css';
// import { useStateValue } from '../../StateProvider';

const SignUp = ({ isOpen, authError, signUp, isSignedIn }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(isOpen);
  let history = useHistory();

  // const [{ user }, dispatch] = useStateValue();
  if (isSignedIn){
    history.push('/')
  }

  const signUpButton = (event) => {
    event.preventDefault();
    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(password);
    
    signUp({
      firstName,
      lastName,
      email,
      password,
    })
  };

  function handleSignInClick() {
    history.push('/signin');
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
      {/* <FlatButton label="Sign up" onClick={(e) => setOpen(true)} /> */}
        <Dialog
          actions={actions}
          modal={true}
          open={open}
          className="dialog__container"
        >
          <div className="signup__container">
            <form className="signup__form">
              <h2 className="signup__title">Sign up</h2>
              <div className="signup__authError">
                { authError && <p className="signup__message">{authError}</p> }
              </div>
              <div className="signup__input">
                <span className="signup__icon"><PermIdentityIcon /></span>
                <input type="text" placeholder="Enter first name" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>

              <div className="signup__input">
                <span className="signup__icon"><PermIdentityIcon /></span>
                <input type="text" placeholder="Enter last name" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>

              <div className="signup__input">
                <span className="signup__icon"><MailOutlineIcon /></span>
                <input type="email" placeholder="Enter email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="signup__input">
                <span className="signup__icon"><LockIcon /></span>
                <input type="password" placeholder="Enter password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <button type="submit" className="signup__button" onClick={(e) => signUpButton(e)}>Sign Up</button>
            </form>

            <div className="signup__createAccount">
              <p>Already have an account?</p>
              <a onClick={handleSignInClick} className="signin__link">
                Sign In
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
    isSignedIn: state.firebase.auth.uid,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (newUser) => dispatch(signUp(newUser))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SignUp);