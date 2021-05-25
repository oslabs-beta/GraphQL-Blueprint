import * as types from '../actions/action-types';

const initialState = {
  //  maps to each database wireframe
  databases: {},

  // state that holds type of databases in order
  databaseTypes: [],

  // make sure to delete from schemaReducers, use search feature to ensure projectReset state is refactored
  projectReset: true,
  databaseIndex: 0,

  selectedDatabase: {
    //  name of database (i.e. eastcoast employees)
    name: '',
    // type of database (i.e. mongoDb)
    database: '',
    // take out projectRest
    projectReset: true,
    //  number of tables in selected DB
    tableIndex: 0,
    //  object holding each table state (i believe this is not needed)
    //  pointless to access table state from this state object
    //  tables: {},

    //  ID for each database (necessary to refer to which database's state to inject from schema object)
    databaseID: -1
    }
  },

  const reducers = (state = initialState, action) => {
    let newDatabase;
    let newDatabases;
    let newState;

    const databaseReset = {
      name: '',
      database: '',
      // take out projectRest
      projectReset: true,
      tableIndex: 0,
      databaseID: -1
      // tables: {},
    };

    switch (action.type) {

      //  reducer for updating "databases" state, after database schema is created add schema states as another object
      //  (this reducer would be tied to a save button, where the action's payload would be store.schema state object)
      case types.SAVE_DATABASE_DATA_INPUT:
        
        //  replace action.payload with getState() from redux-thunk
        const databaseState = action.payload;

        //  Saving a new database
        if (action.payload.databaseID < 0) {
          newDatabase = Object.assign ({}, action.payload, { databaseID: action.payload.databaseIndex });
          newDatabases = Object.assign ({}, state.databases, { [state.databaseIndex]: newDatabase });
          newState = Object.assign({}, state, {
            databaseIndex: state.databaseIndex + 1, 
            databases: newDatabases
          });
        }
        //  Updating a saved database
        else {
          newDatabase = Object.assign ({}, action.payload);
          newDatabases = Object.assign ({}, state.databases, { [action.payload.databaseID]: newDatabase });
          newState = Object.assign ({}, state, {
            databases: newDatabases
          });
        }

        return newState;
      
      //  add reducer for changing projectreset state (the one that triggers welcome dialog)
      //  this is triggerd when clicking "add new db"


      //  reducer for when you click a database, updates "selectedDatabase" 
      //  (dependent on what states you want to show in new component (database layer))
      //  think default side bar of create table
      case types.

      //  reducer for when you go into schemaView, injects "selectedDatabase" state into "schema" state object
      //  (similar to a handle_fields_select)
      //  must use access.payload object, where payload refers to onclick event object
      case types.

      //  add reducer for deleting database
      
    }
  }