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
  deleteDatabase: databaseIndex => dispatch(actions.deleteDatabase(databaseIndex)),
  //  this reducer doesnt seem necessary in our db view
  // addField: fieldName => dispatch(actions.addFieldClicked(fieldName)),

  //  requires a reducer to handleSelectedDatabase
  handleSelectedDatabase: databaseIndex => dispatch(actions.handleSelectedDatabase(databaseIndex)),

  //  fields dont exist in db view, so reducer may be unnecessary
  // deletedFieldRelationUpdate: indexes => dispatch(actions.deletedFieldRelationUpdate(indexes)),
});

const Table = ({
  //  props are passed in from db-app.jsx
  databaseIndex,
  databaseData,
  deleteDatabase,
  handleSelectedDatabase
}) => {
  const colors = ['darkcyan', 'dodgerblue', 'crimson', 'orangered', 'darkviolet',
    'gold', 'hotpink', 'seagreen', 'darkorange', 'tomato', 'mediumspringgreen',
    'purple', 'darkkhaki', 'firebrick', 'steelblue', 'limegreen', 'sienna',
    'darkslategrey', 'goldenrod', 'deeppink'];

  return (
    <div className="table" style={{ border: `1px solid ${colors[databaseData.databaseID]}` }}>
      <div>
        <div className="type">
          <FlatButton
            backgroundColor={colors[databaseData.databaseID]}
            value={databaseIndex}
            onClick={event => handleSelectedDatabase(event.currentTarget.value)}
            className="tableButton"
          >
            <h4>{databaseData.name}</h4>
          </FlatButton>
          <FlatButton
            className="delete-button"
            icon={<Delete />}
            value={databaseIndex}
            onClick={event => deleteDatabase(event.currentTarget.value)}
            style={style.deleteStyle}
          />
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#ffffff', margin: '2rem 0' }}>
        <h4 style={{ margin: '0.5rem 0' }}>{databaseData.database}</h4>
        <p style={{ margin: '0.25rem 0' }}>{databaseData.tableIndex} tables</p>
      </div>
      <div onClick={() => 
          {document.getElementById('schemaTab').click()
          addField(tableIndex)}} 
          className="addField">
        <p style={{ marginTop: '10px' }}>
            Edit Tables
        </p>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
