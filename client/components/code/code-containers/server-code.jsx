import React from "react";
import { connect } from "react-redux";
import buildServerCode from "../../../../utl/create_file_func/graphql_server";

// styling
import "../code.css";

const mapStateToProps = (store) => ({
  databases: store.multiSchema.databases,
});

const convertTablesToData = (obj) => {
  const databasesCopy = JSON.parse(JSON.stringify(obj))
  for (const databaseIndex in databasesCopy) {
    databasesCopy[databaseIndex].data = databasesCopy[databaseIndex].tables;
    databasesCopy[databaseIndex].databaseName = databasesCopy[databaseIndex].database;
  }
  return databasesCopy
}


const CodeServerContainer = ({databases}) => {
  console.log('databases in CodeServerContainer: ', databases)
  const databasesCopy = convertTablesToData(databases);
  const serverCode = buildServerCode(databasesCopy);
  return (
    <div id="code-container-server">
      <h4 className="codeHeader">GraphQl Types, Root Queries, and Mutations</h4>
      <hr />
      <pre>{serverCode}</pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeServerContainer);
