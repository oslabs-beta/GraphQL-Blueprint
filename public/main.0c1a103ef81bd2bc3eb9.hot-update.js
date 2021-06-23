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
  var query = "";
  for (var databaseIndex in databases) {
    var _database = databases[databaseIndex];
    // database.data is same as database.tables
    query += buildRequireStatements(_database.data, _database.databaseName);
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
    var _databaseName2 = database[_databaseIndex3].databaseName;
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
function buildRequireStatements(tables, database) {
  var requireStatements = "const graphql = require('graphql');\n";

  if (database === "MongoDB") {
    for (var tableIndex in tables) {
      requireStatements += "const " + tables[tableIndex].type + " = require('../db/" + tables[tableIndex].type.toLowerCase() + ".js');\n";
    }
  } else {
    requireStatements += "const pool = require('../db/sql_pool.js');\n";
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

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwiZGF0YWJhc2VzIiwicXVlcnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2UiLCJidWlsZFJlcXVpcmVTdGF0ZW1lbnRzIiwiZGF0YSIsImRhdGFiYXNlTmFtZSIsImJ1aWxkR3JhcGhxbFZhcmlhYmxlcyIsInRhYmxlcyIsInRhYmxlSW5kZXgiLCJidWlsZEdyYXBocWxUeXBlU2NoZW1hIiwiZmlyc3RSb290TG9vcCIsImJ1aWxkR3JhcGhxbFJvb3RRdWVyeSIsImZpcnN0TXV0YXRpb25Mb29wIiwiYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSIsInJlcXVpcmVTdGF0ZW1lbnRzIiwidHlwZSIsInRvTG93ZXJDYXNlIiwidGFibGUiLCJidWlsZEdyYXBoUUxUeXBlRmllbGRzIiwiZmlyc3RMb29wIiwiZmllbGRJbmRleCIsImJ1aWxkRmllbGRJdGVtIiwiZmllbGRzIiwicmVsYXRpb24iLCJjcmVhdGVTdWJRdWVyeSIsInJlZkJ5IiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsInZhbHVlIiwicGFyc2VkVmFsdWUiLCJzcGxpdCIsImZpZWxkIiwibmFtZSIsInJlZlR5cGUiLCJjaGVja0ZvclJlcXVpcmVkIiwicmVxdWlyZWQiLCJjaGVja0Zvck11bHRpcGxlVmFsdWVzIiwibXVsdGlwbGVWYWx1ZXMiLCJ0YWJsZVR5cGVUb0dyYXBocWxUeXBlIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJyZWZGaWVsZE5hbWUiLCJyZWZGaWVsZFR5cGUiLCJjcmVhdGVTdWJRdWVyeU5hbWUiLCJmaW5kRGJTZWFyY2hNZXRob2QiLCJjcmVhdGVTZWFyY2hPYmplY3QiLCJidWlsZFNRTFBvb2xRdWVyeSIsInJvd3MiLCJjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5IiwiY3JlYXRlRmluZEJ5SWRRdWVyeSIsImlkRmllbGROYW1lIiwic3RyaW5nIiwiYWRkTXV0YXRpb24iLCJ1cGRhdGVNdXRhdGlvbiIsImRlbGV0ZU11dGF0aW9uIiwiYnVpbGRTUUxQb29sTXV0YXRpb24iLCJwb3NpdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLFVBQU47O0FBRUE7QUFDQSxTQUFTQyxrQkFBVCxDQUE0QkMsU0FBNUIsRUFBdUM7QUFDckMsTUFBSUMsUUFBUSxFQUFaO0FBQ0EsT0FBSyxJQUFNQyxhQUFYLElBQTRCRixTQUE1QixFQUF1QztBQUNyQyxRQUFNRyxZQUFXSCxVQUFVRSxhQUFWLENBQWpCO0FBQ0E7QUFDQUQsYUFBU0csdUJBQXVCRCxVQUFTRSxJQUFoQyxFQUFzQ0YsVUFBU0csWUFBL0MsQ0FBVDtBQUNEO0FBQ0RMLFdBQVNNLHVCQUFUOztBQUVBO0FBQ0EsT0FBSyxJQUFNTCxjQUFYLElBQTRCRixTQUE1QixFQUF1QztBQUNyQyxRQUFNUSxTQUFTUixVQUFVRSxjQUFWLEVBQXlCRyxJQUF4QztBQUNBLFFBQU1DLGVBQWVOLFVBQVVFLGNBQVYsRUFBeUJJLFlBQTlDO0FBQ0EsU0FBSyxJQUFNRyxVQUFYLElBQXlCRCxNQUF6QixFQUFpQztBQUMvQlAsZUFBU1MsdUJBQXVCRixPQUFPQyxVQUFQLENBQXZCLEVBQTJDRCxNQUEzQyxFQUFtREYsWUFBbkQsQ0FBVDtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQUwsMkRBQXVESCxHQUF2RCxnQ0FBcUZBLEdBQXJGOztBQUVBLE1BQUlhLGdCQUFnQixJQUFwQjtBQUNBLE9BQUssSUFBTVQsZUFBWCxJQUE0QkYsU0FBNUIsRUFBdUM7QUFDckMsUUFBTVEsVUFBU1IsVUFBVUUsZUFBVixFQUF5QkcsSUFBeEM7QUFDQSxRQUFNQyxnQkFBZU4sVUFBVUUsZUFBVixFQUF5QkksWUFBOUM7QUFDQSxTQUFLLElBQU1HLFdBQVgsSUFBeUJELE9BQXpCLEVBQWlDO0FBQy9CLFVB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O0FBQ0Q7QUFDRCxXQUFPLEdBQVA7QUFDRDtBQUNELFNBQU8sRUFBUDtBQUNEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCL0Qsa0JBQWpCLEMiLCJmaWxlIjoibWFpbi4wYzFhMTAzZWY4MWJkMmJjM2ViOS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGFiID0gYCAgYDtcblxuLy8gRnVuY3Rpb24gdGhhdCBldm9rZXMgYWxsIG90aGVyIGhlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIHBhcnNlR3JhcGhxbFNlcnZlcihkYXRhYmFzZXMpIHtcbiAgbGV0IHF1ZXJ5ID0gXCJcIjtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IGRhdGFiYXNlID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdO1xuICAgIC8vIGRhdGFiYXNlLmRhdGEgaXMgc2FtZSBhcyBkYXRhYmFzZS50YWJsZXNcbiAgICBxdWVyeSArPSBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKGRhdGFiYXNlLmRhdGEsIGRhdGFiYXNlLmRhdGFiYXNlTmFtZSk7XG4gIH1cbiAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCk7XG5cbiAgLy8gQlVJTEQgVFlQRSBTQ0hFTUFcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IHRhYmxlcyA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhO1xuICAgIGNvbnN0IGRhdGFiYXNlTmFtZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhYmFzZU5hbWU7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSh0YWJsZXNbdGFibGVJbmRleF0sIHRhYmxlcywgZGF0YWJhc2VOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvLyBCVUlMRCBST09UIFFVRVJZXG4gIHF1ZXJ5ICs9IGBjb25zdCBSb290UXVlcnkgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdSb290UXVlcnlUeXBlJyxcXG4ke3RhYn1maWVsZHM6IHtcXG5gO1xuXG4gIGxldCBmaXJzdFJvb3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IHRhYmxlcyA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhO1xuICAgIGNvbnN0IGRhdGFiYXNlTmFtZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhYmFzZU5hbWU7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgaWYgKCFmaXJzdFJvb3RMb29wKSBxdWVyeSArPSBcIixcXG5cIjtcbiAgICAgIGZpcnN0Um9vdExvb3AgPSBmYWxzZTtcblxuICAgICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5KHRhYmxlc1t0YWJsZUluZGV4XSwgZGF0YWJhc2VOYW1lKTtcbiAgICB9XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIC8vIEJVSUxEIE1VVEFUSU9OU1xuICBxdWVyeSArPSBgY29uc3QgTXV0YXRpb24gPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdNdXRhdGlvbicsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RNdXRhdGlvbkxvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7XG4gICAgY29uc3QgdGFibGVzID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdLmRhdGE7XG4gICAgY29uc3QgZGF0YWJhc2VOYW1lID0gZGF0YWJhc2VbZGF0YWJhc2VJbmRleF0uZGF0YWJhc2VOYW1lO1xuICAgIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICAgIGlmICghZmlyc3RNdXRhdGlvbkxvb3ApIHF1ZXJ5ICs9IFwiLFxcblwiO1xuICAgICAgZmlyc3RNdXRhdGlvbkxvb3AgPSBmYWxzZTtcblxuICAgICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSh0YWJsZXNbdGFibGVJbmRleF0sIGRhdGFiYXNlTmFtZSk7XG4gICAgfVxuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn19XFxufSk7XFxuXFxuYDtcblxuICBxdWVyeSArPSBgbW9kdWxlLmV4cG9ydHMgPSBuZXcgR3JhcGhRTFNjaGVtYSh7XFxuJHt0YWJ9cXVlcnk6IFJvb3RRdWVyeSxcXG4ke3RhYn1tdXRhdGlvbjogTXV0YXRpb25cXG59KTtgO1xuICByZXR1cm4gcXVlcnk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gUmVwcmVzZW50cyB0aGUgZGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBBbGwgdGhlIHJlcXVpcmUgc3RhdGVtZW50cyBuZWVkZWQgZm9yIHRoZSBHcmFwaFFMIHNlcnZlci5cbiAqL1xuZnVuY3Rpb24gYnVpbGRSZXF1aXJlU3RhdGVtZW50cyh0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCByZXF1aXJlU3RhdGVtZW50cyA9IFwiY29uc3QgZ3JhcGhxbCA9IHJlcXVpcmUoJ2dyYXBocWwnKTtcXG5cIjtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0ICR7XG4gICAgICAgIHRhYmxlc1t0YWJsZUluZGV4XS50eXBlXG4gICAgICB9ID0gcmVxdWlyZSgnLi4vZGIvJHt0YWJsZXNbdGFibGVJbmRleF0udHlwZS50b0xvd2VyQ2FzZSgpfS5qcycpO1xcbmA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcXVpcmVTdGF0ZW1lbnRzICs9IGBjb25zdCBwb29sID0gcmVxdWlyZSgnLi4vZGIvc3FsX3Bvb2wuanMnKTtcXG5gO1xuICB9XG4gIHJldHVybiByZXF1aXJlU3RhdGVtZW50cztcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIGFsbCBjb25zdGFudHMgbmVlZGVkIGZvciBhIEdyYXBoUUwgc2VydmVyXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFZhcmlhYmxlcygpIHtcbiAgcmV0dXJuIGBcbmNvbnN0IHsgXG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMU2NoZW1hLFxuICBHcmFwaFFMSUQsXG4gIEdyYXBoUUxTdHJpbmcsIFxuICBHcmFwaFFMSW50LCBcbiAgR3JhcGhRTEJvb2xlYW4sXG4gIEdyYXBoUUxMaXN0LFxuICBHcmFwaFFMTm9uTnVsbFxufSA9IGdyYXBocWw7XG4gIFxcbmA7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgR3JhcGhRTCB0eXBlIGNvZGUgZm9yIHRoZSBpbnB1dHRlZCB0YWJsZVxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxUeXBlU2NoZW1hKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGBjb25zdCAke3RhYmxlLnR5cGV9VHlwZSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifW5hbWU6ICcke3RhYmxlLnR5cGV9JyxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9ZmllbGRzOiAoKSA9PiAoe2A7XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpO1xuICByZXR1cm4gKHF1ZXJ5ICs9IGBcXG4ke3RhYn19KVxcbn0pO1xcblxcbmApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGludGVyYXRlZCBvbi4gRWFjaCB0YWJsZSBjb25zaXN0cyBvZiBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbiBvYmplY3Qgb2YgYWxsIHRoZSB0YWJsZXMgY3JlYXRlZCBpbiB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gZWFjaCBmaWVsZCBmb3IgdGhlIEdyYXBoUUwgdHlwZS5cbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBcIlwiO1xuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChsZXQgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gXCIsXCI7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWA7XG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpZWxkIGhhcyBhIHJlbGF0aW9uIHRvIGFub3RoZXIgZmllbGRcbiAgICBpZiAodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlbGF0aW9uLnRhYmxlSW5kZXggPiAtMSkge1xuICAgICAgcXVlcnkgKz0gY3JlYXRlU3ViUXVlcnkodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaXMgYSByZWxhdGlvbiBmb3IgYW5vdGhlciBmaWVsZFxuICAgIGNvbnN0IHJlZkJ5ID0gdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlZkJ5O1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJlZkJ5KSkge1xuICAgICAgcmVmQnkuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgY29uc3QgcGFyc2VkVmFsdWUgPSB2YWx1ZS5zcGxpdChcIi5cIik7XG4gICAgICAgIGNvbnN0IGZpZWxkID0ge1xuICAgICAgICAgIG5hbWU6IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS5uYW1lLFxuICAgICAgICAgIHJlbGF0aW9uOiB7XG4gICAgICAgICAgICB0YWJsZUluZGV4OiBwYXJzZWRWYWx1ZVswXSxcbiAgICAgICAgICAgIGZpZWxkSW5kZXg6IHBhcnNlZFZhbHVlWzFdLFxuICAgICAgICAgICAgcmVmVHlwZTogcGFyc2VkVmFsdWVbMl0sXG4gICAgICAgICAgICB0eXBlOiB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0udHlwZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgaW5mb3JtYXRpb24gZm9yIHRoZSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHJldHVybnMge1N0cmluZ30gLSBhIGZpZWxkIGl0ZW0gKGV4OiAnaWQ6IHsgdHlwZTogR3JhcGhRTElEIH0nKVxuICovXG5mdW5jdGlvbiBidWlsZEZpZWxkSXRlbShmaWVsZCkge1xuICByZXR1cm4gYCR7ZmllbGQubmFtZX06IHsgdHlwZTogJHtjaGVja0ZvclJlcXVpcmVkKFxuICAgIGZpZWxkLnJlcXVpcmVkLFxuICAgIFwiZnJvbnRcIlxuICApfSR7Y2hlY2tGb3JNdWx0aXBsZVZhbHVlcyhcbiAgICBmaWVsZC5tdWx0aXBsZVZhbHVlcyxcbiAgICBcImZyb250XCJcbiAgKX0ke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoZmllbGQudHlwZSl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKFxuICAgIGZpZWxkLm11bHRpcGxlVmFsdWVzLFxuICAgIFwiYmFja1wiXG4gICl9JHtjaGVja0ZvclJlcXVpcmVkKGZpZWxkLnJlcXVpcmVkLCBcImJhY2tcIil9IH1gO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gdGhlIGZpZWxkIHR5cGUgKElELCBTdHJpbmcsIE51bWJlciwgQm9vbGVhbiwgb3IgRmxvYXQpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHRoZSBHcmFwaFFMIHR5cGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBmaWVsZCB0eXBlIGVudGVyZWRcbiAqL1xuZnVuY3Rpb24gdGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0eXBlKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgXCJJRFwiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTElEXCI7XG4gICAgY2FzZSBcIlN0cmluZ1wiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTFN0cmluZ1wiO1xuICAgIGNhc2UgXCJOdW1iZXJcIjpcbiAgICAgIHJldHVybiBcIkdyYXBoUUxJbnRcIjtcbiAgICBjYXNlIFwiQm9vbGVhblwiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTEJvb2xlYW5cIjtcbiAgICBjYXNlIFwiRmxvYXRcIjpcbiAgICAgIHJldHVybiBcIkdyYXBoUUxGbG9hdFwiO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gXCJHcmFwaFFMU3RyaW5nXCI7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmVHlwZU5hbWUgLSBBbnkgc3RyaW5nIGlucHV0dGVkXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIFRoZSBzdHJpbmcgaW5wdXR0ZWQsIGJ1dCB3aXRoIHRoZSBmaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWQgYW5kIHRoZSByZXN0IGxvd2VyY2FzZWRcbiAqL1xuZnVuY3Rpb24gdG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpIHtcbiAgbGV0IG5hbWUgPSByZWZUeXBlTmFtZVswXS50b1VwcGVyQ2FzZSgpO1xuICBuYW1lICs9IHJlZlR5cGVOYW1lLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBuYW1lO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGZpZWxkIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGVzIC0gYWxsIHRoZSB0YWJsZXMgbWFkZSBieSB0aGUgdXNlci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQnVpbGRzIGEgc3ViIHR5cGUgZm9yIGFueSBmaWVsZCB3aXRoIGEgcmVsYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN1YlF1ZXJ5KGZpZWxkLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IHJlZlR5cGVOYW1lID0gdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLnR5cGU7XG4gIGNvbnN0IHJlZkZpZWxkTmFtZSA9XG4gICAgdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLmZpZWxkc1tmaWVsZC5yZWxhdGlvbi5maWVsZEluZGV4XS5uYW1lO1xuICBjb25zdCByZWZGaWVsZFR5cGUgPVxuICAgIHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0udHlwZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke2NyZWF0ZVN1YlF1ZXJ5TmFtZShcbiAgICBmaWVsZCxcbiAgICByZWZUeXBlTmFtZVxuICApfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6IGA7XG5cbiAgaWYgKFxuICAgIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09IFwib25lIHRvIG1hbnlcIiB8fFxuICAgIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09IFwibWFueSB0byBtYW55XCJcbiAgKSB7XG4gICAgcXVlcnkgKz0gYG5ldyBHcmFwaFFMTGlzdCgke3JlZlR5cGVOYW1lfVR5cGUpLGA7XG4gIH0gZWxzZSB7XG4gICAgcXVlcnkgKz0gYCR7cmVmVHlwZU5hbWV9VHlwZSxgO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHtyZWZUeXBlTmFtZX0uJHtmaW5kRGJTZWFyY2hNZXRob2QoXG4gICAgICByZWZGaWVsZE5hbWUsXG4gICAgICByZWZGaWVsZFR5cGUsXG4gICAgICBmaWVsZC5yZWxhdGlvbi5yZWZUeXBlXG4gICAgKX1gO1xuICAgIHF1ZXJ5ICs9IGAoJHtjcmVhdGVTZWFyY2hPYmplY3QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIGZpZWxkKX0pO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn19YDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNeVNRTFwiIHx8IGRhdGFiYXNlID09PSBcIlBvc3RncmVTUUxcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBTRUxFQ1QgKiBGUk9NIFwiJHtyZWZUeXBlTmFtZX1cIiBXSEVSRSBcIiR7cmVmRmllbGROYW1lfVwiID0gJ1xcJHtwYXJlbnQuJHtmaWVsZC5uYW1lfX0nO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoZmllbGQucmVsYXRpb24ucmVmVHlwZSk7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn19YDtcbiAgfVxuICByZXR1cm4gcXVlcnk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlZlR5cGUgLSBUaGUgcmVsYXRpb24gdHlwZSBvZiB0aGUgc3ViIHF1ZXJ5XG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHRoZSBjb2RlIGZvciBhIFNRTCBwb29sIHF1ZXJ5LlxuICovXG5mdW5jdGlvbiBidWlsZFNRTFBvb2xRdWVyeShyZWZUeXBlKSB7XG4gIGxldCByb3dzID0gXCJcIjtcbiAgaWYgKHJlZlR5cGUgPT09IFwib25lIHRvIG9uZVwiIHx8IHJlZlR5cGUgPT09IFwibWFueSB0byBvbmVcIikgcm93cyA9IFwicm93c1swXVwiO1xuICBlbHNlIHJvd3MgPSBcInJvd3NcIjtcblxuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wucXVlcnkoc3FsKVxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4gcmVzLiR7cm93c30pXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coJ0Vycm9yOiAnLCBlcnIpKVxcbmA7XG4gIHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3ViUXVlcnlOYW1lKGZpZWxkLCByZWZUeXBlTmFtZSkge1xuICBzd2l0Y2ggKGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUpIHtcbiAgICBjYXNlIFwib25lIHRvIG9uZVwiOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlIFwib25lIHRvIG1hbnlcIjpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlIFwibWFueSB0byBvbmVcIjpcbiAgICAgIHJldHVybiBgcmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSBcIm1hbnkgdG8gbWFueVwiOlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZERiU2VhcmNoTWV0aG9kKHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCByZWZUeXBlKSB7XG4gIGlmIChyZWZGaWVsZE5hbWUgPT09IFwiaWRcIiB8fCByZWZGaWVsZFR5cGUgPT09IFwiSURcIikgcmV0dXJuIFwiZmluZEJ5SWRcIjtcbiAgZWxzZSBpZiAocmVmVHlwZSA9PT0gXCJvbmUgdG8gb25lXCIpIHJldHVybiBcImZpbmRPbmVcIjtcbiAgZWxzZSByZXR1cm4gXCJmaW5kXCI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gXCJpZFwiIHx8IHJlZkZpZWxkVHlwZSA9PT0gXCJJRFwiKSB7XG4gICAgcmV0dXJuIGBwYXJlbnQuJHtmaWVsZC5uYW1lfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGB7ICR7cmVmRmllbGROYW1lfTogcGFyZW50LiR7ZmllbGQubmFtZX0gfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBcIlwiO1xuXG4gIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKTtcblxuICBpZiAoISF0YWJsZS5maWVsZHNbMF0pIHtcbiAgICBxdWVyeSArPSBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSk7XG4gIH1cblxuICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1ldmVyeSR7dG9UaXRsZUNhc2UodGFibGUudHlwZSl9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6IG5ldyBHcmFwaFFMTGlzdCgke3RhYmxlLnR5cGV9VHlwZSksXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUoKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmQoe30pO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KFwibWFueVwiKTtcbiAgfVxuXG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIGRhdGFiYXNlIHNlbGVjdGVkXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHJvb3QgcXVlcnkgY29kZSB0byBmaW5kIGFuIGluZGl2aWR1YWwgdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBjb25zdCBpZEZpZWxkTmFtZSA9IHRhYmxlLmZpZWxkc1swXS5uYW1lO1xuICBsZXQgcXVlcnkgPSBgLFxcbiR7dGFifSR7dGFifSR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfToge1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczogeyAke2lkRmllbGROYW1lfTogeyB0eXBlOiAke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoXG4gICAgdGFibGUuZmllbGRzWzBdLnR5cGVcbiAgKX19fSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNb25nb0RCXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZEJ5SWQoYXJncy5pZCk7XFxuYDtcbiAgfVxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIiBXSEVSRSAke2lkRmllbGROYW1lfSA9ICdcXCR7YXJncy5pZH0nO1xcYDtcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KFwib25lIHRvIG9uZVwiKTtcbiAgfVxuXG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke2FkZE11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9YDtcbiAgaWYgKHRhYmxlLmZpZWxkc1swXSkge1xuICAgIHN0cmluZyArPSBgLFxcbiR7dXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX0sXFxuYDtcbiAgICBzdHJpbmcgKz0gYCR7ZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICB9XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbE11dGF0aW9uKCkge1xuICBsZXQgc3RyaW5nID0gYGA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wuY29ubmVjdCgpXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihjbGllbnQgPT4ge1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIGNsaWVudC5xdWVyeShzcWwpXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4ge1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y2xpZW50LnJlbGVhc2UoKTtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiByZXMucm93c1swXTtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0uY2F0Y2goZXJyID0+IHtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNsaWVudC5yZWxlYXNlKCk7XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn19KVxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gO1xuICByZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBhZGRNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWFkZCR7dGFibGUudHlwZX06IHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHtcXG5gO1xuXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGZpZWxkSW5kZXggaW4gdGFibGUuZmllbGRzKSB7XG4gICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9IFwiLFxcblwiO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0oXG4gICAgICB0YWJsZS5maWVsZHNbZmllbGRJbmRleF1cbiAgICApfWA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifX0sXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0ICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfSA9IG5ldyAke1xuICAgICAgdGFibGUudHlwZVxuICAgIH0oYXJncyk7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfS5zYXZlKCk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNeVNRTFwiIHx8IGRhdGFiYXNlID09PSBcIlBvc3RncmVTUUxcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBjb2x1bW5zID0gT2JqZWN0LmtleXMoYXJncykubWFwKGVsID0+IFxcYFwiXFwke2VsfVwiXFxgKTtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKGFyZ3MpLm1hcChlbCA9PiBcXGAnXFwke2VsfSdcXGApO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYElOU0VSVCBJTlRPIFwiJHt0YWJsZS50eXBlfVwiIChcXCR7Y29sdW1uc30pIFZBTFVFUyAoXFwke3ZhbHVlc30pIFJFVFVSTklORyAqXFxgO1xcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTtcbiAgfVxuXG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9dXBkYXRlJHt0YWJsZS50eXBlfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbiR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHtcXG5gO1xuXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGZpZWxkSW5kZXggaW4gdGFibGUuZmllbGRzKSB7XG4gICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9IFwiLFxcblwiO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0oXG4gICAgICB0YWJsZS5maWVsZHNbZmllbGRJbmRleF1cbiAgICApfWA7XG4gIH1cblxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9fSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIilcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZEJ5SWRBbmRVcGRhdGUoYXJncy5pZCwgYXJncyk7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9bGV0IHVwZGF0ZVZhbHVlcyA9ICcnO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWZvciAoY29uc3QgcHJvcCBpbiBhcmdzKSB7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9aWYgKHVwZGF0ZVZhbHVlcy5sZW5ndGggPiAwKSB1cGRhdGVWYWx1ZXMgKz0gXFxgLCBcXGA7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9dXBkYXRlVmFsdWVzICs9IFxcYFwiXFwke3Byb3B9XCIgPSAnXFwke2FyZ3NbcHJvcF19JyBcXGA7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFVQREFURSBcIiR7dGFibGUudHlwZX1cIiBTRVQgXFwke3VwZGF0ZVZhbHVlc30gV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7XG4gIH1cbiAgcmV0dXJuIChxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IGlkRmllbGROYW1lID0gdGFibGUuZmllbGRzWzBdLm5hbWU7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1kZWxldGUke3RhYmxlLnR5cGV9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZShcbiAgICB0YWJsZS5maWVsZHNbMF0udHlwZVxuICApfX19LFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFJlbW92ZShhcmdzLmlkKTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk15U1FMXCIgfHwgZGF0YWJhc2UgPT09IFwiUG9zdGdyZVNRTFwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYERFTEVURSBGUk9NIFwiJHt0YWJsZS50eXBlfVwiIFdIRVJFIGlkID0gJ1xcJHthcmdzLmlkfScgUkVUVVJOSU5HICo7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xNdXRhdGlvbigpO1xuICB9XG5cbiAgcmV0dXJuIChxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JSZXF1aXJlZChyZXF1aXJlZCwgcG9zaXRpb24pIHtcbiAgaWYgKHJlcXVpcmVkKSB7XG4gICAgaWYgKHBvc2l0aW9uID09PSBcImZyb250XCIpIHtcbiAgICAgIHJldHVybiBcIm5ldyBHcmFwaFFMTm9uTnVsbChcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiKVwiO1xuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG5mdW5jdGlvbiBjaGVja0Zvck11bHRpcGxlVmFsdWVzKG11bHRpcGxlVmFsdWVzLCBwb3NpdGlvbikge1xuICBpZiAobXVsdGlwbGVWYWx1ZXMpIHtcbiAgICBpZiAocG9zaXRpb24gPT09IFwiZnJvbnRcIikge1xuICAgICAgcmV0dXJuIFwibmV3IEdyYXBoUUxMaXN0KFwiO1xuICAgIH1cbiAgICByZXR1cm4gXCIpXCI7XG4gIH1cbiAgcmV0dXJuIFwiXCI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VHcmFwaHFsU2VydmVyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==