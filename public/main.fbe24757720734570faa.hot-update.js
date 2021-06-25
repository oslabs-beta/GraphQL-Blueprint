webpackHotUpdate("main",{

/***/ "../utl/create_file_func/graphql_server.js":
/*!*************************************************!*\
  !*** ../utl/create_file_func/graphql_server.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tab = "  ";

// Function that evokes all other helper functions

function parseGraphqlServer(databases) {
  console.log('databases in parseGraphqlServer', databases);
  var query = "";
  query += "const graphql = require('graphql');\n";
  for (var databaseIndex in databases) {
    var database = databases[databaseIndex];
    // database.data is same as database.tables

    query += buildRequireStatements(database.data, database.databaseName, database.name);
  }
  query += buildGraphqlVariables();

  // BUILD TYPE SCHEMA
  for (var _databaseIndex in databases) {
    var tables = databases[_databaseIndex].data;
    var databaseName = databases[_databaseIndex].databaseName;
    for (var tableIndex in tables) {
      query += buildGraphqlTypeSchema(tables[tableIndex], tables, databaseName);
    }
  }

  // BUILD ROOT QUERY
  query += "const RootQuery = new GraphQLObjectType({\n" + tab + "name: 'RootQueryType',\n" + tab + "fields: {\n";

  var firstRootLoop = true;
  for (var _databaseIndex2 in databases) {
    var _tables = databases[_databaseIndex2].data;
    var _databaseName = databases[_databaseIndex2].databaseName;
    for (var _tableIndex in _tables) {
      if (!firstRootLoop) query += ",\n";
      firstRootLoop = false;

      query += buildGraphqlRootQuery(_tables[_tableIndex], _databaseName);
    }
  }
  query += "\n" + tab + "}\n});\n\n";

  // BUILD MUTATIONS
  query += "const Mutation = new GraphQLObjectType({\n" + tab + "name: 'Mutation',\n" + tab + "fields: {\n";

  var firstMutationLoop = true;
  for (var _databaseIndex3 in databases) {
    var _tables2 = databases[_databaseIndex3].data;
    var _databaseName2 = databases[_databaseIndex3].databaseName;
    for (var _tableIndex2 in _tables2) {
      if (!firstMutationLoop) query += ",\n";
      firstMutationLoop = false;

      query += buildGraphqlMutationQuery(_tables2[_tableIndex2], _databaseName2);
    }
  }
  query += "\n" + tab + "}\n});\n\n";

  query += "module.exports = new GraphQLSchema({\n" + tab + "query: RootQuery,\n" + tab + "mutation: Mutation\n});";
  return query;
}

/**
 * @param {String} database - Represents the database selected (MongoDB, MySQL, or PostgreSQL)
 * @returns {String} - All the require statements needed for the GraphQL server.
 */
function buildRequireStatements(tables, database, name) {
  var requireStatements = "";
  if (database === "MongoDB") {
    for (var tableIndex in tables) {
      requireStatements += "const " + tables[tableIndex].type + " = require('../db/" + name + "/" + tables[tableIndex].type.toLowerCase() + ".js');\n";
    }
  } else {
    requireStatements += "const pool = require('../db/" + name + "/sql_pool.js');\n";
  }
  return requireStatements;
}

/**
 * @returns {String} - all constants needed for a GraphQL server
 */
function buildGraphqlVariables() {
  return "\nconst { \n  GraphQLObjectType,\n  GraphQLSchema,\n  GraphQLID,\n  GraphQLString, \n  GraphQLInt, \n  GraphQLBoolean,\n  GraphQLList,\n  GraphQLNonNull\n} = graphql;\n  \n";
}

/**
 * @param {Object} table - table being interated on. Each table consists of fields
 * @param {Object} tables - an object of all the tables created in the application
 * @param {String} database - Database selected (MongoDB, MySQL, or PostgreSQL)
 * @returns {String} - The GraphQL type code for the inputted table
 */
function buildGraphqlTypeSchema(table, tables, database) {
  var query = "const " + table.type + "Type = new GraphQLObjectType({\n";
  query += tab + "name: '" + table.type + "',\n";
  query += tab + "fields: () => ({";
  query += buildGraphQLTypeFields(table, tables, database);
  return query += "\n" + tab + "})\n});\n\n";
}

/**
 * @param {Object} table - table being interated on. Each table consists of fields
 * @param {Object} tables - an object of all the tables created in the application
 * @param {String} database - Database selected (MongoDB, MySQL, or PostgreSQL)
 * @returns {String} - each field for the GraphQL type.
 */
function buildGraphQLTypeFields(table, tables, database) {
  var query = "";
  var firstLoop = true;

  var _loop = function _loop(fieldIndex) {
    if (!firstLoop) query += ",";
    firstLoop = false;

    query += "\n" + tab + tab + buildFieldItem(table.fields[fieldIndex]);
    // check if the field has a relation to another field
    if (table.fields[fieldIndex].relation.tableIndex > -1) {
      query += createSubQuery(table.fields[fieldIndex], tables, database);
    }

    // check if the field is a relation for another field
    var refBy = table.fields[fieldIndex].refBy;
    if (Array.isArray(refBy)) {
      refBy.forEach(function (value) {
        var parsedValue = value.split(".");
        var field = {
          name: table.fields[fieldIndex].name,
          relation: {
            tableIndex: parsedValue[0],
            fieldIndex: parsedValue[1],
            refType: parsedValue[2],
            type: table.fields[fieldIndex].type
          }
        };
        query += createSubQuery(field, tables, database);
      });
    }
  };

  for (var fieldIndex in table.fields) {
    _loop(fieldIndex);
  }
  return query;
}

/**
 * @param {Object} field - an object containing all the information for the field being iterated on
 * @returns {String} - a field item (ex: 'id: { type: GraphQLID }')
 */
function buildFieldItem(field) {
  return field.name + ": { type: " + checkForRequired(field.required, "front") + checkForMultipleValues(field.multipleValues, "front") + tableTypeToGraphqlType(field.type) + checkForMultipleValues(field.multipleValues, "back") + checkForRequired(field.required, "back") + " }";
}

/**
 * @param {String} type - the field type (ID, String, Number, Boolean, or Float)
 * @returns {String} - the GraphQL type associated with the field type entered
 */
function tableTypeToGraphqlType(type) {
  switch (type) {
    case "ID":
      return "GraphQLID";
    case "String":
      return "GraphQLString";
    case "Number":
      return "GraphQLInt";
    case "Boolean":
      return "GraphQLBoolean";
    case "Float":
      return "GraphQLFloat";
    default:
      return "GraphQLString";
  }
}

/**
 * @param {String} refTypeName - Any string inputted
 * @returns {String} - The string inputted, but with the first letter capitalized and the rest lowercased
 */
function toTitleCase(refTypeName) {
  var name = refTypeName[0].toUpperCase();
  name += refTypeName.slice(1).toLowerCase();
  return name;
}

/**
 * @param {Object} field - field being iterated on
 * @param {Object} tables - all the tables made by the user.
 * @param {String} database - Datbase selected
 * @returns {String} - Builds a sub type for any field with a relation.
 */
function createSubQuery(field, tables, database) {
  var refTypeName = tables[field.relation.tableIndex].type;
  var refFieldName = tables[field.relation.tableIndex].fields[field.relation.fieldIndex].name;
  var refFieldType = tables[field.relation.tableIndex].fields[field.relation.fieldIndex].type;
  var query = ",\n" + tab + tab + createSubQueryName(field, refTypeName) + ": {\n" + tab + tab + tab + "type: ";

  if (field.relation.refType === "one to many" || field.relation.refType === "many to many") {
    query += "new GraphQLList(" + refTypeName + "Type),";
  } else {
    query += refTypeName + "Type,";
  }
  query += "\n" + tab + tab + tab + "resolve(parent, args) {\n";

  if (database === "MongoDB") {
    query += "" + tab + tab + tab + tab + "return " + refTypeName + "." + findDbSearchMethod(refFieldName, refFieldType, field.relation.refType);
    query += "(" + createSearchObject(refFieldName, refFieldType, field) + ");\n";
    query += "" + tab + tab + tab + "}\n";
    query += "" + tab + tab + "}";
  }

  if (database === "MySQL" || database === "PostgreSQL") {
    query += "" + tab + tab + tab + tab + "const sql = `SELECT * FROM \"" + refTypeName + "\" WHERE \"" + refFieldName + "\" = '${parent." + field.name + "}';`\n";
    query += buildSQLPoolQuery(field.relation.refType);
    query += "" + tab + tab + tab + "}\n";
    query += "" + tab + tab + "}";
  }
  return query;
}

/**
 * @param {String} refType - The relation type of the sub query
 * @returns {String} - the code for a SQL pool query.
 */
function buildSQLPoolQuery(refType) {
  var rows = "";
  if (refType === "one to one" || refType === "many to one") rows = "rows[0]";else rows = "rows";

  var query = "" + tab + tab + tab + tab + "return pool.query(sql)\n";
  query += "" + tab + tab + tab + tab + tab + ".then(res => res." + rows + ")\n";
  query += "" + tab + tab + tab + tab + tab + ".catch(err => console.log('Error: ', err))\n";
  return query;
}

function createSubQueryName(field, refTypeName) {
  switch (field.relation.refType) {
    case "one to one":
      return "related" + toTitleCase(refTypeName);
    case "one to many":
      return "everyRelated" + toTitleCase(refTypeName);
    case "many to one":
      return "related" + toTitleCase(refTypeName);
    case "many to many":
      return "everyRelated" + toTitleCase(refTypeName);
    default:
      return "everyRelated" + toTitleCase(refTypeName);
  }
}

function findDbSearchMethod(refFieldName, refFieldType, refType) {
  if (refFieldName === "id" || refFieldType === "ID") return "findById";else if (refType === "one to one") return "findOne";else return "find";
}

function createSearchObject(refFieldName, refFieldType, field) {
  if (refFieldName === "id" || refFieldType === "ID") {
    return "parent." + field.name;
  } else {
    return "{ " + refFieldName + ": parent." + field.name + " }";
  }
}

function buildGraphqlRootQuery(table, database) {
  var query = "";

  query += createFindAllRootQuery(table, database);

  if (!!table.fields[0]) {
    query += createFindByIdQuery(table, database);
  }

  return query;
}

function createFindAllRootQuery(table, database) {
  var query = "" + tab + tab + "every" + toTitleCase(table.type) + ": {\n";
  query += "" + tab + tab + tab + "type: new GraphQLList(" + table.type + "Type),\n";
  query += "" + tab + tab + tab + "resolve() {\n";

  if (database === "MongoDB") {
    query += "" + tab + tab + tab + tab + "return " + table.type + ".find({});\n";
  }

  if (database === "MySQL" || database === "PostgreSQL") {
    query += "" + tab + tab + tab + tab + "const sql = `SELECT * FROM \"" + table.type + "\";`\n";
    query += buildSQLPoolQuery("many");
  }

  return query += "" + tab + tab + tab + "}\n" + tab + tab + "}";
}

/**
 * @param {Object} table - table being iterated on
 * @param {String} database - database selected
 * @returns {String} - root query code to find an individual type
 */
function createFindByIdQuery(table, database) {
  var idFieldName = table.fields[0].name;
  var query = ",\n" + tab + tab + table.type.toLowerCase() + ": {\n";
  query += "" + tab + tab + tab + "type: " + table.type + "Type,\n";
  query += "" + tab + tab + tab + "args: { " + idFieldName + ": { type: " + tableTypeToGraphqlType(table.fields[0].type) + "}},\n";
  query += "" + tab + tab + tab + "resolve(parent, args) {\n";

  if (database === "MongoDB") {
    query += "" + tab + tab + tab + tab + "return " + table.type + ".findById(args.id);\n";
  }
  if (database === "MySQL" || database === "PostgreSQL") {
    query += "" + tab + tab + tab + tab + "const sql = `SELECT * FROM \"" + table.type + "\" WHERE " + idFieldName + " = '${args.id}';`;\n";
    query += buildSQLPoolQuery("one to one");
  }

  return query += "" + tab + tab + tab + "}\n" + tab + tab + "}";
}

function buildGraphqlMutationQuery(table, database) {
  var string = "";
  string += "" + addMutation(table, database);
  if (table.fields[0]) {
    string += ",\n" + updateMutation(table, database) + ",\n";
    string += "" + deleteMutation(table, database);
  }
  return string;
}

function buildSQLPoolMutation() {
  var string = "";
  string += "" + tab + tab + tab + tab + "return pool.connect()\n";
  string += "" + tab + tab + tab + tab + tab + ".then(client => {\n";
  string += "" + tab + tab + tab + tab + tab + tab + "return client.query(sql)\n";
  string += "" + tab + tab + tab + tab + tab + tab + tab + ".then(res => {\n";
  string += "" + tab + tab + tab + tab + tab + tab + tab + tab + "client.release();\n";
  string += "" + tab + tab + tab + tab + tab + tab + tab + tab + "return res.rows[0];\n";
  string += "" + tab + tab + tab + tab + tab + tab + tab + "})\n";
  string += "" + tab + tab + tab + tab + tab + tab + tab + ".catch(err => {\n";
  string += "" + tab + tab + tab + tab + tab + tab + tab + tab + "client.release();\n";
  string += "" + tab + tab + tab + tab + tab + tab + tab + tab + "console.log('Error: ', err);\n";
  string += "" + tab + tab + tab + tab + tab + tab + tab + "})\n";
  string += "" + tab + tab + tab + tab + tab + "})\n";
  return string;
}

function addMutation(table, database) {
  var query = "" + tab + tab + "add" + table.type + ": {\n";
  query += "" + tab + tab + tab + "type: " + table.type + "Type,\n";
  query += "" + tab + tab + tab + "args: {\n";

  var firstLoop = true;
  for (var fieldIndex in table.fields) {
    if (!firstLoop) query += ",\n";
    firstLoop = false;

    query += "" + tab + tab + tab + tab + buildFieldItem(table.fields[fieldIndex]);
  }
  query += "\n" + tab + tab + tab + "},\n";
  query += "" + tab + tab + tab + "resolve(parent, args) {\n";

  if (database === "MongoDB") {
    query += "" + tab + tab + tab + tab + "const " + table.type.toLowerCase() + " = new " + table.type + "(args);\n";
    query += "" + tab + tab + tab + tab + "return " + table.type.toLowerCase() + ".save();\n";
  }

  if (database === "MySQL" || database === "PostgreSQL") {
    query += "" + tab + tab + tab + tab + "const columns = Object.keys(args).map(el => `\"${el}\"`);\n";
    query += "" + tab + tab + tab + tab + "const values = Object.values(args).map(el => `'${el}'`);\n";
    query += "" + tab + tab + tab + tab + "const sql = `INSERT INTO \"" + table.type + "\" (${columns}) VALUES (${values}) RETURNING *`;\n";
    query += buildSQLPoolMutation();
  }

  return query += "" + tab + tab + tab + "}\n" + tab + tab + "}";
}

function updateMutation(table, database) {
  var query = "" + tab + tab + "update" + table.type + ": {\n" + tab + tab + tab + "type: " + table.type + "Type,\n" + tab + tab + tab + "args: {\n";

  var firstLoop = true;
  for (var fieldIndex in table.fields) {
    if (!firstLoop) query += ",\n";
    firstLoop = false;

    query += "" + tab + tab + tab + tab + buildFieldItem(table.fields[fieldIndex]);
  }

  query += "\n" + tab + tab + tab + "},\n" + tab + tab + tab + "resolve(parent, args) {\n";

  if (database === "MongoDB") query += "" + tab + tab + tab + tab + "return " + table.type + ".findByIdAndUpdate(args.id, args);\n";

  if (database === "MySQL" || database === "PostgreSQL") {
    query += "" + tab + tab + tab + tab + "let updateValues = '';\n";
    query += "" + tab + tab + tab + tab + "for (const prop in args) {\n";
    query += "" + tab + tab + tab + tab + tab + "if (updateValues.length > 0) updateValues += `, `;\n";
    query += "" + tab + tab + tab + tab + tab + "updateValues += `\"${prop}\" = '${args[prop]}' `;\n";
    query += "" + tab + tab + tab + tab + "}\n";
    query += "" + tab + tab + tab + tab + "const sql = `UPDATE \"" + table.type + "\" SET ${updateValues} WHERE id = '${args.id}' RETURNING *;`\n";
    query += buildSQLPoolMutation();
  }
  return query += "" + tab + tab + tab + "}\n" + tab + tab + "}";
}

function deleteMutation(table, database) {
  var idFieldName = table.fields[0].name;
  var query = "" + tab + tab + "delete" + table.type + ": {\n";
  query += "" + tab + tab + tab + "type: " + table.type + "Type,\n";
  query += "" + tab + tab + tab + "args: { " + idFieldName + ": { type: " + tableTypeToGraphqlType(table.fields[0].type) + "}},\n";
  query += "" + tab + tab + tab + "resolve(parent, args) {\n";

  if (database === "MongoDB") {
    query += "" + tab + tab + tab + tab + "return " + table.type + ".findByIdAndRemove(args.id);\n";
  }

  if (database === "MySQL" || database === "PostgreSQL") {
    query += "" + tab + tab + tab + tab + "const sql = `DELETE FROM \"" + table.type + "\" WHERE id = '${args.id}' RETURNING *;`\n";
    query += buildSQLPoolMutation();
  }

  return query += "" + tab + tab + tab + "}\n" + tab + tab + "}";
}

function checkForRequired(required, position) {
  if (required) {
    if (position === "front") {
      return "new GraphQLNonNull(";
    }
    return ")";
  }
  return "";
}

function checkForMultipleValues(multipleValues, position) {
  if (multipleValues) {
    if (position === "front") {
      return "new GraphQLList(";
    }
    return ")";
  }
  return "";
}

module.exports = parseGraphqlServer;

/***/ }),

/***/ "./components/code/code-containers/server-code.jsx":
/*!*********************************************************!*\
  !*** ./components/code/code-containers/server-code.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(/*! react */ "../node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _graphql_server = __webpack_require__(/*! ../../../../utl/create_file_func/graphql_server */ "../utl/create_file_func/graphql_server.js");

var _graphql_server2 = _interopRequireDefault(_graphql_server);

__webpack_require__(/*! ../code.css */ "./components/code/code.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(store) {
  return {
    databases: store.multiSchema.databases
  };
};

// styling


var createDatabaseCopy = function createDatabaseCopy(obj) {
  var databasesCopy = JSON.parse(JSON.stringify(obj));
  for (var databaseIndex in obj) {

    Object.defineProperty(obj[databaseIndex][t], new_key, Object.getOwnPropertyDescriptor(o, old_key));
    delete o[old_key];
  }
};

var CodeServerContainer = function CodeServerContainer(_ref) {
  var databases = _ref.databases;

  console.log('databases in CodeServerContainer', databases);
  var serverCode = (0, _graphql_server2.default)(databases);
  console.log('serverCode:', serverCode);
  console.log('buildServerCode:', _graphql_server2.default);
  return _react2.default.createElement(
    "div",
    { id: "code-container-server" },
    _react2.default.createElement(
      "h4",
      { className: "codeHeader" },
      "GraphQl Types, Root Queries, and Mutations"
    ),
    _react2.default.createElement("hr", null),
    _react2.default.createElement(
      "pre",
      null,
      serverCode
    )
  );
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, null)(CodeServerContainer);

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9jb2RlL2NvZGUtY29udGFpbmVycy9zZXJ2ZXItY29kZS5qc3giXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwiZGF0YWJhc2VzIiwiY29uc29sZSIsImxvZyIsInF1ZXJ5IiwiZGF0YWJhc2VJbmRleCIsImRhdGFiYXNlIiwiYnVpbGRSZXF1aXJlU3RhdGVtZW50cyIsImRhdGEiLCJkYXRhYmFzZU5hbWUiLCJuYW1lIiwiYnVpbGRHcmFwaHFsVmFyaWFibGVzIiwidGFibGVzIiwidGFibGVJbmRleCIsImJ1aWxkR3JhcGhxbFR5cGVTY2hlbWEiLCJmaXJzdFJvb3RMb29wIiwiYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5IiwiZmlyc3RNdXRhdGlvbkxvb3AiLCJidWlsZEdyYXBocWxNdXRhdGlvblF1ZXJ5IiwicmVxdWlyZVN0YXRlbWVudHMiLCJ0eXBlIiwidG9Mb3dlckNhc2UiLCJ0YWJsZSIsImJ1aWxkR3JhcGhRTFR5cGVGaWVsZHMiLCJmaXJzdExvb3AiLCJmaWVsZEluZGV4IiwiYnVpbGRGaWVsZEl0ZW0iLCJmaWVsZHMiLCJyZWxhdGlvbiIsImNyZWF0ZVN1YlF1ZXJ5IiwicmVmQnkiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwidmFsdWUiLCJwYXJzZWRWYWx1ZSIsInNwbGl0IiwiZmllbGQiLCJyZWZUeXBlIiwiY2hlY2tGb3JSZXF1aXJlZCIsInJlcXVpcmVkIiwiY2hlY2tGb3JNdWx0aXBsZVZhbHVlcyIsIm11bHRpcGxlVmFsdWVzIiwidGFibGVUeXBlVG9HcmFwaHFsVHlwZSIsInRvVGl0bGVDYXNlIiwicmVmVHlwZU5hbWUiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwicmVmRmllbGROYW1lIiwicmVmRmllbGRUeXBlIiwiY3JlYXRlU3ViUXVlcnlOYW1lIiwiZmluZERiU2VhcmNoTWV0aG9kIiwiY3JlYXRlU2VhcmNoT2JqZWN0IiwiYnVpbGRTUUxQb29sUXVlcnkiLCJyb3dzIiwiY3JlYXRlRmluZEFsbFJvb3RRdWVyeSIsImNyZWF0ZUZpbmRCeUlkUXVlcnkiLCJpZEZpZWxkTmFtZSIsInN0cmluZyIsImFkZE11dGF0aW9uIiwidXBkYXRlTXV0YXRpb24iLCJkZWxldGVNdXRhdGlvbiIsImJ1aWxkU1FMUG9vbE11dGF0aW9uIiwicG9zaXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwibWFwU3RhdGVUb1Byb3BzIiwic3RvcmUiLCJtdWx0aVNjaGVtYSIsImNyZWF0ZURhdGFiYXNlQ29weSIsIm9iaiIsImRhdGFiYXNlc0NvcHkiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInQiLCJuZXdfa2V5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwibyIsIm9sZF9rZXkiLCJDb2RlU2VydmVyQ29udGFpbmVyIiwic2VydmVyQ29kZSIsImJ1aWxkU2VydmVyQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsVUFBTjs7QUFFQTs7QUFFQSxTQUFTQyxrQkFBVCxDQUE0QkMsU0FBNUIsRUFBdUM7QUFDckNDLFVBQVFDLEdBQVIsQ0FBWSxpQ0FBWixFQUErQ0YsU0FBL0M7QUFDQSxNQUFJRyxRQUFRLEVBQVo7QUFDQUEsV0FBUyx1Q0FBVDtBQUNBLE9BQUssSUFBTUMsYUFBWCxJQUE0QkosU0FBNUIsRUFBdUM7QUFDckMsUUFBTUssV0FBV0wsVUFBVUksYUFBVixDQUFqQjtBQUNBOztBQUVBRCxhQUFTRyx1QkFBdUJELFNBQVNFLElBQWhDLEVBQXNDRixTQUFTRyxZQUEvQyxFQUE2REgsU0FBU0ksSUFBdEUsQ0FBVDtBQUNEO0FBQ0ROLFdBQVNPLHVCQUFUOztBQUVBO0FBQ0EsT0FBSyxJQUFNTixjQUFYLElBQTRCSixTQUE1QixFQUF1QztBQUNyQyxRQUFNVyxTQUFTWCxVQUFVSSxjQUFWLEVBQXlCRyxJ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QU9DLGNBQVAsQ0FBc0JOLElBQUlqRSxhQUFKLEVBQW1Cd0UsQ0FBbkIsQ0FBdEIsRUFBNkNDLE9BQTdDLEVBQ0lILE9BQU9JLHdCQUFQLENBQWdDQyxDQUFoQyxFQUFtQ0MsT0FBbkMsQ0FESjtBQUVBLFdBQU9ELEVBQUVDLE9BQUYsQ0FBUDtBQUNEO0FBRUYsQ0FWRDs7QUFhQSxJQUFNQyxzQkFBc0IsU0FBdEJBLG1CQUFzQixPQUFpQjtBQUFBLE1BQWZqRixTQUFlLFFBQWZBLFNBQWU7O0FBQzNDQyxVQUFRQyxHQUFSLENBQVksa0NBQVosRUFBZ0RGLFNBQWhEO0FBQ0EsTUFBTWtGLGFBQWEsOEJBQWdCbEYsU0FBaEIsQ0FBbkI7QUFDQUMsVUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJnRixVQUEzQjtBQUNBakYsVUFBUUMsR0FBUixDQUFZLGtCQUFaLEVBQWdDaUYsd0JBQWhDO0FBQ0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFBTUQ7QUFBTjtBQUhGLEdBREY7QUFPRCxDQVpEOztrQkFjZSx5QkFBUWpCLGVBQVIsRUFBeUIsSUFBekIsRUFBK0JnQixtQkFBL0IsQyIsImZpbGUiOiJtYWluLmZiZTI0NzU3NzIwNzM0NTcwZmFhLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0YWIgPSBgICBgO1xuXG4vLyBGdW5jdGlvbiB0aGF0IGV2b2tlcyBhbGwgb3RoZXIgaGVscGVyIGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBwYXJzZUdyYXBocWxTZXJ2ZXIoZGF0YWJhc2VzKSB7XG4gIGNvbnNvbGUubG9nKCdkYXRhYmFzZXMgaW4gcGFyc2VHcmFwaHFsU2VydmVyJywgZGF0YWJhc2VzKVxuICBsZXQgcXVlcnkgPSBcIlwiO1xuICBxdWVyeSArPSBcImNvbnN0IGdyYXBocWwgPSByZXF1aXJlKCdncmFwaHFsJyk7XFxuXCI7XG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXMpIHtcbiAgICBjb25zdCBkYXRhYmFzZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XTtcbiAgICAvLyBkYXRhYmFzZS5kYXRhIGlzIHNhbWUgYXMgZGF0YWJhc2UudGFibGVzXG5cbiAgICBxdWVyeSArPSBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKGRhdGFiYXNlLmRhdGEsIGRhdGFiYXNlLmRhdGFiYXNlTmFtZSwgZGF0YWJhc2UubmFtZSk7XG4gIH1cbiAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCk7XG5cbiAgLy8gQlVJTEQgVFlQRSBTQ0hFTUFcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IHRhYmxlcyA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhO1xuICAgIGNvbnN0IGRhdGFiYXNlTmFtZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhYmFzZU5hbWU7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSh0YWJsZXNbdGFibGVJbmRleF0sIHRhYmxlcywgZGF0YWJhc2VOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvLyBCVUlMRCBST09UIFFVRVJZXG4gIHF1ZXJ5ICs9IGBjb25zdCBSb290UXVlcnkgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdSb290UXVlcnlUeXBlJyxcXG4ke3RhYn1maWVsZHM6IHtcXG5gO1xuXG4gIGxldCBmaXJzdFJvb3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IHRhYmxlcyA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhO1xuICAgIGNvbnN0IGRhdGFiYXNlTmFtZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhYmFzZU5hbWU7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgaWYgKCFmaXJzdFJvb3RMb29wKSBxdWVyeSArPSBcIixcXG5cIjtcbiAgICAgIGZpcnN0Um9vdExvb3AgPSBmYWxzZTtcblxuICAgICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5KHRhYmxlc1t0YWJsZUluZGV4XSwgZGF0YWJhc2VOYW1lKTtcbiAgICB9XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIC8vIEJVSUxEIE1VVEFUSU9OU1xuICBxdWVyeSArPSBgY29uc3QgTXV0YXRpb24gPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdNdXRhdGlvbicsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RNdXRhdGlvbkxvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7XG4gICAgY29uc3QgdGFibGVzID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdLmRhdGE7XG4gICAgY29uc3QgZGF0YWJhc2VOYW1lID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdLmRhdGFiYXNlTmFtZTtcbiAgICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgICBpZiAoIWZpcnN0TXV0YXRpb25Mb29wKSBxdWVyeSArPSBcIixcXG5cIjtcbiAgICAgIGZpcnN0TXV0YXRpb25Mb29wID0gZmFsc2U7XG5cbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZU5hbWUpO1xuICAgIH1cbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9fVxcbn0pO1xcblxcbmA7XG5cbiAgcXVlcnkgKz0gYG1vZHVsZS5leHBvcnRzID0gbmV3IEdyYXBoUUxTY2hlbWEoe1xcbiR7dGFifXF1ZXJ5OiBSb290UXVlcnksXFxuJHt0YWJ9bXV0YXRpb246IE11dGF0aW9uXFxufSk7YDtcbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIFJlcHJlc2VudHMgdGhlIGRhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQWxsIHRoZSByZXF1aXJlIHN0YXRlbWVudHMgbmVlZGVkIGZvciB0aGUgR3JhcGhRTCBzZXJ2ZXIuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkUmVxdWlyZVN0YXRlbWVudHModGFibGVzLCBkYXRhYmFzZSwgbmFtZSkge1xuICBsZXQgcmVxdWlyZVN0YXRlbWVudHMgPSBcIlwiO1xuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0ICR7XG4gICAgICAgIHRhYmxlc1t0YWJsZUluZGV4XS50eXBlXG4gICAgICB9ID0gcmVxdWlyZSgnLi4vZGIvJHtuYW1lfS8ke3RhYmxlc1t0YWJsZUluZGV4XS50eXBlLnRvTG93ZXJDYXNlKCl9LmpzJyk7XFxuYDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0IHBvb2wgPSByZXF1aXJlKCcuLi9kYi8ke25hbWV9L3NxbF9wb29sLmpzJyk7XFxuYDtcbiAgfVxuICByZXR1cm4gcmVxdWlyZVN0YXRlbWVudHM7XG59XG5cbi8qKlxuICogQHJldHVybnMge1N0cmluZ30gLSBhbGwgY29uc3RhbnRzIG5lZWRlZCBmb3IgYSBHcmFwaFFMIHNlcnZlclxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxWYXJpYWJsZXMoKSB7XG4gIHJldHVybiBgXG5jb25zdCB7IFxuICBHcmFwaFFMT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFNjaGVtYSxcbiAgR3JhcGhRTElELFxuICBHcmFwaFFMU3RyaW5nLCBcbiAgR3JhcGhRTEludCwgXG4gIEdyYXBoUUxCb29sZWFuLFxuICBHcmFwaFFMTGlzdCxcbiAgR3JhcGhRTE5vbk51bGxcbn0gPSBncmFwaHFsO1xuICBcXG5gO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGludGVyYXRlZCBvbi4gRWFjaCB0YWJsZSBjb25zaXN0cyBvZiBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbiBvYmplY3Qgb2YgYWxsIHRoZSB0YWJsZXMgY3JlYXRlZCBpbiB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gVGhlIEdyYXBoUUwgdHlwZSBjb2RlIGZvciB0aGUgaW5wdXR0ZWQgdGFibGVcbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBgY29uc3QgJHt0YWJsZS50eXBlfVR5cGUgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn1uYW1lOiAnJHt0YWJsZS50eXBlfScsXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifWZpZWxkczogKCkgPT4gKHtgO1xuICBxdWVyeSArPSBidWlsZEdyYXBoUUxUeXBlRmllbGRzKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgcmV0dXJuIChxdWVyeSArPSBgXFxuJHt0YWJ9fSlcXG59KTtcXG5cXG5gKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpbnRlcmF0ZWQgb24uIEVhY2ggdGFibGUgY29uc2lzdHMgb2YgZmllbGRzXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGVzIC0gYW4gb2JqZWN0IG9mIGFsbCB0aGUgdGFibGVzIGNyZWF0ZWQgaW4gdGhlIGFwcGxpY2F0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBEYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIGVhY2ggZmllbGQgZm9yIHRoZSBHcmFwaFFMIHR5cGUuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gXCJcIjtcbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAobGV0IGZpZWxkSW5kZXggaW4gdGFibGUuZmllbGRzKSB7XG4gICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9IFwiLFwiO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0odGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdKX1gO1xuICAgIC8vIGNoZWNrIGlmIHRoZSBmaWVsZCBoYXMgYSByZWxhdGlvbiB0byBhbm90aGVyIGZpZWxkXG4gICAgaWYgKHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS5yZWxhdGlvbi50YWJsZUluZGV4ID4gLTEpIHtcbiAgICAgIHF1ZXJ5ICs9IGNyZWF0ZVN1YlF1ZXJ5KHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XSwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpZWxkIGlzIGEgcmVsYXRpb24gZm9yIGFub3RoZXIgZmllbGRcbiAgICBjb25zdCByZWZCeSA9IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS5yZWZCeTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZWZCeSkpIHtcbiAgICAgIHJlZkJ5LmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFZhbHVlID0gdmFsdWUuc3BsaXQoXCIuXCIpO1xuICAgICAgICBjb25zdCBmaWVsZCA9IHtcbiAgICAgICAgICBuYW1lOiB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ubmFtZSxcbiAgICAgICAgICByZWxhdGlvbjoge1xuICAgICAgICAgICAgdGFibGVJbmRleDogcGFyc2VkVmFsdWVbMF0sXG4gICAgICAgICAgICBmaWVsZEluZGV4OiBwYXJzZWRWYWx1ZVsxXSxcbiAgICAgICAgICAgIHJlZlR5cGU6IHBhcnNlZFZhbHVlWzJdLFxuICAgICAgICAgICAgdHlwZTogdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnR5cGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgcXVlcnkgKz0gY3JlYXRlU3ViUXVlcnkoZmllbGQsIHRhYmxlcywgZGF0YWJhc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBxdWVyeTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gZmllbGQgLSBhbiBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGluZm9ybWF0aW9uIGZvciB0aGUgZmllbGQgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gYSBmaWVsZCBpdGVtIChleDogJ2lkOiB7IHR5cGU6IEdyYXBoUUxJRCB9JylcbiAqL1xuZnVuY3Rpb24gYnVpbGRGaWVsZEl0ZW0oZmllbGQpIHtcbiAgcmV0dXJuIGAke2ZpZWxkLm5hbWV9OiB7IHR5cGU6ICR7Y2hlY2tGb3JSZXF1aXJlZChcbiAgICBmaWVsZC5yZXF1aXJlZCxcbiAgICBcImZyb250XCJcbiAgKX0ke2NoZWNrRm9yTXVsdGlwbGVWYWx1ZXMoXG4gICAgZmllbGQubXVsdGlwbGVWYWx1ZXMsXG4gICAgXCJmcm9udFwiXG4gICl9JHt0YWJsZVR5cGVUb0dyYXBocWxUeXBlKGZpZWxkLnR5cGUpfSR7Y2hlY2tGb3JNdWx0aXBsZVZhbHVlcyhcbiAgICBmaWVsZC5tdWx0aXBsZVZhbHVlcyxcbiAgICBcImJhY2tcIlxuICApfSR7Y2hlY2tGb3JSZXF1aXJlZChmaWVsZC5yZXF1aXJlZCwgXCJiYWNrXCIpfSB9YDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIHRoZSBmaWVsZCB0eXBlIChJRCwgU3RyaW5nLCBOdW1iZXIsIEJvb2xlYW4sIG9yIEZsb2F0KVxuICogQHJldHVybnMge1N0cmluZ30gLSB0aGUgR3JhcGhRTCB0eXBlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZmllbGQgdHlwZSBlbnRlcmVkXG4gKi9cbmZ1bmN0aW9uIHRhYmxlVHlwZVRvR3JhcGhxbFR5cGUodHlwZSkge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFwiSURcIjpcbiAgICAgIHJldHVybiBcIkdyYXBoUUxJRFwiO1xuICAgIGNhc2UgXCJTdHJpbmdcIjpcbiAgICAgIHJldHVybiBcIkdyYXBoUUxTdHJpbmdcIjtcbiAgICBjYXNlIFwiTnVtYmVyXCI6XG4gICAgICByZXR1cm4gXCJHcmFwaFFMSW50XCI7XG4gICAgY2FzZSBcIkJvb2xlYW5cIjpcbiAgICAgIHJldHVybiBcIkdyYXBoUUxCb29sZWFuXCI7XG4gICAgY2FzZSBcIkZsb2F0XCI6XG4gICAgICByZXR1cm4gXCJHcmFwaFFMRmxvYXRcIjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTFN0cmluZ1wiO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlZlR5cGVOYW1lIC0gQW55IHN0cmluZyBpbnB1dHRlZFxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgc3RyaW5nIGlucHV0dGVkLCBidXQgd2l0aCB0aGUgZmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkIGFuZCB0aGUgcmVzdCBsb3dlcmNhc2VkXG4gKi9cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKSB7XG4gIGxldCBuYW1lID0gcmVmVHlwZU5hbWVbMF0udG9VcHBlckNhc2UoKTtcbiAgbmFtZSArPSByZWZUeXBlTmFtZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gbmFtZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gZmllbGQgLSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFsbCB0aGUgdGFibGVzIG1hZGUgYnkgdGhlIHVzZXIuXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBEYXRiYXNlIHNlbGVjdGVkXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIEJ1aWxkcyBhIHN1YiB0eXBlIGZvciBhbnkgZmllbGQgd2l0aCBhIHJlbGF0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBjb25zdCByZWZUeXBlTmFtZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS50eXBlO1xuICBjb25zdCByZWZGaWVsZE5hbWUgPVxuICAgIHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0ubmFtZTtcbiAgY29uc3QgcmVmRmllbGRUeXBlID1cbiAgICB0YWJsZXNbZmllbGQucmVsYXRpb24udGFibGVJbmRleF0uZmllbGRzW2ZpZWxkLnJlbGF0aW9uLmZpZWxkSW5kZXhdLnR5cGU7XG4gIGxldCBxdWVyeSA9IGAsXFxuJHt0YWJ9JHt0YWJ9JHtjcmVhdGVTdWJRdWVyeU5hbWUoXG4gICAgZmllbGQsXG4gICAgcmVmVHlwZU5hbWVcbiAgKX06IHtcXG4ke3RhYn0ke3RhYn0ke3RhYn10eXBlOiBgO1xuXG4gIGlmIChcbiAgICBmaWVsZC5yZWxhdGlvbi5yZWZUeXBlID09PSBcIm9uZSB0byBtYW55XCIgfHxcbiAgICBmaWVsZC5yZWxhdGlvbi5yZWZUeXBlID09PSBcIm1hbnkgdG8gbWFueVwiXG4gICkge1xuICAgIHF1ZXJ5ICs9IGBuZXcgR3JhcGhRTExpc3QoJHtyZWZUeXBlTmFtZX1UeXBlKSxgO1xuICB9IGVsc2Uge1xuICAgIHF1ZXJ5ICs9IGAke3JlZlR5cGVOYW1lfVR5cGUsYDtcbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNb25nb0RCXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7cmVmVHlwZU5hbWV9LiR7ZmluZERiU2VhcmNoTWV0aG9kKFxuICAgICAgcmVmRmllbGROYW1lLFxuICAgICAgcmVmRmllbGRUeXBlLFxuICAgICAgZmllbGQucmVsYXRpb24ucmVmVHlwZVxuICAgICl9YDtcbiAgICBxdWVyeSArPSBgKCR7Y3JlYXRlU2VhcmNoT2JqZWN0KHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCBmaWVsZCl9KTtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9fWA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7cmVmVHlwZU5hbWV9XCIgV0hFUkUgXCIke3JlZkZpZWxkTmFtZX1cIiA9ICdcXCR7cGFyZW50LiR7ZmllbGQubmFtZX19JztcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUpO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9fWA7XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWZUeXBlIC0gVGhlIHJlbGF0aW9uIHR5cGUgb2YgdGhlIHN1YiBxdWVyeVxuICogQHJldHVybnMge1N0cmluZ30gLSB0aGUgY29kZSBmb3IgYSBTUUwgcG9vbCBxdWVyeS5cbiAqL1xuZnVuY3Rpb24gYnVpbGRTUUxQb29sUXVlcnkocmVmVHlwZSkge1xuICBsZXQgcm93cyA9IFwiXCI7XG4gIGlmIChyZWZUeXBlID09PSBcIm9uZSB0byBvbmVcIiB8fCByZWZUeXBlID09PSBcIm1hbnkgdG8gb25lXCIpIHJvd3MgPSBcInJvd3NbMF1cIjtcbiAgZWxzZSByb3dzID0gXCJyb3dzXCI7XG5cbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBwb29sLnF1ZXJ5KHNxbClcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LnRoZW4ocmVzID0+IHJlcy4ke3Jvd3N9KVxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0uY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKCdFcnJvcjogJywgZXJyKSlcXG5gO1xuICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN1YlF1ZXJ5TmFtZShmaWVsZCwgcmVmVHlwZU5hbWUpIHtcbiAgc3dpdGNoIChmaWVsZC5yZWxhdGlvbi5yZWZUeXBlKSB7XG4gICAgY2FzZSBcIm9uZSB0byBvbmVcIjpcbiAgICAgIHJldHVybiBgcmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSBcIm9uZSB0byBtYW55XCI6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSBcIm1hbnkgdG8gb25lXCI6XG4gICAgICByZXR1cm4gYHJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGNhc2UgXCJtYW55IHRvIG1hbnlcIjpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmREYlNlYXJjaE1ldGhvZChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgcmVmVHlwZSkge1xuICBpZiAocmVmRmllbGROYW1lID09PSBcImlkXCIgfHwgcmVmRmllbGRUeXBlID09PSBcIklEXCIpIHJldHVybiBcImZpbmRCeUlkXCI7XG4gIGVsc2UgaWYgKHJlZlR5cGUgPT09IFwib25lIHRvIG9uZVwiKSByZXR1cm4gXCJmaW5kT25lXCI7XG4gIGVsc2UgcmV0dXJuIFwiZmluZFwiO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTZWFyY2hPYmplY3QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIGZpZWxkKSB7XG4gIGlmIChyZWZGaWVsZE5hbWUgPT09IFwiaWRcIiB8fCByZWZGaWVsZFR5cGUgPT09IFwiSURcIikge1xuICAgIHJldHVybiBgcGFyZW50LiR7ZmllbGQubmFtZX1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgeyAke3JlZkZpZWxkTmFtZX06IHBhcmVudC4ke2ZpZWxkLm5hbWV9IH1gO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gXCJcIjtcblxuICBxdWVyeSArPSBjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSk7XG5cbiAgaWYgKCEhdGFibGUuZmllbGRzWzBdKSB7XG4gICAgcXVlcnkgKz0gY3JlYXRlRmluZEJ5SWRRdWVyeSh0YWJsZSwgZGF0YWJhc2UpO1xuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9ZXZlcnkke3RvVGl0bGVDYXNlKHRhYmxlLnR5cGUpfToge1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiBuZXcgR3JhcGhRTExpc3QoJHt0YWJsZS50eXBlfVR5cGUpLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKCkge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kKHt9KTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk15U1FMXCIgfHwgZGF0YWJhc2UgPT09IFwiUG9zdGdyZVNRTFwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3RhYmxlLnR5cGV9XCI7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeShcIm1hbnlcIik7XG4gIH1cblxuICByZXR1cm4gKHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBkYXRhYmFzZSBzZWxlY3RlZFxuICogQHJldHVybnMge1N0cmluZ30gLSByb290IHF1ZXJ5IGNvZGUgdG8gZmluZCBhbiBpbmRpdmlkdWFsIHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRmluZEJ5SWRRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgY29uc3QgaWRGaWVsZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX06IHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHsgJHtpZEZpZWxkTmFtZX06IHsgdHlwZTogJHt0YWJsZVR5cGVUb0dyYXBocWxUeXBlKFxuICAgIHRhYmxlLmZpZWxkc1swXS50eXBlXG4gICl9fX0sXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkKGFyZ3MuaWQpO1xcbmA7XG4gIH1cbiAgaWYgKGRhdGFiYXNlID09PSBcIk15U1FMXCIgfHwgZGF0YWJhc2UgPT09IFwiUG9zdGdyZVNRTFwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3RhYmxlLnR5cGV9XCIgV0hFUkUgJHtpZEZpZWxkTmFtZX0gPSAnXFwke2FyZ3MuaWR9JztcXGA7XFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeShcIm9uZSB0byBvbmVcIik7XG4gIH1cblxuICByZXR1cm4gKHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWApO1xufVxuXG5mdW5jdGlvbiBidWlsZEdyYXBocWxNdXRhdGlvblF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgc3RyaW5nID0gYGA7XG4gIHN0cmluZyArPSBgJHthZGRNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpfWA7XG4gIGlmICh0YWJsZS5maWVsZHNbMF0pIHtcbiAgICBzdHJpbmcgKz0gYCxcXG4ke3VwZGF0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9LFxcbmA7XG4gICAgc3RyaW5nICs9IGAke2RlbGV0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9YDtcbiAgfVxuICByZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBidWlsZFNRTFBvb2xNdXRhdGlvbigpIHtcbiAgbGV0IHN0cmluZyA9IGBgO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBwb29sLmNvbm5lY3QoKVxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LnRoZW4oY2xpZW50ID0+IHtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBjbGllbnQucXVlcnkoc3FsKVxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LnRoZW4ocmVzID0+IHtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNsaWVudC5yZWxlYXNlKCk7XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcmVzLnJvd3NbMF07XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn19KVxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LmNhdGNoKGVyciA9PiB7XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jbGllbnQucmVsZWFzZSgpO1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc29sZS5sb2coJ0Vycm9yOiAnLCBlcnIpO1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYDtcbiAgcmV0dXJuIHN0cmluZztcbn1cblxuZnVuY3Rpb24gYWRkTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1hZGQke3RhYmxlLnR5cGV9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSBcIixcXG5cIjtcbiAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke2J1aWxkRmllbGRJdGVtKFxuICAgICAgdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdXG4gICAgKX1gO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn19LFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCAke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX0gPSBuZXcgJHtcbiAgICAgIHRhYmxlLnR5cGVcbiAgICB9KGFyZ3MpO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX0uc2F2ZSgpO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3QgY29sdW1ucyA9IE9iamVjdC5rZXlzKGFyZ3MpLm1hcChlbCA9PiBcXGBcIlxcJHtlbH1cIlxcYCk7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhhcmdzKS5tYXAoZWwgPT4gXFxgJ1xcJHtlbH0nXFxgKTtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBJTlNFUlQgSU5UTyBcIiR7dGFibGUudHlwZX1cIiAoXFwke2NvbHVtbnN9KSBWQUxVRVMgKFxcJHt2YWx1ZXN9KSBSRVRVUk5JTkcgKlxcYDtcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7XG4gIH1cblxuICByZXR1cm4gKHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWApO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifXVwZGF0ZSR7dGFibGUudHlwZX06IHtcXG4ke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSBcIixcXG5cIjtcbiAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke2J1aWxkRmllbGRJdGVtKFxuICAgICAgdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdXG4gICAgKX1gO1xuICB9XG5cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifX0sXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNb25nb0RCXCIpXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkQW5kVXBkYXRlKGFyZ3MuaWQsIGFyZ3MpO1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk15U1FMXCIgfHwgZGF0YWJhc2UgPT09IFwiUG9zdGdyZVNRTFwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWxldCB1cGRhdGVWYWx1ZXMgPSAnJztcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1mb3IgKGNvbnN0IHByb3AgaW4gYXJncykge1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWlmICh1cGRhdGVWYWx1ZXMubGVuZ3RoID4gMCkgdXBkYXRlVmFsdWVzICs9IFxcYCwgXFxgO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXVwZGF0ZVZhbHVlcyArPSBcXGBcIlxcJHtwcm9wfVwiID0gJ1xcJHthcmdzW3Byb3BdfScgXFxgO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifX1cXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBVUERBVEUgXCIke3RhYmxlLnR5cGV9XCIgU0VUIFxcJHt1cGRhdGVWYWx1ZXN9IFdIRVJFIGlkID0gJ1xcJHthcmdzLmlkfScgUkVUVVJOSU5HICo7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xNdXRhdGlvbigpO1xuICB9XG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSkge1xuICBjb25zdCBpZEZpZWxkTmFtZSA9IHRhYmxlLmZpZWxkc1swXS5uYW1lO1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9ZGVsZXRlJHt0YWJsZS50eXBlfToge1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczogeyAke2lkRmllbGROYW1lfTogeyB0eXBlOiAke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoXG4gICAgdGFibGUuZmllbGRzWzBdLnR5cGVcbiAgKX19fSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNb25nb0RCXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZEJ5SWRBbmRSZW1vdmUoYXJncy5pZCk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNeVNRTFwiIHx8IGRhdGFiYXNlID09PSBcIlBvc3RncmVTUUxcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBERUxFVEUgRlJPTSBcIiR7dGFibGUudHlwZX1cIiBXSEVSRSBpZCA9ICdcXCR7YXJncy5pZH0nIFJFVFVSTklORyAqO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTtcbiAgfVxuXG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yUmVxdWlyZWQocmVxdWlyZWQsIHBvc2l0aW9uKSB7XG4gIGlmIChyZXF1aXJlZCkge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gXCJmcm9udFwiKSB7XG4gICAgICByZXR1cm4gXCJuZXcgR3JhcGhRTE5vbk51bGwoXCI7XG4gICAgfVxuICAgIHJldHVybiBcIilcIjtcbiAgfVxuICByZXR1cm4gXCJcIjtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JNdWx0aXBsZVZhbHVlcyhtdWx0aXBsZVZhbHVlcywgcG9zaXRpb24pIHtcbiAgaWYgKG11bHRpcGxlVmFsdWVzKSB7XG4gICAgaWYgKHBvc2l0aW9uID09PSBcImZyb250XCIpIHtcbiAgICAgIHJldHVybiBcIm5ldyBHcmFwaFFMTGlzdChcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiKVwiO1xuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlR3JhcGhxbFNlcnZlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCBidWlsZFNlcnZlckNvZGUgZnJvbSBcIi4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2dyYXBocWxfc2VydmVyXCI7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCBcIi4uL2NvZGUuY3NzXCI7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdG9yZSkgPT4gKHtcbiAgZGF0YWJhc2VzOiBzdG9yZS5tdWx0aVNjaGVtYS5kYXRhYmFzZXMsXG59KTtcblxuY29uc3QgY3JlYXRlRGF0YWJhc2VDb3B5ID0gKG9iaikgPT4ge1xuICBjb25zdCBkYXRhYmFzZXNDb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIG9iaikge1xuICAgIFxuICAgIFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmpbZGF0YWJhc2VJbmRleF1bdF0sIG5ld19rZXksXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iobywgb2xkX2tleSkpO1xuICAgIGRlbGV0ZSBvW29sZF9rZXldO1xuICB9XG4gIFxufVxuXG5cbmNvbnN0IENvZGVTZXJ2ZXJDb250YWluZXIgPSAoe2RhdGFiYXNlc30pID0+IHtcbiAgY29uc29sZS5sb2coJ2RhdGFiYXNlcyBpbiBDb2RlU2VydmVyQ29udGFpbmVyJywgZGF0YWJhc2VzKTtcbiAgY29uc3Qgc2VydmVyQ29kZSA9IGJ1aWxkU2VydmVyQ29kZShkYXRhYmFzZXMpO1xuICBjb25zb2xlLmxvZygnc2VydmVyQ29kZTonLCBzZXJ2ZXJDb2RlKTtcbiAgY29uc29sZS5sb2coJ2J1aWxkU2VydmVyQ29kZTonLCBidWlsZFNlcnZlckNvZGUpXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cImNvZGUtY29udGFpbmVyLXNlcnZlclwiPlxuICAgICAgPGg0IGNsYXNzTmFtZT1cImNvZGVIZWFkZXJcIj5HcmFwaFFsIFR5cGVzLCBSb290IFF1ZXJpZXMsIGFuZCBNdXRhdGlvbnM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPntzZXJ2ZXJDb2RlfTwvcHJlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG51bGwpKENvZGVTZXJ2ZXJDb250YWluZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==