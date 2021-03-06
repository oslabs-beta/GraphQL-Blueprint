import * as types from './action-types.js';

// -------------------------- Welcome and Intro ----------------------------//

export const chooseDatabase = dbName => ({
  type: types.CHOOSE_DATABASE,
  payload: dbName,
});

export const handleSnackbarUpdate = status => ({
  type: types.HANDLE_SNACKBAR_UPDATE,
  payload: status,
});

export const hideModal = () => ({
  type: types.HIDE_MODAL,
});

export const showModal = () => ({
  type: types.SHOW_MODAL,
});

// ----------------------------- Schema App --------------------------------//
export const openTableCreator = () => ({
  type: types.OPEN_TABLE_CREATOR,
});

export const saveTableDataInput = () => ({
  type: types.SAVE_TABLE_DATA_INPUT,
});

export const deleteTable = tableIndex => ({
  type: types.DELETE_TABLE,
  payload: tableIndex,
});

export const deleteField = tableIndex => ({
  type: types.DELETE_FIELD,
  payload: tableIndex,
});

export const addFieldClicked = tableIndex => ({
  type: types.ADD_FIELD_CLICKED,
  payload: tableIndex,
});

export const saveFieldInput = database => ({
  type: types.SAVE_FIELD_INPUT,
  payload: database,
});

export const handleFieldsUpdate = field => ({
  type: types.HANDLE_FIELDS_UPDATE,
  payload: field,
});

export const handleFieldsSelect = field => ({
  type: types.HANDLE_FIELDS_SELECT,
  payload: field,
});

export const handleTableNameChange = tableName => ({
  type: types.HANDLE_TABLE_NAME_CHANGE,
  payload: tableName,
});

export const handleTableID = () => ({
  type: types.HANDLE_TABLE_ID,
});

export const handleSelectedTable = tableIndex => ({
  type: types.HANDLE_SELECTED_TABLE,
  payload: tableIndex,
});

export const handleNewProject = reset => ({
  type: types.HANDLE_NEW_PROJECT,
  payload: reset,
});

export const handleInjectDatabase = database => ({
  type: types.HANDLE_INJECT_DATABASE,
  payload: database,
});

// ----------------------------- Database App -------------------------------//

export const saveDatabaseDataInput = state => ({
  type: types.SAVE_DATABASE_DATA_INPUT,
  payload: state,
});

export const deleteDatabase = databaseIndex => ({
  type: types.DELETE_DATABASE,
  payload: databaseIndex,
});

export const handleSelectedDatabase = databaseIndex => ({
  type: types.HANDLE_SELECTED_DATABASE,
  payload: databaseIndex,
});

export const handleDatabaseNameChange = databaseName => ({
  type: types.HANDLE_DATABASE_NAME_CHANGE,
  payload: databaseName,
});

export const handleDatabaseTypeChange = databaseType => ({
  type: types.HANDLE_DATABASE_TYPE_CHANGE,
  payload: databaseType,
});

export const handleNewMultiProject = reset => ({
  type: types.HANDLE_NEW_MULTI_PROJECT,
  payload: reset,
});

export const openDatabaseCreator = () => ({
  type: types.OPEN_DATABASE_CREATOR,
});

// ----------------------------- Query App -------------------------------//

export const createQuery = query => ({
  type: types.CREATE_QUERY,
  payload: query,
});

export const openCreateQuery = () => ({
  type: types.OPEN_CREATE_QUERY,
});

export const handleNewQueryChange = field => ({
  type: types.HANDLE_NEW_QUERY_CHANGE,
  payload: field,
});


// export const createReturnFields = returnFields => ({
//   type: types.CREATE_RETURN_FIELDS,
//   payload: returnFields,
// });

export const handleReturnValues = returnValues => ({
  type: types.HANDLE_RETURN_VALUES,
  payload: returnValues,
});

export const handleSubQuerySelector = tableFieldIndexes => ({
  type: types.HANDLE_SUBQUERY_SELECTOR,
  payload: tableFieldIndexes,
});

export const handleNewQueryName = name => ({
  type: types.HANDLE_NEW_QUERY_NAME,
  payload: name,
});

export const handleNewSubQueryToggle = field => ({
  type: types.HANDLE_NEW_SUBQUERY_TOGGLE,
  payload: field,
});

export const submitSubQueryHandler = subQuery => ({
  type: types.SUBMIT_SUBQUERY_HANDLER,
  payload: subQuery,
});

export const deletedFieldRelationUpdate = indexes => ({
  type: types.DELETED_FIELD_RELATION_UPDATE,
  payload: indexes,
});

export const saveSchemasToDatabases = () => {
  return (dispatch, getState) => {
    const { schema } = getState();
  }
}

