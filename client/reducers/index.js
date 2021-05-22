import { combineReducers } from 'redux';

// import all reducers here
import schemaReducers from './schemaReducers.js';
import generalReducers from './generalReducers.js';
// import queryReducers from './queryReducers.js';

//  import parentSchemasReducers from './databaseReducers.js'


// combine reducers
const combinedReducers = combineReducers({
  general: generalReducers,
  schema: schemaReducers,
  // query: queryReducers,
  //  parentSchemas: parentSchemasReducers
});

// make the combined reducers available for import
export default combinedReducers;
