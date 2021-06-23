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
  query += "const graphql = require('graphql');\n";
  for (var databaseIndex in databases) {
    var database = databases[databaseIndex];
    // database.data is same as database.tables

    query += buildRequireStatements(database.data, database.databaseName);
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
function buildRequireStatements(tables, database) {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwiZGF0YWJhc2VzIiwicXVlcnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2UiLCJidWlsZFJlcXVpcmVTdGF0ZW1lbnRzIiwiZGF0YSIsImRhdGFiYXNlTmFtZSIsImJ1aWxkR3JhcGhxbFZhcmlhYmxlcyIsInRhYmxlcyIsInRhYmxlSW5kZXgiLCJidWlsZEdyYXBocWxUeXBlU2NoZW1hIiwiZmlyc3RSb290TG9vcCIsImJ1aWxkR3JhcGhxbFJvb3RRdWVyeSIsImZpcnN0TXV0YXRpb25Mb29wIiwiYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSIsInJlcXVpcmVTdGF0ZW1lbnRzIiwidHlwZSIsInRvTG93ZXJDYXNlIiwidGFibGUiLCJidWlsZEdyYXBoUUxUeXBlRmllbGRzIiwiZmlyc3RMb29wIiwiZmllbGRJbmRleCIsImJ1aWxkRmllbGRJdGVtIiwiZmllbGRzIiwicmVsYXRpb24iLCJjcmVhdGVTdWJRdWVyeSIsInJlZkJ5IiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsInZhbHVlIiwicGFyc2VkVmFsdWUiLCJzcGxpdCIsImZpZWxkIiwibmFtZSIsInJlZlR5cGUiLCJjaGVja0ZvclJlcXVpcmVkIiwicmVxdWlyZWQiLCJjaGVja0Zvck11bHRpcGxlVmFsdWVzIiwibXVsdGlwbGVWYWx1ZXMiLCJ0YWJsZVR5cGVUb0dyYXBocWxUeXBlIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJyZWZGaWVsZE5hbWUiLCJyZWZGaWVsZFR5cGUiLCJjcmVhdGVTdWJRdWVyeU5hbWUiLCJmaW5kRGJTZWFyY2hNZXRob2QiLCJjcmVhdGVTZWFyY2hPYmplY3QiLCJidWlsZFNRTFBvb2xRdWVyeSIsInJvd3MiLCJjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5IiwiY3JlYXRlRmluZEJ5SWRRdWVyeSIsImlkRmllbGROYW1lIiwic3RyaW5nIiwiYWRkTXV0YXRpb24iLCJ1cGRhdGVNdXRhdGlvbiIsImRlbGV0ZU11dGF0aW9uIiwiYnVpbGRTUUxQb29sTXV0YXRpb24iLCJwb3NpdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLFVBQU47O0FBRUE7QUFDQSxTQUFTQyxrQkFBVCxDQUE0QkMsU0FBNUIsRUFBdUM7QUFDckMsTUFBSUMsUUFBUSxFQUFaO0FBQ0FBLFdBQVEsdUNBQVI7QUFDQSxPQUFLLElBQU1DLGFBQVgsSUFBNEJGLFNBQTVCLEVBQXVDO0FBQ3JDLFFBQU1HLFdBQVdILFVBQVVFLGFBQVYsQ0FBakI7QUFDQTs7QUFFQUQsYUFBU0csdUJBQXVCRCxTQUFTRSxJQUFoQyxFQUFzQ0YsU0FBU0csWUFBL0MsQ0FBVDtBQUNEO0FBQ0RMLFdBQVNNLHVCQUFUOztBQUVBO0FBQ0EsT0FBSyxJQUFNTCxjQUFYLElBQTRCRixTQUE1QixFQUF1QztBQUNyQyxRQUFNUSxTQUFTUixVQUFVRSxjQUFWLEVBQXlCRyxJQUF4QztBQUNBLFFBQU1DLGVBQWVOLFVBQVVFLGNBQVYsRUFBeUJJLFlBQTlDO0FBQ0EsU0FBSyxJQUFNRyxVQUFYLElBQXlCRCxNQUF6QixFQUFpQztBQUMvQlAsZUFBU1MsdUJBQXVCRixPQUFPQyxVQUFQLENBQXZCLEVBQTJDRCxNQUEzQyxFQUFtREYsWUFBbkQsQ0FBVDtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQUwsMkRBQXVESCxHQUF2RCxnQ0FBcUZBLEdBQXJGOztBQUVBLE1BQUlhLGdCQUFnQixJQUFwQjtBQUNBLE9BQUssSUFBTVQsZUFBWCxJQUE0QkYsU0FBNUIsRUFBdUM7QUFDckMsUUFBTVEsVUFBU1IsVUFBVUUsZUFBVixFQUF5QkcsSUFBeEM7QUFDQSxRQUFNQyxnQkFBZU4sVUFBVUUsZUFBVixFQUF5QkksWUFBOUM7QUFDQSxTQUFLLElBQU1HLFdBQVgsSUFBeUJELE9B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QUNELFdBQU8sR0FBUDtBQUNEO0FBQ0QsU0FBTyxFQUFQO0FBQ0Q7O0FBRURDLE9BQU9DLE9BQVAsR0FBaUIvRCxrQkFBakIsQyIsImZpbGUiOiJtYWluLjUyNmM3NjhhNzhiMTJiMDkzY2E2LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0YWIgPSBgICBgO1xuXG4vLyBGdW5jdGlvbiB0aGF0IGV2b2tlcyBhbGwgb3RoZXIgaGVscGVyIGZ1bmN0aW9uc1xuZnVuY3Rpb24gcGFyc2VHcmFwaHFsU2VydmVyKGRhdGFiYXNlcykge1xuICBsZXQgcXVlcnkgPSBcIlwiIDtcbiAgcXVlcnkrPSBcImNvbnN0IGdyYXBocWwgPSByZXF1aXJlKCdncmFwaHFsJyk7XFxuXCJcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IGRhdGFiYXNlID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdO1xuICAgIC8vIGRhdGFiYXNlLmRhdGEgaXMgc2FtZSBhcyBkYXRhYmFzZS50YWJsZXNcbiAgICBcbiAgICBxdWVyeSArPSBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKGRhdGFiYXNlLmRhdGEsIGRhdGFiYXNlLmRhdGFiYXNlTmFtZSk7XG4gIH1cbiAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCk7XG5cbiAgLy8gQlVJTEQgVFlQRSBTQ0hFTUFcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IHRhYmxlcyA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhO1xuICAgIGNvbnN0IGRhdGFiYXNlTmFtZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhYmFzZU5hbWU7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSh0YWJsZXNbdGFibGVJbmRleF0sIHRhYmxlcywgZGF0YWJhc2VOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvLyBCVUlMRCBST09UIFFVRVJZXG4gIHF1ZXJ5ICs9IGBjb25zdCBSb290UXVlcnkgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdSb290UXVlcnlUeXBlJyxcXG4ke3RhYn1maWVsZHM6IHtcXG5gO1xuXG4gIGxldCBmaXJzdFJvb3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IHRhYmxlcyA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhO1xuICAgIGNvbnN0IGRhdGFiYXNlTmFtZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhYmFzZU5hbWU7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgaWYgKCFmaXJzdFJvb3RMb29wKSBxdWVyeSArPSBcIixcXG5cIjtcbiAgICAgIGZpcnN0Um9vdExvb3AgPSBmYWxzZTtcblxuICAgICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5KHRhYmxlc1t0YWJsZUluZGV4XSwgZGF0YWJhc2VOYW1lKTtcbiAgICB9XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIC8vIEJVSUxEIE1VVEFUSU9OU1xuICBxdWVyeSArPSBgY29uc3QgTXV0YXRpb24gPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdNdXRhdGlvbicsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RNdXRhdGlvbkxvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7XG4gICAgY29uc3QgdGFibGVzID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdLmRhdGE7XG4gICAgY29uc3QgZGF0YWJhc2VOYW1lID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdLmRhdGFiYXNlTmFtZTtcbiAgICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgICBpZiAoIWZpcnN0TXV0YXRpb25Mb29wKSBxdWVyeSArPSBcIixcXG5cIjtcbiAgICAgIGZpcnN0TXV0YXRpb25Mb29wID0gZmFsc2U7XG5cbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZU5hbWUpO1xuICAgIH1cbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9fVxcbn0pO1xcblxcbmA7XG5cbiAgcXVlcnkgKz0gYG1vZHVsZS5leHBvcnRzID0gbmV3IEdyYXBoUUxTY2hlbWEoe1xcbiR7dGFifXF1ZXJ5OiBSb290UXVlcnksXFxuJHt0YWJ9bXV0YXRpb246IE11dGF0aW9uXFxufSk7YDtcbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIFJlcHJlc2VudHMgdGhlIGRhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQWxsIHRoZSByZXF1aXJlIHN0YXRlbWVudHMgbmVlZGVkIGZvciB0aGUgR3JhcGhRTCBzZXJ2ZXIuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkUmVxdWlyZVN0YXRlbWVudHModGFibGVzLCBkYXRhYmFzZSkge1xuICBcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0ICR7XG4gICAgICAgIHRhYmxlc1t0YWJsZUluZGV4XS50eXBlXG4gICAgICB9ID0gcmVxdWlyZSgnLi4vZGIvJHt0YWJsZXNbdGFibGVJbmRleF0udHlwZS50b0xvd2VyQ2FzZSgpfS5qcycpO1xcbmA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcXVpcmVTdGF0ZW1lbnRzICs9IGBjb25zdCBwb29sID0gcmVxdWlyZSgnLi4vZGIvc3FsX3Bvb2wuanMnKTtcXG5gO1xuICB9XG4gIHJldHVybiByZXF1aXJlU3RhdGVtZW50cztcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIGFsbCBjb25zdGFudHMgbmVlZGVkIGZvciBhIEdyYXBoUUwgc2VydmVyXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFZhcmlhYmxlcygpIHtcbiAgcmV0dXJuIGBcbmNvbnN0IHsgXG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMU2NoZW1hLFxuICBHcmFwaFFMSUQsXG4gIEdyYXBoUUxTdHJpbmcsIFxuICBHcmFwaFFMSW50LCBcbiAgR3JhcGhRTEJvb2xlYW4sXG4gIEdyYXBoUUxMaXN0LFxuICBHcmFwaFFMTm9uTnVsbFxufSA9IGdyYXBocWw7XG4gIFxcbmA7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgR3JhcGhRTCB0eXBlIGNvZGUgZm9yIHRoZSBpbnB1dHRlZCB0YWJsZVxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxUeXBlU2NoZW1hKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGBjb25zdCAke3RhYmxlLnR5cGV9VHlwZSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifW5hbWU6ICcke3RhYmxlLnR5cGV9JyxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9ZmllbGRzOiAoKSA9PiAoe2A7XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpO1xuICByZXR1cm4gKHF1ZXJ5ICs9IGBcXG4ke3RhYn19KVxcbn0pO1xcblxcbmApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGludGVyYXRlZCBvbi4gRWFjaCB0YWJsZSBjb25zaXN0cyBvZiBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbiBvYmplY3Qgb2YgYWxsIHRoZSB0YWJsZXMgY3JlYXRlZCBpbiB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gZWFjaCBmaWVsZCBmb3IgdGhlIEdyYXBoUUwgdHlwZS5cbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBcIlwiO1xuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChsZXQgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gXCIsXCI7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWA7XG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpZWxkIGhhcyBhIHJlbGF0aW9uIHRvIGFub3RoZXIgZmllbGRcbiAgICBpZiAodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlbGF0aW9uLnRhYmxlSW5kZXggPiAtMSkge1xuICAgICAgcXVlcnkgKz0gY3JlYXRlU3ViUXVlcnkodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaXMgYSByZWxhdGlvbiBmb3IgYW5vdGhlciBmaWVsZFxuICAgIGNvbnN0IHJlZkJ5ID0gdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlZkJ5O1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJlZkJ5KSkge1xuICAgICAgcmVmQnkuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgY29uc3QgcGFyc2VkVmFsdWUgPSB2YWx1ZS5zcGxpdChcIi5cIik7XG4gICAgICAgIGNvbnN0IGZpZWxkID0ge1xuICAgICAgICAgIG5hbWU6IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS5uYW1lLFxuICAgICAgICAgIHJlbGF0aW9uOiB7XG4gICAgICAgICAgICB0YWJsZUluZGV4OiBwYXJzZWRWYWx1ZVswXSxcbiAgICAgICAgICAgIGZpZWxkSW5kZXg6IHBhcnNlZFZhbHVlWzFdLFxuICAgICAgICAgICAgcmVmVHlwZTogcGFyc2VkVmFsdWVbMl0sXG4gICAgICAgICAgICB0eXBlOiB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0udHlwZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgaW5mb3JtYXRpb24gZm9yIHRoZSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHJldHVybnMge1N0cmluZ30gLSBhIGZpZWxkIGl0ZW0gKGV4OiAnaWQ6IHsgdHlwZTogR3JhcGhRTElEIH0nKVxuICovXG5mdW5jdGlvbiBidWlsZEZpZWxkSXRlbShmaWVsZCkge1xuICByZXR1cm4gYCR7ZmllbGQubmFtZX06IHsgdHlwZTogJHtjaGVja0ZvclJlcXVpcmVkKFxuICAgIGZpZWxkLnJlcXVpcmVkLFxuICAgIFwiZnJvbnRcIlxuICApfSR7Y2hlY2tGb3JNdWx0aXBsZVZhbHVlcyhcbiAgICBmaWVsZC5tdWx0aXBsZVZhbHVlcyxcbiAgICBcImZyb250XCJcbiAgKX0ke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoZmllbGQudHlwZSl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKFxuICAgIGZpZWxkLm11bHRpcGxlVmFsdWVzLFxuICAgIFwiYmFja1wiXG4gICl9JHtjaGVja0ZvclJlcXVpcmVkKGZpZWxkLnJlcXVpcmVkLCBcImJhY2tcIil9IH1gO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gdGhlIGZpZWxkIHR5cGUgKElELCBTdHJpbmcsIE51bWJlciwgQm9vbGVhbiwgb3IgRmxvYXQpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHRoZSBHcmFwaFFMIHR5cGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBmaWVsZCB0eXBlIGVudGVyZWRcbiAqL1xuZnVuY3Rpb24gdGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0eXBlKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgXCJJRFwiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTElEXCI7XG4gICAgY2FzZSBcIlN0cmluZ1wiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTFN0cmluZ1wiO1xuICAgIGNhc2UgXCJOdW1iZXJcIjpcbiAgICAgIHJldHVybiBcIkdyYXBoUUxJbnRcIjtcbiAgICBjYXNlIFwiQm9vbGVhblwiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTEJvb2xlYW5cIjtcbiAgICBjYXNlIFwiRmxvYXRcIjpcbiAgICAgIHJldHVybiBcIkdyYXBoUUxGbG9hdFwiO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gXCJHcmFwaFFMU3RyaW5nXCI7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmVHlwZU5hbWUgLSBBbnkgc3RyaW5nIGlucHV0dGVkXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIFRoZSBzdHJpbmcgaW5wdXR0ZWQsIGJ1dCB3aXRoIHRoZSBmaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWQgYW5kIHRoZSByZXN0IGxvd2VyY2FzZWRcbiAqL1xuZnVuY3Rpb24gdG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpIHtcbiAgbGV0IG5hbWUgPSByZWZUeXBlTmFtZVswXS50b1VwcGVyQ2FzZSgpO1xuICBuYW1lICs9IHJlZlR5cGVOYW1lLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBuYW1lO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGZpZWxkIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGVzIC0gYWxsIHRoZSB0YWJsZXMgbWFkZSBieSB0aGUgdXNlci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQnVpbGRzIGEgc3ViIHR5cGUgZm9yIGFueSBmaWVsZCB3aXRoIGEgcmVsYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN1YlF1ZXJ5KGZpZWxkLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IHJlZlR5cGVOYW1lID0gdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLnR5cGU7XG4gIGNvbnN0IHJlZkZpZWxkTmFtZSA9XG4gICAgdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLmZpZWxkc1tmaWVsZC5yZWxhdGlvbi5maWVsZEluZGV4XS5uYW1lO1xuICBjb25zdCByZWZGaWVsZFR5cGUgPVxuICAgIHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0udHlwZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke2NyZWF0ZVN1YlF1ZXJ5TmFtZShcbiAgICBmaWVsZCxcbiAgICByZWZUeXBlTmFtZVxuICApfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6IGA7XG5cbiAgaWYgKFxuICAgIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09IFwib25lIHRvIG1hbnlcIiB8fFxuICAgIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09IFwibWFueSB0byBtYW55XCJcbiAgKSB7XG4gICAgcXVlcnkgKz0gYG5ldyBHcmFwaFFMTGlzdCgke3JlZlR5cGVOYW1lfVR5cGUpLGA7XG4gIH0gZWxzZSB7XG4gICAgcXVlcnkgKz0gYCR7cmVmVHlwZU5hbWV9VHlwZSxgO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHtyZWZUeXBlTmFtZX0uJHtmaW5kRGJTZWFyY2hNZXRob2QoXG4gICAgICByZWZGaWVsZE5hbWUsXG4gICAgICByZWZGaWVsZFR5cGUsXG4gICAgICBmaWVsZC5yZWxhdGlvbi5yZWZUeXBlXG4gICAgKX1gO1xuICAgIHF1ZXJ5ICs9IGAoJHtjcmVhdGVTZWFyY2hPYmplY3QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIGZpZWxkKX0pO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn19YDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNeVNRTFwiIHx8IGRhdGFiYXNlID09PSBcIlBvc3RncmVTUUxcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBTRUxFQ1QgKiBGUk9NIFwiJHtyZWZUeXBlTmFtZX1cIiBXSEVSRSBcIiR7cmVmRmllbGROYW1lfVwiID0gJ1xcJHtwYXJlbnQuJHtmaWVsZC5uYW1lfX0nO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoZmllbGQucmVsYXRpb24ucmVmVHlwZSk7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn19YDtcbiAgfVxuICByZXR1cm4gcXVlcnk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlZlR5cGUgLSBUaGUgcmVsYXRpb24gdHlwZSBvZiB0aGUgc3ViIHF1ZXJ5XG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHRoZSBjb2RlIGZvciBhIFNRTCBwb29sIHF1ZXJ5LlxuICovXG5mdW5jdGlvbiBidWlsZFNRTFBvb2xRdWVyeShyZWZUeXBlKSB7XG4gIGxldCByb3dzID0gXCJcIjtcbiAgaWYgKHJlZlR5cGUgPT09IFwib25lIHRvIG9uZVwiIHx8IHJlZlR5cGUgPT09IFwibWFueSB0byBvbmVcIikgcm93cyA9IFwicm93c1swXVwiO1xuICBlbHNlIHJvd3MgPSBcInJvd3NcIjtcblxuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wucXVlcnkoc3FsKVxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4gcmVzLiR7cm93c30pXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coJ0Vycm9yOiAnLCBlcnIpKVxcbmA7XG4gIHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3ViUXVlcnlOYW1lKGZpZWxkLCByZWZUeXBlTmFtZSkge1xuICBzd2l0Y2ggKGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUpIHtcbiAgICBjYXNlIFwib25lIHRvIG9uZVwiOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlIFwib25lIHRvIG1hbnlcIjpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlIFwibWFueSB0byBvbmVcIjpcbiAgICAgIHJldHVybiBgcmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSBcIm1hbnkgdG8gbWFueVwiOlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZERiU2VhcmNoTWV0aG9kKHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCByZWZUeXBlKSB7XG4gIGlmIChyZWZGaWVsZE5hbWUgPT09IFwiaWRcIiB8fCByZWZGaWVsZFR5cGUgPT09IFwiSURcIikgcmV0dXJuIFwiZmluZEJ5SWRcIjtcbiAgZWxzZSBpZiAocmVmVHlwZSA9PT0gXCJvbmUgdG8gb25lXCIpIHJldHVybiBcImZpbmRPbmVcIjtcbiAgZWxzZSByZXR1cm4gXCJmaW5kXCI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gXCJpZFwiIHx8IHJlZkZpZWxkVHlwZSA9PT0gXCJJRFwiKSB7XG4gICAgcmV0dXJuIGBwYXJlbnQuJHtmaWVsZC5uYW1lfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGB7ICR7cmVmRmllbGROYW1lfTogcGFyZW50LiR7ZmllbGQubmFtZX0gfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBcIlwiO1xuXG4gIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKTtcblxuICBpZiAoISF0YWJsZS5maWVsZHNbMF0pIHtcbiAgICBxdWVyeSArPSBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSk7XG4gIH1cblxuICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1ldmVyeSR7dG9UaXRsZUNhc2UodGFibGUudHlwZSl9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6IG5ldyBHcmFwaFFMTGlzdCgke3RhYmxlLnR5cGV9VHlwZSksXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUoKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmQoe30pO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KFwibWFueVwiKTtcbiAgfVxuXG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIGRhdGFiYXNlIHNlbGVjdGVkXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHJvb3QgcXVlcnkgY29kZSB0byBmaW5kIGFuIGluZGl2aWR1YWwgdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBjb25zdCBpZEZpZWxkTmFtZSA9IHRhYmxlLmZpZWxkc1swXS5uYW1lO1xuICBsZXQgcXVlcnkgPSBgLFxcbiR7dGFifSR7dGFifSR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfToge1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczogeyAke2lkRmllbGROYW1lfTogeyB0eXBlOiAke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoXG4gICAgdGFibGUuZmllbGRzWzBdLnR5cGVcbiAgKX19fSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNb25nb0RCXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZEJ5SWQoYXJncy5pZCk7XFxuYDtcbiAgfVxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIiBXSEVSRSAke2lkRmllbGROYW1lfSA9ICdcXCR7YXJncy5pZH0nO1xcYDtcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KFwib25lIHRvIG9uZVwiKTtcbiAgfVxuXG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke2FkZE11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9YDtcbiAgaWYgKHRhYmxlLmZpZWxkc1swXSkge1xuICAgIHN0cmluZyArPSBgLFxcbiR7dXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX0sXFxuYDtcbiAgICBzdHJpbmcgKz0gYCR7ZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICB9XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbE11dGF0aW9uKCkge1xuICBsZXQgc3RyaW5nID0gYGA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wuY29ubmVjdCgpXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihjbGllbnQgPT4ge1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIGNsaWVudC5xdWVyeShzcWwpXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4ge1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y2xpZW50LnJlbGVhc2UoKTtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiByZXMucm93c1swXTtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0uY2F0Y2goZXJyID0+IHtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNsaWVudC5yZWxlYXNlKCk7XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn19KVxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gO1xuICByZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBhZGRNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWFkZCR7dGFibGUudHlwZX06IHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHtcXG5gO1xuXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGZpZWxkSW5kZXggaW4gdGFibGUuZmllbGRzKSB7XG4gICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9IFwiLFxcblwiO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0oXG4gICAgICB0YWJsZS5maWVsZHNbZmllbGRJbmRleF1cbiAgICApfWA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifX0sXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0ICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfSA9IG5ldyAke1xuICAgICAgdGFibGUudHlwZVxuICAgIH0oYXJncyk7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfS5zYXZlKCk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNeVNRTFwiIHx8IGRhdGFiYXNlID09PSBcIlBvc3RncmVTUUxcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBjb2x1bW5zID0gT2JqZWN0LmtleXMoYXJncykubWFwKGVsID0+IFxcYFwiXFwke2VsfVwiXFxgKTtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKGFyZ3MpLm1hcChlbCA9PiBcXGAnXFwke2VsfSdcXGApO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYElOU0VSVCBJTlRPIFwiJHt0YWJsZS50eXBlfVwiIChcXCR7Y29sdW1uc30pIFZBTFVFUyAoXFwke3ZhbHVlc30pIFJFVFVSTklORyAqXFxgO1xcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTtcbiAgfVxuXG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9dXBkYXRlJHt0YWJsZS50eXBlfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbiR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHtcXG5gO1xuXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGZpZWxkSW5kZXggaW4gdGFibGUuZmllbGRzKSB7XG4gICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9IFwiLFxcblwiO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0oXG4gICAgICB0YWJsZS5maWVsZHNbZmllbGRJbmRleF1cbiAgICApfWA7XG4gIH1cblxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9fSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIilcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZEJ5SWRBbmRVcGRhdGUoYXJncy5pZCwgYXJncyk7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9bGV0IHVwZGF0ZVZhbHVlcyA9ICcnO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWZvciAoY29uc3QgcHJvcCBpbiBhcmdzKSB7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9aWYgKHVwZGF0ZVZhbHVlcy5sZW5ndGggPiAwKSB1cGRhdGVWYWx1ZXMgKz0gXFxgLCBcXGA7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9dXBkYXRlVmFsdWVzICs9IFxcYFwiXFwke3Byb3B9XCIgPSAnXFwke2FyZ3NbcHJvcF19JyBcXGA7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFVQREFURSBcIiR7dGFibGUudHlwZX1cIiBTRVQgXFwke3VwZGF0ZVZhbHVlc30gV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7XG4gIH1cbiAgcmV0dXJuIChxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IGlkRmllbGROYW1lID0gdGFibGUuZmllbGRzWzBdLm5hbWU7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1kZWxldGUke3RhYmxlLnR5cGV9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZShcbiAgICB0YWJsZS5maWVsZHNbMF0udHlwZVxuICApfX19LFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFJlbW92ZShhcmdzLmlkKTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk15U1FMXCIgfHwgZGF0YWJhc2UgPT09IFwiUG9zdGdyZVNRTFwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYERFTEVURSBGUk9NIFwiJHt0YWJsZS50eXBlfVwiIFdIRVJFIGlkID0gJ1xcJHthcmdzLmlkfScgUkVUVVJOSU5HICo7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xNdXRhdGlvbigpO1xuICB9XG5cbiAgcmV0dXJuIChxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JSZXF1aXJlZChyZXF1aXJlZCwgcG9zaXRpb24pIHtcbiAgaWYgKHJlcXVpcmVkKSB7XG4gICAgaWYgKHBvc2l0aW9uID09PSBcImZyb250XCIpIHtcbiAgICAgIHJldHVybiBcIm5ldyBHcmFwaFFMTm9uTnVsbChcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiKVwiO1xuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG5mdW5jdGlvbiBjaGVja0Zvck11bHRpcGxlVmFsdWVzKG11bHRpcGxlVmFsdWVzLCBwb3NpdGlvbikge1xuICBpZiAobXVsdGlwbGVWYWx1ZXMpIHtcbiAgICBpZiAocG9zaXRpb24gPT09IFwiZnJvbnRcIikge1xuICAgICAgcmV0dXJuIFwibmV3IEdyYXBoUUxMaXN0KFwiO1xuICAgIH1cbiAgICByZXR1cm4gXCIpXCI7XG4gIH1cbiAgcmV0dXJuIFwiXCI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VHcmFwaHFsU2VydmVyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==