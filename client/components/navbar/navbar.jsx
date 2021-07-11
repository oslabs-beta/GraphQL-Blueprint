import React from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import * as actions from '../../actions/actions';

// Reactjs-Popup Component
import Popup from 'reactjs-popup';

// styling
import './navbar.css';

// components
import Team from './team/team-button.jsx';
import ExportCode from './export-code/export-button.jsx';
import TreeView from './tree-view/treeView.jsx';
import { Dialog } from 'material-ui';
import { Tabs, Tab } from 'material-ui/Tabs';
// import Info from './info/info';

const mapStateToProps = store => ({
  modalState: store.general.open,
  schemaObject: store.schema
});

const mapDispatchToProps = dispatch => ({
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
  saveDatabaseDataInput: schemaObject => dispatch(actions.saveDatabaseDataInput(schemaObject)),
  handleOpen: () => dispatch(actions.showModal()),
  handleClose: () => dispatch(actions.hideModal()),
  handleNewMultiProject: reset => dispatch(actions.handleNewMultiProject(reset))
});

const classes = {
  button: {
    color: '#5C5E72',
  }
};


const MainNav = ({ handleNewProject, handleNewMultiProject, modalState, handleClose, handleOpen, saveDatabaseDataInput, schemaObject }) => (
  <div>
    <nav id="navbar">
      <div id="nav-left">
        <img alt="" id="logo" src="./images/logo-horizontal.svg" />
        <ExportCode />
      </div>
      <div id="nav-right">
        {/* <Info/> */}
        {/* <Team /> */}
        <a href="https://github.com/GraphQL-Designer/graphqldesigner.com">
          <img alt="" src="./images/githubicon.png" />
        </a>
      </div>
    </nav>
  </div>
);


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainNav);
