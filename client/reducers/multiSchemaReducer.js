import * as types from '../actions/action-types';

const initialState = {
  //  maps to each database wireframe
  databases: {},

  // state that holds type of databases in order
  databaseTypes: {},

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
  }

  const reducers = (state = initialState, action) => {
    let newDatabase;
    let newDatabases;
    let newState;
    let databaseNum;
    let newSelectedDatabase;
    let newDatabaseTypes;

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
      //  this reducer is called in both Schema view and Database view
      case types.SAVE_DATABASE_DATA_INPUT:
        
        //  replace action.payload with getState() from redux-thunk (maybe not)
        //  databaseState can be both selectedDB or schema state object (depends on what's being passed in as payload)
        const databaseState = action.payload;

        //  Saving a new database
        if (action.payload.databaseID < 0) {
          newDatabase = Object.assign ({}, action.payload, { databaseID: state.databaseIndex });
          newDatabases = Object.assign ({}, state.databases, { [state.databaseIndex]: newDatabase });
          newDatabaseTypes = Object.assign ({}, state.databaseTypes, { [state.databaseIndex]: action.payload.database })
          newState = Object.assign({}, state, {
            databaseIndex: state.databaseIndex + 1, 
            databases: newDatabases,
            databaseTypes: newDatabaseTypes
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
      // ----------------------------- Open Table Creator ---------------------------------//
     
    //  used in "create-db" component, function dispatched to store when clicking the back button on the side bar
    //  resets selectedDatabase state since conditional rendering on view makes a different side menu appear
    case types.OPEN_DATABASE_CREATOR:
      newSelectedDatabase = Object.assign({}, databaseReset);

      return {
        ...state,
        selectedDatabase: newSelectedField,
      };

      // ---------------------------- Change Database Name -----------------------------------//
      //  payload = databaseName
      case types.HANDLE_DATABASE_NAME_CHANGE:
      newSelectedDatabase = Object.assign({}, state.selectedDatabase, { name: action.payload });

        return {
          ...state,
          selectedDatabase: newSelectedDatabase,
        };
      
      case types.HANDLE_DATABASE_TYPE_CHANGE:
        console.log(action.payload);
        newSelectedDatabase = Object.assign({}, state.selectedDatabase, { database: action.payload });
        
          return {
            ...state,
            selectedDatabase: newSelectedDatabase,
          };
      

      //  add reducer for changing projectreset state (the one that triggers welcome dialog)
      //  this is triggered when clicking "add new db"


      //  reducer for when you click a database, updates "selectedDatabase" state
      //  (payload would be the event.target.currentValue which should equal databaseID)

      
      // -------------------------------- Select Database for Update -------------------------------//
      case types.HANDLE_SELECTED_DATABASE:
        databaseNum = Number(action.payload);
        newSelectedDatabase = JSON.parse(JSON.stringify(state.databases[databaseNum]));
        return {
          ...state,
          selectedDatabase: newSelectedDatabase,
        }
      
      // -------------------------------- Delete Database -------------------------------// 
      case types.DELETE_DATABASE:
        databaseNum = Number(action.payload);
        
        newDatabases = Object.assign({}, state.databases)
        delete newDatabases[databaseNum];

        const newDatabasesCopy = {};
        let counter = 0;

        for (let key in newDatabases){
          newDatabasesCopy[counter] = newDatabases[key];
          counter++
        }
        if (counter > 0 ) {
          newSelectedDatabase = JSON.parse(JSON.stringify(state.databases[databaseNum - 1]));
        } else {
          newSelectedDatabase = Object.assign({}, databaseReset);
        }
        // must be refactored to update databaseIndex and to update databaseType state
        return {
          ...state,
          databases: newDatabasesCopy,
          databaseIndex: counter,
          selectedDatabase: newSelectedDatabase,
        }
        
      default:
        return state;


      //  reducer for when you go into schemaView, injects "selectedDatabase" state into "schema" state object
      //  (similar to a handle_fields_select)
      //  must use access.payload object, where payload refers to onclick event object
      // case types.
      

      
    }
  };

  export default reducers;