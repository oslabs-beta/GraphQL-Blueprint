import React from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Delete from 'material-ui/svg-icons/action/delete';
// import Close from 'material-ui/svg-icons/navigation/close';
import * as actions from '../../actions/actions';
import Field from './field.jsx';

const style = {
  deleteStyle: {
    minWidth: '25px',
    position: 'absolute',
    right: '10px',
  },
  idFiled: {
    width: '100%',
    justifyContent: 'center',
    color: 'white',
    marginTop: '5px',
    cursor: 'pointer',
  },
};

const mapStateToProps = store => ({
  databases: store.multiSchema.databases,

  // database prop might not be needed, (the equivilent is databaseTypes)
  // database: store.schema.database,
});

const mapDispatchToProps = dispatch => ({
  //  requires reducer to delete database
  deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
  //  this reducer doesnt seem necessary in our db view
  // addField: fieldName => dispatch(actions.addFieldClicked(fieldName)),

  //  requires a reducer to handleSelectedDatabase
  handleSelectedTable: tableIndex => dispatch(actions.handleSelectedTable(tableIndex)),

  //  fields dont exist in db view, so reducer may be unnecessary
  // deletedFieldRelationUpdate: indexes => dispatch(actions.deletedFieldRelationUpdate(indexes)),
});

const Table = ({
  //  props are passed in from db-app.jsx
  databaseIndex,
  databaseData,

  // database,
  deleteTable,
  // addField,
  handleSelectedTable,
}) => {
  const colors = ['darkcyan', 'dodgerblue', 'crimson', 'orangered', 'darkviolet',
    'gold', 'hotpink', 'seagreen', 'darkorange', 'tomato', 'mediumspringgreen',
    'purple', 'darkkhaki', 'firebrick', 'steelblue', 'limegreen', 'sienna',
    'darkslategrey', 'goldenrod', 'deeppink'];

  function renderFields() {
    return Object.keys(databaseData.fields).map((property) => {
      const field = tableData.fields[property];
      const relation = field.relation.tableIndex;
      const refBy = field.refBy;

      // if MongoDB is selected, the ID field is no longer clickable
      let buttonDisabled = false;
      if (database === 'MongoDB' && tableData.fields[property].name === 'id') {
        buttonDisabled = true;
      }

      // button color is clear unless there is a relation
      let buttonColor = 'rgba(0,0,0,0)';
      if (relation >= 0) buttonColor = colors[relation];

      // create relation colors if field has relation
      let refColor = 'rgba(0,0,0,0)';
      if (refBy.size > 0) {
        const transparent = ', transparent';
        let gradient = `linear-gradient(-45deg${transparent.repeat(25)}`;

        refBy.forEach((ref) => {
          gradient += `, #363A42, ${colors[ref.split('.')[0]]}`;
        });

        gradient += ', #363A42, transparent, transparent)';
        refColor = gradient;
      }

      return (
        <Field
          key={property}
          buttonColor={buttonColor}
          refColor={refColor}
          databaseIndex={databaseIndex}
          fieldIndex={property}
          buttonDisabled={buttonDisabled}
          field={field}
        />
      );
    });
  }

  return (
    <div className="table" style={{ border: `1px solid ${colors[databaseData.databaseID]}` }}>
      <div>
        <div className="type">
          <FlatButton
            backgroundColor={colors[databaseData.databaseID]}
            value={databaseIndex}
            onClick={event => handleSelectedTable(event.currentTarget.value)}
            className="tableButton"
          >
            <h4>{databaseData.name}</h4>
          </FlatButton>
          <FlatButton
            className="delete-button"
            icon={<Delete />}
            value={databaseIndex}
            onClick={event => deleteTable(event.currentTarget.value)}
            style={style.deleteStyle}
          />
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#ffffff', margin: '2rem 0' }}>
        <h4 style={{ margin: '0.5rem 0' }}>MongoDB</h4>
        <p style={{ margin: '0.25rem 0' }}>4 tables</p>
      </div>
      <div onClick={() => addField(tableIndex)} className="addField">
        <p style={{ marginTop: '10px' }}>
            Edit Tables
        </p>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
