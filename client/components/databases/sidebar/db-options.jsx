//  file doesn't look necessary in DB view

import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions.js';

// styles
import './sidebar.css';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

const style = {
  customWidth: {
    width: 200,
  },
  toggle: {
    marginTop: '5px',
  },
};

const mapStateToProps = store => ({
  database: store.schema.database,
  selectedDatabase: store.multiSchema.selectedDatabase,
  databases: store.multiSchema.databases,
});

const mapDispatchToProps = dispatch => ({
  // createField: field => dispatch(actions.addField(field)),
  saveFieldInput: database => dispatch(actions.saveFieldInput(database)),
  handleChange: field => dispatch(actions.handleFieldsUpdate(field)),
  openTableCreator: () => dispatch(actions.openTableCreator()),
  handleSnackbarUpdate: status => dispatch(actions.handleSnackbarUpdate(status)),
});

const TableOptions = ({
  database,
  selectedDatabase,
  databases,
  saveFieldInput,
  handleChange,
  openTableCreator,
  handleSnackbarUpdate,
}) => {
  function handleToggle(name, value) {
    handleChange({ name, value });

    // set required to true and disabled if primary key is selected for SQL
    if (database !== 'MongoDB' && name === 'primaryKey' && value === true) {
      handleChange({ name: 'required', value: true });
    }
  }

  // user saves added or updated field
  function submitOptions(event) {
    event.preventDefault();
    const currTableNum = selectedDatabase.databaseID;

    // remove whitespace and symbols
    const originalFieldName = selectedDatabase.name;
    const newFieldName = selectedDatabase.name.replace(/[^\w]/gi, '');

    if (!newFieldName.length) {
      return handleSnackbarUpdate('Please enter a field name (no space, symbols allowed)');
    }

    // get list of field indexes
    const listFieldIndexes = Object.keys(databases[currTableNum].fields);
    const selectedDatabaseIndex = String(selectedDatabase.tableIndex);

    // check that the new field name is not the same as a previous field name
    for (let i = 0; i < listFieldIndexes.length; i += 1) {
      const existingFieldName = databases[currTableNum].fields[listFieldIndexes[i]].name;
      // if field name is a duplicate (not counting our selected field if updating)
      if (existingFieldName === newFieldName && listFieldIndexes[i] !== selectedDatabaseIndex) {
        return handleSnackbarUpdate('Error: Field name already exist');
      }
    }

    // confirm Type, Field, and RefType are filled out if Relation is toggled
    if (selectedDatabase.relationSelected) {
      if (selectedDatabase.relation.tableIndex === -1 || selectedDatabase.relation.fieldIndex === -1 || !selectedDatabase.relation.refType) {
        return handleSnackbarUpdate('Please fill out Type, Field and RefType for matching field');
      }
    }

    // update state if field name was modified to take out spaces and symbols.
    if (originalFieldName !== newFieldName) {
      handleSnackbarUpdate('Spaces or symbols were removed from field name');
      handleChange({
        name: 'name',
        value: newFieldName,
      });
    }

    // save or update table
    return saveFieldInput();
  }

  // returns an array of the related databases
  function renderRelateddatabases() {
    return Object.keys(databases).map(tableIndex => (
      <MenuItem
        key={tableIndex}
        value={tableIndex}
        primaryText={databases[tableIndex].type}
      />
    ));
  }
  
  function renderRelatedFields() {
    const renderedFields = [];
    const selectedTableIndex = selectedDatabase.relation.tableIndex;
    if (selectedTableIndex >= 0) {
      Object.keys(databases[selectedTableIndex].fields).forEach((field) => {
        // check if field has a relation to selected field, if so, don't push
        let noRelationExists = true;
        const tableIndex = selectedDatabase.databaseID;
        const fieldIndex = selectedDatabase.tableIndex;
        if (fieldIndex >= 0) {
          const { refBy } = databases[tableIndex].fields[fieldIndex];
          const refTypes = ['one to one', 'one to many', 'many to one', 'many to many'];
          for (let i = 0; i < refTypes.length; i += 1) {
            const refInfo = `${selectedTableIndex}.${field}.${refTypes[i]}`;
            if (refBy.has(refInfo)) {
              noRelationExists = false;
            }
          }
        }
        // only push to fields if multiple values is false for the field,
        // and no relation exists to selected field
        if (!databases[selectedTableIndex].fields[field].multipleValues && noRelationExists) {
          renderedFields.push(
            <MenuItem
              key={field}
              value={field}
              primaryText={databases[selectedTableIndex].fields[field].name}
            />,
          );
        }
      });
    }
    return renderedFields;
  }

  function fieldName(fieldNum, dbNum) {
    // Header text if adding a new field
    let h2Text = 'Add Field';
    let h4Text = `in ${databases[dbNum].database}`;
    // Header text if updating a field
    if (fieldNum >= 0) {
      h2Text = `Update ${databases[dbNum].name}`;
      h4Text = `in ${databases[dbNum].database}`;
    }

    return (
      <div style={{ marginTop: '10px' }}>
        <h2>{h2Text}</h2>
        <h4 style={{ fontWeight: '200', marginTop: '5px' }}>{h4Text}</h4>
      </div>
    );
  }

  return (
    <div id="fieldOptions">
      {selectedDatabase.databaseID > -1 && (
        <div id="options" style={{ width: '250px' }}>
          <FlatButton
            id="back-to-create"
            label="Create Database"
            icon={<KeyboardArrowLeft />}
            onClick={openTableCreator}
          />
          <form style={{ width: '100%' }}>
            {fieldName(
              selectedDatabase.tableIndex,
              selectedDatabase.databaseID,
              databases,
            )}
            <TextField
              hintText="Field Name"
              floatingLabelText="Field Name"
              fullWidth={true}
              name="name"
              id="fieldNameOption"
              onChange={e => handleChange({ name: e.target.name, value: e.target.value })}
              value={selectedDatabase.name}
              autoFocus
            />
            <SelectField
              floatingLabelText="Type"
              fullWidth={true}
              value={selectedDatabase.type}
              onChange={(e, i, value) => handleChange({ name: 'type', value })}
            >
              <MenuItem value="String" primaryText="String" />
              <MenuItem value="Number" primaryText="Number" />
              <MenuItem value="Boolean" primaryText="Boolean" />
              <MenuItem value="ID" primaryText="ID" />
            </SelectField>

            <TextField
              hintText="Default Value"
              floatingLabelText="Default Value"
              fullWidth={true}
              id="defaultValueOption"
              name="defaultValue"
              onChange={e => handleChange({ name: e.target.name, value: e.target.value })}
              value={selectedDatabase.defaultValue}
            />
            {database !== 'MongoDB' && (
              <Toggle
                label="Primary Key"
                toggled={selectedDatabase.primaryKey}
                onToggle={(event, value) => handleToggle('primaryKey', value)}
                style={style.toggle}
              />
            )}
            <Toggle
              label="Required"
              toggled={selectedDatabase.required}
              onToggle={(event, value) => handleToggle('required', value)}
              style={style.toggle}
              disabled={selectedDatabase.primaryKey}
            />
            <Toggle
              label="Unique"
              toggled={selectedDatabase.unique}
              onToggle={(event, value) => handleToggle('unique', value)}
              style={style.toggle}
            />
            {database !== 'MongoDB' && (
              <Toggle
                label="Auto Increment"
                toggled={selectedDatabase.autoIncrement}
                onToggle={(event, value) => handleToggle('autoIncrement', value)}
                style={style.toggle}
              />
            )}
            {database === 'MongoDB' && (
              <Toggle
                label="Multiple Values"
                toggled={selectedDatabase.multipleValues && !selectedDatabase.relationSelected}
                onToggle={(event, value) => handleToggle('multipleValues', value)}
                style={style.toggle}
                disabled={selectedDatabase.relationSelected || selectedDatabase.refBy.size > 0}
              />
            )}
            <Toggle
              label={database === 'MongoDB' ? 'Relation' : 'Foreign Key'}
              toggled={selectedDatabase.relationSelected && !selectedDatabase.multipleValues}
              onToggle={(event, value) => handleToggle('relationSelected', value)}
              style={style.toggle}
              disabled={selectedDatabase.multipleValues}
            />
            {selectedDatabase.relationSelected && !selectedDatabase.multipleValues && (
            <span>
              <div className="relation-options">
                <p>Type:</p>
                <DropDownMenu
                  value={selectedDatabase.relation.tableIndex}
                  style={style.customWidth}
                  onChange={(e, i, value) => handleChange({ name: 'relation.tableIndex', value })}
                >
                  {renderRelateddatabases()}
                </DropDownMenu>
              </div>
              <div className="relation-options">
                <p>Field:</p>
                <DropDownMenu
                  value={selectedDatabase.relation.fieldIndex}
                  style={style.customWidth}
                  onChange={(e, i, value) => handleChange({ name: 'relation.fieldIndex', value })}
                >
                  {renderRelatedFields()}
                </DropDownMenu>
              </div>
              <div className="relation-options">
                <p>RefType:</p>
                <DropDownMenu
                  value={selectedDatabase.relation.refType}
                  style={style.customWidth}
                  onChange={(e, i, value) => handleChange({ name: 'relation.refType', value })}
                >
                  <MenuItem value="one to one" primaryText="one to one" />
                  <MenuItem value="one to many" primaryText="one to many" />
                  <MenuItem value="many to one" primaryText="many to one" />
                  {/* <MenuItem value="many to many" primaryText="many to many" /> */}
                </DropDownMenu>
              </div>
            </span>)}
            <RaisedButton
              secondary={true}
              label={selectedDatabase.tableIndex > -1 ? 'Update Field' : 'Create Field'}
              type="submit"
              onClick={submitOptions}
              style={{ marginTop: '25px' }}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableOptions);
