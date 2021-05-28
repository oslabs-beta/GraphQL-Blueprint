import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import FlatButton from 'material-ui/FlatButton';
import * as actions from '../../../actions/actions';

// styles
import './sidebar.css';
import { OPEN_DATABASE_CREATOR } from '../../../actions/action-types';

const mapStateToProps = store => ({
  databases: store.multiSchema.databases,
  selectedDatabase: store.multiSchema.selectedDatabase,
  databaseName: store.multiSchema.selectedDatabase.name,
  databaseType: store.multiSchema.selectedDatabase.database,
  //  if ID = -1, this is a new DB, else it corresponds to db id
  databaseID: store.multiSchema.selectedDatabase.databaseID,
  
  //  type of db (i.e. MongoDb), this prop equivilent (database) was used to check if it was MongoDb to display a different sidebar, not needed in our view
  // databaseTypes: store.multiSchema.databaseTypes,
});

const mapDispatchToProps = dispatch => ({
  //  passes in selectedDB, and this reducer updates name changes or dbID.
  saveDatabaseDataInput: selectedDatabase => dispatch(actions.saveDatabaseDataInput(selectedDatabase)),
  databaseNameChange: databaseName => dispatch(actions.handleDatabaseNameChange(databaseName)),
  handleDatabaseTypeChange: databaseType => dispatch(actions.handleDatabaseTypeChange(databaseType)),
  
  //  this doesn't seem needed in our DB view
  // idSelector: () => dispatch(actions.handleTableID()),

  openDatabaseCreator: () => dispatch(actions.openDatabaseCreator()),
  // error message display
  handleSnackbarUpdate: status => dispatch(actions.handleSnackbarUpdate(status)),
});

const CreateTable = ({
  databases,
  selectedDatabase,
  databaseName,
  databaseType,
  databaseID,
  //  this used to be a single string for dbType (i.e. mongoDb) that is now an object
  databaseTypes,
  saveDatabaseDataInput,
  databaseNameChange,
  // idSelector, 
  openDatabaseCreator,
  handleSnackbarUpdate,
  handleDatabaseTypeChange
}) => {
  function saveDatabaseData(e) {
    e.preventDefault();

    // remove whitespace and symbols
    // //  following previous convention would be, but i refactored
    let name = selectedDatabase.name.replace(/[^\w]/gi, '');
    // let name = databaseName.replace(/[^\w]/gi, '');

    // confirm database name was entered
    if (!name.length) {
      return handleSnackbarUpdate('Please enter a database name (no symbols or spaces)');
    }

    // capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const databaseIndices = Object.keys(databases);
    const selectedDatabaseIndex = String(selectedDatabase.databaseID);
    // confirm database name does not exist
    for (let x = 0; x < databaseIndices.length; x += 1) {
      const existingDatabaseName = databases[databaseIndices[x]].name;
      // if table name is a duplicate (not counting our selected table if updating)
      if (existingDatabaseName === name && databaseIndices[x] !== selectedDatabaseIndex) {
        return handleSnackbarUpdate('Error: Database name already exist');
      }
    }

    // update table name with uppercase before saving/updating
    databaseNameChange(name);
    //  not sure why i had to make this difference, but the action doesn't dispatch if i take out "selectedDatbase"
    return saveDatabaseDataInput(selectedDatabase);
  }

  function renderDatabaseName() {
    if (databaseID >= 0) {
      return <h2>{databases[databaseID].name} Database</h2>;
    }
    return <h2>Create Database</h2>;
  }

  return (
    <div id="newTable" key={databaseID}>
      {databaseID >= 0 && (
        <FlatButton
          id="back-to-create"
          label="Create Database"
          icon={<KeyboardArrowLeft />}
          onClick={openDatabaseCreator}
        />
      )}
      <form id="create-table-form" onSubmit={saveDatabaseData}>
        {renderDatabaseName()}
        <TextField
          floatingLabelText="Database Name"
          id="tableName"
          fullWidth={true}
          autoFocus
          onChange={(e) => databaseNameChange(e.target.value)}
          value={databaseName}
        />
        <h5 style={{ textAlign: 'center', marginTop: '-4px' }}>( Singular naming convention )</h5>
        
        <SelectField 
          labelId="databaseType" 
          id="select" 
          floatingLabelText="Choose Database Type" 
          value={databaseType}
          onChange={(e, index, value) => handleDatabaseTypeChange(value)}
        >
          <MenuItem value='MongoDb' primaryText="MongoDB" />
          <MenuItem value='PostgreSQL' primaryText="PostgreSQL" />
          <MenuItem value='MySQL' primaryText="MySQL" />
          
        </SelectField>
        
        <RaisedButton
          label={databaseID >= 0 ? 'Update Database' : 'Create Database'}
          fullWidth={true}
          secondary={true}
          type="submit"
          style={{ marginTop: '25px' }}
        />
      </form>

    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTable);
