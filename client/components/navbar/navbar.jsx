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
// import Info from './info/info';

const mapStateToProps = store => ({
  modalState: store.general.open,
  schemaObject: store.schema
});

const mapDispatchToProps = dispatch => ({
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
  saveDatabaseDataInput: schemaObject => dispatch(actions.saveDatabaseDataInput(schemaObject)),
  handleOpen: () => dispatch(actions.showModal()),
  handleClose: () => dispatch(actions.hideModal())
});


const MainNav = ({ handleNewProject, modalState, handleClose, handleOpen, saveDatabaseDataInput, schemaObject }) => (
  <div>
    <nav id="navbar">
      <div id="nav-left">
        <img alt="" id="logo" src="./images/Logo.svg" />
        <FlatButton label="New Project" onClick={() => handleNewProject(true)} />
        <FlatButton 
          label="Tree View" 
          onClick={() => {
            handleOpen();
            if (schemaObject.name){
              saveDatabaseDataInput(schemaObject)
            }}} />
        <Dialog
          paperClassName="tree-box"
          actionsContainerClassName="tree-box2"
          title='Tree View'
          modal={false}
          open={modalState}
          onRequestClose={handleClose}
          autoDetectWindowHeight={true} 
        >
          <TreeView/>
        </Dialog>
        {/* <Popup
          trigger={<FlatButton className="button" label="Tree View" />}
          modal>
          {close => (
            <div className="modal">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="header"> Tree View </div>
              <div className="content">
                {' '}
                <TreeView/>
              </div>
            </div>
          )}
        </Popup> */}
        <ExportCode />
      </div>
      <div id="nav-right">
        {/* <Info/> */}
        <Team />
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
