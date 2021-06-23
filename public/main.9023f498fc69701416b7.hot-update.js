webpackHotUpdate("main",{

/***/ "../utl/create_file_func/graphql_server.js":
/*!*************************************************!*\
  !*** ../utl/create_file_func/graphql_server.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tab = '  ';

// Function that evokes all other helper functions
function parseGraphqlServer(databases) {
  var query = '';
  for (var databaseIndex in databases) {
    var _database = databases[databaseIndex];
    // database.data is same as database.tables
    query += buildRequireStatements(_database.data, _database.databaseName);
  }
  query += buildGraphqlVariables();

  // BUILD TYPE SCHEMA
  for (var _databaseIndex in databases) {
    var _tables = database[_databaseIndex].data;
    var databaseName = database[_databaseIndex].databaseName;
    for (var tableIndex in _tables) {
      query += buildGraphqlTypeSchema(_tables[tableIndex], _tables, databaseName);
    }
  }

  // BUILD ROOT QUERY
  query += 'const RootQuery = new GraphQLObjectType({\n' + tab + 'name: \'RootQueryType\',\n' + tab + 'fields: {\n';

  var firstRootLoop = true;
  for (var _databaseIndex2 in databases) {
    var _tables2 = database[_databaseIndex2].data;
    var _databaseName = database[_databaseIndex2].databaseName;
    for (var _tableIndex in _tables2) {
      if (!firstRootLoop) query += ',\n';
      firstRootLoop = false;

      query += buildGraphqlRootQuery(_tables2[_tableIndex], _databaseName);
    }
  }
  query += '\n' + tab + '}\n});\n\n';

  // BUILD MUTATIONS
  query += 'const Mutation = new GraphQLObjectType({\n' + tab + 'name: \'Mutation\',\n' + tab + 'fields: {\n';

  var firstMutationLoop = true;
  for (var _tableIndex2 in tables) {
    if (!firstMutationLoop) query += ',\n';
    firstMutationLoop = false;

    query += buildGraphqlMutationQuery(tables[_tableIndex2], database);
  }
  query += '\n' + tab + '}\n});\n\n';

  query += 'module.exports = new GraphQLSchema({\n' + tab + 'query: RootQuery,\n' + tab + 'mutation: Mutation\n});';
  return query;
}

/**
 * @param {String} database - Represents the database selected (MongoDB, MySQL, or PostgreSQL)
 * @returns {String} - All the require statements needed for the GraphQL server.
 */
function buildRequireStatements(tables, database) {
  var requireStatements = "const graphql = require('graphql');\n";

  if (database === 'MongoDB') {
    for (var tableIndex in tables) {
      requireStatements += 'const ' + tables[tableIndex].type + ' = require(\'../db/' + tables[tableIndex].type.toLowerCase() + '.js\');\n';
    }
  } else {
    requireStatements += 'const pool = require(\'../db/sql_pool.js\');\n';
  }
  return requireStatements;
}

/**
 * @returns {String} - all constants needed for a GraphQL server
 */
function buildGraphqlVariables() {
  return '\nconst { \n  GraphQLObjectType,\n  GraphQLSchema,\n  GraphQLID,\n  GraphQLString, \n  GraphQLInt, \n  GraphQLBoolean,\n  GraphQLList,\n  GraphQLNonNull\n} = graphql;\n  \n';
}

/**
 * @param {Object} table - table being interated on. Each table consists of fields
 * @param {Object} tables - an object of all the tables created in the application
 * @param {String} database - Database selected (MongoDB, MySQL, or PostgreSQL)
 * @returns {String} - The GraphQL type code for the inputted table
 */
function buildGraphqlTypeSchema(table, tables, database) {
  var query = 'const ' + table.type + 'Type = new GraphQLObjectType({\n';
  query += tab + 'name: \'' + table.type + '\',\n';
  query += tab + 'fields: () => ({';
  query += buildGraphQLTypeFields(table, tables, database);
  return query += '\n' + tab + '})\n});\n\n';
}

/**
 * @param {Object} table - table being interated on. Each table consists of fields
 * @param {Object} tables - an object of all the tables created in the application
 * @param {String} database - Database selected (MongoDB, MySQL, or PostgreSQL)
 * @returns {String} - each field for the GraphQL type. 
 */
function buildGraphQLTypeFields(table, tables, database) {
  var query = '';
  var firstLoop = true;

  var _loop = function _loop(fieldIndex) {
    if (!firstLoop) query += ',';
    firstLoop = false;

    query += '\n' + tab + tab + buildFieldItem(table.fields[fieldIndex]);
    // check if the field has a relation to another field
    if (table.fields[fieldIndex].relation.tableIndex > -1) {
      query += createSubQuery(table.fields[fieldIndex], tables, database);
    }

    // check if the field is a relation for another field
    var refBy = table.fields[fieldIndex].refBy;
    if (Array.isArray(refBy)) {
      refBy.forEach(function (value) {
        var parsedValue = value.split('.');
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
  return field.name + ': { type: ' + checkForRequired(field.required, 'front') + checkForMultipleValues(field.multipleValues, 'front') + tableTypeToGraphqlType(field.type) + checkForMultipleValues(field.multipleValues, 'back') + checkForRequired(field.required, 'back') + ' }';
}

/**
 * @param {String} type - the field type (ID, String, Number, Boolean, or Float)
 * @returns {String} - the GraphQL type associated with the field type entered
 */
function tableTypeToGraphqlType(type) {
  switch (type) {
    case 'ID':
      return 'GraphQLID';
    case 'String':
      return 'GraphQLString';
    case 'Number':
      return 'GraphQLInt';
    case 'Boolean':
      return 'GraphQLBoolean';
    case 'Float':
      return 'GraphQLFloat';
    default:
      return 'GraphQLString';
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
  var query = ',\n' + tab + tab + createSubQueryName(field, refTypeName) + ': {\n' + tab + tab + tab + 'type: ';

  if (field.relation.refType === 'one to many' || field.relation.refType === 'many to many') {
    query += 'new GraphQLList(' + refTypeName + 'Type),';
  } else {
    query += refTypeName + 'Type,';
  }
  query += '\n' + tab + tab + tab + 'resolve(parent, args) {\n';

  if (database === 'MongoDB') {
    query += '' + tab + tab + tab + tab + 'return ' + refTypeName + '.' + findDbSearchMethod(refFieldName, refFieldType, field.relation.refType);
    query += '(' + createSearchObject(refFieldName, refFieldType, field) + ');\n';
    query += '' + tab + tab + tab + '}\n';
    query += '' + tab + tab + '}';
  }

  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += '' + tab + tab + tab + tab + 'const sql = `SELECT * FROM "' + refTypeName + '" WHERE "' + refFieldName + '" = \'${parent.' + field.name + '}\';`\n';
    query += buildSQLPoolQuery(field.relation.refType);
    query += '' + tab + tab + tab + '}\n';
    query += '' + tab + tab + '}';
  }
  return query;
}

/**
 * @param {String} refType - The relation type of the sub query
 * @returns {String} - the code for a SQL pool query. 
 */
function buildSQLPoolQuery(refType) {
  var rows = '';
  if (refType === 'one to one' || refType === 'many to one') rows = 'rows[0]';else rows = 'rows';

  var query = '' + tab + tab + tab + tab + 'return pool.query(sql)\n';
  query += '' + tab + tab + tab + tab + tab + '.then(res => res.' + rows + ')\n';
  query += '' + tab + tab + tab + tab + tab + '.catch(err => console.log(\'Error: \', err))\n';
  return query;
}

function createSubQueryName(field, refTypeName) {
  switch (field.relation.refType) {
    case 'one to one':
      return 'related' + toTitleCase(refTypeName);
    case 'one to many':
      return 'everyRelated' + toTitleCase(refTypeName);
    case 'many to one':
      return 'related' + toTitleCase(refTypeName);
    case 'many to many':
      return 'everyRelated' + toTitleCase(refTypeName);
    default:
      return 'everyRelated' + toTitleCase(refTypeName);
  }
}

function findDbSearchMethod(refFieldName, refFieldType, refType) {
  if (refFieldName === 'id' || refFieldType === 'ID') return 'findById';else if (refType === 'one to one') return 'findOne';else return 'find';
}

function createSearchObject(refFieldName, refFieldType, field) {
  if (refFieldName === 'id' || refFieldType === 'ID') {
    return 'parent.' + field.name;
  } else {
    return '{ ' + refFieldName + ': parent.' + field.name + ' }';
  }
}

function buildGraphqlRootQuery(table, database) {
  var query = '';

  query += createFindAllRootQuery(table, database);

  if (!!table.fields[0]) {
    query += createFindByIdQuery(table, database);
  }

  return query;
}

function createFindAllRootQuery(table, database) {
  var query = '' + tab + tab + 'every' + toTitleCase(table.type) + ': {\n';
  query += '' + tab + tab + tab + 'type: new GraphQLList(' + table.type + 'Type),\n';
  query += '' + tab + tab + tab + 'resolve() {\n';

  if (database === 'MongoDB') {
    query += '' + tab + tab + tab + tab + 'return ' + table.type + '.find({});\n';
  }

  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += '' + tab + tab + tab + tab + 'const sql = `SELECT * FROM "' + table.type + '";`\n';
    query += buildSQLPoolQuery('many');
  }

  return query += '' + tab + tab + tab + '}\n' + tab + tab + '}';
}

/**
 * @param {Object} table - table being iterated on
 * @param {String} database - database selected
 * @returns {String} - root query code to find an individual type
 */
function createFindByIdQuery(table, database) {
  var idFieldName = table.fields[0].name;
  var query = ',\n' + tab + tab + table.type.toLowerCase() + ': {\n';
  query += '' + tab + tab + tab + 'type: ' + table.type + 'Type,\n';
  query += '' + tab + tab + tab + 'args: { ' + idFieldName + ': { type: ' + tableTypeToGraphqlType(table.fields[0].type) + '}},\n';
  query += '' + tab + tab + tab + 'resolve(parent, args) {\n';

  if (database === 'MongoDB') {
    query += '' + tab + tab + tab + tab + 'return ' + table.type + '.findById(args.id);\n';
  }
  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += '' + tab + tab + tab + tab + 'const sql = `SELECT * FROM "' + table.type + '" WHERE ' + idFieldName + ' = \'${args.id}\';`;\n';
    query += buildSQLPoolQuery('one to one');
  }

  return query += '' + tab + tab + tab + '}\n' + tab + tab + '}';
}

function buildGraphqlMutationQuery(table, database) {
  var string = '';
  string += '' + addMutation(table, database);
  if (table.fields[0]) {
    string += ',\n' + updateMutation(table, database) + ',\n';
    string += '' + deleteMutation(table, database);
  }
  return string;
}

function buildSQLPoolMutation() {
  var string = '';
  string += '' + tab + tab + tab + tab + 'return pool.connect()\n';
  string += '' + tab + tab + tab + tab + tab + '.then(client => {\n';
  string += '' + tab + tab + tab + tab + tab + tab + 'return client.query(sql)\n';
  string += '' + tab + tab + tab + tab + tab + tab + tab + '.then(res => {\n';
  string += '' + tab + tab + tab + tab + tab + tab + tab + tab + 'client.release();\n';
  string += '' + tab + tab + tab + tab + tab + tab + tab + tab + 'return res.rows[0];\n';
  string += '' + tab + tab + tab + tab + tab + tab + tab + '})\n';
  string += '' + tab + tab + tab + tab + tab + tab + tab + '.catch(err => {\n';
  string += '' + tab + tab + tab + tab + tab + tab + tab + tab + 'client.release();\n';
  string += '' + tab + tab + tab + tab + tab + tab + tab + tab + 'console.log(\'Error: \', err);\n';
  string += '' + tab + tab + tab + tab + tab + tab + tab + '})\n';
  string += '' + tab + tab + tab + tab + tab + '})\n';
  return string;
}

function addMutation(table, database) {
  var query = '' + tab + tab + 'add' + table.type + ': {\n';
  query += '' + tab + tab + tab + 'type: ' + table.type + 'Type,\n';
  query += '' + tab + tab + tab + 'args: {\n';

  var firstLoop = true;
  for (var fieldIndex in table.fields) {
    if (!firstLoop) query += ',\n';
    firstLoop = false;

    query += '' + tab + tab + tab + tab + buildFieldItem(table.fields[fieldIndex]);
  }
  query += '\n' + tab + tab + tab + '},\n';
  query += '' + tab + tab + tab + 'resolve(parent, args) {\n';

  if (database === 'MongoDB') {
    query += '' + tab + tab + tab + tab + 'const ' + table.type.toLowerCase() + ' = new ' + table.type + '(args);\n';
    query += '' + tab + tab + tab + tab + 'return ' + table.type.toLowerCase() + '.save();\n';
  }

  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += '' + tab + tab + tab + tab + 'const columns = Object.keys(args).map(el => `"${el}"`);\n';
    query += '' + tab + tab + tab + tab + 'const values = Object.values(args).map(el => `\'${el}\'`);\n';
    query += '' + tab + tab + tab + tab + 'const sql = `INSERT INTO "' + table.type + '" (${columns}) VALUES (${values}) RETURNING *`;\n';
    query += buildSQLPoolMutation();
  }

  return query += '' + tab + tab + tab + '}\n' + tab + tab + '}';
}

function updateMutation(table, database) {
  var query = '' + tab + tab + 'update' + table.type + ': {\n' + tab + tab + tab + 'type: ' + table.type + 'Type,\n' + tab + tab + tab + 'args: {\n';

  var firstLoop = true;
  for (var fieldIndex in table.fields) {
    if (!firstLoop) query += ',\n';
    firstLoop = false;

    query += '' + tab + tab + tab + tab + buildFieldItem(table.fields[fieldIndex]);
  }

  query += '\n' + tab + tab + tab + '},\n' + tab + tab + tab + 'resolve(parent, args) {\n';

  if (database === 'MongoDB') query += '' + tab + tab + tab + tab + 'return ' + table.type + '.findByIdAndUpdate(args.id, args);\n';

  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += '' + tab + tab + tab + tab + 'let updateValues = \'\';\n';
    query += '' + tab + tab + tab + tab + 'for (const prop in args) {\n';
    query += '' + tab + tab + tab + tab + tab + 'if (updateValues.length > 0) updateValues += `, `;\n';
    query += '' + tab + tab + tab + tab + tab + 'updateValues += `"${prop}" = \'${args[prop]}\' `;\n';
    query += '' + tab + tab + tab + tab + '}\n';
    query += '' + tab + tab + tab + tab + 'const sql = `UPDATE "' + table.type + '" SET ${updateValues} WHERE id = \'${args.id}\' RETURNING *;`\n';
    query += buildSQLPoolMutation();
  }
  return query += '' + tab + tab + tab + '}\n' + tab + tab + '}';
}

function deleteMutation(table, database) {
  var idFieldName = table.fields[0].name;
  var query = '' + tab + tab + 'delete' + table.type + ': {\n';
  query += '' + tab + tab + tab + 'type: ' + table.type + 'Type,\n';
  query += '' + tab + tab + tab + 'args: { ' + idFieldName + ': { type: ' + tableTypeToGraphqlType(table.fields[0].type) + '}},\n';
  query += '' + tab + tab + tab + 'resolve(parent, args) {\n';

  if (database === 'MongoDB') {
    query += '' + tab + tab + tab + tab + 'return ' + table.type + '.findByIdAndRemove(args.id);\n';
  }

  if (database === 'MySQL' || database === 'PostgreSQL') {
    query += '' + tab + tab + tab + tab + 'const sql = `DELETE FROM "' + table.type + '" WHERE id = \'${args.id}\' RETURNING *;`\n';
    query += buildSQLPoolMutation();
  }

  return query += '' + tab + tab + tab + '}\n' + tab + tab + '}';
}

function checkForRequired(required, position) {
  if (required) {
    if (position === 'front') {
      return 'new GraphQLNonNull(';
    }
    return ')';
  }
  return '';
}

function checkForMultipleValues(multipleValues, position) {
  if (multipleValues) {
    if (position === 'front') {
      return 'new GraphQLList(';
    }
    return ')';
  }
  return '';
}

module.exports = parseGraphqlServer;

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwiZGF0YWJhc2VzIiwicXVlcnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2UiLCJidWlsZFJlcXVpcmVTdGF0ZW1lbnRzIiwiZGF0YSIsImRhdGFiYXNlTmFtZSIsImJ1aWxkR3JhcGhxbFZhcmlhYmxlcyIsInRhYmxlcyIsInRhYmxlSW5kZXgiLCJidWlsZEdyYXBocWxUeXBlU2NoZW1hIiwiZmlyc3RSb290TG9vcCIsImJ1aWxkR3JhcGhxbFJvb3RRdWVyeSIsImZpcnN0TXV0YXRpb25Mb29wIiwiYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSIsInJlcXVpcmVTdGF0ZW1lbnRzIiwidHlwZSIsInRvTG93ZXJDYXNlIiwidGFibGUiLCJidWlsZEdyYXBoUUxUeXBlRmllbGRzIiwiZmlyc3RMb29wIiwiZmllbGRJbmRleCIsImJ1aWxkRmllbGRJdGVtIiwiZmllbGRzIiwicmVsYXRpb24iLCJjcmVhdGVTdWJRdWVyeSIsInJlZkJ5IiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsInBhcnNlZFZhbHVlIiwidmFsdWUiLCJzcGxpdCIsImZpZWxkIiwibmFtZSIsInJlZlR5cGUiLCJjaGVja0ZvclJlcXVpcmVkIiwicmVxdWlyZWQiLCJjaGVja0Zvck11bHRpcGxlVmFsdWVzIiwibXVsdGlwbGVWYWx1ZXMiLCJ0YWJsZVR5cGVUb0dyYXBocWxUeXBlIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJyZWZGaWVsZE5hbWUiLCJyZWZGaWVsZFR5cGUiLCJjcmVhdGVTdWJRdWVyeU5hbWUiLCJmaW5kRGJTZWFyY2hNZXRob2QiLCJjcmVhdGVTZWFyY2hPYmplY3QiLCJidWlsZFNRTFBvb2xRdWVyeSIsInJvd3MiLCJjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5IiwiY3JlYXRlRmluZEJ5SWRRdWVyeSIsImlkRmllbGROYW1lIiwic3RyaW5nIiwiYWRkTXV0YXRpb24iLCJ1cGRhdGVNdXRhdGlvbiIsImRlbGV0ZU11dGF0aW9uIiwiYnVpbGRTUUxQb29sTXV0YXRpb24iLCJwb3NpdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLFVBQU47O0FBRUE7QUFDQSxTQUFTQyxrQkFBVCxDQUE0QkMsU0FBNUIsRUFBdUM7QUFDckMsTUFBSUMsUUFBUSxFQUFaO0FBQ0EsT0FBSyxJQUFNQyxhQUFYLElBQTRCRixTQUE1QixFQUF1QztBQUNyQyxRQUFNRyxZQUFXSCxVQUFVRSxhQUFWLENBQWpCO0FBQ0E7QUFDQUQsYUFBU0csdUJBQXVCRCxVQUFTRSxJQUFoQyxFQUFzQ0YsVUFBU0csWUFBL0MsQ0FBVDtBQUNEO0FBQ0RMLFdBQVNNLHVCQUFUOztBQUVBO0FBQ0EsT0FBSyxJQUFNTCxjQUFYLElBQTRCRixTQUE1QixFQUF1QztBQUNyQyxRQUFNUSxVQUFTTCxTQUFTRCxjQUFULEVBQXdCRyxJQUF2QztBQUNBLFFBQU1DLGVBQWVILFNBQVNELGNBQVQsRUFBd0JJLFlBQTdDO0FBQ0EsU0FBSyxJQUFNRyxVQUFYLElBQXlCRCxPQUF6QixFQUFpQztBQUMvQlAsZUFBU1MsdUJBQXVCRixRQUFPQyxVQUFQLENBQXZCLEVBQTJDRCxPQUEzQyxFQUFtREYsWUFBbkQsQ0FBVDtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQUwsMkRBQXVESCxHQUF2RCxrQ0FBcUZBLEdBQXJGOztBQUVBLE1BQUlhLGdCQUFnQixJQUFwQjtBQUNBLE9BQUssSUFBTVQsZUFBWCxJQUE0QkYsU0FBNUIsRUFBdUM7QUFDckMsUUFBTVEsV0FBU0wsU0FBU0QsZUFBVCxFQUF3QkcsSUFBdkM7QUFDQSxRQUFNQyxnQkFBZUgsU0FBU0QsZUFBVCxFQUF3QkksWUFBN0M7QUFDQSxTQUFLLElBQU1HLFdBQVgsSUFBeUJELFFBQXpCLEVBQWlDO0FBQy9CLFVB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dXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGFiID0gYCAgYDtcblxuLy8gRnVuY3Rpb24gdGhhdCBldm9rZXMgYWxsIG90aGVyIGhlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIHBhcnNlR3JhcGhxbFNlcnZlcihkYXRhYmFzZXMpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7XG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXMpIHsgIFxuICAgIGNvbnN0IGRhdGFiYXNlID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdO1xuICAgIC8vIGRhdGFiYXNlLmRhdGEgaXMgc2FtZSBhcyBkYXRhYmFzZS50YWJsZXNcbiAgICBxdWVyeSArPSBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKGRhdGFiYXNlLmRhdGEsIGRhdGFiYXNlLmRhdGFiYXNlTmFtZSk7XG4gIH1cbiAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCk7XG4gIFxuICAvLyBCVUlMRCBUWVBFIFNDSEVNQVxuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7XG4gICAgY29uc3QgdGFibGVzID0gZGF0YWJhc2VbZGF0YWJhc2VJbmRleF0uZGF0YTtcbiAgICBjb25zdCBkYXRhYmFzZU5hbWUgPSBkYXRhYmFzZVtkYXRhYmFzZUluZGV4XS5kYXRhYmFzZU5hbWU7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSh0YWJsZXNbdGFibGVJbmRleF0sIHRhYmxlcywgZGF0YWJhc2VOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvLyBCVUlMRCBST09UIFFVRVJZXG4gIHF1ZXJ5ICs9IGBjb25zdCBSb290UXVlcnkgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdSb290UXVlcnlUeXBlJyxcXG4ke3RhYn1maWVsZHM6IHtcXG5gO1xuXG4gIGxldCBmaXJzdFJvb3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IHRhYmxlcyA9IGRhdGFiYXNlW2RhdGFiYXNlSW5kZXhdLmRhdGE7XG4gICAgY29uc3QgZGF0YWJhc2VOYW1lID0gZGF0YWJhc2VbZGF0YWJhc2VJbmRleF0uZGF0YWJhc2VOYW1lO1xuICAgIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICAgIGlmICghZmlyc3RSb290TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgICAgZmlyc3RSb290TG9vcCA9IGZhbHNlO1xuXG4gICAgICBxdWVyeSArPSBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZU5hbWUpO1xuICAgIH1cbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9fVxcbn0pO1xcblxcbmA7XG5cbiAgLy8gQlVJTEQgTVVUQVRJT05TXG4gIHF1ZXJ5ICs9IGBjb25zdCBNdXRhdGlvbiA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuJHt0YWJ9bmFtZTogJ011dGF0aW9uJyxcXG4ke3RhYn1maWVsZHM6IHtcXG5gO1xuXG4gIGxldCBmaXJzdE11dGF0aW9uTG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICBpZiAoIWZpcnN0TXV0YXRpb25Mb29wKSBxdWVyeSArPSAnLFxcbic7XG4gICAgZmlyc3RNdXRhdGlvbkxvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZSk7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIHF1ZXJ5ICs9IGBtb2R1bGUuZXhwb3J0cyA9IG5ldyBHcmFwaFFMU2NoZW1hKHtcXG4ke3RhYn1xdWVyeTogUm9vdFF1ZXJ5LFxcbiR7dGFifW11dGF0aW9uOiBNdXRhdGlvblxcbn0pO2A7XG4gIHJldHVybiBxdWVyeTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIFJlcHJlc2VudHMgdGhlIGRhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQWxsIHRoZSByZXF1aXJlIHN0YXRlbWVudHMgbmVlZGVkIGZvciB0aGUgR3JhcGhRTCBzZXJ2ZXIuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkUmVxdWlyZVN0YXRlbWVudHModGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcmVxdWlyZVN0YXRlbWVudHMgPSBcImNvbnN0IGdyYXBocWwgPSByZXF1aXJlKCdncmFwaHFsJyk7XFxuXCI7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgICByZXF1aXJlU3RhdGVtZW50cyArPSBgY29uc3QgJHt0YWJsZXNbdGFibGVJbmRleF0udHlwZX0gPSByZXF1aXJlKCcuLi9kYi8ke3RhYmxlc1t0YWJsZUluZGV4XS50eXBlLnRvTG93ZXJDYXNlKCl9LmpzJyk7XFxuYDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0IHBvb2wgPSByZXF1aXJlKCcuLi9kYi9zcWxfcG9vbC5qcycpO1xcbmA7XG4gIH1cbiAgcmV0dXJuIHJlcXVpcmVTdGF0ZW1lbnRzO1xufVxuXG5cbi8qKlxuICogQHJldHVybnMge1N0cmluZ30gLSBhbGwgY29uc3RhbnRzIG5lZWRlZCBmb3IgYSBHcmFwaFFMIHNlcnZlclxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxWYXJpYWJsZXMoKSB7XG4gIHJldHVybiBgXG5jb25zdCB7IFxuICBHcmFwaFFMT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFNjaGVtYSxcbiAgR3JhcGhRTElELFxuICBHcmFwaFFMU3RyaW5nLCBcbiAgR3JhcGhRTEludCwgXG4gIEdyYXBoUUxCb29sZWFuLFxuICBHcmFwaFFMTGlzdCxcbiAgR3JhcGhRTE5vbk51bGxcbn0gPSBncmFwaHFsO1xuICBcXG5gXG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpbnRlcmF0ZWQgb24uIEVhY2ggdGFibGUgY29uc2lzdHMgb2YgZmllbGRzXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGVzIC0gYW4gb2JqZWN0IG9mIGFsbCB0aGUgdGFibGVzIGNyZWF0ZWQgaW4gdGhlIGFwcGxpY2F0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBEYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIFRoZSBHcmFwaFFMIHR5cGUgY29kZSBmb3IgdGhlIGlucHV0dGVkIHRhYmxlXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFR5cGVTY2hlbWEodGFibGUsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYGNvbnN0ICR7dGFibGUudHlwZX1UeXBlID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9bmFtZTogJyR7dGFibGUudHlwZX0nLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn1maWVsZHM6ICgpID0+ICh7YDtcbiAgcXVlcnkgKz0gYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSk7XG4gIHJldHVybiBxdWVyeSArPSBgXFxuJHt0YWJ9fSlcXG59KTtcXG5cXG5gO1xufVxuXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBlYWNoIGZpZWxkIGZvciB0aGUgR3JhcGhRTCB0eXBlLiBcbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSAnJzsgXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGxldCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSs9ICcsJztcbiAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke2J1aWxkRmllbGRJdGVtKHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XSl9YDtcbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaGFzIGEgcmVsYXRpb24gdG8gYW5vdGhlciBmaWVsZFxuICAgIGlmICh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ucmVsYXRpb24udGFibGVJbmRleCA+IC0xKSB7XG4gICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0sIHRhYmxlcywgZGF0YWJhc2UpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBmaWVsZCBpcyBhIHJlbGF0aW9uIGZvciBhbm90aGVyIGZpZWxkXG4gICAgY29uc3QgcmVmQnkgPSB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ucmVmQnk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVmQnkpKSB7XG4gICAgICByZWZCeS5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgY29uc3QgcGFyc2VkVmFsdWUgPSB2YWx1ZS5zcGxpdCgnLicpO1xuICAgICAgICBjb25zdCBmaWVsZCA9IHtcbiAgICAgICAgICBuYW1lOiB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ubmFtZSxcbiAgICAgICAgICByZWxhdGlvbjoge1xuICAgICAgICAgICAgdGFibGVJbmRleDogcGFyc2VkVmFsdWVbMF0sXG4gICAgICAgICAgICBmaWVsZEluZGV4OiBwYXJzZWRWYWx1ZVsxXSxcbiAgICAgICAgICAgIHJlZlR5cGU6IHBhcnNlZFZhbHVlWzJdLFxuICAgICAgICAgICAgdHlwZTogdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnR5cGVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXJ5ICs9IGNyZWF0ZVN1YlF1ZXJ5KGZpZWxkLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnk7IFxufVxuXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZpZWxkIC0gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGZpZWxkIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIGEgZmllbGQgaXRlbSAoZXg6ICdpZDogeyB0eXBlOiBHcmFwaFFMSUQgfScpXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkRmllbGRJdGVtKGZpZWxkKSB7XG4gIHJldHVybiAgYCR7ZmllbGQubmFtZX06IHsgdHlwZTogJHtjaGVja0ZvclJlcXVpcmVkKGZpZWxkLnJlcXVpcmVkLCAnZnJvbnQnKX0ke2NoZWNrRm9yTXVsdGlwbGVWYWx1ZXMoZmllbGQubXVsdGlwbGVWYWx1ZXMsICdmcm9udCcpfSR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZShmaWVsZC50eXBlKX0ke2NoZWNrRm9yTXVsdGlwbGVWYWx1ZXMoZmllbGQubXVsdGlwbGVWYWx1ZXMsICdiYWNrJyl9JHtjaGVja0ZvclJlcXVpcmVkKGZpZWxkLnJlcXVpcmVkLCAnYmFjaycpfSB9YDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gdGhlIGZpZWxkIHR5cGUgKElELCBTdHJpbmcsIE51bWJlciwgQm9vbGVhbiwgb3IgRmxvYXQpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHRoZSBHcmFwaFFMIHR5cGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBmaWVsZCB0eXBlIGVudGVyZWRcbiAqL1xuZnVuY3Rpb24gdGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0eXBlKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ0lEJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTElEJztcbiAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgcmV0dXJuICdHcmFwaFFMU3RyaW5nJztcbiAgICBjYXNlICdOdW1iZXInOlxuICAgICAgcmV0dXJuICdHcmFwaFFMSW50JztcbiAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTEJvb2xlYW4nO1xuICAgIGNhc2UgJ0Zsb2F0JzpcbiAgICAgIHJldHVybiAnR3JhcGhRTEZsb2F0JztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICdHcmFwaFFMU3RyaW5nJztcbiAgfVxufVxuXG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlZlR5cGVOYW1lIC0gQW55IHN0cmluZyBpbnB1dHRlZFxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgc3RyaW5nIGlucHV0dGVkLCBidXQgd2l0aCB0aGUgZmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkIGFuZCB0aGUgcmVzdCBsb3dlcmNhc2VkXG4gKi9cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKSB7XG4gIGxldCBuYW1lID0gcmVmVHlwZU5hbWVbMF0udG9VcHBlckNhc2UoKTtcbiAgbmFtZSArPSByZWZUeXBlTmFtZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gbmFtZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gZmllbGQgLSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFsbCB0aGUgdGFibGVzIG1hZGUgYnkgdGhlIHVzZXIuIFxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YmFzZSBzZWxlY3RlZFxuICogQHJldHVybnMge1N0cmluZ30gLSBCdWlsZHMgYSBzdWIgdHlwZSBmb3IgYW55IGZpZWxkIHdpdGggYSByZWxhdGlvbi4gXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN1YlF1ZXJ5KGZpZWxkLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IHJlZlR5cGVOYW1lID0gdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLnR5cGU7XG4gIGNvbnN0IHJlZkZpZWxkTmFtZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0ubmFtZTtcbiAgY29uc3QgcmVmRmllbGRUeXBlID0gdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLmZpZWxkc1tmaWVsZC5yZWxhdGlvbi5maWVsZEluZGV4XS50eXBlO1xuICBsZXQgcXVlcnkgPSBgLFxcbiR7dGFifSR7dGFifSR7Y3JlYXRlU3ViUXVlcnlOYW1lKGZpZWxkLCByZWZUeXBlTmFtZSl9OiB7XFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogYDtcblxuICBpZiAoZmllbGQucmVsYXRpb24ucmVmVHlwZSA9PT0gJ29uZSB0byBtYW55JyB8fCBmaWVsZC5yZWxhdGlvbi5yZWZUeXBlID09PSAnbWFueSB0byBtYW55Jykge1xuICAgIHF1ZXJ5ICs9IGBuZXcgR3JhcGhRTExpc3QoJHtyZWZUeXBlTmFtZX1UeXBlKSxgO1xuICB9IGVsc2Uge1xuICAgIHF1ZXJ5ICs9IGAke3JlZlR5cGVOYW1lfVR5cGUsYDtcbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3JlZlR5cGVOYW1lfS4ke2ZpbmREYlNlYXJjaE1ldGhvZChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQucmVsYXRpb24ucmVmVHlwZSl9YDtcbiAgICBxdWVyeSArPSBgKCR7Y3JlYXRlU2VhcmNoT2JqZWN0KHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCBmaWVsZCl9KTtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9fWA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBTRUxFQ1QgKiBGUk9NIFwiJHtyZWZUeXBlTmFtZX1cIiBXSEVSRSBcIiR7cmVmRmllbGROYW1lfVwiID0gJ1xcJHtwYXJlbnQuJHtmaWVsZC5uYW1lfX0nO1xcYFxcbmBcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeShmaWVsZC5yZWxhdGlvbi5yZWZUeXBlKVxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9fWA7XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWZUeXBlIC0gVGhlIHJlbGF0aW9uIHR5cGUgb2YgdGhlIHN1YiBxdWVyeVxuICogQHJldHVybnMge1N0cmluZ30gLSB0aGUgY29kZSBmb3IgYSBTUUwgcG9vbCBxdWVyeS4gXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbFF1ZXJ5KHJlZlR5cGUpIHtcbiAgbGV0IHJvd3MgPSAnJzsgXG4gIGlmIChyZWZUeXBlID09PSAnb25lIHRvIG9uZScgfHwgcmVmVHlwZSA9PT0gJ21hbnkgdG8gb25lJykgcm93cyA9ICdyb3dzWzBdJ1xuICBlbHNlIHJvd3MgPSAncm93cydcblxuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wucXVlcnkoc3FsKVxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKHJlcyA9PiByZXMuJHtyb3dzfSlcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0uY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKCdFcnJvcjogJywgZXJyKSlcXG5gXG4gIHJldHVybiBxdWVyeTsgXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN1YlF1ZXJ5TmFtZShmaWVsZCwgcmVmVHlwZU5hbWUpIHtcbiAgc3dpdGNoIChmaWVsZC5yZWxhdGlvbi5yZWZUeXBlKSB7XG4gICAgY2FzZSAnb25lIHRvIG9uZSc6XG4gICAgICByZXR1cm4gYHJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGNhc2UgJ29uZSB0byBtYW55JzpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdtYW55IHRvIG9uZSc6XG4gICAgICByZXR1cm4gYHJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGNhc2UgJ21hbnkgdG8gbWFueSc6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kRGJTZWFyY2hNZXRob2QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIHJlZlR5cGUpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gJ2lkJyB8fCByZWZGaWVsZFR5cGUgPT09ICdJRCcpIHJldHVybiAnZmluZEJ5SWQnO1xuICBlbHNlIGlmIChyZWZUeXBlID09PSAnb25lIHRvIG9uZScpIHJldHVybiAnZmluZE9uZSc7XG4gIGVsc2UgcmV0dXJuICdmaW5kJztcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VhcmNoT2JqZWN0KHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCBmaWVsZCkge1xuICBpZiAocmVmRmllbGROYW1lID09PSAnaWQnIHx8IHJlZkZpZWxkVHlwZSA9PT0gJ0lEJykge1xuICAgIHJldHVybiBgcGFyZW50LiR7ZmllbGQubmFtZX1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgeyAke3JlZkZpZWxkTmFtZX06IHBhcmVudC4ke2ZpZWxkLm5hbWV9IH1gO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7XG5cbiAgcXVlcnkgKz0gY3JlYXRlRmluZEFsbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpO1xuXG4gIGlmICghIXRhYmxlLmZpZWxkc1swXSkge1xuICAgIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRCeUlkUXVlcnkodGFibGUsIGRhdGFiYXNlKTtcbiAgfVxuXG4gIHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRmluZEFsbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWV2ZXJ5JHt0b1RpdGxlQ2FzZSh0YWJsZS50eXBlKX06IHtcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiBuZXcgR3JhcGhRTExpc3QoJHt0YWJsZS50eXBlfVR5cGUpLFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUoKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kKHt9KTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KCdtYW55JylcbiAgfVxuXG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBkYXRhYmFzZSBzZWxlY3RlZFxuICogQHJldHVybnMge1N0cmluZ30gLSByb290IHF1ZXJ5IGNvZGUgdG8gZmluZCBhbiBpbmRpdmlkdWFsIHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRmluZEJ5SWRRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgY29uc3QgaWRGaWVsZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX06IHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHsgJHtpZEZpZWxkTmFtZX06IHsgdHlwZTogJHt0YWJsZVR5cGVUb0dyYXBocWxUeXBlKHRhYmxlLmZpZWxkc1swXS50eXBlKX19fSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkKGFyZ3MuaWQpO1xcbmA7XG4gIH1cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIiBXSEVSRSAke2lkRmllbGROYW1lfSA9ICdcXCR7YXJncy5pZH0nO1xcYDtcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoJ29uZSB0byBvbmUnKTsgXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHN0cmluZyA9IGBgO1xuICBzdHJpbmcgKz0gYCR7YWRkTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICBpZiAodGFibGUuZmllbGRzWzBdKSB7XG4gICAgc3RyaW5nICs9IGAsXFxuJHt1cGRhdGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpfSxcXG5gO1xuICAgIHN0cmluZyArPSBgJHtkZWxldGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpfWA7XG4gIH1cbiAgcmV0dXJuIHN0cmluZztcbn1cblxuZnVuY3Rpb24gYnVpbGRTUUxQb29sTXV0YXRpb24oKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcG9vbC5jb25uZWN0KClcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LnRoZW4oY2xpZW50ID0+IHtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIGNsaWVudC5xdWVyeShzcWwpXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKHJlcyA9PiB7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNsaWVudC5yZWxlYXNlKCk7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiByZXMucm93c1swXTtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LmNhdGNoKGVyciA9PiB7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNsaWVudC5yZWxlYXNlKCk7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnNvbGUubG9nKCdFcnJvcjogJywgZXJyKTtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gXG4gIHJldHVybiBzdHJpbmc7IFxufVxuXG5mdW5jdGlvbiBhZGRNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWFkZCR7dGFibGUudHlwZX06IHtcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLFxcbic7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifX0sXFxuYFxuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0ICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfSA9IG5ldyAke3RhYmxlLnR5cGV9KGFyZ3MpO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfS5zYXZlKCk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IGNvbHVtbnMgPSBPYmplY3Qua2V5cyhhcmdzKS5tYXAoZWwgPT4gXFxgXCJcXCR7ZWx9XCJcXGApO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhhcmdzKS5tYXAoZWwgPT4gXFxgJ1xcJHtlbH0nXFxgKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYElOU0VSVCBJTlRPIFwiJHt0YWJsZS50eXBlfVwiIChcXCR7Y29sdW1uc30pIFZBTFVFUyAoXFwke3ZhbHVlc30pIFJFVFVSTklORyAqXFxgO1xcbmBcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xNdXRhdGlvbigpOyBcbiAgfVxuXG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifXVwZGF0ZSR7dGFibGUudHlwZX06IHtcXG4ke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLFxcbic7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWBcbiAgfVxuXG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn19LFxcbiR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkQW5kVXBkYXRlKGFyZ3MuaWQsIGFyZ3MpO1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9bGV0IHVwZGF0ZVZhbHVlcyA9ICcnO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Zm9yIChjb25zdCBwcm9wIGluIGFyZ3MpIHtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWlmICh1cGRhdGVWYWx1ZXMubGVuZ3RoID4gMCkgdXBkYXRlVmFsdWVzICs9IFxcYCwgXFxgO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9dXBkYXRlVmFsdWVzICs9IFxcYFwiXFwke3Byb3B9XCIgPSAnXFwke2FyZ3NbcHJvcF19JyBcXGA7XFxuYCAgICBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgVVBEQVRFIFwiJHt0YWJsZS50eXBlfVwiIFNFVCBcXCR7dXBkYXRlVmFsdWVzfSBXSEVSRSBpZCA9ICdcXCR7YXJncy5pZH0nIFJFVFVSTklORyAqO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTsgXG4gIH1cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSkge1xuICBjb25zdCBpZEZpZWxkTmFtZSA9IHRhYmxlLmZpZWxkc1swXS5uYW1lO1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9ZGVsZXRlJHt0YWJsZS50eXBlfToge1xcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHsgJHtpZEZpZWxkTmFtZX06IHsgdHlwZTogJHt0YWJsZVR5cGVUb0dyYXBocWxUeXBlKHRhYmxlLmZpZWxkc1swXS50eXBlKSB9fX0sXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkQW5kUmVtb3ZlKGFyZ3MuaWQpO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBERUxFVEUgRlJPTSBcIiR7dGFibGUudHlwZX1cIiBXSEVSRSBpZCA9ICdcXCR7YXJncy5pZH0nIFJFVFVSTklORyAqO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTsgXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JSZXF1aXJlZChyZXF1aXJlZCwgcG9zaXRpb24pIHtcbiAgaWYgKHJlcXVpcmVkKSB7XG4gICAgaWYgKHBvc2l0aW9uID09PSAnZnJvbnQnKSB7XG4gICAgICByZXR1cm4gJ25ldyBHcmFwaFFMTm9uTnVsbCgnO1xuICAgIH1cbiAgICByZXR1cm4gJyknO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JNdWx0aXBsZVZhbHVlcyhtdWx0aXBsZVZhbHVlcywgcG9zaXRpb24pIHtcbiAgaWYgKG11bHRpcGxlVmFsdWVzKSB7XG4gICAgaWYgKHBvc2l0aW9uID09PSAnZnJvbnQnKSB7XG4gICAgICByZXR1cm4gJ25ldyBHcmFwaFFMTGlzdCgnO1xuICAgIH1cbiAgICByZXR1cm4gJyknO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUdyYXBocWxTZXJ2ZXI7XG4iXSwic291cmNlUm9vdCI6IiJ9