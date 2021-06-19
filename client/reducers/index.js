
// import all reducers here
import { combineReducers } from 'redux';
import schemaReducers from './schemaReducers.js';
import generalReducers from './generalReducers.js';
import multiSchemaReducer from './multiSchemaReducer.js';
// import queryReducers from './queryReducers.js';




// combine reducers
const combinedReducers = combineReducers({
  general: generalReducers,
  schema: schemaReducers,
  multiSchema: multiSchemaReducer,
  // query: queryReducers,
});

// make the combined reducers available for import
export default combinedReducers;
