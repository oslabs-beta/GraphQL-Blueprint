import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { saveDatabaseDataInput } from '../actions/actions';

// Components
import MainNav from './navbar/navbar.jsx';
import Welcome from './welcome/welcome.jsx';
import SchemaApp from './schema/schema-app.jsx';
import DBApp from './databases/db-app.jsx';
import CodeApp from './code/code-app.jsx';

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
    backgroundColor: 'rgb(38,42,48)',
    color: 'white',
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
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
