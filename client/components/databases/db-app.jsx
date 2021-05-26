import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// components
import Table from './db.jsx';
import CreateTable from './sidebar/create-db.jsx';
import TableOptions from './sidebar/db-options.jsx';

// styles
import './schema.css';

// We use store.data, because of index.js reduce function
const mapStateToProps = store => ({
  databases: store.multiSchema.databases,
  selectedDatabase: store.multiSchema.selectedDatabase,
});

const SchemaApp = ({ databases, selectedDatabase }) => {
  // Dynamically renders each table based on the number of tables.
  function renderTables() {
    return Object.keys(databases).map(databaseIndex => (
      <CSSTransition
        key={databaseIndex}
        timeout={100}
        classNames="fadeScale"
      >
        <Table
          key={databaseIndex}
          databaseData={databases[databaseIndex]}
          databaseIndex={databaseIndex}
        />
      </CSSTransition>
    ));
  }

  return (
    <div className="schema-app-container">
      <CSSTransition
        in={true}
        timeout={200}
        classNames="fade"
      >
        <div id="sidebar-container">
          <CSSTransition
            in={selectedDatabase.databaseID < 0}
            key="table"
            timeout={200}
            classNames="fade"
          >
            <CreateTable />
          </CSSTransition>
          <CSSTransition
            in={selectedDatabase.databaseID >= 0}
            key="fields"
            timeout={200}
            classNames="fade"
          >
            <TableOptions />
          </CSSTransition>
        </div>
      </CSSTransition>
      <TransitionGroup className="table-components-container" id="wallpaper-schema">
        {renderTables()}
      </TransitionGroup>
    </div>
  );
}

export default connect(mapStateToProps, null)(SchemaApp);
