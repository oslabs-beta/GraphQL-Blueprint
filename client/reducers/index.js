
// import all reducers here
import { combineReducers } from 'redux';
import schemaReducers from './schemaReducers.js';
import generalReducers from './generalReducers.js';
import multiSchemaReducer from './multiSchemaReducer.js';
import { firestoreReducer } from 'react-redux-firebase';
import { firebaseReducer } from 'react-redux-firebase';
// import queryReducers from './queryReducers.js';




// combine reducers
const combinedReducers = combineReducers({
  general: generalReducers,
  schema: schemaReducers,
  multiSchema: multiSchemaReducer,
  // query: queryReducers,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

// make the combined reducers available for import
export default combinedReducers;
