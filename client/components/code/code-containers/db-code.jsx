import React from 'react';
import { connect } from 'react-redux';
import buildMySQLScripts from '../../../../utl/create_file_func/mysql_scripts';
import buildMongoSchema from '../../../../utl/create_file_func/mongo_schema';
import buildPostgreSQLScripts from '../../../../utl/create_file_func/postgresql_scripts';

// Styling
import '../code.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const mapStateToProps = store => ({
  tables: store.schema.tables,
  database: store.schema.database,
});

const CodeDBSQLContainer = ({ database, tables }) => {
  let databaseCode = '';
  let header = '';
  const enter = `
`

  switch (database) {
    case 'MongoDB':
      header = 'MongoDB Schemas';
      databaseCode = Object.keys(tables).map(tableId => (
        <SyntaxHighlighter key={`mongoSchema${tableId}`} language="javascript" style={dracula}>
          {buildMongoSchema(tables[tableId])}
          {enter}
          {enter}
          <hr />
        </SyntaxHighlighter>
      ));
      break;
    case 'PostgreSQL':
      databaseCode = ( <SyntaxHighlighter language="javascript" style={dracula}>{buildPostgreSQLScripts(tables)}</SyntaxHighlighter> );
      header = 'PostgreSQL Create Scripts';
      break; 
    case 'MySQL':
      databaseCode = ( <SyntaxHighlighter language="javascript" style={dracula}>{buildMySQLScripts(tables)}</SyntaxHighlighter> );
      header = 'MySQL Create Scripts';
      break;
    default:
      break;
  }

  return (
    <div id="code-container-database">
      <h4 className="codeHeader">{header}</h4>
      <hr />
      <div>
        {databaseCode}
      </div>
      <pre id="column-filler-for-scroll" />
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeDBSQLContainer);
