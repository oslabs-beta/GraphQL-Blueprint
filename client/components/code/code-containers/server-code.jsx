import React from "react";
import { connect } from "react-redux";
import buildServerCode from "../../../../utl/create_file_func/graphql_server";

// styling
import "../code.css";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const mapStateToProps = (store) => ({
  databases: store.multiSchema.databases,
});

const convertTablesToData = (obj) => {
  const databasesCopy = JSON.parse(JSON.stringify(obj))
  for (const databaseIndex in databasesCopy) {
    databasesCopy[databaseIndex].databaseName = databasesCopy[databaseIndex].database;
  }
  return databasesCopy
}


const CodeServerContainer = ({databases}) => {
  const dbCopy = convertTablesToData(databases);
  const serverCode = buildServerCode(dbCopy);
  return (
    <div id="code-container-server">
      <h4 className="codeHeader">GraphQl Types, Root Queries, and Mutations</h4>
      <hr />
      <SyntaxHighlighter language="javascript" style={dracula}>
        {serverCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeServerContainer);
