import * as types from '../actions/action-types';

const initialState = {
  //  maps to each database wireframe
  databases: {},

  // state that holds type of databases in order
  databaseTypes: [],

  // make sure to delete from schemaReducers, use search feature to ensure 
  // 
  projectReset: true,
  databaseIndex: 0,
  selectedDatabase: {
    name: '',
    database: '',
    // take out projectRest
    projectReset: true,
    tableIndex: 0,
    tables: {},
  }
  },

  const reducers = (state = initialState, action) => {
    const databaseReset = {
      name: '',
      database: '',
      // take out projectRest
      projectReset: true,
      tableIndex: 0,
      tables: {},
    }

    //  reducer for updating "databases" state, after database schema is created add schema states as another object
    //  (this reducer would be on the schema component)

    //  reducer for when you click a database, updates "selectedDatabase" 
    //  (This reducer would be on the new database component )

    //  reducer for when you go into schemaView, injects "selectedDatabase" state into schema state object
    //  (This reducer would be on the new database component )

  }