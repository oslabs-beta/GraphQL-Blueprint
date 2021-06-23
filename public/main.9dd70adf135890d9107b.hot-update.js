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
    // database.data is same as database.tables
    query += buildRequireStatements(databases[databaseIndex].data, database.databaseName);
  }
  query += buildGraphqlVariables();

  // BUILD TYPE SCHEMA
  for (var _database in databases) {
    for (var tableIndex in _database.data) {
      query += buildGraphqlTypeSchema(tables[tableIndex], tables, _database);
    }
  }

  // BUILD ROOT QUERY
  query += 'const RootQuery = new GraphQLObjectType({\n' + tab + 'name: \'RootQueryType\',\n' + tab + 'fields: {\n';

  var firstRootLoop = true;
  for (var _tableIndex in tables) {
    if (!firstRootLoop) query += ',\n';
    firstRootLoop = false;

    query += buildGraphqlRootQuery(tables[_tableIndex], database);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwiZGF0YWJhc2VzIiwicXVlcnkiLCJkYXRhYmFzZUluZGV4IiwiYnVpbGRSZXF1aXJlU3RhdGVtZW50cyIsImRhdGEiLCJkYXRhYmFzZSIsImRhdGFiYXNlTmFtZSIsImJ1aWxkR3JhcGhxbFZhcmlhYmxlcyIsInRhYmxlSW5kZXgiLCJidWlsZEdyYXBocWxUeXBlU2NoZW1hIiwidGFibGVzIiwiZmlyc3RSb290TG9vcCIsImJ1aWxkR3JhcGhxbFJvb3RRdWVyeSIsImZpcnN0TXV0YXRpb25Mb29wIiwiYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSIsInJlcXVpcmVTdGF0ZW1lbnRzIiwidHlwZSIsInRvTG93ZXJDYXNlIiwidGFibGUiLCJidWlsZEdyYXBoUUxUeXBlRmllbGRzIiwiZmlyc3RMb29wIiwiZmllbGRJbmRleCIsImJ1aWxkRmllbGRJdGVtIiwiZmllbGRzIiwicmVsYXRpb24iLCJjcmVhdGVTdWJRdWVyeSIsInJlZkJ5IiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsInBhcnNlZFZhbHVlIiwidmFsdWUiLCJzcGxpdCIsImZpZWxkIiwibmFtZSIsInJlZlR5cGUiLCJjaGVja0ZvclJlcXVpcmVkIiwicmVxdWlyZWQiLCJjaGVja0Zvck11bHRpcGxlVmFsdWVzIiwibXVsdGlwbGVWYWx1ZXMiLCJ0YWJsZVR5cGVUb0dyYXBocWxUeXBlIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJyZWZGaWVsZE5hbWUiLCJyZWZGaWVsZFR5cGUiLCJjcmVhdGVTdWJRdWVyeU5hbWUiLCJmaW5kRGJTZWFyY2hNZXRob2QiLCJjcmVhdGVTZWFyY2hPYmplY3QiLCJidWlsZFNRTFBvb2xRdWVyeSIsInJvd3MiLCJjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5IiwiY3JlYXRlRmluZEJ5SWRRdWVyeSIsImlkRmllbGROYW1lIiwic3RyaW5nIiwiYWRkTXV0YXRpb24iLCJ1cGRhdGVNdXRhdGlvbiIsImRlbGV0ZU11dGF0aW9uIiwiYnVpbGRTUUxQb29sTXV0YXRpb24iLCJwb3NpdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLFVBQU47O0FBRUE7QUFDQSxTQUFTQyxrQkFBVCxDQUE0QkMsU0FBNUIsRUFBdUM7QUFDckMsTUFBSUMsUUFBUSxFQUFaO0FBQ0EsT0FBSyxJQUFNQyxhQUFYLElBQTRCRixTQUE1QixFQUF1QztBQUNyQztBQUNBQyxhQUFTRSx1QkFBdUJILFVBQVVFLGFBQVYsRUFBeUJFLElBQWhELEVBQXNEQyxTQUFTQyxZQUEvRCxDQUFUO0FBQ0Q7QUFDREwsV0FBU00sdUJBQVQ7O0FBR0E7QUFDQSxPQUFLLElBQU1GLFNBQVgsSUFBdUJMLFNBQXZCLEVBQWtDO0FBQ2hDLFNBQUssSUFBTVEsVUFBWCxJQUF5QkgsVUFBU0QsSUFBbEMsRUFBd0M7QUFDdENILGVBQVNRLHVCQUF1QkMsT0FBT0YsVUFBUCxDQUF2QixFQUEyQ0UsTUFBM0MsRUFBbURMLFNBQW5ELENBQVQ7QUFDRDtBQUNGOztBQUVEO0FBQ0FKLDJEQUF1REgsR0FBdkQsa0NBQXFGQSxHQUFyRjs7QUFFQSxNQUFJYSxnQkFBZ0IsSUFBcEI7QUFDQSxPQUFLLElBQU1ILFdBQVgsSUFBeUJFLE1BQXpCLEVBQWlDO0FBQy9CLFFBQUksQ0FBQ0MsYUFBTCxFQUFvQlYsU0FBUyxLQUFUO0FBQ3BCVSxvQkFBZ0IsS0FBaEI7O0FBRUFWLGFBQVNXLHNCQUFzQkYsT0FBT0YsV0FBUCxDQUF0QixFQUEwQ0gsUUFBMUMsQ0FBVDtBQUNEO0FBQ0RKLGtCQUFjSCxHQUFkOztBQUVBO0FBQ0FHLDBEQUFzREgsR0FBdEQsNkJBQStFQSxHQUEvRTs7QUFFQSxNQUFJZSxvQkFBb0IsSUFBeEI7QUFDQSxPQUFLLElBQU1MLFlBQVgsSUFBeUJF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OEJBLEdBQTlCLGVBQTJDb0IsTUFBTUYsSUFBakQ7QUFDRDs7QUFFRCxNQUFJWCxhQUFhLE9BQWIsSUFBd0JBLGFBQWEsWUFBekMsRUFBdUQ7QUFDckRKLGtCQUFZSCxHQUFaLEdBQWtCQSxHQUFsQixHQUF3QkEsR0FBeEIsR0FBOEJBLEdBQTlCLGtDQUErRG9CLE1BQU1GLElBQXJFO0FBQ0FmLGFBQVMwRCxzQkFBVDtBQUNEOztBQUVELFNBQU8xRCxjQUFZSCxHQUFaLEdBQWtCQSxHQUFsQixHQUF3QkEsR0FBeEIsV0FBaUNBLEdBQWpDLEdBQXVDQSxHQUF2QyxNQUFQO0FBQ0Q7O0FBRUQsU0FBU3NDLGdCQUFULENBQTBCQyxRQUExQixFQUFvQ3VCLFFBQXBDLEVBQThDO0FBQzVDLE1BQUl2QixRQUFKLEVBQWM7QUFDWixRQUFJdUIsYUFBYSxPQUFqQixFQUEwQjtBQUN4QixhQUFPLHFCQUFQO0FBQ0Q7QUFDRCxXQUFPLEdBQVA7QUFDRDtBQUNELFNBQU8sRUFBUDtBQUNEOztBQUVELFNBQVN0QixzQkFBVCxDQUFnQ0MsY0FBaEMsRUFBZ0RxQixRQUFoRCxFQUEwRDtBQUN4RCxNQUFJckIsY0FBSixFQUFvQjtBQUNsQixRQUFJcUIsYUFBYSxPQUFqQixFQUEwQjtBQUN4QixhQUFPLGtCQUFQO0FBQ0Q7QUFDRCxXQUFPLEdBQVA7QUFDRDtBQUNELFNBQU8sRUFBUDtBQUNEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCL0Qsa0JBQWpCLEMiLCJmaWxlIjoibWFpbi45ZGQ3MGFkZjEzNTg5MGQ5MTA3Yi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGFiID0gYCAgYDtcblxuLy8gRnVuY3Rpb24gdGhhdCBldm9rZXMgYWxsIG90aGVyIGhlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIHBhcnNlR3JhcGhxbFNlcnZlcihkYXRhYmFzZXMpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7XG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXMpIHsgIFxuICAgIC8vIGRhdGFiYXNlLmRhdGEgaXMgc2FtZSBhcyBkYXRhYmFzZS50YWJsZXNcbiAgICBxdWVyeSArPSBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XS5kYXRhLCBkYXRhYmFzZS5kYXRhYmFzZU5hbWUpO1xuICB9XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbFZhcmlhYmxlcygpO1xuICBcblxuICAvLyBCVUlMRCBUWVBFIFNDSEVNQVxuICBmb3IgKGNvbnN0IGRhdGFiYXNlIGluIGRhdGFiYXNlcykge1xuICAgIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiBkYXRhYmFzZS5kYXRhKSB7XG4gICAgICBxdWVyeSArPSBidWlsZEdyYXBocWxUeXBlU2NoZW1hKHRhYmxlc1t0YWJsZUluZGV4XSwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQlVJTEQgUk9PVCBRVUVSWVxuICBxdWVyeSArPSBgY29uc3QgUm9vdFF1ZXJ5ID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG4ke3RhYn1uYW1lOiAnUm9vdFF1ZXJ5VHlwZScsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RSb290TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICBpZiAoIWZpcnN0Um9vdExvb3ApIHF1ZXJ5ICs9ICcsXFxuJztcbiAgICBmaXJzdFJvb3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZSk7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIC8vIEJVSUxEIE1VVEFUSU9OU1xuICBxdWVyeSArPSBgY29uc3QgTXV0YXRpb24gPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdNdXRhdGlvbicsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RNdXRhdGlvbkxvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgaWYgKCFmaXJzdE11dGF0aW9uTG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TXV0YXRpb25Mb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBidWlsZEdyYXBocWxNdXRhdGlvblF1ZXJ5KHRhYmxlc1t0YWJsZUluZGV4XSwgZGF0YWJhc2UpO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn19XFxufSk7XFxuXFxuYDtcblxuICBxdWVyeSArPSBgbW9kdWxlLmV4cG9ydHMgPSBuZXcgR3JhcGhRTFNjaGVtYSh7XFxuJHt0YWJ9cXVlcnk6IFJvb3RRdWVyeSxcXG4ke3RhYn1tdXRhdGlvbjogTXV0YXRpb25cXG59KTtgO1xuICByZXR1cm4gcXVlcnk7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBSZXByZXNlbnRzIHRoZSBkYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIEFsbCB0aGUgcmVxdWlyZSBzdGF0ZW1lbnRzIG5lZWRlZCBmb3IgdGhlIEdyYXBoUUwgc2VydmVyLlxuICovXG5mdW5jdGlvbiBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHJlcXVpcmVTdGF0ZW1lbnRzID0gXCJjb25zdCBncmFwaHFsID0gcmVxdWlyZSgnZ3JhcGhxbCcpO1xcblwiO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0ICR7dGFibGVzW3RhYmxlSW5kZXhdLnR5cGV9ID0gcmVxdWlyZSgnLi4vZGIvJHt0YWJsZXNbdGFibGVJbmRleF0udHlwZS50b0xvd2VyQ2FzZSgpfS5qcycpO1xcbmA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcXVpcmVTdGF0ZW1lbnRzICs9IGBjb25zdCBwb29sID0gcmVxdWlyZSgnLi4vZGIvc3FsX3Bvb2wuanMnKTtcXG5gO1xuICB9XG4gIHJldHVybiByZXF1aXJlU3RhdGVtZW50cztcbn1cblxuXG4vKipcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gYWxsIGNvbnN0YW50cyBuZWVkZWQgZm9yIGEgR3JhcGhRTCBzZXJ2ZXJcbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCkge1xuICByZXR1cm4gYFxuY29uc3QgeyBcbiAgR3JhcGhRTE9iamVjdFR5cGUsXG4gIEdyYXBoUUxTY2hlbWEsXG4gIEdyYXBoUUxJRCxcbiAgR3JhcGhRTFN0cmluZywgXG4gIEdyYXBoUUxJbnQsIFxuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTExpc3QsXG4gIEdyYXBoUUxOb25OdWxsXG59ID0gZ3JhcGhxbDtcbiAgXFxuYFxufVxuXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgR3JhcGhRTCB0eXBlIGNvZGUgZm9yIHRoZSBpbnB1dHRlZCB0YWJsZVxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxUeXBlU2NoZW1hKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGBjb25zdCAke3RhYmxlLnR5cGV9VHlwZSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifW5hbWU6ICcke3RhYmxlLnR5cGV9JyxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9ZmllbGRzOiAoKSA9PiAoe2A7XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpO1xuICByZXR1cm4gcXVlcnkgKz0gYFxcbiR7dGFifX0pXFxufSk7XFxuXFxuYDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGludGVyYXRlZCBvbi4gRWFjaCB0YWJsZSBjb25zaXN0cyBvZiBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbiBvYmplY3Qgb2YgYWxsIHRoZSB0YWJsZXMgY3JlYXRlZCBpbiB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gZWFjaCBmaWVsZCBmb3IgdGhlIEdyYXBoUUwgdHlwZS4gXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7IFxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChsZXQgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkrPSAnLCc7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWA7XG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpZWxkIGhhcyBhIHJlbGF0aW9uIHRvIGFub3RoZXIgZmllbGRcbiAgICBpZiAodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlbGF0aW9uLnRhYmxlSW5kZXggPiAtMSkge1xuICAgICAgcXVlcnkgKz0gY3JlYXRlU3ViUXVlcnkodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaXMgYSByZWxhdGlvbiBmb3IgYW5vdGhlciBmaWVsZFxuICAgIGNvbnN0IHJlZkJ5ID0gdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlZkJ5O1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJlZkJ5KSkge1xuICAgICAgcmVmQnkuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFZhbHVlID0gdmFsdWUuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgZmllbGQgPSB7XG4gICAgICAgICAgbmFtZTogdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLm5hbWUsXG4gICAgICAgICAgcmVsYXRpb246IHtcbiAgICAgICAgICAgIHRhYmxlSW5kZXg6IHBhcnNlZFZhbHVlWzBdLFxuICAgICAgICAgICAgZmllbGRJbmRleDogcGFyc2VkVmFsdWVbMV0sXG4gICAgICAgICAgICByZWZUeXBlOiBwYXJzZWRWYWx1ZVsyXSxcbiAgICAgICAgICAgIHR5cGU6IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS50eXBlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5OyBcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgaW5mb3JtYXRpb24gZm9yIHRoZSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHJldHVybnMge1N0cmluZ30gLSBhIGZpZWxkIGl0ZW0gKGV4OiAnaWQ6IHsgdHlwZTogR3JhcGhRTElEIH0nKVxuICovXG5mdW5jdGlvbiBidWlsZEZpZWxkSXRlbShmaWVsZCkge1xuICByZXR1cm4gIGAke2ZpZWxkLm5hbWV9OiB7IHR5cGU6ICR7Y2hlY2tGb3JSZXF1aXJlZChmaWVsZC5yZXF1aXJlZCwgJ2Zyb250Jyl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKGZpZWxkLm11bHRpcGxlVmFsdWVzLCAnZnJvbnQnKX0ke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoZmllbGQudHlwZSl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKGZpZWxkLm11bHRpcGxlVmFsdWVzLCAnYmFjaycpfSR7Y2hlY2tGb3JSZXF1aXJlZChmaWVsZC5yZXF1aXJlZCwgJ2JhY2snKX0gfWA7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIHRoZSBmaWVsZCB0eXBlIChJRCwgU3RyaW5nLCBOdW1iZXIsIEJvb2xlYW4sIG9yIEZsb2F0KVxuICogQHJldHVybnMge1N0cmluZ30gLSB0aGUgR3JhcGhRTCB0eXBlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZmllbGQgdHlwZSBlbnRlcmVkXG4gKi9cbmZ1bmN0aW9uIHRhYmxlVHlwZVRvR3JhcGhxbFR5cGUodHlwZSkge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdJRCc6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxJRCc7XG4gICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTFN0cmluZyc7XG4gICAgY2FzZSAnTnVtYmVyJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTEludCc7XG4gICAgY2FzZSAnQm9vbGVhbic6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxCb29sZWFuJztcbiAgICBjYXNlICdGbG9hdCc6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxGbG9hdCc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnR3JhcGhRTFN0cmluZyc7XG4gIH1cbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWZUeXBlTmFtZSAtIEFueSBzdHJpbmcgaW5wdXR0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gVGhlIHN0cmluZyBpbnB1dHRlZCwgYnV0IHdpdGggdGhlIGZpcnN0IGxldHRlciBjYXBpdGFsaXplZCBhbmQgdGhlIHJlc3QgbG93ZXJjYXNlZFxuICovXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSkge1xuICBsZXQgbmFtZSA9IHJlZlR5cGVOYW1lWzBdLnRvVXBwZXJDYXNlKCk7XG4gIG5hbWUgKz0gcmVmVHlwZU5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIG5hbWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZpZWxkIC0gZmllbGQgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbGwgdGhlIHRhYmxlcyBtYWRlIGJ5IHRoZSB1c2VyLiBcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQnVpbGRzIGEgc3ViIHR5cGUgZm9yIGFueSBmaWVsZCB3aXRoIGEgcmVsYXRpb24uIFxuICovXG5mdW5jdGlvbiBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBjb25zdCByZWZUeXBlTmFtZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS50eXBlO1xuICBjb25zdCByZWZGaWVsZE5hbWUgPSB0YWJsZXNbZmllbGQucmVsYXRpb24udGFibGVJbmRleF0uZmllbGRzW2ZpZWxkLnJlbGF0aW9uLmZpZWxkSW5kZXhdLm5hbWU7XG4gIGNvbnN0IHJlZkZpZWxkVHlwZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0udHlwZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke2NyZWF0ZVN1YlF1ZXJ5TmFtZShmaWVsZCwgcmVmVHlwZU5hbWUpfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6IGA7XG5cbiAgaWYgKGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09ICdvbmUgdG8gbWFueScgfHwgZmllbGQucmVsYXRpb24ucmVmVHlwZSA9PT0gJ21hbnkgdG8gbWFueScpIHtcbiAgICBxdWVyeSArPSBgbmV3IEdyYXBoUUxMaXN0KCR7cmVmVHlwZU5hbWV9VHlwZSksYDtcbiAgfSBlbHNlIHtcbiAgICBxdWVyeSArPSBgJHtyZWZUeXBlTmFtZX1UeXBlLGA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHtyZWZUeXBlTmFtZX0uJHtmaW5kRGJTZWFyY2hNZXRob2QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUpfWA7XG4gICAgcXVlcnkgKz0gYCgke2NyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpfSk7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifX1gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7cmVmVHlwZU5hbWV9XCIgV0hFUkUgXCIke3JlZkZpZWxkTmFtZX1cIiA9ICdcXCR7cGFyZW50LiR7ZmllbGQubmFtZX19JztcXGBcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoZmllbGQucmVsYXRpb24ucmVmVHlwZSlcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifX1gO1xuICB9XG4gIHJldHVybiBxdWVyeTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmVHlwZSAtIFRoZSByZWxhdGlvbiB0eXBlIG9mIHRoZSBzdWIgcXVlcnlcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gdGhlIGNvZGUgZm9yIGEgU1FMIHBvb2wgcXVlcnkuIFxuICovXG5mdW5jdGlvbiBidWlsZFNRTFBvb2xRdWVyeShyZWZUeXBlKSB7XG4gIGxldCByb3dzID0gJyc7IFxuICBpZiAocmVmVHlwZSA9PT0gJ29uZSB0byBvbmUnIHx8IHJlZlR5cGUgPT09ICdtYW55IHRvIG9uZScpIHJvd3MgPSAncm93c1swXSdcbiAgZWxzZSByb3dzID0gJ3Jvd3MnXG5cbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBwb29sLnF1ZXJ5KHNxbClcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4gcmVzLiR7cm93c30pXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycikpXFxuYFxuICByZXR1cm4gcXVlcnk7IFxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdWJRdWVyeU5hbWUoZmllbGQsIHJlZlR5cGVOYW1lKSB7XG4gIHN3aXRjaCAoZmllbGQucmVsYXRpb24ucmVmVHlwZSkge1xuICAgIGNhc2UgJ29uZSB0byBvbmUnOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdvbmUgdG8gbWFueSc6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSAnbWFueSB0byBvbmUnOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdtYW55IHRvIG1hbnknOlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZERiU2VhcmNoTWV0aG9kKHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCByZWZUeXBlKSB7XG4gIGlmIChyZWZGaWVsZE5hbWUgPT09ICdpZCcgfHwgcmVmRmllbGRUeXBlID09PSAnSUQnKSByZXR1cm4gJ2ZpbmRCeUlkJztcbiAgZWxzZSBpZiAocmVmVHlwZSA9PT0gJ29uZSB0byBvbmUnKSByZXR1cm4gJ2ZpbmRPbmUnO1xuICBlbHNlIHJldHVybiAnZmluZCc7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gJ2lkJyB8fCByZWZGaWVsZFR5cGUgPT09ICdJRCcpIHtcbiAgICByZXR1cm4gYHBhcmVudC4ke2ZpZWxkLm5hbWV9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYHsgJHtyZWZGaWVsZE5hbWV9OiBwYXJlbnQuJHtmaWVsZC5uYW1lfSB9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9ICcnO1xuXG4gIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKTtcblxuICBpZiAoISF0YWJsZS5maWVsZHNbMF0pIHtcbiAgICBxdWVyeSArPSBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSk7XG4gIH1cblxuICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1ldmVyeSR7dG9UaXRsZUNhc2UodGFibGUudHlwZSl9OiB7XFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogbmV3IEdyYXBoUUxMaXN0KCR7dGFibGUudHlwZX1UeXBlKSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKCkge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZCh7fSk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3RhYmxlLnR5cGV9XCI7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeSgnbWFueScpXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpdGVyYXRlZCBvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gZGF0YWJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gcm9vdCBxdWVyeSBjb2RlIHRvIGZpbmQgYW4gaW5kaXZpZHVhbCB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRCeUlkUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IGlkRmllbGROYW1lID0gdGFibGUuZmllbGRzWzBdLm5hbWU7XG4gIGxldCBxdWVyeSA9IGAsXFxuJHt0YWJ9JHt0YWJ9JHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0YWJsZS5maWVsZHNbMF0udHlwZSl9fX0sXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZChhcmdzLmlkKTtcXG5gO1xuICB9XG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3RhYmxlLnR5cGV9XCIgV0hFUkUgJHtpZEZpZWxkTmFtZX0gPSAnXFwke2FyZ3MuaWR9JztcXGA7XFxuYFxuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KCdvbmUgdG8gb25lJyk7IFxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke2FkZE11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9YDtcbiAgaWYgKHRhYmxlLmZpZWxkc1swXSkge1xuICAgIHN0cmluZyArPSBgLFxcbiR7dXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX0sXFxuYDtcbiAgICBzdHJpbmcgKz0gYCR7ZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICB9XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbE11dGF0aW9uKCkge1xuICBsZXQgc3RyaW5nID0gYGA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wuY29ubmVjdCgpXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKGNsaWVudCA9PiB7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBjbGllbnQucXVlcnkoc3FsKVxcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4ge1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jbGllbnQucmVsZWFzZSgpO1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcmVzLnJvd3NbMF07XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS5jYXRjaChlcnIgPT4ge1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jbGllbnQucmVsZWFzZSgpO1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICByZXR1cm4gc3RyaW5nOyBcbn1cblxuZnVuY3Rpb24gYWRkTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1hZGQke3RhYmxlLnR5cGV9OiB7XFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0odGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdKX1gO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn19LFxcbmBcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCAke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX0gPSBuZXcgJHt0YWJsZS50eXBlfShhcmdzKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX0uc2F2ZSgpO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBjb2x1bW5zID0gT2JqZWN0LmtleXMoYXJncykubWFwKGVsID0+IFxcYFwiXFwke2VsfVwiXFxgKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoYXJncykubWFwKGVsID0+IFxcYCdcXCR7ZWx9J1xcYCk7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBJTlNFUlQgSU5UTyBcIiR7dGFibGUudHlwZX1cIiAoXFwke2NvbHVtbnN9KSBWQUxVRVMgKFxcJHt2YWx1ZXN9KSBSRVRVUk5JTkcgKlxcYDtcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTsgXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn11cGRhdGUke3RhYmxlLnR5cGV9OiB7XFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0odGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdKX1gXG4gIH1cblxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9fSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFVwZGF0ZShhcmdzLmlkLCBhcmdzKTtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWxldCB1cGRhdGVWYWx1ZXMgPSAnJztcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWZvciAoY29uc3QgcHJvcCBpbiBhcmdzKSB7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1pZiAodXBkYXRlVmFsdWVzLmxlbmd0aCA+IDApIHVwZGF0ZVZhbHVlcyArPSBcXGAsIFxcYDtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXVwZGF0ZVZhbHVlcyArPSBcXGBcIlxcJHtwcm9wfVwiID0gJ1xcJHthcmdzW3Byb3BdfScgXFxgO1xcbmAgICAgXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifX1cXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFVQREFURSBcIiR7dGFibGUudHlwZX1cIiBTRVQgXFwke3VwZGF0ZVZhbHVlc30gV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7IFxuICB9XG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG5mdW5jdGlvbiBkZWxldGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgY29uc3QgaWRGaWVsZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWRlbGV0ZSR7dGFibGUudHlwZX06IHtcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0YWJsZS5maWVsZHNbMF0udHlwZSkgfX19LFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFJlbW92ZShhcmdzLmlkKTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgREVMRVRFIEZST00gXCIke3RhYmxlLnR5cGV9XCIgV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7IFxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yUmVxdWlyZWQocmVxdWlyZWQsIHBvc2l0aW9uKSB7XG4gIGlmIChyZXF1aXJlZCkge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2Zyb250Jykge1xuICAgICAgcmV0dXJuICduZXcgR3JhcGhRTE5vbk51bGwoJztcbiAgICB9XG4gICAgcmV0dXJuICcpJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMobXVsdGlwbGVWYWx1ZXMsIHBvc2l0aW9uKSB7XG4gIGlmIChtdWx0aXBsZVZhbHVlcykge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2Zyb250Jykge1xuICAgICAgcmV0dXJuICduZXcgR3JhcGhRTExpc3QoJztcbiAgICB9XG4gICAgcmV0dXJuICcpJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VHcmFwaHFsU2VydmVyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==