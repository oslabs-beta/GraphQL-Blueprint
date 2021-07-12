import React from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Delete from 'material-ui/svg-icons/action/delete';
// import Close from 'material-ui/svg-icons/navigation/close';
import * as actions from '../../actions/actions';

const style = {
  deleteStyle: {
    minWidth: '25px',
    position: 'absolute',
    right: '0',
    top: '0',
    color: '#A1A1A1'
  },
  editStyle: {
    border: '2px solid #000',
    padding: '4px 16px',
    borderRadius: '50px',
    height: 'auto',
    lineHeight: 'auto',
    fontSize: '14px',
    fontWeight: '500',
    float: 'right',
    marginTop: '16px',
    boxShadow: 'none'
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
  handleInjectDatabase: database => dispatch(actions.handleInjectDatabase(database)),
  handleSelectedDatabase: databaseIndex => dispatch(actions.handleSelectedDatabase(databaseIndex)),
  openTableCreator: () => dispatch(actions.openTableCreator())
  //  fields dont exist in db view, so reducer may be unnecessary
  // deletedFieldRelationUpdate: indexes => dispatch(actions.deletedFieldRelationUpdate(indexes)),
});

const Table = ({
  //  props are passed in from db-app.jsx
  databaseIndex,
  databaseData,
  databases,
  handleInjectDatabase,
  deleteDatabase,
  handleSelectedDatabase,
  openTableCreator
}) => {
  const colors = ['darkcyan', 'dodgerblue', 'crimson', 'orangered', 'darkviolet',
    'gold', 'hotpink', 'seagreen', 'darkorange', 'tomato', 'mediumspringgreen',
    'purple', 'darkkhaki', 'firebrick', 'steelblue', 'limegreen', 'sienna',
    'darkslategrey', 'goldenrod', 'deeppink'];

  function grabSelectedDatabase(e) {
    const selectedDatabase = databases[Number(e)];
    openTableCreator()
    handleInjectDatabase(selectedDatabase)
  };

  return (
    <div className="table">
      <div 
        style={{
          opacity: '0.15',
          position: 'absolute',
          bottom: '-40px',
          right: '-20px',
          width: '97px',
          height: '101px',
          backgroundImage: `url('images/${databaseData.database}.png')`,
          backgroundSize: 'cover',
        }}
      ></div>
      <div>
        <div 
          className="type"
        >
          <div
            backgroundColor={colors[databaseData.databaseID]}
            data-value={databaseIndex}
            onClick={event => handleSelectedDatabase(event.currentTarget.getAttribute("data-value"))}
            className="tableButton"
          >
            <div
              className="db-logo"
              style={{
                backgroundImage: `url('images/${databaseData.database}.png')`,
                backgroundSize: 'cover',
              }}
            >
            </div>
            <h4>
              {databaseData.name}
              <small>{databaseData.database} <span style={{color: '#939393'}}>•</span> {databaseData.tableIndex} tables</small>
            </h4>
          </div>
          <FlatButton
            className="delete-button"
            icon={<box-icon name='trash'></box-icon>}
            value={databaseIndex}
            onClick={event => deleteDatabase(event.currentTarget.value)}
            style={style.deleteStyle}
          />
        </div>
      </div>
        <FlatButton 
          className="edit-tables"
          value={databaseData.databaseID}
          onClick={(e) => 
            { grabSelectedDatabase(e.currentTarget.value)
              setTimeout(()=>{document.getElementById('schemaTab').click()}, 0)
            }}
            style={style.editStyle}
        >
            Edit Tables
        </FlatButton>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
