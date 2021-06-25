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
      requireStatements += "const " + tables[tableIndex].type + " = require('../db/" + tables[tableIndex].type.toLowerCase() + ".js');\n";
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

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwiZGF0YWJhc2VzIiwicXVlcnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2UiLCJidWlsZFJlcXVpcmVTdGF0ZW1lbnRzIiwiZGF0YSIsImRhdGFiYXNlTmFtZSIsIm5hbWUiLCJidWlsZEdyYXBocWxWYXJpYWJsZXMiLCJ0YWJsZXMiLCJ0YWJsZUluZGV4IiwiYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSIsImZpcnN0Um9vdExvb3AiLCJidWlsZEdyYXBocWxSb290UXVlcnkiLCJmaXJzdE11dGF0aW9uTG9vcCIsImJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkiLCJyZXF1aXJlU3RhdGVtZW50cyIsInR5cGUiLCJ0b0xvd2VyQ2FzZSIsInRhYmxlIiwiYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyIsImZpcnN0TG9vcCIsImZpZWxkSW5kZXgiLCJidWlsZEZpZWxkSXRlbSIsImZpZWxkcyIsInJlbGF0aW9uIiwiY3JlYXRlU3ViUXVlcnkiLCJyZWZCeSIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJ2YWx1ZSIsInBhcnNlZFZhbHVlIiwic3BsaXQiLCJmaWVsZCIsInJlZlR5cGUiLCJjaGVja0ZvclJlcXVpcmVkIiwicmVxdWlyZWQiLCJjaGVja0Zvck11bHRpcGxlVmFsdWVzIiwibXVsdGlwbGVWYWx1ZXMiLCJ0YWJsZVR5cGVUb0dyYXBocWxUeXBlIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJyZWZGaWVsZE5hbWUiLCJyZWZGaWVsZFR5cGUiLCJjcmVhdGVTdWJRdWVyeU5hbWUiLCJmaW5kRGJTZWFyY2hNZXRob2QiLCJjcmVhdGVTZWFyY2hPYmplY3QiLCJidWlsZFNRTFBvb2xRdWVyeSIsInJvd3MiLCJjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5IiwiY3JlYXRlRmluZEJ5SWRRdWVyeSIsImlkRmllbGROYW1lIiwic3RyaW5nIiwiYWRkTXV0YXRpb24iLCJ1cGRhdGVNdXRhdGlvbiIsImRlbGV0ZU11dGF0aW9uIiwiYnVpbGRTUUxQb29sTXV0YXRpb24iLCJwb3NpdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLFVBQU47O0FBRUE7QUFDQSxTQUFTQyxrQkFBVCxDQUE0QkMsU0FBNUIsRUFBdUM7QUFDckMsTUFBSUMsUUFBUSxFQUFaO0FBQ0FBLFdBQVMsdUNBQVQ7QUFDQSxPQUFLLElBQU1DLGFBQVgsSUFBNEJGLFNBQTVCLEVBQXVDO0FBQ3JDLFFBQU1HLFdBQVdILFVBQVVFLGFBQVYsQ0FBakI7QUFDQTs7QUFFQUQsYUFBU0csdUJBQXVCRCxTQUFTRSxJQUFoQyxFQUFzQ0YsU0FBU0csWUFBL0MsRUFBNkRILFNBQVNJLElBQXRFLENBQVQ7QUFDRDtBQUNETixXQUFTTyx1QkFBVDs7QUFFQTtBQUNBLE9BQUssSUFBTU4sY0FBWCxJQUE0QkYsU0FBNUIsRUFBdUM7QUFDckMsUUFBTVMsU0FBU1QsVUFBVUUsY0FBVixFQUF5QkcsSUFBeEM7QUFDQSxRQUFNQyxlQUFlTixVQUFVRSxjQUFWLEVBQXlCSSxZQUE5QztBQUNBLFNBQUssSUFBTUksVUFBWCxJQUF5QkQsTUFBekIsRUFBaUM7QUFDL0JSLGVBQVNVLHVCQUF1QkYsT0FBT0MsVUFBUCxDQUF2QixFQUEyQ0QsTUFBM0MsRUFBbURILFlBQW5ELENBQVQ7QUFDRDtBQUNGOztBQUVEO0FBQ0FMLDJEQUF1REgsR0FBdkQsZ0NBQXFGQSxHQUFyRjs7QUFFQSxNQUFJYyxnQkFBZ0IsSUFBcEI7QUFDQSxPQUFLLElBQU1WLGVBQVgsSUFBNEJGLFNBQTVCLEVBQXVDO0FBQ3JDLFFBQU1TLFVBQVNULFVBQVVFLGVBQVYsRUFBeUJHLElBQXhDO0FBQ0EsUUFBTUMsZ0JBQWVOLFVBQVVFLGVBQVYsRUFBeUJJLFlBQTlDO0FBQ0EsU0FBSyxJ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VCxDQUFnQ0MsY0FBaEMsRUFBZ0RxQixRQUFoRCxFQUEwRDtBQUN4RCxNQUFJckIsY0FBSixFQUFvQjtBQUNsQixRQUFJcUIsYUFBYSxPQUFqQixFQUEwQjtBQUN4QixhQUFPLGtCQUFQO0FBQ0Q7QUFDRCxXQUFPLEdBQVA7QUFDRDtBQUNELFNBQU8sRUFBUDtBQUNEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCL0Qsa0JBQWpCLEMiLCJmaWxlIjoibWFpbi5lODYzMmQzMmI4MTJlN2VkOGUwZS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGFiID0gYCAgYDtcblxuLy8gRnVuY3Rpb24gdGhhdCBldm9rZXMgYWxsIG90aGVyIGhlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIHBhcnNlR3JhcGhxbFNlcnZlcihkYXRhYmFzZXMpIHtcbiAgbGV0IHF1ZXJ5ID0gXCJcIjtcbiAgcXVlcnkgKz0gXCJjb25zdCBncmFwaHFsID0gcmVxdWlyZSgnZ3JhcGhxbCcpO1xcblwiO1xuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7XG4gICAgY29uc3QgZGF0YWJhc2UgPSBkYXRhYmFzZXNbZGF0YWJhc2VJbmRleF07XG4gICAgLy8gZGF0YWJhc2UuZGF0YSBpcyBzYW1lIGFzIGRhdGFiYXNlLnRhYmxlc1xuXG4gICAgcXVlcnkgKz0gYnVpbGRSZXF1aXJlU3RhdGVtZW50cyhkYXRhYmFzZS5kYXRhLCBkYXRhYmFzZS5kYXRhYmFzZU5hbWUsIGRhdGFiYXNlLm5hbWUpO1xuICB9XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbFZhcmlhYmxlcygpO1xuXG4gIC8vIEJVSUxEIFRZUEUgU0NIRU1BXG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXMpIHtcbiAgICBjb25zdCB0YWJsZXMgPSBkYXRhYmFzZXNbZGF0YWJhc2VJbmRleF0uZGF0YTtcbiAgICBjb25zdCBkYXRhYmFzZU5hbWUgPSBkYXRhYmFzZXNbZGF0YWJhc2VJbmRleF0uZGF0YWJhc2VOYW1lO1xuICAgIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbFR5cGVTY2hlbWEodGFibGVzW3RhYmxlSW5kZXhdLCB0YWJsZXMsIGRhdGFiYXNlTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQlVJTEQgUk9PVCBRVUVSWVxuICBxdWVyeSArPSBgY29uc3QgUm9vdFF1ZXJ5ID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG4ke3RhYn1uYW1lOiAnUm9vdFF1ZXJ5VHlwZScsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RSb290TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXMpIHtcbiAgICBjb25zdCB0YWJsZXMgPSBkYXRhYmFzZXNbZGF0YWJhc2VJbmRleF0uZGF0YTtcbiAgICBjb25zdCBkYXRhYmFzZU5hbWUgPSBkYXRhYmFzZXNbZGF0YWJhc2VJbmRleF0uZGF0YWJhc2VOYW1lO1xuICAgIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICAgIGlmICghZmlyc3RSb290TG9vcCkgcXVlcnkgKz0gXCIsXFxuXCI7XG4gICAgICBmaXJzdFJvb3RMb29wID0gZmFsc2U7XG5cbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbFJvb3RRdWVyeSh0YWJsZXNbdGFibGVJbmRleF0sIGRhdGFiYXNlTmFtZSk7XG4gICAgfVxuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn19XFxufSk7XFxuXFxuYDtcblxuICAvLyBCVUlMRCBNVVRBVElPTlNcbiAgcXVlcnkgKz0gYGNvbnN0IE11dGF0aW9uID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG4ke3RhYn1uYW1lOiAnTXV0YXRpb24nLFxcbiR7dGFifWZpZWxkczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TXV0YXRpb25Mb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IHRhYmxlcyA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhO1xuICAgIGNvbnN0IGRhdGFiYXNlTmFtZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhYmFzZU5hbWU7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgaWYgKCFmaXJzdE11dGF0aW9uTG9vcCkgcXVlcnkgKz0gXCIsXFxuXCI7XG4gICAgICBmaXJzdE11dGF0aW9uTG9vcCA9IGZhbHNlO1xuXG4gICAgICBxdWVyeSArPSBidWlsZEdyYXBocWxNdXRhdGlvblF1ZXJ5KHRhYmxlc1t0YWJsZUluZGV4XSwgZGF0YWJhc2VOYW1lKTtcbiAgICB9XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIHF1ZXJ5ICs9IGBtb2R1bGUuZXhwb3J0cyA9IG5ldyBHcmFwaFFMU2NoZW1hKHtcXG4ke3RhYn1xdWVyeTogUm9vdFF1ZXJ5LFxcbiR7dGFifW11dGF0aW9uOiBNdXRhdGlvblxcbn0pO2A7XG4gIHJldHVybiBxdWVyeTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBSZXByZXNlbnRzIHRoZSBkYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIEFsbCB0aGUgcmVxdWlyZSBzdGF0ZW1lbnRzIG5lZWRlZCBmb3IgdGhlIEdyYXBoUUwgc2VydmVyLlxuICovXG5mdW5jdGlvbiBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKHRhYmxlcywgZGF0YWJhc2UsIG5hbWUpIHtcbiAgbGV0IHJlcXVpcmVTdGF0ZW1lbnRzID0gXCJcIjtcbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIikge1xuICAgIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICAgIHJlcXVpcmVTdGF0ZW1lbnRzICs9IGBjb25zdCAke1xuICAgICAgICB0YWJsZXNbdGFibGVJbmRleF0udHlwZVxuICAgICAgfSA9IHJlcXVpcmUoJy4uL2RiLyR7dGFibGVzW3RhYmxlSW5kZXhdLnR5cGUudG9Mb3dlckNhc2UoKX0uanMnKTtcXG5gO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXF1aXJlU3RhdGVtZW50cyArPSBgY29uc3QgcG9vbCA9IHJlcXVpcmUoJy4uL2RiLyR7bmFtZX0vc3FsX3Bvb2wuanMnKTtcXG5gO1xuICB9XG4gIHJldHVybiByZXF1aXJlU3RhdGVtZW50cztcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIGFsbCBjb25zdGFudHMgbmVlZGVkIGZvciBhIEdyYXBoUUwgc2VydmVyXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFZhcmlhYmxlcygpIHtcbiAgcmV0dXJuIGBcbmNvbnN0IHsgXG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMU2NoZW1hLFxuICBHcmFwaFFMSUQsXG4gIEdyYXBoUUxTdHJpbmcsIFxuICBHcmFwaFFMSW50LCBcbiAgR3JhcGhRTEJvb2xlYW4sXG4gIEdyYXBoUUxMaXN0LFxuICBHcmFwaFFMTm9uTnVsbFxufSA9IGdyYXBocWw7XG4gIFxcbmA7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgR3JhcGhRTCB0eXBlIGNvZGUgZm9yIHRoZSBpbnB1dHRlZCB0YWJsZVxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxUeXBlU2NoZW1hKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGBjb25zdCAke3RhYmxlLnR5cGV9VHlwZSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifW5hbWU6ICcke3RhYmxlLnR5cGV9JyxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9ZmllbGRzOiAoKSA9PiAoe2A7XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpO1xuICByZXR1cm4gKHF1ZXJ5ICs9IGBcXG4ke3RhYn19KVxcbn0pO1xcblxcbmApO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGludGVyYXRlZCBvbi4gRWFjaCB0YWJsZSBjb25zaXN0cyBvZiBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbiBvYmplY3Qgb2YgYWxsIHRoZSB0YWJsZXMgY3JlYXRlZCBpbiB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gZWFjaCBmaWVsZCBmb3IgdGhlIEdyYXBoUUwgdHlwZS5cbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBcIlwiO1xuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChsZXQgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gXCIsXCI7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWA7XG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpZWxkIGhhcyBhIHJlbGF0aW9uIHRvIGFub3RoZXIgZmllbGRcbiAgICBpZiAodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlbGF0aW9uLnRhYmxlSW5kZXggPiAtMSkge1xuICAgICAgcXVlcnkgKz0gY3JlYXRlU3ViUXVlcnkodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaXMgYSByZWxhdGlvbiBmb3IgYW5vdGhlciBmaWVsZFxuICAgIGNvbnN0IHJlZkJ5ID0gdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlZkJ5O1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJlZkJ5KSkge1xuICAgICAgcmVmQnkuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgY29uc3QgcGFyc2VkVmFsdWUgPSB2YWx1ZS5zcGxpdChcIi5cIik7XG4gICAgICAgIGNvbnN0IGZpZWxkID0ge1xuICAgICAgICAgIG5hbWU6IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS5uYW1lLFxuICAgICAgICAgIHJlbGF0aW9uOiB7XG4gICAgICAgICAgICB0YWJsZUluZGV4OiBwYXJzZWRWYWx1ZVswXSxcbiAgICAgICAgICAgIGZpZWxkSW5kZXg6IHBhcnNlZFZhbHVlWzFdLFxuICAgICAgICAgICAgcmVmVHlwZTogcGFyc2VkVmFsdWVbMl0sXG4gICAgICAgICAgICB0eXBlOiB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0udHlwZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgaW5mb3JtYXRpb24gZm9yIHRoZSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHJldHVybnMge1N0cmluZ30gLSBhIGZpZWxkIGl0ZW0gKGV4OiAnaWQ6IHsgdHlwZTogR3JhcGhRTElEIH0nKVxuICovXG5mdW5jdGlvbiBidWlsZEZpZWxkSXRlbShmaWVsZCkge1xuICByZXR1cm4gYCR7ZmllbGQubmFtZX06IHsgdHlwZTogJHtjaGVja0ZvclJlcXVpcmVkKFxuICAgIGZpZWxkLnJlcXVpcmVkLFxuICAgIFwiZnJvbnRcIlxuICApfSR7Y2hlY2tGb3JNdWx0aXBsZVZhbHVlcyhcbiAgICBmaWVsZC5tdWx0aXBsZVZhbHVlcyxcbiAgICBcImZyb250XCJcbiAgKX0ke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoZmllbGQudHlwZSl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKFxuICAgIGZpZWxkLm11bHRpcGxlVmFsdWVzLFxuICAgIFwiYmFja1wiXG4gICl9JHtjaGVja0ZvclJlcXVpcmVkKGZpZWxkLnJlcXVpcmVkLCBcImJhY2tcIil9IH1gO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gdGhlIGZpZWxkIHR5cGUgKElELCBTdHJpbmcsIE51bWJlciwgQm9vbGVhbiwgb3IgRmxvYXQpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHRoZSBHcmFwaFFMIHR5cGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBmaWVsZCB0eXBlIGVudGVyZWRcbiAqL1xuZnVuY3Rpb24gdGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0eXBlKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgXCJJRFwiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTElEXCI7XG4gICAgY2FzZSBcIlN0cmluZ1wiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTFN0cmluZ1wiO1xuICAgIGNhc2UgXCJOdW1iZXJcIjpcbiAgICAgIHJldHVybiBcIkdyYXBoUUxJbnRcIjtcbiAgICBjYXNlIFwiQm9vbGVhblwiOlxuICAgICAgcmV0dXJuIFwiR3JhcGhRTEJvb2xlYW5cIjtcbiAgICBjYXNlIFwiRmxvYXRcIjpcbiAgICAgIHJldHVybiBcIkdyYXBoUUxGbG9hdFwiO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gXCJHcmFwaFFMU3RyaW5nXCI7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmVHlwZU5hbWUgLSBBbnkgc3RyaW5nIGlucHV0dGVkXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIFRoZSBzdHJpbmcgaW5wdXR0ZWQsIGJ1dCB3aXRoIHRoZSBmaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWQgYW5kIHRoZSByZXN0IGxvd2VyY2FzZWRcbiAqL1xuZnVuY3Rpb24gdG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpIHtcbiAgbGV0IG5hbWUgPSByZWZUeXBlTmFtZVswXS50b1VwcGVyQ2FzZSgpO1xuICBuYW1lICs9IHJlZlR5cGVOYW1lLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBuYW1lO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGZpZWxkIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGVzIC0gYWxsIHRoZSB0YWJsZXMgbWFkZSBieSB0aGUgdXNlci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQnVpbGRzIGEgc3ViIHR5cGUgZm9yIGFueSBmaWVsZCB3aXRoIGEgcmVsYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN1YlF1ZXJ5KGZpZWxkLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IHJlZlR5cGVOYW1lID0gdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLnR5cGU7XG4gIGNvbnN0IHJlZkZpZWxkTmFtZSA9XG4gICAgdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLmZpZWxkc1tmaWVsZC5yZWxhdGlvbi5maWVsZEluZGV4XS5uYW1lO1xuICBjb25zdCByZWZGaWVsZFR5cGUgPVxuICAgIHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0udHlwZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke2NyZWF0ZVN1YlF1ZXJ5TmFtZShcbiAgICBmaWVsZCxcbiAgICByZWZUeXBlTmFtZVxuICApfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6IGA7XG5cbiAgaWYgKFxuICAgIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09IFwib25lIHRvIG1hbnlcIiB8fFxuICAgIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09IFwibWFueSB0byBtYW55XCJcbiAgKSB7XG4gICAgcXVlcnkgKz0gYG5ldyBHcmFwaFFMTGlzdCgke3JlZlR5cGVOYW1lfVR5cGUpLGA7XG4gIH0gZWxzZSB7XG4gICAgcXVlcnkgKz0gYCR7cmVmVHlwZU5hbWV9VHlwZSxgO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHtyZWZUeXBlTmFtZX0uJHtmaW5kRGJTZWFyY2hNZXRob2QoXG4gICAgICByZWZGaWVsZE5hbWUsXG4gICAgICByZWZGaWVsZFR5cGUsXG4gICAgICBmaWVsZC5yZWxhdGlvbi5yZWZUeXBlXG4gICAgKX1gO1xuICAgIHF1ZXJ5ICs9IGAoJHtjcmVhdGVTZWFyY2hPYmplY3QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIGZpZWxkKX0pO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn19YDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNeVNRTFwiIHx8IGRhdGFiYXNlID09PSBcIlBvc3RncmVTUUxcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBTRUxFQ1QgKiBGUk9NIFwiJHtyZWZUeXBlTmFtZX1cIiBXSEVSRSBcIiR7cmVmRmllbGROYW1lfVwiID0gJ1xcJHtwYXJlbnQuJHtmaWVsZC5uYW1lfX0nO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoZmllbGQucmVsYXRpb24ucmVmVHlwZSk7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn19YDtcbiAgfVxuICByZXR1cm4gcXVlcnk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlZlR5cGUgLSBUaGUgcmVsYXRpb24gdHlwZSBvZiB0aGUgc3ViIHF1ZXJ5XG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHRoZSBjb2RlIGZvciBhIFNRTCBwb29sIHF1ZXJ5LlxuICovXG5mdW5jdGlvbiBidWlsZFNRTFBvb2xRdWVyeShyZWZUeXBlKSB7XG4gIGxldCByb3dzID0gXCJcIjtcbiAgaWYgKHJlZlR5cGUgPT09IFwib25lIHRvIG9uZVwiIHx8IHJlZlR5cGUgPT09IFwibWFueSB0byBvbmVcIikgcm93cyA9IFwicm93c1swXVwiO1xuICBlbHNlIHJvd3MgPSBcInJvd3NcIjtcblxuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wucXVlcnkoc3FsKVxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4gcmVzLiR7cm93c30pXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coJ0Vycm9yOiAnLCBlcnIpKVxcbmA7XG4gIHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3ViUXVlcnlOYW1lKGZpZWxkLCByZWZUeXBlTmFtZSkge1xuICBzd2l0Y2ggKGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUpIHtcbiAgICBjYXNlIFwib25lIHRvIG9uZVwiOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlIFwib25lIHRvIG1hbnlcIjpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlIFwibWFueSB0byBvbmVcIjpcbiAgICAgIHJldHVybiBgcmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSBcIm1hbnkgdG8gbWFueVwiOlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZERiU2VhcmNoTWV0aG9kKHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCByZWZUeXBlKSB7XG4gIGlmIChyZWZGaWVsZE5hbWUgPT09IFwiaWRcIiB8fCByZWZGaWVsZFR5cGUgPT09IFwiSURcIikgcmV0dXJuIFwiZmluZEJ5SWRcIjtcbiAgZWxzZSBpZiAocmVmVHlwZSA9PT0gXCJvbmUgdG8gb25lXCIpIHJldHVybiBcImZpbmRPbmVcIjtcbiAgZWxzZSByZXR1cm4gXCJmaW5kXCI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gXCJpZFwiIHx8IHJlZkZpZWxkVHlwZSA9PT0gXCJJRFwiKSB7XG4gICAgcmV0dXJuIGBwYXJlbnQuJHtmaWVsZC5uYW1lfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGB7ICR7cmVmRmllbGROYW1lfTogcGFyZW50LiR7ZmllbGQubmFtZX0gfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBcIlwiO1xuXG4gIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKTtcblxuICBpZiAoISF0YWJsZS5maWVsZHNbMF0pIHtcbiAgICBxdWVyeSArPSBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSk7XG4gIH1cblxuICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1ldmVyeSR7dG9UaXRsZUNhc2UodGFibGUudHlwZSl9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6IG5ldyBHcmFwaFFMTGlzdCgke3RhYmxlLnR5cGV9VHlwZSksXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUoKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmQoe30pO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KFwibWFueVwiKTtcbiAgfVxuXG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIGRhdGFiYXNlIHNlbGVjdGVkXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHJvb3QgcXVlcnkgY29kZSB0byBmaW5kIGFuIGluZGl2aWR1YWwgdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBjb25zdCBpZEZpZWxkTmFtZSA9IHRhYmxlLmZpZWxkc1swXS5uYW1lO1xuICBsZXQgcXVlcnkgPSBgLFxcbiR7dGFifSR7dGFifSR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfToge1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczogeyAke2lkRmllbGROYW1lfTogeyB0eXBlOiAke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoXG4gICAgdGFibGUuZmllbGRzWzBdLnR5cGVcbiAgKX19fSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNb25nb0RCXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZEJ5SWQoYXJncy5pZCk7XFxuYDtcbiAgfVxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIiBXSEVSRSAke2lkRmllbGROYW1lfSA9ICdcXCR7YXJncy5pZH0nO1xcYDtcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KFwib25lIHRvIG9uZVwiKTtcbiAgfVxuXG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke2FkZE11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9YDtcbiAgaWYgKHRhYmxlLmZpZWxkc1swXSkge1xuICAgIHN0cmluZyArPSBgLFxcbiR7dXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX0sXFxuYDtcbiAgICBzdHJpbmcgKz0gYCR7ZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICB9XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbE11dGF0aW9uKCkge1xuICBsZXQgc3RyaW5nID0gYGA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wuY29ubmVjdCgpXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihjbGllbnQgPT4ge1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIGNsaWVudC5xdWVyeShzcWwpXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4ge1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y2xpZW50LnJlbGVhc2UoKTtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiByZXMucm93c1swXTtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0uY2F0Y2goZXJyID0+IHtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNsaWVudC5yZWxlYXNlKCk7XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn19KVxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gO1xuICByZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBhZGRNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWFkZCR7dGFibGUudHlwZX06IHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHtcXG5gO1xuXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGZpZWxkSW5kZXggaW4gdGFibGUuZmllbGRzKSB7XG4gICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9IFwiLFxcblwiO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0oXG4gICAgICB0YWJsZS5maWVsZHNbZmllbGRJbmRleF1cbiAgICApfWA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifX0sXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTW9uZ29EQlwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0ICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfSA9IG5ldyAke1xuICAgICAgdGFibGUudHlwZVxuICAgIH0oYXJncyk7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfS5zYXZlKCk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gXCJNeVNRTFwiIHx8IGRhdGFiYXNlID09PSBcIlBvc3RncmVTUUxcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBjb2x1bW5zID0gT2JqZWN0LmtleXMoYXJncykubWFwKGVsID0+IFxcYFwiXFwke2VsfVwiXFxgKTtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKGFyZ3MpLm1hcChlbCA9PiBcXGAnXFwke2VsfSdcXGApO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYElOU0VSVCBJTlRPIFwiJHt0YWJsZS50eXBlfVwiIChcXCR7Y29sdW1uc30pIFZBTFVFUyAoXFwke3ZhbHVlc30pIFJFVFVSTklORyAqXFxgO1xcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTtcbiAgfVxuXG4gIHJldHVybiAocXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9dXBkYXRlJHt0YWJsZS50eXBlfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbiR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHtcXG5gO1xuXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGZpZWxkSW5kZXggaW4gdGFibGUuZmllbGRzKSB7XG4gICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9IFwiLFxcblwiO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0oXG4gICAgICB0YWJsZS5maWVsZHNbZmllbGRJbmRleF1cbiAgICApfWA7XG4gIH1cblxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9fSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIilcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZEJ5SWRBbmRVcGRhdGUoYXJncy5pZCwgYXJncyk7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09IFwiTXlTUUxcIiB8fCBkYXRhYmFzZSA9PT0gXCJQb3N0Z3JlU1FMXCIpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9bGV0IHVwZGF0ZVZhbHVlcyA9ICcnO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWZvciAoY29uc3QgcHJvcCBpbiBhcmdzKSB7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9aWYgKHVwZGF0ZVZhbHVlcy5sZW5ndGggPiAwKSB1cGRhdGVWYWx1ZXMgKz0gXFxgLCBcXGA7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9dXBkYXRlVmFsdWVzICs9IFxcYFwiXFwke3Byb3B9XCIgPSAnXFwke2FyZ3NbcHJvcF19JyBcXGA7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFVQREFURSBcIiR7dGFibGUudHlwZX1cIiBTRVQgXFwke3VwZGF0ZVZhbHVlc30gV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7XG4gIH1cbiAgcmV0dXJuIChxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IGlkRmllbGROYW1lID0gdGFibGUuZmllbGRzWzBdLm5hbWU7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1kZWxldGUke3RhYmxlLnR5cGV9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZShcbiAgICB0YWJsZS5maWVsZHNbMF0udHlwZVxuICApfX19LFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk1vbmdvREJcIikge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFJlbW92ZShhcmdzLmlkKTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSBcIk15U1FMXCIgfHwgZGF0YWJhc2UgPT09IFwiUG9zdGdyZVNRTFwiKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYERFTEVURSBGUk9NIFwiJHt0YWJsZS50eXBlfVwiIFdIRVJFIGlkID0gJ1xcJHthcmdzLmlkfScgUkVUVVJOSU5HICo7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xNdXRhdGlvbigpO1xuICB9XG5cbiAgcmV0dXJuIChxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JSZXF1aXJlZChyZXF1aXJlZCwgcG9zaXRpb24pIHtcbiAgaWYgKHJlcXVpcmVkKSB7XG4gICAgaWYgKHBvc2l0aW9uID09PSBcImZyb250XCIpIHtcbiAgICAgIHJldHVybiBcIm5ldyBHcmFwaFFMTm9uTnVsbChcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiKVwiO1xuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG5mdW5jdGlvbiBjaGVja0Zvck11bHRpcGxlVmFsdWVzKG11bHRpcGxlVmFsdWVzLCBwb3NpdGlvbikge1xuICBpZiAobXVsdGlwbGVWYWx1ZXMpIHtcbiAgICBpZiAocG9zaXRpb24gPT09IFwiZnJvbnRcIikge1xuICAgICAgcmV0dXJuIFwibmV3IEdyYXBoUUxMaXN0KFwiO1xuICAgIH1cbiAgICByZXR1cm4gXCIpXCI7XG4gIH1cbiAgcmV0dXJuIFwiXCI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VHcmFwaHFsU2VydmVyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==