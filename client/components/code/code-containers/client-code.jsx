import React from 'react';
import { connect } from 'react-redux';
import buildClientQueries from '../../../../utl/create_file_func/client_queries';
import buildClientMutations from '../../../../utl/create_file_func/client_mutations';

// styling
import '../code.css';

const mapStateToProps = store => ({
  tables: store.schema.tables,
  databases: store.multiSchema.databases
});

const createCombinedTables = (databases) => {
  let num = 0;
  const tablesCombined = {}
  for (const databaseIndex in databases) {
      const database = databases[databaseIndex];
      for (const index in database.tables) {
        tablesCombined[num] = database.tables[index]
        num++;
     }

  }
  return tablesCombined;
}


const CodeClientContainer = ({ databases }) => {
  const tables = createCombinedTables(databases);
  const clientQueries = buildClientQueries(tables);
  const clientMutations = buildClientMutations(tables);

  return (
    <div id="code-container-client">
      <h4 className="codeHeader">Client Queries</h4>
      <hr />
      <pre>
        {clientQueries}
      </pre>
      <br />
      <br />
      <h4 className="codeHeader">Client Mutations</h4>
      <hr />
      <pre>
        {clientMutations}
      </pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeClientContainer);
