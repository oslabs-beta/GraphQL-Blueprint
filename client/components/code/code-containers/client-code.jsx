import React from 'react';
import { connect } from 'react-redux';
import buildClientQueries from '../../../../utl/create_file_func/client_queries';
import buildClientMutations from '../../../../utl/create_file_func/client_mutations';

// styling
import '../code.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
      <SyntaxHighlighter language="javascript" style={dracula}>
        {clientQueries}
      </SyntaxHighlighter>
      <br />
      <br />
      <h4 className="codeHeader">Client Mutations</h4>
      <hr />
      <SyntaxHighlighter language="javascript" style={dracula}>
        {clientMutations}
      </SyntaxHighlighter>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeClientContainer);
