import React from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import * as actions from '../../actions/actions';
import { useHistory, Link } from 'react-router-dom';

// styling
import './navbar.css';

// components
import Team from './team/team-button.jsx';
import SignIn from './auth/SignIn.jsx';
import SignUp from './auth/SignUp.jsx';
import Logout from './auth/Logout.jsx';
import ExportCode from './export-code/export-button.jsx';
// import Info from './info/info';

const mapDispatchToProps = dispatch => ({
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
});

const mapStateToProps = (state) => {
  return { 
    isSignedIn : state.firebase.auth.uid
  }
}
  

const MainNav = ({ handleNewProject, isSignedIn }) => {
  let history = useHistory();

  function handleSignInClick() {
    history.push('/signin');
  }

  function handleSignUpClick() {
    history.push('/signup');
  }

  return (
    <div>
      <nav id="navbar">
        <div id="nav-left">
          <img alt="" id="logo" src="./images/Logo.svg" />
          <FlatButton label="New Project" onClick={() => handleNewProject(true)} />
          <ExportCode />
        </div>
        <div id="nav-right">
          {/* <Info/> */}
          {!isSignedIn && <FlatButton label="Log in" onClick={handleSignInClick} />}
          {!isSignedIn && <FlatButton label="Sign up" onClick={handleSignUpClick} />}
          {isSignedIn && <Logout />}
          <Team />
          <a href="https://github.com/GraphQL-Designer/graphqldesigner.com">
            <img alt="" src="./images/githubicon.png" />
          </a>
        </div>
      </nav>
    </div>
  );
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainNav);
