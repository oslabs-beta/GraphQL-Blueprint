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
      "const " + tables[tableIndex].type + " = require('../db/" + tables[tableIndex].type.toLowerCase() + ".js');\n";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwiZGF0YWJhc2VzIiwicXVlcnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2UiLCJidWlsZFJlcXVpcmVTdGF0ZW1lbnRzIiwiZGF0YSIsImRhdGFiYXNlTmFtZSIsImJ1aWxkR3JhcGhxbFZhcmlhYmxlcyIsInRhYmxlcyIsInRhYmxlSW5kZXgiLCJidWlsZEdyYXBocWxUeXBlU2NoZW1hIiwiZmlyc3RSb290TG9vcCIsImJ1aWxkR3JhcGhxbFJvb3RRdWVyeSIsImZpcnN0TXV0YXRpb25Mb29wIiwiYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSIsInR5cGUiLCJ0b0xvd2VyQ2FzZSIsInJlcXVpcmVTdGF0ZW1lbnRzIiwidGFibGUiLCJidWlsZEdyYXBoUUxUeXBlRmllbGRzIiwiZmlyc3RMb29wIiwiZmllbGRJbmRleCIsImJ1aWxkRmllbGRJdGVtIiwiZmllbGRzIiwicmVsYXRpb24iLCJjcmVhdGVTdWJRdWVyeSIsInJlZkJ5IiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsInZhbHVlIiwicGFyc2VkVmFsdWUiLCJzcGxpdCIsImZpZWxkIiwibmFtZSIsInJlZlR5cGUiLCJjaGVja0ZvclJlcXVpcmVkIiwicmVxdWlyZWQiLCJjaGVja0Zvck11bHRpcGxlVmFsdWVzIiwibXVsdGlwbGVWYWx1ZXMiLCJ0YWJsZVR5cGVUb0dyYXBocWxUeXBlIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJyZWZGaWVsZE5hbWUiLCJyZWZGaWVsZFR5cGUiLCJjcmVhdGVTdWJRdWVyeU5hbWUiLCJmaW5kRGJTZWFyY2hNZXRob2QiLCJjcmVhdGVTZWFyY2hPYmplY3QiLCJidWlsZFNRTFBvb2xRdWVyeSIsInJvd3MiLCJjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5IiwiY3JlYXRlRmluZEJ5SWRRdWVyeSIsImlkRmllbGROYW1lIiwic3RyaW5nIiwiYWRkTXV0YXRpb24iLCJ1cGRhdGVNdXRhdGlvbiIsImRlbGV0ZU11dGF0aW9uIiwiYnVpbGRTUUxQb29sTXV0YXRpb24iLCJwb3NpdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLFVBQU47O0FBRUE7QUFDQSxTQUFTQyxrQkFBVCxDQUE0QkMsU0FBNUIsRUFBdUM7QUFDckMsTUFBSUMsUUFBUSxFQUFaO0FBQ0FBLFdBQVEsdUNBQVI7QUFDQSxPQUFLLElBQU1DLGFBQVgsSUFBNEJGLFNBQTVCLEVBQXVDO0FBQ3JDLFFBQU1HLFdBQVdILFVBQVVFLGFBQVYsQ0FBakI7QUFDQTs7QUFFQUQsYUFBU0csdUJBQXVCRCxTQUFTRSxJQUFoQyxFQUFzQ0YsU0FBU0csWUFBL0MsQ0FBVDtBQUNEO0FBQ0RMLFdBQVNNLHVCQUFUOztBQUVBO0FBQ0EsT0FBSyxJQUFNTCxjQUFYLElBQTRCRixTQUE1QixFQUF1QztBQUNyQyxRQUFNUSxTQUFTUixVQUFVRSxjQUFWLEVBQXlCRyxJQUF4QztBQUNBLFFBQU1DLGVBQWVOLFVBQVVFLGNBQVYsRUFBeUJJLFlBQTlDO0FBQ0EsU0FBSyxJQUFNRyxVQUFYLElBQXlCRCxNQUF6QixFQUFpQztBQUMvQlAsZUFBU1MsdUJBQXVCRixPQUFPQyxVQUFQLENBQXZCLEVBQTJDRCxNQUEzQyxFQUFtREYsWUFBbkQsQ0FBVDtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQUwsMkRBQXVESCxHQUF2RCxnQ0FBcUZBLEdBQXJGOztBQUVBLE1BQUlhLGdCQUFnQixJQUFwQjtBQUNBLE9BQUssSUFBTVQsZUFBWCxJQUE0QkYsU0FBNUIsRUFBdUM7QUFDckMsUUFBTVEsVUFBU1IsVUFBVUUsZUFBVixFQUF5QkcsSUFBeEM7QUFDQSxRQUFNQyxnQkFBZU4sVUFBVUUsZUFBVixFQUF5QkksWUFBOUM7QUFDQSxTQUFLLElBQU1HLFdBQVgsSUFBeUJELE9B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Q0QsV0FBTyxHQUFQO0FBQ0Q7QUFDRCxTQUFPLEVBQVA7QUFDRDs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQi9ELGtCQUFqQixDIiwiZmlsZSI6Im1haW4uYWFjNDA1MjY3MmJjODQzOTVmNWIuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhYiA9IGAgIGA7XG5cbi8vIEZ1bmN0aW9uIHRoYXQgZXZva2VzIGFsbCBvdGhlciBoZWxwZXIgZnVuY3Rpb25zXG5mdW5jdGlvbiBwYXJzZUdyYXBocWxTZXJ2ZXIoZGF0YWJhc2VzKSB7XG4gIGxldCBxdWVyeSA9IFwiXCIgO1xuICBxdWVyeSs9IFwiY29uc3QgZ3JhcGhxbCA9IHJlcXVpcmUoJ2dyYXBocWwnKTtcXG5cIlxuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7XG4gICAgY29uc3QgZGF0YWJhc2UgPSBkYXRhYmFzZXNbZGF0YWJhc2VJbmRleF07XG4gICAgLy8gZGF0YWJhc2UuZGF0YSBpcyBzYW1lIGFzIGRhdGFiYXNlLnRhYmxlc1xuICAgIFxuICAgIHF1ZXJ5ICs9IGJ1aWxkUmVxdWlyZVN0YXRlbWVudHMoZGF0YWJhc2UuZGF0YSwgZGF0YWJhc2UuZGF0YWJhc2VOYW1lKTtcbiAgfVxuICBxdWVyeSArPSBidWlsZEdyYXBocWxWYXJpYWJsZXMoKTtcblxuICAvLyBCVUlMRCBUWVBFIFNDSEVNQVxuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7XG4gICAgY29uc3QgdGFibGVzID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdLmRhdGE7XG4gICAgY29uc3QgZGF0YWJhc2VOYW1lID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdLmRhdGFiYXNlTmFtZTtcbiAgICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgICBxdWVyeSArPSBidWlsZEdyYXBocWxUeXBlU2NoZW1hKHRhYmxlc1t0YWJsZUluZGV4XSwgdGFibGVzLCBkYXRhYmFzZU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEJVSUxEIFJPT1QgUVVFUllcbiAgcXVlcnkgKz0gYGNvbnN0IFJvb3RRdWVyeSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuJHt0YWJ9bmFtZTogJ1Jvb3RRdWVyeVR5cGUnLFxcbiR7dGFifWZpZWxkczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0Um9vdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7XG4gICAgY29uc3QgdGFibGVzID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdLmRhdGE7XG4gICAgY29uc3QgZGF0YWJhc2VOYW1lID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdLmRhdGFiYXNlTmFtZTtcbiAgICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgICBpZiAoIWZpcnN0Um9vdExvb3ApIHF1ZXJ5ICs9IFwiLFxcblwiO1xuICAgICAgZmlyc3RSb290TG9vcCA9IGZhbHNlO1xuXG4gICAgICBxdWVyeSArPSBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZU5hbWUpO1xuICAgIH1cbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9fVxcbn0pO1xcblxcbmA7XG5cbiAgLy8gQlVJTEQgTVVUQVRJT05TXG4gIHF1ZXJ5ICs9IGBjb25zdCBNdXRhdGlvbiA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuJHt0YWJ9bmFtZTogJ011dGF0aW9uJyxcXG4ke3RhYn1maWVsZHM6IHtcXG5gO1xuXG4gIGxldCBmaXJzdE11dGF0aW9uTG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXMpIHtcbiAgICBjb25zdCB0YWJsZXMgPSBkYXRhYmFzZXNbZGF0YWJhc2VJbmRleF0uZGF0YTtcbiAgICBjb25zdCBkYXRhYmFzZU5hbWUgPSBkYXRhYmFzZXNbZGF0YWJhc2VJbmRleF0uZGF0YWJhc2VOYW1lO1xuICAgIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICAgIGlmICghZmlyc3RNdXRhdGlvbkxvb3ApIHF1ZXJ5ICs9IFwiLFxcblwiO1xuICAgICAgZmlyc3RNdXRhdGlvbkxvb3AgPSBmYWxzZTtcblxuICAgICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSh0YWJsZXNbdGFibGVJbmRleF0sIGRhdGFiYXNlTmFtZSk7XG4gICAgfVxuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn19XFxufSk7XFxuXFxuYDtcblxuICBxdWVyeSArPSBgbW9kdWxlLmV4cG9ydHMgPSBuZXcgR3JhcGhRTFNjaGVtYSh7XFxuJHt0YWJ9cXVlcnk6IFJvb3RRdWVyeSxcXG4ke3RhYn1tdXRhdGlvbjogTXV0YXRpb25cXG59KTtgO1xuICByZXR1cm4gcXVlcnk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gUmVwcmVzZW50cyB0aGUgZGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBBbGwgdGhlIHJlcXVpcmUgc3RhdGVtZW50cyBuZWVkZWQgZm9yIHRoZSBHcmFwaFFMIHNlcnZlci5cbiAqL1xuZnVuY3Rpb24gYnVpbGRSZXF1aXJlU3RhdGVtZW50cyh0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIFxuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNb25nb0RCXCIpIHtcbiAgICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgICBgY29uc3QgJHtcbiAgICAgICAgdGFibGVzW3RhYmxlSW5kZXhdLnR5cGVcbiAgICAgIH0gPSByZXF1aXJlKCcuLi9kYi8ke3RhYmxlc1t0YWJsZUluZGV4XS50eXBlLnRvTG93ZXJDYXNlKCl9LmpzJyk7XFxuYDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0IHBvb2wgPSByZXF1aXJlKCcuLi9kYi9zcWxfcG9vbC5qcycpO1xcbmA7XG4gIH1cbiAgcmV0dXJuIHJlcXVpcmVTdGF0ZW1lbnRzO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gYWxsIGNvbnN0YW50cyBuZWVkZWQgZm9yIGEgR3JhcGhRTCBzZXJ2ZXJcbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCkge1xuICByZXR1cm4gYFxuY29uc3QgeyBcbiAgR3JhcGhRTE9iamVjdFR5cGUsXG4gIEdyYXBoUUxTY2hlbWEsXG4gIEdyYXBoUUxJRCxcbiAgR3JhcGhRTFN0cmluZywgXG4gIEdyYXBoUUxJbnQsIFxuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTExpc3QsXG4gIEdyYXBoUUxOb25OdWxsXG59ID0gZ3JhcGhxbDtcbiAgXFxuYDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpbnRlcmF0ZWQgb24uIEVhY2ggdGFibGUgY29uc2lzdHMgb2YgZmllbGRzXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGVzIC0gYW4gb2JqZWN0IG9mIGFsbCB0aGUgdGFibGVzIGNyZWF0ZWQgaW4gdGhlIGFwcGxpY2F0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBEYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIFRoZSBHcmFwaFFMIHR5cGUgY29kZSBmb3IgdGhlIGlucHV0dGVkIHRhYmxlXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFR5cGVTY2hlbWEodGFibGUsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYGNvbnN0ICR7dGFibGUudHlwZX1UeXBlID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9bmFtZTogJyR7dGFibGUudHlwZX0nLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn1maWVsZHM6ICgpID0+ICh7YDtcbiAgcXVlcnkgKz0gYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSk7XG4gIHJldHVybiAocXVlcnkgKz0gYFxcbiR7dGFifX0pXFxufSk7XFxuXFxuYCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBlYWNoIGZpZWxkIGZvciB0aGUgR3JhcGhRTCB0eXBlLlxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBoUUxUeXBlRmllbGRzKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IFwiXCI7XG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGxldCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSBcIixcIjtcbiAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke2J1aWxkRmllbGRJdGVtKHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XSl9YDtcbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaGFzIGEgcmVsYXRpb24gdG8gYW5vdGhlciBmaWVsZFxuICAgIGlmICh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ucmVsYXRpb24udGFibGVJbmRleCA+IC0xKSB7XG4gICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0sIHRhYmxlcywgZGF0YWJhc2UpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBmaWVsZCBpcyBhIHJlbGF0aW9uIGZvciBhbm90aGVyIGZpZWxkXG4gICAgY29uc3QgcmVmQnkgPSB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ucmVmQnk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVmQnkpKSB7XG4gICAgICByZWZCeS5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgICBjb25zdCBwYXJzZWRWYWx1ZSA9IHZhbHVlLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgY29uc3QgZmllbGQgPSB7XG4gICAgICAgICAgbmFtZTogdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLm5hbWUsXG4gICAgICAgICAgcmVsYXRpb246IHtcbiAgICAgICAgICAgIHRhYmxlSW5kZXg6IHBhcnNlZFZhbHVlWzBdLFxuICAgICAgICAgICAgZmllbGRJbmRleDogcGFyc2VkVmFsdWVbMV0sXG4gICAgICAgICAgICByZWZUeXBlOiBwYXJzZWRWYWx1ZVsyXSxcbiAgICAgICAgICAgIHR5cGU6IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS50eXBlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHF1ZXJ5ICs9IGNyZWF0ZVN1YlF1ZXJ5KGZpZWxkLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZpZWxkIC0gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGZpZWxkIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIGEgZmllbGQgaXRlbSAoZXg6ICdpZDogeyB0eXBlOiBHcmFwaFFMSUQgfScpXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkRmllbGRJdGVtKGZpZWxkKSB7XG4gIHJldHVybiBgJHtmaWVsZC5uYW1lfTogeyB0eXBlOiAke2NoZWNrRm9yUmVxdWlyZWQoXG4gICAgZmllbGQucmVxdWlyZWQsXG4gICAgXCJmcm9udFwiXG4gICl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKFxuICAgIGZpZWxkLm11bHRpcGxlVmFsdWVzLFxuICAgIFwiZnJvbnRcIlxuICApfSR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZShmaWVsZC50eXBlKX0ke2NoZWNrRm9yTXVsdGlwbGVWYWx1ZXMoXG4gICAgZmllbGQubXVsdGlwbGVWYWx1ZXMsXG4gICAgXCJiYWNrXCJcbiAgKX0ke2NoZWNrRm9yUmVxdWlyZWQoZmllbGQucmVxdWlyZWQsIFwiYmFja1wiKX0gfWA7XG59XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSB0aGUgZmllbGQgdHlwZSAoSUQsIFN0cmluZywgTnVtYmVyLCBCb29sZWFuLCBvciBGbG9hdClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gdGhlIEdyYXBoUUwgdHlwZSBhc3NvY2lhdGVkIHdpdGggdGhlIGZpZWxkIHR5cGUgZW50ZXJlZFxuICovXG5mdW5jdGlvbiB0YWJsZVR5cGVUb0dyYXBocWxUeXBlKHR5cGUpIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBcIklEXCI6XG4gICAgICByZXR1cm4gXCJHcmFwaFFMSURcIjtcbiAgICBjYXNlIFwiU3RyaW5nXCI6XG4gICAgICByZXR1cm4gXCJHcmFwaFFMU3RyaW5nXCI7XG4gICAgY2FzZSBcIk51bWJlclwiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTEludFwiO1xuICAgIGNhc2UgXCJCb29sZWFuXCI6XG4gICAgICByZXR1cm4gXCJHcmFwaFFMQm9vbGVhblwiO1xuICAgIGNhc2UgXCJGbG9hdFwiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTEZsb2F0XCI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBcIkdyYXBoUUxTdHJpbmdcIjtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWZUeXBlTmFtZSAtIEFueSBzdHJpbmcgaW5wdXR0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gVGhlIHN0cmluZyBpbnB1dHRlZCwgYnV0IHdpdGggdGhlIGZpcnN0IGxldHRlciBjYXBpdGFsaXplZCBhbmQgdGhlIHJlc3QgbG93ZXJjYXNlZFxuICovXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSkge1xuICBsZXQgbmFtZSA9IHJlZlR5cGVOYW1lWzBdLnRvVXBwZXJDYXNlKCk7XG4gIG5hbWUgKz0gcmVmVHlwZU5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIG5hbWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZpZWxkIC0gZmllbGQgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbGwgdGhlIHRhYmxlcyBtYWRlIGJ5IHRoZSB1c2VyLlxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YmFzZSBzZWxlY3RlZFxuICogQHJldHVybnMge1N0cmluZ30gLSBCdWlsZHMgYSBzdWIgdHlwZSBmb3IgYW55IGZpZWxkIHdpdGggYSByZWxhdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlU3ViUXVlcnkoZmllbGQsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgY29uc3QgcmVmVHlwZU5hbWUgPSB0YWJsZXNbZmllbGQucmVsYXRpb24udGFibGVJbmRleF0udHlwZTtcbiAgY29uc3QgcmVmRmllbGROYW1lID1cbiAgICB0YWJsZXNbZmllbGQucmVsYXRpb24udGFibGVJbmRleF0uZmllbGRzW2ZpZWxkLnJlbGF0aW9uLmZpZWxkSW5kZXhdLm5hbWU7XG4gIGNvbnN0IHJlZkZpZWxkVHlwZSA9XG4gICAgdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLmZpZWxkc1tmaWVsZC5yZWxhdGlvbi5maWVsZEluZGV4XS50eXBlO1xuICBsZXQgcXVlcnkgPSBgLFxcbiR7dGFifSR7dGFifSR7Y3JlYXRlU3ViUXVlcnlOYW1lKFxuICAgIGZpZWxkLFxuICAgIHJlZlR5cGVOYW1lXG4gICl9OiB7XFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogYDtcblxuICBpZiAoXG4gICAgZmllbGQucmVsYXRpb24ucmVmVHlwZSA9PT0gXCJvbmUgdG8gbWFueVwiIHx8XG4gICAgZmllbGQucmVsYXRpb24ucmVmVHlwZSA9PT0gXCJtYW55IHRvIG1hbnlcIlxuICApIHtcbiAgICBxdWVyeSArPSBgbmV3IEdyYXBoUUxMaXN0KCR7cmVmVHlwZU5hbWV9VHlwZSksYDtcbiAgfSBlbHNlIHtcbiAgICBxdWVyeSArPSBgJHtyZWZUeXBlTmFtZX1UeXBlLGA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3JlZlR5cGVOYW1lfS4ke2ZpbmREYlNlYXJjaE1ldGhvZChcbiAgICAgIHJlZkZpZWxkTmFtZSxcbiAgICAgIHJlZkZpZWxkVHlwZSxcbiAgICAgIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGVcbiAgICApfWA7XG4gICAgcXVlcnkgKz0gYCgke2NyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpfSk7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifX1gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk15U1FMXCIgfHwgZGF0YWJhc2UgPT09IFwiUG9zdGdyZVNRTFwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3JlZlR5cGVOYW1lfVwiIFdIRVJFIFwiJHtyZWZGaWVsZE5hbWV9XCIgPSAnXFwke3BhcmVudC4ke2ZpZWxkLm5hbWV9fSc7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeShmaWVsZC5yZWxhdGlvbi5yZWZUeXBlKTtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifX1gO1xuICB9XG4gIHJldHVybiBxdWVyeTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmVHlwZSAtIFRoZSByZWxhdGlvbiB0eXBlIG9mIHRoZSBzdWIgcXVlcnlcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gdGhlIGNvZGUgZm9yIGEgU1FMIHBvb2wgcXVlcnkuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbFF1ZXJ5KHJlZlR5cGUpIHtcbiAgbGV0IHJvd3MgPSBcIlwiO1xuICBpZiAocmVmVHlwZSA9PT0gXCJvbmUgdG8gb25lXCIgfHwgcmVmVHlwZSA9PT0gXCJtYW55IHRvIG9uZVwiKSByb3dzID0gXCJyb3dzWzBdXCI7XG4gIGVsc2Ugcm93cyA9IFwicm93c1wiO1xuXG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcG9vbC5xdWVyeShzcWwpXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKHJlcyA9PiByZXMuJHtyb3dzfSlcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycikpXFxuYDtcbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTdWJRdWVyeU5hbWUoZmllbGQsIHJlZlR5cGVOYW1lKSB7XG4gIHN3aXRjaCAoZmllbGQucmVsYXRpb24ucmVmVHlwZSkge1xuICAgIGNhc2UgXCJvbmUgdG8gb25lXCI6XG4gICAgICByZXR1cm4gYHJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGNhc2UgXCJvbmUgdG8gbWFueVwiOlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGNhc2UgXCJtYW55IHRvIG9uZVwiOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlIFwibWFueSB0byBtYW55XCI6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kRGJTZWFyY2hNZXRob2QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIHJlZlR5cGUpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gXCJpZFwiIHx8IHJlZkZpZWxkVHlwZSA9PT0gXCJJRFwiKSByZXR1cm4gXCJmaW5kQnlJZFwiO1xuICBlbHNlIGlmIChyZWZUeXBlID09PSBcIm9uZSB0byBvbmVcIikgcmV0dXJuIFwiZmluZE9uZVwiO1xuICBlbHNlIHJldHVybiBcImZpbmRcIjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VhcmNoT2JqZWN0KHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCBmaWVsZCkge1xuICBpZiAocmVmRmllbGROYW1lID09PSBcImlkXCIgfHwgcmVmRmllbGRUeXBlID09PSBcIklEXCIpIHtcbiAgICByZXR1cm4gYHBhcmVudC4ke2ZpZWxkLm5hbWV9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYHsgJHtyZWZGaWVsZE5hbWV9OiBwYXJlbnQuJHtmaWVsZC5uYW1lfSB9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IFwiXCI7XG5cbiAgcXVlcnkgKz0gY3JlYXRlRmluZEFsbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpO1xuXG4gIGlmICghIXRhYmxlLmZpZWxkc1swXSkge1xuICAgIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRCeUlkUXVlcnkodGFibGUsIGRhdGFiYXNlKTtcbiAgfVxuXG4gIHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRmluZEFsbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWV2ZXJ5JHt0b1RpdGxlQ2FzZSh0YWJsZS50eXBlKX06IHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogbmV3IEdyYXBoUUxMaXN0KCR7dGFibGUudHlwZX1UeXBlKSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZSgpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNb25nb0RCXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZCh7fSk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNeVNRTFwiIHx8IGRhdGFiYXNlID09PSBcIlBvc3RncmVTUUxcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBTRUxFQ1QgKiBGUk9NIFwiJHt0YWJsZS50eXBlfVwiO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoXCJtYW55XCIpO1xuICB9XG5cbiAgcmV0dXJuIChxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpdGVyYXRlZCBvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gZGF0YWJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gcm9vdCBxdWVyeSBjb2RlIHRvIGZpbmQgYW4gaW5kaXZpZHVhbCB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRCeUlkUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IGlkRmllbGROYW1lID0gdGFibGUuZmllbGRzWzBdLm5hbWU7XG4gIGxldCBxdWVyeSA9IGAsXFxuJHt0YWJ9JHt0YWJ9JHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZShcbiAgICB0YWJsZS5maWVsZHNbMF0udHlwZVxuICApfX19LFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZChhcmdzLmlkKTtcXG5gO1xuICB9XG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNeVNRTFwiIHx8IGRhdGFiYXNlID09PSBcIlBvc3RncmVTUUxcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBTRUxFQ1QgKiBGUk9NIFwiJHt0YWJsZS50eXBlfVwiIFdIRVJFICR7aWRGaWVsZE5hbWV9ID0gJ1xcJHthcmdzLmlkfSc7XFxgO1xcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoXCJvbmUgdG8gb25lXCIpO1xuICB9XG5cbiAgcmV0dXJuIChxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHN0cmluZyA9IGBgO1xuICBzdHJpbmcgKz0gYCR7YWRkTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICBpZiAodGFibGUuZmllbGRzWzBdKSB7XG4gICAgc3RyaW5nICs9IGAsXFxuJHt1cGRhdGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpfSxcXG5gO1xuICAgIHN0cmluZyArPSBgJHtkZWxldGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpfWA7XG4gIH1cbiAgcmV0dXJuIHN0cmluZztcbn1cblxuZnVuY3Rpb24gYnVpbGRTUUxQb29sTXV0YXRpb24oKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcG9vbC5jb25uZWN0KClcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKGNsaWVudCA9PiB7XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gY2xpZW50LnF1ZXJ5KHNxbClcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKHJlcyA9PiB7XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jbGllbnQucmVsZWFzZSgpO1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHJlcy5yb3dzWzBdO1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS5jYXRjaChlcnIgPT4ge1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y2xpZW50LnJlbGVhc2UoKTtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnNvbGUubG9nKCdFcnJvcjogJywgZXJyKTtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn19KVxcbmA7XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGFkZE11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9YWRkJHt0YWJsZS50eXBlfToge1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gXCIsXFxuXCI7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbShcbiAgICAgIHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XVxuICAgICl9YDtcbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9fSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNb25nb0RCXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3QgJHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9ID0gbmV3ICR7XG4gICAgICB0YWJsZS50eXBlXG4gICAgfShhcmdzKTtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9LnNhdmUoKTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk15U1FMXCIgfHwgZGF0YWJhc2UgPT09IFwiUG9zdGdyZVNRTFwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IGNvbHVtbnMgPSBPYmplY3Qua2V5cyhhcmdzKS5tYXAoZWwgPT4gXFxgXCJcXCR7ZWx9XCJcXGApO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoYXJncykubWFwKGVsID0+IFxcYCdcXCR7ZWx9J1xcYCk7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgSU5TRVJUIElOVE8gXCIke3RhYmxlLnR5cGV9XCIgKFxcJHtjb2x1bW5zfSkgVkFMVUVTIChcXCR7dmFsdWVzfSkgUkVUVVJOSU5HICpcXGA7XFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xNdXRhdGlvbigpO1xuICB9XG5cbiAgcmV0dXJuIChxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn11cGRhdGUke3RhYmxlLnR5cGV9OiB7XFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gXCIsXFxuXCI7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbShcbiAgICAgIHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XVxuICAgICl9YDtcbiAgfVxuXG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn19LFxcbiR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKVxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFVwZGF0ZShhcmdzLmlkLCBhcmdzKTtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNeVNRTFwiIHx8IGRhdGFiYXNlID09PSBcIlBvc3RncmVTUUxcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1sZXQgdXBkYXRlVmFsdWVzID0gJyc7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Zm9yIChjb25zdCBwcm9wIGluIGFyZ3MpIHtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1pZiAodXBkYXRlVmFsdWVzLmxlbmd0aCA+IDApIHVwZGF0ZVZhbHVlcyArPSBcXGAsIFxcYDtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn11cGRhdGVWYWx1ZXMgKz0gXFxgXCJcXCR7cHJvcH1cIiA9ICdcXCR7YXJnc1twcm9wXX0nIFxcYDtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn19XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgVVBEQVRFIFwiJHt0YWJsZS50eXBlfVwiIFNFVCBcXCR7dXBkYXRlVmFsdWVzfSBXSEVSRSBpZCA9ICdcXCR7YXJncy5pZH0nIFJFVFVSTklORyAqO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTtcbiAgfVxuICByZXR1cm4gKHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWApO1xufVxuXG5mdW5jdGlvbiBkZWxldGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgY29uc3QgaWRGaWVsZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWRlbGV0ZSR7dGFibGUudHlwZX06IHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHsgJHtpZEZpZWxkTmFtZX06IHsgdHlwZTogJHt0YWJsZVR5cGVUb0dyYXBocWxUeXBlKFxuICAgIHRhYmxlLmZpZWxkc1swXS50eXBlXG4gICl9fX0sXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkQW5kUmVtb3ZlKGFyZ3MuaWQpO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgREVMRVRFIEZST00gXCIke3RhYmxlLnR5cGV9XCIgV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7XG4gIH1cblxuICByZXR1cm4gKHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWApO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvclJlcXVpcmVkKHJlcXVpcmVkLCBwb3NpdGlvbikge1xuICBpZiAocmVxdWlyZWQpIHtcbiAgICBpZiAocG9zaXRpb24gPT09IFwiZnJvbnRcIikge1xuICAgICAgcmV0dXJuIFwibmV3IEdyYXBoUUxOb25OdWxsKFwiO1xuICAgIH1cbiAgICByZXR1cm4gXCIpXCI7XG4gIH1cbiAgcmV0dXJuIFwiXCI7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMobXVsdGlwbGVWYWx1ZXMsIHBvc2l0aW9uKSB7XG4gIGlmIChtdWx0aXBsZVZhbHVlcykge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gXCJmcm9udFwiKSB7XG4gICAgICByZXR1cm4gXCJuZXcgR3JhcGhRTExpc3QoXCI7XG4gICAgfVxuICAgIHJldHVybiBcIilcIjtcbiAgfVxuICByZXR1cm4gXCJcIjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUdyYXBocWxTZXJ2ZXI7XG4iXSwic291cmNlUm9vdCI6IiJ9