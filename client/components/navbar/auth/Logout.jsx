import React from "react";
import { connect } from 'react-redux';
import { signOut } from "../../../actions/actions";
import RaisedButton from 'material-ui/RaisedButton';

const Logout = ({ signOut }) => {

  return (
    <div>
      <RaisedButton label="Log out" onClick={signOut} />
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(null, mapDispatchToProps)(Logout);