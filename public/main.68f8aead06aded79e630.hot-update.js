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
  for (var _database in databases) {
    // database.data is same as database.tables
    query += buildRequireStatements(_database.data, _database.databaseName);
  }
  query += buildGraphqlVariables();

  // BUILD TYPE SCHEMA
  for (var _database2 in databases) {
    for (var tableIndex in _database2.data) {
      query += buildGraphqlTypeSchema(_database2.data[tableIndex], tables, _database2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwiZGF0YWJhc2VzIiwicXVlcnkiLCJkYXRhYmFzZSIsImJ1aWxkUmVxdWlyZVN0YXRlbWVudHMiLCJkYXRhIiwiZGF0YWJhc2VOYW1lIiwiYnVpbGRHcmFwaHFsVmFyaWFibGVzIiwidGFibGVJbmRleCIsImJ1aWxkR3JhcGhxbFR5cGVTY2hlbWEiLCJ0YWJsZXMiLCJmaXJzdFJvb3RMb29wIiwiYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5IiwiZmlyc3RNdXRhdGlvbkxvb3AiLCJidWlsZEdyYXBocWxNdXRhdGlvblF1ZXJ5IiwicmVxdWlyZVN0YXRlbWVudHMiLCJ0eXBlIiwidG9Mb3dlckNhc2UiLCJ0YWJsZSIsImJ1aWxkR3JhcGhRTFR5cGVGaWVsZHMiLCJmaXJzdExvb3AiLCJmaWVsZEluZGV4IiwiYnVpbGRGaWVsZEl0ZW0iLCJmaWVsZHMiLCJyZWxhdGlvbiIsImNyZWF0ZVN1YlF1ZXJ5IiwicmVmQnkiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwicGFyc2VkVmFsdWUiLCJ2YWx1ZSIsInNwbGl0IiwiZmllbGQiLCJuYW1lIiwicmVmVHlwZSIsImNoZWNrRm9yUmVxdWlyZWQiLCJyZXF1aXJlZCIsImNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMiLCJtdWx0aXBsZVZhbHVlcyIsInRhYmxlVHlwZVRvR3JhcGhxbFR5cGUiLCJ0b1RpdGxlQ2FzZSIsInJlZlR5cGVOYW1lIiwidG9VcHBlckNhc2UiLCJzbGljZSIsInJlZkZpZWxkTmFtZSIsInJlZkZpZWxkVHlwZSIsImNyZWF0ZVN1YlF1ZXJ5TmFtZSIsImZpbmREYlNlYXJjaE1ldGhvZCIsImNyZWF0ZVNlYXJjaE9iamVjdCIsImJ1aWxkU1FMUG9vbFF1ZXJ5Iiwicm93cyIsImNyZWF0ZUZpbmRBbGxSb290UXVlcnkiLCJjcmVhdGVGaW5kQnlJZFF1ZXJ5IiwiaWRGaWVsZE5hbWUiLCJzdHJpbmciLCJhZGRNdXRhdGlvbiIsInVwZGF0ZU11dGF0aW9uIiwiZGVsZXRlTXV0YXRpb24iLCJidWlsZFNRTFBvb2xNdXRhdGlvbiIsInBvc2l0aW9uIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsVUFBTjs7QUFFQTtBQUNBLFNBQVNDLGtCQUFULENBQTRCQyxTQUE1QixFQUF1QztBQUNyQyxNQUFJQyxRQUFRLEVBQVo7QUFDQSxPQUFLLElBQU1DLFNBQVgsSUFBdUJGLFNBQXZCLEVBQWtDO0FBQ2hDO0FBQ0FDLGFBQVNFLHVCQUF1QkQsVUFBU0UsSUFBaEMsRUFBc0NGLFVBQVNHLFlBQS9DLENBQVQ7QUFDRDtBQUNESixXQUFTSyx1QkFBVDs7QUFHQTtBQUNBLE9BQUssSUFBTUosVUFBWCxJQUF1QkYsU0FBdkIsRUFBa0M7QUFDaEMsU0FBSyxJQUFNTyxVQUFYLElBQXlCTCxXQUFTRSxJQUFsQyxFQUF3QztBQUN0Q0gsZUFBU08sdUJBQXVCTixXQUFTRSxJQUFULENBQWNHLFVBQWQsQ0FBdkIsRUFBa0RFLE1BQWxELEVBQTBEUCxVQUExRCxDQUFUO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBRCwyREFBdURILEdBQXZELGtDQUFxRkEsR0FBckY7O0FBRUEsTUFBSVksZ0JBQWdCLElBQXBCO0FBQ0EsT0FBSyxJQUFNSCxXQUFYLElBQXlCRSxNQUF6QixFQUFpQztBQUMvQixRQUFJLENBQUNDLGFBQUwsRUFBb0JULFNBQVMsS0FBVDtBQUNwQlMsb0JBQWdCLEtBQWhCOztBQUVBVCxhQUFTVSxzQkFBc0JGLE9BQU9GLFdBQVAsQ0FBdEIsRUFBMENMLFFBQTFDLENBQVQ7QUFDRDtBQUNERCxrQkFBY0gsR0FBZDs7QUFFQTtBQUNBRywwREFBc0RILEdBQXRELDZCQUErRUEsR0FBL0U7O0FBRUEsTUFBSWMsb0JBQW9CLElBQXhCO0FBQ0EsT0FBSyxJQUFNTCxZQUFYLElBQXlCRSxNQUF6QixFQUFpQztBQUMv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QUFNRixJQUFqRDtBQUNEOztBQUVELE1BQUliLGFBQWEsT0FBYixJQUF3QkEsYUFBYSxZQUF6QyxFQUF1RDtBQUNyREQsa0JBQVlILEdBQVosR0FBa0JBLEdBQWxCLEdBQXdCQSxHQUF4QixHQUE4QkEsR0FBOUIsa0NBQStEbUIsTUFBTUYsSUFBckU7QUFDQWQsYUFBU3lELHNCQUFUO0FBQ0Q7O0FBRUQsU0FBT3pELGNBQVlILEdBQVosR0FBa0JBLEdBQWxCLEdBQXdCQSxHQUF4QixXQUFpQ0EsR0FBakMsR0FBdUNBLEdBQXZDLE1BQVA7QUFDRDs7QUFFRCxTQUFTcUMsZ0JBQVQsQ0FBMEJDLFFBQTFCLEVBQW9DdUIsUUFBcEMsRUFBOEM7QUFDNUMsTUFBSXZCLFFBQUosRUFBYztBQUNaLFFBQUl1QixhQUFhLE9BQWpCLEVBQTBCO0FBQ3hCLGFBQU8scUJBQVA7QUFDRDtBQUNELFdBQU8sR0FBUDtBQUNEO0FBQ0QsU0FBTyxFQUFQO0FBQ0Q7O0FBRUQsU0FBU3RCLHNCQUFULENBQWdDQyxjQUFoQyxFQUFnRHFCLFFBQWhELEVBQTBEO0FBQ3hELE1BQUlyQixjQUFKLEVBQW9CO0FBQ2xCLFFBQUlxQixhQUFhLE9BQWpCLEVBQTBCO0FBQ3hCLGFBQU8sa0JBQVA7QUFDRDtBQUNELFdBQU8sR0FBUDtBQUNEO0FBQ0QsU0FBTyxFQUFQO0FBQ0Q7O0FBRURDLE9BQU9DLE9BQVAsR0FBaUI5RCxrQkFBakIsQyIsImZpbGUiOiJtYWluLjY4ZjhhZWFkMDZhZGVkNzllNjMwLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0YWIgPSBgICBgO1xuXG4vLyBGdW5jdGlvbiB0aGF0IGV2b2tlcyBhbGwgb3RoZXIgaGVscGVyIGZ1bmN0aW9uc1xuZnVuY3Rpb24gcGFyc2VHcmFwaHFsU2VydmVyKGRhdGFiYXNlcykge1xuICBsZXQgcXVlcnkgPSAnJztcbiAgZm9yIChjb25zdCBkYXRhYmFzZSBpbiBkYXRhYmFzZXMpIHsgIFxuICAgIC8vIGRhdGFiYXNlLmRhdGEgaXMgc2FtZSBhcyBkYXRhYmFzZS50YWJsZXNcbiAgICBxdWVyeSArPSBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKGRhdGFiYXNlLmRhdGEsIGRhdGFiYXNlLmRhdGFiYXNlTmFtZSk7XG4gIH1cbiAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCk7XG4gIFxuXG4gIC8vIEJVSUxEIFRZUEUgU0NIRU1BXG4gIGZvciAoY29uc3QgZGF0YWJhc2UgaW4gZGF0YWJhc2VzKSB7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIGRhdGFiYXNlLmRhdGEpIHtcbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbFR5cGVTY2hlbWEoZGF0YWJhc2UuZGF0YVt0YWJsZUluZGV4XSwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQlVJTEQgUk9PVCBRVUVSWVxuICBxdWVyeSArPSBgY29uc3QgUm9vdFF1ZXJ5ID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG4ke3RhYn1uYW1lOiAnUm9vdFF1ZXJ5VHlwZScsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RSb290TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICBpZiAoIWZpcnN0Um9vdExvb3ApIHF1ZXJ5ICs9ICcsXFxuJztcbiAgICBmaXJzdFJvb3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZSk7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIC8vIEJVSUxEIE1VVEFUSU9OU1xuICBxdWVyeSArPSBgY29uc3QgTXV0YXRpb24gPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdNdXRhdGlvbicsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RNdXRhdGlvbkxvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgaWYgKCFmaXJzdE11dGF0aW9uTG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TXV0YXRpb25Mb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBidWlsZEdyYXBocWxNdXRhdGlvblF1ZXJ5KHRhYmxlc1t0YWJsZUluZGV4XSwgZGF0YWJhc2UpO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn19XFxufSk7XFxuXFxuYDtcblxuICBxdWVyeSArPSBgbW9kdWxlLmV4cG9ydHMgPSBuZXcgR3JhcGhRTFNjaGVtYSh7XFxuJHt0YWJ9cXVlcnk6IFJvb3RRdWVyeSxcXG4ke3RhYn1tdXRhdGlvbjogTXV0YXRpb25cXG59KTtgO1xuICByZXR1cm4gcXVlcnk7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBSZXByZXNlbnRzIHRoZSBkYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIEFsbCB0aGUgcmVxdWlyZSBzdGF0ZW1lbnRzIG5lZWRlZCBmb3IgdGhlIEdyYXBoUUwgc2VydmVyLlxuICovXG5mdW5jdGlvbiBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHJlcXVpcmVTdGF0ZW1lbnRzID0gXCJjb25zdCBncmFwaHFsID0gcmVxdWlyZSgnZ3JhcGhxbCcpO1xcblwiO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0ICR7dGFibGVzW3RhYmxlSW5kZXhdLnR5cGV9ID0gcmVxdWlyZSgnLi4vZGIvJHt0YWJsZXNbdGFibGVJbmRleF0udHlwZS50b0xvd2VyQ2FzZSgpfS5qcycpO1xcbmA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcXVpcmVTdGF0ZW1lbnRzICs9IGBjb25zdCBwb29sID0gcmVxdWlyZSgnLi4vZGIvc3FsX3Bvb2wuanMnKTtcXG5gO1xuICB9XG4gIHJldHVybiByZXF1aXJlU3RhdGVtZW50cztcbn1cblxuXG4vKipcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gYWxsIGNvbnN0YW50cyBuZWVkZWQgZm9yIGEgR3JhcGhRTCBzZXJ2ZXJcbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCkge1xuICByZXR1cm4gYFxuY29uc3QgeyBcbiAgR3JhcGhRTE9iamVjdFR5cGUsXG4gIEdyYXBoUUxTY2hlbWEsXG4gIEdyYXBoUUxJRCxcbiAgR3JhcGhRTFN0cmluZywgXG4gIEdyYXBoUUxJbnQsIFxuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTExpc3QsXG4gIEdyYXBoUUxOb25OdWxsXG59ID0gZ3JhcGhxbDtcbiAgXFxuYFxufVxuXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgR3JhcGhRTCB0eXBlIGNvZGUgZm9yIHRoZSBpbnB1dHRlZCB0YWJsZVxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxUeXBlU2NoZW1hKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGBjb25zdCAke3RhYmxlLnR5cGV9VHlwZSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifW5hbWU6ICcke3RhYmxlLnR5cGV9JyxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9ZmllbGRzOiAoKSA9PiAoe2A7XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpO1xuICByZXR1cm4gcXVlcnkgKz0gYFxcbiR7dGFifX0pXFxufSk7XFxuXFxuYDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGludGVyYXRlZCBvbi4gRWFjaCB0YWJsZSBjb25zaXN0cyBvZiBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbiBvYmplY3Qgb2YgYWxsIHRoZSB0YWJsZXMgY3JlYXRlZCBpbiB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gZWFjaCBmaWVsZCBmb3IgdGhlIEdyYXBoUUwgdHlwZS4gXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7IFxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChsZXQgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkrPSAnLCc7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWA7XG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpZWxkIGhhcyBhIHJlbGF0aW9uIHRvIGFub3RoZXIgZmllbGRcbiAgICBpZiAodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlbGF0aW9uLnRhYmxlSW5kZXggPiAtMSkge1xuICAgICAgcXVlcnkgKz0gY3JlYXRlU3ViUXVlcnkodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaXMgYSByZWxhdGlvbiBmb3IgYW5vdGhlciBmaWVsZFxuICAgIGNvbnN0IHJlZkJ5ID0gdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlZkJ5O1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJlZkJ5KSkge1xuICAgICAgcmVmQnkuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFZhbHVlID0gdmFsdWUuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgZmllbGQgPSB7XG4gICAgICAgICAgbmFtZTogdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLm5hbWUsXG4gICAgICAgICAgcmVsYXRpb246IHtcbiAgICAgICAgICAgIHRhYmxlSW5kZXg6IHBhcnNlZFZhbHVlWzBdLFxuICAgICAgICAgICAgZmllbGRJbmRleDogcGFyc2VkVmFsdWVbMV0sXG4gICAgICAgICAgICByZWZUeXBlOiBwYXJzZWRWYWx1ZVsyXSxcbiAgICAgICAgICAgIHR5cGU6IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS50eXBlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5OyBcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgaW5mb3JtYXRpb24gZm9yIHRoZSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHJldHVybnMge1N0cmluZ30gLSBhIGZpZWxkIGl0ZW0gKGV4OiAnaWQ6IHsgdHlwZTogR3JhcGhRTElEIH0nKVxuICovXG5mdW5jdGlvbiBidWlsZEZpZWxkSXRlbShmaWVsZCkge1xuICByZXR1cm4gIGAke2ZpZWxkLm5hbWV9OiB7IHR5cGU6ICR7Y2hlY2tGb3JSZXF1aXJlZChmaWVsZC5yZXF1aXJlZCwgJ2Zyb250Jyl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKGZpZWxkLm11bHRpcGxlVmFsdWVzLCAnZnJvbnQnKX0ke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoZmllbGQudHlwZSl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKGZpZWxkLm11bHRpcGxlVmFsdWVzLCAnYmFjaycpfSR7Y2hlY2tGb3JSZXF1aXJlZChmaWVsZC5yZXF1aXJlZCwgJ2JhY2snKX0gfWA7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIHRoZSBmaWVsZCB0eXBlIChJRCwgU3RyaW5nLCBOdW1iZXIsIEJvb2xlYW4sIG9yIEZsb2F0KVxuICogQHJldHVybnMge1N0cmluZ30gLSB0aGUgR3JhcGhRTCB0eXBlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZmllbGQgdHlwZSBlbnRlcmVkXG4gKi9cbmZ1bmN0aW9uIHRhYmxlVHlwZVRvR3JhcGhxbFR5cGUodHlwZSkge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdJRCc6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxJRCc7XG4gICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTFN0cmluZyc7XG4gICAgY2FzZSAnTnVtYmVyJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTEludCc7XG4gICAgY2FzZSAnQm9vbGVhbic6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxCb29sZWFuJztcbiAgICBjYXNlICdGbG9hdCc6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxGbG9hdCc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnR3JhcGhRTFN0cmluZyc7XG4gIH1cbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWZUeXBlTmFtZSAtIEFueSBzdHJpbmcgaW5wdXR0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gVGhlIHN0cmluZyBpbnB1dHRlZCwgYnV0IHdpdGggdGhlIGZpcnN0IGxldHRlciBjYXBpdGFsaXplZCBhbmQgdGhlIHJlc3QgbG93ZXJjYXNlZFxuICovXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSkge1xuICBsZXQgbmFtZSA9IHJlZlR5cGVOYW1lWzBdLnRvVXBwZXJDYXNlKCk7XG4gIG5hbWUgKz0gcmVmVHlwZU5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIG5hbWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZpZWxkIC0gZmllbGQgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbGwgdGhlIHRhYmxlcyBtYWRlIGJ5IHRoZSB1c2VyLiBcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQnVpbGRzIGEgc3ViIHR5cGUgZm9yIGFueSBmaWVsZCB3aXRoIGEgcmVsYXRpb24uIFxuICovXG5mdW5jdGlvbiBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBjb25zdCByZWZUeXBlTmFtZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS50eXBlO1xuICBjb25zdCByZWZGaWVsZE5hbWUgPSB0YWJsZXNbZmllbGQucmVsYXRpb24udGFibGVJbmRleF0uZmllbGRzW2ZpZWxkLnJlbGF0aW9uLmZpZWxkSW5kZXhdLm5hbWU7XG4gIGNvbnN0IHJlZkZpZWxkVHlwZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0udHlwZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke2NyZWF0ZVN1YlF1ZXJ5TmFtZShmaWVsZCwgcmVmVHlwZU5hbWUpfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6IGA7XG5cbiAgaWYgKGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09ICdvbmUgdG8gbWFueScgfHwgZmllbGQucmVsYXRpb24ucmVmVHlwZSA9PT0gJ21hbnkgdG8gbWFueScpIHtcbiAgICBxdWVyeSArPSBgbmV3IEdyYXBoUUxMaXN0KCR7cmVmVHlwZU5hbWV9VHlwZSksYDtcbiAgfSBlbHNlIHtcbiAgICBxdWVyeSArPSBgJHtyZWZUeXBlTmFtZX1UeXBlLGA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHtyZWZUeXBlTmFtZX0uJHtmaW5kRGJTZWFyY2hNZXRob2QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUpfWA7XG4gICAgcXVlcnkgKz0gYCgke2NyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpfSk7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifX1gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7cmVmVHlwZU5hbWV9XCIgV0hFUkUgXCIke3JlZkZpZWxkTmFtZX1cIiA9ICdcXCR7cGFyZW50LiR7ZmllbGQubmFtZX19JztcXGBcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoZmllbGQucmVsYXRpb24ucmVmVHlwZSlcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifX1gO1xuICB9XG4gIHJldHVybiBxdWVyeTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmVHlwZSAtIFRoZSByZWxhdGlvbiB0eXBlIG9mIHRoZSBzdWIgcXVlcnlcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gdGhlIGNvZGUgZm9yIGEgU1FMIHBvb2wgcXVlcnkuIFxuICovXG5mdW5jdGlvbiBidWlsZFNRTFBvb2xRdWVyeShyZWZUeXBlKSB7XG4gIGxldCByb3dzID0gJyc7IFxuICBpZiAocmVmVHlwZSA9PT0gJ29uZSB0byBvbmUnIHx8IHJlZlR5cGUgPT09ICdtYW55IHRvIG9uZScpIHJvd3MgPSAncm93c1swXSdcbiAgZWxzZSByb3dzID0gJ3Jvd3MnXG5cbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBwb29sLnF1ZXJ5KHNxbClcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4gcmVzLiR7cm93c30pXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycikpXFxuYFxuICByZXR1cm4gcXVlcnk7IFxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdWJRdWVyeU5hbWUoZmllbGQsIHJlZlR5cGVOYW1lKSB7XG4gIHN3aXRjaCAoZmllbGQucmVsYXRpb24ucmVmVHlwZSkge1xuICAgIGNhc2UgJ29uZSB0byBvbmUnOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdvbmUgdG8gbWFueSc6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSAnbWFueSB0byBvbmUnOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdtYW55IHRvIG1hbnknOlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZERiU2VhcmNoTWV0aG9kKHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCByZWZUeXBlKSB7XG4gIGlmIChyZWZGaWVsZE5hbWUgPT09ICdpZCcgfHwgcmVmRmllbGRUeXBlID09PSAnSUQnKSByZXR1cm4gJ2ZpbmRCeUlkJztcbiAgZWxzZSBpZiAocmVmVHlwZSA9PT0gJ29uZSB0byBvbmUnKSByZXR1cm4gJ2ZpbmRPbmUnO1xuICBlbHNlIHJldHVybiAnZmluZCc7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gJ2lkJyB8fCByZWZGaWVsZFR5cGUgPT09ICdJRCcpIHtcbiAgICByZXR1cm4gYHBhcmVudC4ke2ZpZWxkLm5hbWV9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYHsgJHtyZWZGaWVsZE5hbWV9OiBwYXJlbnQuJHtmaWVsZC5uYW1lfSB9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9ICcnO1xuXG4gIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKTtcblxuICBpZiAoISF0YWJsZS5maWVsZHNbMF0pIHtcbiAgICBxdWVyeSArPSBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSk7XG4gIH1cblxuICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1ldmVyeSR7dG9UaXRsZUNhc2UodGFibGUudHlwZSl9OiB7XFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogbmV3IEdyYXBoUUxMaXN0KCR7dGFibGUudHlwZX1UeXBlKSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKCkge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZCh7fSk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3RhYmxlLnR5cGV9XCI7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeSgnbWFueScpXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpdGVyYXRlZCBvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gZGF0YWJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gcm9vdCBxdWVyeSBjb2RlIHRvIGZpbmQgYW4gaW5kaXZpZHVhbCB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRCeUlkUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IGlkRmllbGROYW1lID0gdGFibGUuZmllbGRzWzBdLm5hbWU7XG4gIGxldCBxdWVyeSA9IGAsXFxuJHt0YWJ9JHt0YWJ9JHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0YWJsZS5maWVsZHNbMF0udHlwZSl9fX0sXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZChhcmdzLmlkKTtcXG5gO1xuICB9XG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3RhYmxlLnR5cGV9XCIgV0hFUkUgJHtpZEZpZWxkTmFtZX0gPSAnXFwke2FyZ3MuaWR9JztcXGA7XFxuYFxuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KCdvbmUgdG8gb25lJyk7IFxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke2FkZE11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9YDtcbiAgaWYgKHRhYmxlLmZpZWxkc1swXSkge1xuICAgIHN0cmluZyArPSBgLFxcbiR7dXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX0sXFxuYDtcbiAgICBzdHJpbmcgKz0gYCR7ZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICB9XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbE11dGF0aW9uKCkge1xuICBsZXQgc3RyaW5nID0gYGA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wuY29ubmVjdCgpXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKGNsaWVudCA9PiB7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBjbGllbnQucXVlcnkoc3FsKVxcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4ge1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jbGllbnQucmVsZWFzZSgpO1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcmVzLnJvd3NbMF07XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS5jYXRjaChlcnIgPT4ge1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jbGllbnQucmVsZWFzZSgpO1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICByZXR1cm4gc3RyaW5nOyBcbn1cblxuZnVuY3Rpb24gYWRkTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1hZGQke3RhYmxlLnR5cGV9OiB7XFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0odGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdKX1gO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn19LFxcbmBcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCAke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX0gPSBuZXcgJHt0YWJsZS50eXBlfShhcmdzKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX0uc2F2ZSgpO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBjb2x1bW5zID0gT2JqZWN0LmtleXMoYXJncykubWFwKGVsID0+IFxcYFwiXFwke2VsfVwiXFxgKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoYXJncykubWFwKGVsID0+IFxcYCdcXCR7ZWx9J1xcYCk7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBJTlNFUlQgSU5UTyBcIiR7dGFibGUudHlwZX1cIiAoXFwke2NvbHVtbnN9KSBWQUxVRVMgKFxcJHt2YWx1ZXN9KSBSRVRVUk5JTkcgKlxcYDtcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTsgXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn11cGRhdGUke3RhYmxlLnR5cGV9OiB7XFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0odGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdKX1gXG4gIH1cblxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9fSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFVwZGF0ZShhcmdzLmlkLCBhcmdzKTtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWxldCB1cGRhdGVWYWx1ZXMgPSAnJztcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWZvciAoY29uc3QgcHJvcCBpbiBhcmdzKSB7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1pZiAodXBkYXRlVmFsdWVzLmxlbmd0aCA+IDApIHVwZGF0ZVZhbHVlcyArPSBcXGAsIFxcYDtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXVwZGF0ZVZhbHVlcyArPSBcXGBcIlxcJHtwcm9wfVwiID0gJ1xcJHthcmdzW3Byb3BdfScgXFxgO1xcbmAgICAgXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifX1cXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFVQREFURSBcIiR7dGFibGUudHlwZX1cIiBTRVQgXFwke3VwZGF0ZVZhbHVlc30gV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7IFxuICB9XG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG5mdW5jdGlvbiBkZWxldGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgY29uc3QgaWRGaWVsZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWRlbGV0ZSR7dGFibGUudHlwZX06IHtcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0YWJsZS5maWVsZHNbMF0udHlwZSkgfX19LFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFJlbW92ZShhcmdzLmlkKTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgREVMRVRFIEZST00gXCIke3RhYmxlLnR5cGV9XCIgV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7IFxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yUmVxdWlyZWQocmVxdWlyZWQsIHBvc2l0aW9uKSB7XG4gIGlmIChyZXF1aXJlZCkge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2Zyb250Jykge1xuICAgICAgcmV0dXJuICduZXcgR3JhcGhRTE5vbk51bGwoJztcbiAgICB9XG4gICAgcmV0dXJuICcpJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMobXVsdGlwbGVWYWx1ZXMsIHBvc2l0aW9uKSB7XG4gIGlmIChtdWx0aXBsZVZhbHVlcykge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2Zyb250Jykge1xuICAgICAgcmV0dXJuICduZXcgR3JhcGhRTExpc3QoJztcbiAgICB9XG4gICAgcmV0dXJuICcpJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VHcmFwaHFsU2VydmVyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==