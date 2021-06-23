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
function parseGraphqlServer(tables, databases) {
  for (var _database in databases) {}

  // BUILD TYPE SCHEMA
  for (var tableIndex in tables) {
    query += buildGraphqlTypeSchema(tables[tableIndex], tables, database);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwidGFibGVzIiwiZGF0YWJhc2VzIiwiZGF0YWJhc2UiLCJ0YWJsZUluZGV4IiwicXVlcnkiLCJidWlsZEdyYXBocWxUeXBlU2NoZW1hIiwiZmlyc3RSb290TG9vcCIsImJ1aWxkR3JhcGhxbFJvb3RRdWVyeSIsImZpcnN0TXV0YXRpb25Mb29wIiwiYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSIsImJ1aWxkUmVxdWlyZVN0YXRlbWVudHMiLCJyZXF1aXJlU3RhdGVtZW50cyIsInR5cGUiLCJ0b0xvd2VyQ2FzZSIsImJ1aWxkR3JhcGhxbFZhcmlhYmxlcyIsInRhYmxlIiwiYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyIsImZpcnN0TG9vcCIsImZpZWxkSW5kZXgiLCJidWlsZEZpZWxkSXRlbSIsImZpZWxkcyIsInJlbGF0aW9uIiwiY3JlYXRlU3ViUXVlcnkiLCJyZWZCeSIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJwYXJzZWRWYWx1ZSIsInZhbHVlIiwic3BsaXQiLCJmaWVsZCIsIm5hbWUiLCJyZWZUeXBlIiwiY2hlY2tGb3JSZXF1aXJlZCIsInJlcXVpcmVkIiwiY2hlY2tGb3JNdWx0aXBsZVZhbHVlcyIsIm11bHRpcGxlVmFsdWVzIiwidGFibGVUeXBlVG9HcmFwaHFsVHlwZSIsInRvVGl0bGVDYXNlIiwicmVmVHlwZU5hbWUiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwicmVmRmllbGROYW1lIiwicmVmRmllbGRUeXBlIiwiY3JlYXRlU3ViUXVlcnlOYW1lIiwiZmluZERiU2VhcmNoTWV0aG9kIiwiY3JlYXRlU2VhcmNoT2JqZWN0IiwiYnVpbGRTUUxQb29sUXVlcnkiLCJyb3dzIiwiY3JlYXRlRmluZEFsbFJvb3RRdWVyeSIsImNyZWF0ZUZpbmRCeUlkUXVlcnkiLCJpZEZpZWxkTmFtZSIsInN0cmluZyIsImFkZE11dGF0aW9uIiwidXBkYXRlTXV0YXRpb24iLCJkZWxldGVNdXRhdGlvbiIsImJ1aWxkU1FMUG9vbE11dGF0aW9uIiwicG9zaXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxVQUFOOztBQUVBO0FBQ0EsU0FBU0Msa0JBQVQsQ0FBNEJDLE1BQTVCLEVBQW9DQyxTQUFwQyxFQUErQztBQUM3QyxPQUFLLElBQUlDLFNBQVQsSUFBcUJELFNBQXJCLEVBQWdDLENBRS9COztBQUdEO0FBQ0EsT0FBSyxJQUFNRSxVQUFYLElBQXlCSCxNQUF6QixFQUFpQztBQUMvQkksYUFBU0MsdUJBQXVCTCxPQUFPRyxVQUFQLENBQXZCLEVBQTJDSCxNQUEzQyxFQUFtREUsUUFBbkQsQ0FBVDtBQUNEOztBQUVEO0FBQ0FFLDJEQUF1RE4sR0FBdkQsa0NBQXFGQSxHQUFyRjs7QUFFQSxNQUFJUSxnQkFBZ0IsSUFBcEI7QUFDQSxPQUFLLElBQU1ILFdBQVgsSUFBeUJILE1BQXpCLEVBQWlDO0FBQy9CLFFBQUksQ0FBQ00sYUFBTCxFQUFvQkYsU0FBUyxLQUFUO0FBQ3BCRSxvQkFBZ0IsS0FBaEI7O0FBRUFGLGFBQVNHLHNCQUFzQlAsT0FBT0csV0FBUCxDQUF0QixFQUEwQ0QsUUFBMUMsQ0FBVDtBQUNEO0FBQ0RFLGtCQUFjTixHQUFkOztBQUVBO0FBQ0FNLDBEQUFzRE4sR0FBdEQsNkJBQStFQSxHQUEvRTs7QUFFQSxNQUFJVSxvQkFBb0IsSUFBeEI7QUFDQSxPQUFLLElBQU1MLFlBQVgsSUFBeUJILE1BQXpCLEVBQWlDO0FBQy9CLFFBQUksQ0FBQ1EsaUJBQUwsRUFBd0JKLFNBQVMsS0FBVDtBQUN4Qkksd0JBQW9CLEtBQXBCOztBQUVBSixhQUFTSywwQkFBMEJULE9BQU9HLFlBQVAsQ0FBMUIsRUFBOENELFFBQTlDLENBQVQ7QUFDRDtBQUNERSxrQkFBY04sR0FBZDs7QUFFQU0sc0RBQWtETixHQUFsRCwyQkFBMkVBLEdBQTNFO0FB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WixHQUFrQkEsR0FBbEIsR0FBd0JBLEdBQXhCLFdBQWlDQSxHQUFqQyxHQUF1Q0EsR0FBdkMsTUFBUDtBQUNEOztBQUVELFNBQVNtQyxnQkFBVCxDQUEwQkMsUUFBMUIsRUFBb0N1QixRQUFwQyxFQUE4QztBQUM1QyxNQUFJdkIsUUFBSixFQUFjO0FBQ1osUUFBSXVCLGFBQWEsT0FBakIsRUFBMEI7QUFDeEIsYUFBTyxxQkFBUDtBQUNEO0FBQ0QsV0FBTyxHQUFQO0FBQ0Q7QUFDRCxTQUFPLEVBQVA7QUFDRDs7QUFFRCxTQUFTdEIsc0JBQVQsQ0FBZ0NDLGNBQWhDLEVBQWdEcUIsUUFBaEQsRUFBMEQ7QUFDeEQsTUFBSXJCLGNBQUosRUFBb0I7QUFDbEIsUUFBSXFCLGFBQWEsT0FBakIsRUFBMEI7QUFDeEIsYUFBTyxrQkFBUDtBQUNEO0FBQ0QsV0FBTyxHQUFQO0FBQ0Q7QUFDRCxTQUFPLEVBQVA7QUFDRDs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQjVELGtCQUFqQixDIiwiZmlsZSI6Im1haW4uNzM3OWNmY2U5Y2ZmYTU5ZDY3YTguaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhYiA9IGAgIGA7XG5cbi8vIEZ1bmN0aW9uIHRoYXQgZXZva2VzIGFsbCBvdGhlciBoZWxwZXIgZnVuY3Rpb25zXG5mdW5jdGlvbiBwYXJzZUdyYXBocWxTZXJ2ZXIodGFibGVzLCBkYXRhYmFzZXMpIHtcbiAgZm9yIChsZXQgZGF0YWJhc2UgaW4gZGF0YWJhc2VzKSB7XG5cbiAgfVxuICBcblxuICAvLyBCVUlMRCBUWVBFIFNDSEVNQVxuICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSh0YWJsZXNbdGFibGVJbmRleF0sIHRhYmxlcywgZGF0YWJhc2UpO1xuICB9XG5cbiAgLy8gQlVJTEQgUk9PVCBRVUVSWVxuICBxdWVyeSArPSBgY29uc3QgUm9vdFF1ZXJ5ID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG4ke3RhYn1uYW1lOiAnUm9vdFF1ZXJ5VHlwZScsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RSb290TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICBpZiAoIWZpcnN0Um9vdExvb3ApIHF1ZXJ5ICs9ICcsXFxuJztcbiAgICBmaXJzdFJvb3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZSk7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIC8vIEJVSUxEIE1VVEFUSU9OU1xuICBxdWVyeSArPSBgY29uc3QgTXV0YXRpb24gPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdNdXRhdGlvbicsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RNdXRhdGlvbkxvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgaWYgKCFmaXJzdE11dGF0aW9uTG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TXV0YXRpb25Mb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBidWlsZEdyYXBocWxNdXRhdGlvblF1ZXJ5KHRhYmxlc1t0YWJsZUluZGV4XSwgZGF0YWJhc2UpO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn19XFxufSk7XFxuXFxuYDtcblxuICBxdWVyeSArPSBgbW9kdWxlLmV4cG9ydHMgPSBuZXcgR3JhcGhRTFNjaGVtYSh7XFxuJHt0YWJ9cXVlcnk6IFJvb3RRdWVyeSxcXG4ke3RhYn1tdXRhdGlvbjogTXV0YXRpb25cXG59KTtgO1xuICByZXR1cm4gcXVlcnk7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBSZXByZXNlbnRzIHRoZSBkYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIEFsbCB0aGUgcmVxdWlyZSBzdGF0ZW1lbnRzIG5lZWRlZCBmb3IgdGhlIEdyYXBoUUwgc2VydmVyLlxuICovXG5mdW5jdGlvbiBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHJlcXVpcmVTdGF0ZW1lbnRzID0gXCJjb25zdCBncmFwaHFsID0gcmVxdWlyZSgnZ3JhcGhxbCcpO1xcblwiO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0ICR7dGFibGVzW3RhYmxlSW5kZXhdLnR5cGV9ID0gcmVxdWlyZSgnLi4vZGIvJHt0YWJsZXNbdGFibGVJbmRleF0udHlwZS50b0xvd2VyQ2FzZSgpfS5qcycpO1xcbmA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcXVpcmVTdGF0ZW1lbnRzICs9IGBjb25zdCBwb29sID0gcmVxdWlyZSgnLi4vZGIvc3FsX3Bvb2wuanMnKTtcXG5gO1xuICB9XG4gIHJldHVybiByZXF1aXJlU3RhdGVtZW50cztcbn1cblxuXG4vKipcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gYWxsIGNvbnN0YW50cyBuZWVkZWQgZm9yIGEgR3JhcGhRTCBzZXJ2ZXJcbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCkge1xuICByZXR1cm4gYFxuY29uc3QgeyBcbiAgR3JhcGhRTE9iamVjdFR5cGUsXG4gIEdyYXBoUUxTY2hlbWEsXG4gIEdyYXBoUUxJRCxcbiAgR3JhcGhRTFN0cmluZywgXG4gIEdyYXBoUUxJbnQsIFxuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTExpc3QsXG4gIEdyYXBoUUxOb25OdWxsXG59ID0gZ3JhcGhxbDtcbiAgXFxuYFxufVxuXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgR3JhcGhRTCB0eXBlIGNvZGUgZm9yIHRoZSBpbnB1dHRlZCB0YWJsZVxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxUeXBlU2NoZW1hKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGBjb25zdCAke3RhYmxlLnR5cGV9VHlwZSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifW5hbWU6ICcke3RhYmxlLnR5cGV9JyxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9ZmllbGRzOiAoKSA9PiAoe2A7XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpO1xuICByZXR1cm4gcXVlcnkgKz0gYFxcbiR7dGFifX0pXFxufSk7XFxuXFxuYDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGludGVyYXRlZCBvbi4gRWFjaCB0YWJsZSBjb25zaXN0cyBvZiBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbiBvYmplY3Qgb2YgYWxsIHRoZSB0YWJsZXMgY3JlYXRlZCBpbiB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gZWFjaCBmaWVsZCBmb3IgdGhlIEdyYXBoUUwgdHlwZS4gXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7IFxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChsZXQgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkrPSAnLCc7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWA7XG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpZWxkIGhhcyBhIHJlbGF0aW9uIHRvIGFub3RoZXIgZmllbGRcbiAgICBpZiAodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlbGF0aW9uLnRhYmxlSW5kZXggPiAtMSkge1xuICAgICAgcXVlcnkgKz0gY3JlYXRlU3ViUXVlcnkodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaXMgYSByZWxhdGlvbiBmb3IgYW5vdGhlciBmaWVsZFxuICAgIGNvbnN0IHJlZkJ5ID0gdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlZkJ5O1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJlZkJ5KSkge1xuICAgICAgcmVmQnkuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFZhbHVlID0gdmFsdWUuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgZmllbGQgPSB7XG4gICAgICAgICAgbmFtZTogdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLm5hbWUsXG4gICAgICAgICAgcmVsYXRpb246IHtcbiAgICAgICAgICAgIHRhYmxlSW5kZXg6IHBhcnNlZFZhbHVlWzBdLFxuICAgICAgICAgICAgZmllbGRJbmRleDogcGFyc2VkVmFsdWVbMV0sXG4gICAgICAgICAgICByZWZUeXBlOiBwYXJzZWRWYWx1ZVsyXSxcbiAgICAgICAgICAgIHR5cGU6IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS50eXBlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5OyBcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgaW5mb3JtYXRpb24gZm9yIHRoZSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHJldHVybnMge1N0cmluZ30gLSBhIGZpZWxkIGl0ZW0gKGV4OiAnaWQ6IHsgdHlwZTogR3JhcGhRTElEIH0nKVxuICovXG5mdW5jdGlvbiBidWlsZEZpZWxkSXRlbShmaWVsZCkge1xuICByZXR1cm4gIGAke2ZpZWxkLm5hbWV9OiB7IHR5cGU6ICR7Y2hlY2tGb3JSZXF1aXJlZChmaWVsZC5yZXF1aXJlZCwgJ2Zyb250Jyl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKGZpZWxkLm11bHRpcGxlVmFsdWVzLCAnZnJvbnQnKX0ke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoZmllbGQudHlwZSl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKGZpZWxkLm11bHRpcGxlVmFsdWVzLCAnYmFjaycpfSR7Y2hlY2tGb3JSZXF1aXJlZChmaWVsZC5yZXF1aXJlZCwgJ2JhY2snKX0gfWA7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIHRoZSBmaWVsZCB0eXBlIChJRCwgU3RyaW5nLCBOdW1iZXIsIEJvb2xlYW4sIG9yIEZsb2F0KVxuICogQHJldHVybnMge1N0cmluZ30gLSB0aGUgR3JhcGhRTCB0eXBlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZmllbGQgdHlwZSBlbnRlcmVkXG4gKi9cbmZ1bmN0aW9uIHRhYmxlVHlwZVRvR3JhcGhxbFR5cGUodHlwZSkge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdJRCc6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxJRCc7XG4gICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTFN0cmluZyc7XG4gICAgY2FzZSAnTnVtYmVyJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTEludCc7XG4gICAgY2FzZSAnQm9vbGVhbic6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxCb29sZWFuJztcbiAgICBjYXNlICdGbG9hdCc6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxGbG9hdCc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnR3JhcGhRTFN0cmluZyc7XG4gIH1cbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWZUeXBlTmFtZSAtIEFueSBzdHJpbmcgaW5wdXR0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gVGhlIHN0cmluZyBpbnB1dHRlZCwgYnV0IHdpdGggdGhlIGZpcnN0IGxldHRlciBjYXBpdGFsaXplZCBhbmQgdGhlIHJlc3QgbG93ZXJjYXNlZFxuICovXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSkge1xuICBsZXQgbmFtZSA9IHJlZlR5cGVOYW1lWzBdLnRvVXBwZXJDYXNlKCk7XG4gIG5hbWUgKz0gcmVmVHlwZU5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIG5hbWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZpZWxkIC0gZmllbGQgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbGwgdGhlIHRhYmxlcyBtYWRlIGJ5IHRoZSB1c2VyLiBcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQnVpbGRzIGEgc3ViIHR5cGUgZm9yIGFueSBmaWVsZCB3aXRoIGEgcmVsYXRpb24uIFxuICovXG5mdW5jdGlvbiBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBjb25zdCByZWZUeXBlTmFtZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS50eXBlO1xuICBjb25zdCByZWZGaWVsZE5hbWUgPSB0YWJsZXNbZmllbGQucmVsYXRpb24udGFibGVJbmRleF0uZmllbGRzW2ZpZWxkLnJlbGF0aW9uLmZpZWxkSW5kZXhdLm5hbWU7XG4gIGNvbnN0IHJlZkZpZWxkVHlwZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0udHlwZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke2NyZWF0ZVN1YlF1ZXJ5TmFtZShmaWVsZCwgcmVmVHlwZU5hbWUpfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6IGA7XG5cbiAgaWYgKGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09ICdvbmUgdG8gbWFueScgfHwgZmllbGQucmVsYXRpb24ucmVmVHlwZSA9PT0gJ21hbnkgdG8gbWFueScpIHtcbiAgICBxdWVyeSArPSBgbmV3IEdyYXBoUUxMaXN0KCR7cmVmVHlwZU5hbWV9VHlwZSksYDtcbiAgfSBlbHNlIHtcbiAgICBxdWVyeSArPSBgJHtyZWZUeXBlTmFtZX1UeXBlLGA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHtyZWZUeXBlTmFtZX0uJHtmaW5kRGJTZWFyY2hNZXRob2QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUpfWA7XG4gICAgcXVlcnkgKz0gYCgke2NyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpfSk7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifX1gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7cmVmVHlwZU5hbWV9XCIgV0hFUkUgXCIke3JlZkZpZWxkTmFtZX1cIiA9ICdcXCR7cGFyZW50LiR7ZmllbGQubmFtZX19JztcXGBcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoZmllbGQucmVsYXRpb24ucmVmVHlwZSlcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifX1gO1xuICB9XG4gIHJldHVybiBxdWVyeTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmVHlwZSAtIFRoZSByZWxhdGlvbiB0eXBlIG9mIHRoZSBzdWIgcXVlcnlcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gdGhlIGNvZGUgZm9yIGEgU1FMIHBvb2wgcXVlcnkuIFxuICovXG5mdW5jdGlvbiBidWlsZFNRTFBvb2xRdWVyeShyZWZUeXBlKSB7XG4gIGxldCByb3dzID0gJyc7IFxuICBpZiAocmVmVHlwZSA9PT0gJ29uZSB0byBvbmUnIHx8IHJlZlR5cGUgPT09ICdtYW55IHRvIG9uZScpIHJvd3MgPSAncm93c1swXSdcbiAgZWxzZSByb3dzID0gJ3Jvd3MnXG5cbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBwb29sLnF1ZXJ5KHNxbClcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4gcmVzLiR7cm93c30pXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycikpXFxuYFxuICByZXR1cm4gcXVlcnk7IFxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdWJRdWVyeU5hbWUoZmllbGQsIHJlZlR5cGVOYW1lKSB7XG4gIHN3aXRjaCAoZmllbGQucmVsYXRpb24ucmVmVHlwZSkge1xuICAgIGNhc2UgJ29uZSB0byBvbmUnOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdvbmUgdG8gbWFueSc6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSAnbWFueSB0byBvbmUnOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdtYW55IHRvIG1hbnknOlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZERiU2VhcmNoTWV0aG9kKHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCByZWZUeXBlKSB7XG4gIGlmIChyZWZGaWVsZE5hbWUgPT09ICdpZCcgfHwgcmVmRmllbGRUeXBlID09PSAnSUQnKSByZXR1cm4gJ2ZpbmRCeUlkJztcbiAgZWxzZSBpZiAocmVmVHlwZSA9PT0gJ29uZSB0byBvbmUnKSByZXR1cm4gJ2ZpbmRPbmUnO1xuICBlbHNlIHJldHVybiAnZmluZCc7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gJ2lkJyB8fCByZWZGaWVsZFR5cGUgPT09ICdJRCcpIHtcbiAgICByZXR1cm4gYHBhcmVudC4ke2ZpZWxkLm5hbWV9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYHsgJHtyZWZGaWVsZE5hbWV9OiBwYXJlbnQuJHtmaWVsZC5uYW1lfSB9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9ICcnO1xuXG4gIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKTtcblxuICBpZiAoISF0YWJsZS5maWVsZHNbMF0pIHtcbiAgICBxdWVyeSArPSBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSk7XG4gIH1cblxuICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1ldmVyeSR7dG9UaXRsZUNhc2UodGFibGUudHlwZSl9OiB7XFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogbmV3IEdyYXBoUUxMaXN0KCR7dGFibGUudHlwZX1UeXBlKSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKCkge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZCh7fSk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3RhYmxlLnR5cGV9XCI7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeSgnbWFueScpXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpdGVyYXRlZCBvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gZGF0YWJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gcm9vdCBxdWVyeSBjb2RlIHRvIGZpbmQgYW4gaW5kaXZpZHVhbCB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRCeUlkUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IGlkRmllbGROYW1lID0gdGFibGUuZmllbGRzWzBdLm5hbWU7XG4gIGxldCBxdWVyeSA9IGAsXFxuJHt0YWJ9JHt0YWJ9JHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0YWJsZS5maWVsZHNbMF0udHlwZSl9fX0sXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZChhcmdzLmlkKTtcXG5gO1xuICB9XG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3RhYmxlLnR5cGV9XCIgV0hFUkUgJHtpZEZpZWxkTmFtZX0gPSAnXFwke2FyZ3MuaWR9JztcXGA7XFxuYFxuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KCdvbmUgdG8gb25lJyk7IFxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke2FkZE11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9YDtcbiAgaWYgKHRhYmxlLmZpZWxkc1swXSkge1xuICAgIHN0cmluZyArPSBgLFxcbiR7dXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX0sXFxuYDtcbiAgICBzdHJpbmcgKz0gYCR7ZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICB9XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbE11dGF0aW9uKCkge1xuICBsZXQgc3RyaW5nID0gYGA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wuY29ubmVjdCgpXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKGNsaWVudCA9PiB7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBjbGllbnQucXVlcnkoc3FsKVxcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4ge1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jbGllbnQucmVsZWFzZSgpO1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcmVzLnJvd3NbMF07XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS5jYXRjaChlcnIgPT4ge1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jbGllbnQucmVsZWFzZSgpO1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICByZXR1cm4gc3RyaW5nOyBcbn1cblxuZnVuY3Rpb24gYWRkTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1hZGQke3RhYmxlLnR5cGV9OiB7XFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0odGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdKX1gO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn19LFxcbmBcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCAke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX0gPSBuZXcgJHt0YWJsZS50eXBlfShhcmdzKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX0uc2F2ZSgpO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBjb2x1bW5zID0gT2JqZWN0LmtleXMoYXJncykubWFwKGVsID0+IFxcYFwiXFwke2VsfVwiXFxgKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoYXJncykubWFwKGVsID0+IFxcYCdcXCR7ZWx9J1xcYCk7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBJTlNFUlQgSU5UTyBcIiR7dGFibGUudHlwZX1cIiAoXFwke2NvbHVtbnN9KSBWQUxVRVMgKFxcJHt2YWx1ZXN9KSBSRVRVUk5JTkcgKlxcYDtcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTsgXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn11cGRhdGUke3RhYmxlLnR5cGV9OiB7XFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0odGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdKX1gXG4gIH1cblxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9fSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFVwZGF0ZShhcmdzLmlkLCBhcmdzKTtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWxldCB1cGRhdGVWYWx1ZXMgPSAnJztcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWZvciAoY29uc3QgcHJvcCBpbiBhcmdzKSB7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1pZiAodXBkYXRlVmFsdWVzLmxlbmd0aCA+IDApIHVwZGF0ZVZhbHVlcyArPSBcXGAsIFxcYDtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXVwZGF0ZVZhbHVlcyArPSBcXGBcIlxcJHtwcm9wfVwiID0gJ1xcJHthcmdzW3Byb3BdfScgXFxgO1xcbmAgICAgXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifX1cXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFVQREFURSBcIiR7dGFibGUudHlwZX1cIiBTRVQgXFwke3VwZGF0ZVZhbHVlc30gV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7IFxuICB9XG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG5mdW5jdGlvbiBkZWxldGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgY29uc3QgaWRGaWVsZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWRlbGV0ZSR7dGFibGUudHlwZX06IHtcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0YWJsZS5maWVsZHNbMF0udHlwZSkgfX19LFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFJlbW92ZShhcmdzLmlkKTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgREVMRVRFIEZST00gXCIke3RhYmxlLnR5cGV9XCIgV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7IFxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yUmVxdWlyZWQocmVxdWlyZWQsIHBvc2l0aW9uKSB7XG4gIGlmIChyZXF1aXJlZCkge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2Zyb250Jykge1xuICAgICAgcmV0dXJuICduZXcgR3JhcGhRTE5vbk51bGwoJztcbiAgICB9XG4gICAgcmV0dXJuICcpJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMobXVsdGlwbGVWYWx1ZXMsIHBvc2l0aW9uKSB7XG4gIGlmIChtdWx0aXBsZVZhbHVlcykge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2Zyb250Jykge1xuICAgICAgcmV0dXJuICduZXcgR3JhcGhRTExpc3QoJztcbiAgICB9XG4gICAgcmV0dXJuICcpJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VHcmFwaHFsU2VydmVyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==