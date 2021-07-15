import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

// Components
import MainNav from './navbar/navbar.jsx';
import Welcome from './welcome/welcome.jsx';
import SchemaApp from './schema/schema-app.jsx';
import DBApp from './databases/db-app.jsx';
import CodeApp from './code/code-app.jsx';
import GitHubButton from 'react-github-btn'
import Team from './welcome/team/team-button.jsx';
import Info from './navbar/info/info.jsx';
//import QueryApp from './query/query-app.jsx';

// Material UI Components
import { Tabs, Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';

// Styling
import './app.css';

const style = {
  snackBarStyle: {
    backgroundColor: 'rgb(255,66,128)',
  },
  snackBarFont: {
    color: 'white',
  },
  tabStyle: {
    backgroundColor: '#FFF',
    border: '1px solid #F1F1F1',
    color: '#000',
  },
};

const mapStateToProps = store => ({
  snackBar: store.general.statusMessage,
  schemaObject: store.schema,
});

const mapDispatchToProps = dispatch => ({
  handleSnackbarUpdate: status => dispatch(actions.handleSnackbarUpdate(status)),
  saveDatabaseDataInput: schemaObject => dispatch(actions.saveDatabaseDataInput(schemaObject)),
  chooseDatabase: database => dispatch(actions.chooseDatabase(database)),
});

const App = ({ snackBar, handleSnackbarUpdate, schemaObject, saveDatabaseDataInput, chooseDatabase }) => {
  function handleRequestClose() {
    handleSnackbarUpdate('');
  }

  return (
    <div className="app-container">
      <MainNav />
      <Welcome />
      <div className="app-body-container">
        <Tabs 
          className="tabs" 
          onChange={() => {
            if (schemaObject.name) {
              chooseDatabase(schemaObject.database)
              saveDatabaseDataInput(schemaObject)}
          }}
        >
          <Tab 
            id="databasesTab" 
            label="Databases" 
            style={style.tabStyle}>
              <DBApp />
          </Tab>
          <Tab 
            id="schemaTab" 
            label="Tables" 
            style={style.tabStyle} 
            disabled={(schemaObject.name === "") ? true : false}>
            <SchemaApp />
          </Tab>
          {/* <Tab label="Queries" style={style.tabStyle}>
            <QueryApp />
          </Tab> */}
          <Tab label="Preview Code" style={style.tabStyle}>
            <CodeApp />
          </Tab>
        </Tabs>
        <Snackbar
          open={!!snackBar}
          message={snackBar}
          autoHideDuration={3000}
          onRequestClose={handleRequestClose}
          bodyStyle={style.snackBarStyle}
          contentStyle={style.snackBarFont}
        />
      </div>
      <footer
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem'
        }}
      >
        <ul>
          <li>
            <GitHubButton href="https://github.com/oslabs-beta/GraphQL-Blueprint" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star oslabs-beta/GraphQL-Blueprint on GitHub">Star</GitHubButton>
          </li>
          <li>
            <Info/>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
