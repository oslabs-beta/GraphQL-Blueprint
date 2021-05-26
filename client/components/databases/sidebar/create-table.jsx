import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import FlatButton from 'material-ui/FlatButton';
import * as actions from '../../../actions/actions';

// styles
import './sidebar.css';

const mapStateToProps = store => ({
  tables: store.schema.tables,
  selectedTable: store.schema.selectedTable,
  tableName: store.schema.selectedTable.type,
  tableID: store.schema.selectedTable.tableID,
  database: store.schema.database,
});

const mapDispatchToProps = dispatch => ({
  saveTableDataInput: database => dispatch(actions.saveTableDataInput(database)),
  tableNameChange: tableName => dispatch(actions.handleTableNameChange(tableName)),
  idSelector: () => dispatch(actions.handleTableID()),
  openTableCreator: () => dispatch(actions.openTableCreator()),
  handleSnackbarUpdate: status => dispatch(actions.handleSnackbarUpdate(status)),
});

const CreateTable = ({
  tables,
  selectedTable,
  tableName,
  tableID,
  database,
  saveTableDataInput,
  tableNameChange,
  idSelector,
  openTableCreator,
  handleSnackbarUpdate
}) => {
  function saveTableData(e) {
    e.preventDefault();

    // remove whitespace and symbols
    let name = selectedTable.type.replace(/[^\w]/gi, '');

    // confirm table name was entered
    if (!name.length) {
      return handleSnackbarUpdate('Please enter a database name (no symbols or spaces)');
    }

    // capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const tableIndices = Object.keys(tables);
    const selectedTableIndex = String(selectedTable.tableID);
    // confirm table name does not exist
    for (let x = 0; x < tableIndices.length; x += 1) {
      const existingTableName = tables[tableIndices[x]].type;
      // if table name is a duplicate (not counting our selected table if updating)
      if (existingTableName === name && tableIndices[x] !== selectedTableIndex) {
        return handleSnackbarUpdate('Error: Database name already exist');
      }
    }

    // update table name with uppercase before saving/updating
    tableNameChange(name);
    return saveTableDataInput();
  }

  function renderTableName() {
    if (tableID >= 0) {
      return <h2>{tables[tableID].type} Database</h2>;
    }
    return <h2>Create Database</h2>;
  }

  return (
    <div id="newTable" key={tableID}>
      {tableID >= 0 && (
        <FlatButton
          id="back-to-create"
          label="Create Table"
          icon={<KeyboardArrowLeft />}
          onClick={openTableCreator}
        />
      )}
      <form id="create-table-form" onSubmit={saveTableData}>
        {renderTableName()}
        <TextField
          floatingLabelText="Database Name"
          id="tableName"
          fullWidth={true}
          autoFocus
          onChange={(e) => tableNameChange(e.target.value)}
          value={tableName}
        />
        <InputLabel id="databaseType">Database Type</InputLabel>
        <SelectField labelId="databaseType" id="select" value="20">
          <MenuItem value="10">MongoDB</MenuItem>
          <MenuItem value="20">PostgreSQL</MenuItem>
          <MenuItem value="30">MySQL</MenuItem>
        </SelectField>
        <h5 style={{ textAlign: 'center', marginTop: '-4px' }}>( Singular naming convention )</h5>
        <RaisedButton
          label={tableID >= 0 ? 'Update Database' : 'Create Database'}
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
