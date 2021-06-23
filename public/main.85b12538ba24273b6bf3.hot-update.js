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
function parseGraphqlServer(tables, database) {
  var query = '';
  for (var _database in databases) {
    query += buildRequireStatements(tables, _database);
  }
  query += buildGraphqlVariables();

  // BUILD TYPE SCHEMA
  for (var _database2 in databases) {
    for (var tableIndex in tables) {
      query += buildGraphqlTypeSchema(tables[tableIndex], tables, _database2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwidGFibGVzIiwiZGF0YWJhc2UiLCJxdWVyeSIsImRhdGFiYXNlcyIsImJ1aWxkUmVxdWlyZVN0YXRlbWVudHMiLCJidWlsZEdyYXBocWxWYXJpYWJsZXMiLCJ0YWJsZUluZGV4IiwiYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSIsImZpcnN0Um9vdExvb3AiLCJidWlsZEdyYXBocWxSb290UXVlcnkiLCJmaXJzdE11dGF0aW9uTG9vcCIsImJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkiLCJyZXF1aXJlU3RhdGVtZW50cyIsInR5cGUiLCJ0b0xvd2VyQ2FzZSIsInRhYmxlIiwiYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyIsImZpcnN0TG9vcCIsImZpZWxkSW5kZXgiLCJidWlsZEZpZWxkSXRlbSIsImZpZWxkcyIsInJlbGF0aW9uIiwiY3JlYXRlU3ViUXVlcnkiLCJyZWZCeSIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJwYXJzZWRWYWx1ZSIsInZhbHVlIiwic3BsaXQiLCJmaWVsZCIsIm5hbWUiLCJyZWZUeXBlIiwiY2hlY2tGb3JSZXF1aXJlZCIsInJlcXVpcmVkIiwiY2hlY2tGb3JNdWx0aXBsZVZhbHVlcyIsIm11bHRpcGxlVmFsdWVzIiwidGFibGVUeXBlVG9HcmFwaHFsVHlwZSIsInRvVGl0bGVDYXNlIiwicmVmVHlwZU5hbWUiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwicmVmRmllbGROYW1lIiwicmVmRmllbGRUeXBlIiwiY3JlYXRlU3ViUXVlcnlOYW1lIiwiZmluZERiU2VhcmNoTWV0aG9kIiwiY3JlYXRlU2VhcmNoT2JqZWN0IiwiYnVpbGRTUUxQb29sUXVlcnkiLCJyb3dzIiwiY3JlYXRlRmluZEFsbFJvb3RRdWVyeSIsImNyZWF0ZUZpbmRCeUlkUXVlcnkiLCJpZEZpZWxkTmFtZSIsInN0cmluZyIsImFkZE11dGF0aW9uIiwidXBkYXRlTXV0YXRpb24iLCJkZWxldGVNdXRhdGlvbiIsImJ1aWxkU1FMUG9vbE11dGF0aW9uIiwicG9zaXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxVQUFOOztBQUVBO0FBQ0EsU0FBU0Msa0JBQVQsQ0FBNEJDLE1BQTVCLEVBQW9DQyxRQUFwQyxFQUE4QztBQUM1QyxNQUFJQyxRQUFRLEVBQVo7QUFDQSxPQUFLLElBQU1ELFNBQVgsSUFBdUJFLFNBQXZCLEVBQWtDO0FBQ2hDRCxhQUFTRSx1QkFBdUJKLE1BQXZCLEVBQStCQyxTQUEvQixDQUFUO0FBQ0Q7QUFDREMsV0FBU0csdUJBQVQ7O0FBR0E7QUFDQSxPQUFLLElBQU1KLFVBQVgsSUFBdUJFLFNBQXZCLEVBQWtDO0FBQ2hDLFNBQUssSUFBTUcsVUFBWCxJQUF5Qk4sTUFBekIsRUFBaUM7QUFDL0JFLGVBQVNLLHVCQUF1QlAsT0FBT00sVUFBUCxDQUF2QixFQUEyQ04sTUFBM0MsRUFBbURDLFVBQW5ELENBQVQ7QUFDRDtBQUNGOztBQUVEO0FBQ0FDLDJEQUF1REosR0FBdkQsa0NBQXFGQSxHQUFyRjs7QUFFQSxNQUFJVSxnQkFBZ0IsSUFBcEI7QUFDQSxPQUFLLElBQU1GLFdBQVgsSUFBeUJOLE1BQXpCLEVBQWlDO0FBQy9CLFFBQUksQ0FBQ1EsYUFBTCxFQUFvQk4sU0FBUyxLQUFUO0FBQ3BCTSxvQkFBZ0IsS0FBaEI7O0FBRUFOLGFBQVNPLHNCQUFzQlQsT0FBT00sV0FBUCxDQUF0QixFQUEwQ0wsUUFBMUMsQ0FBVDtBQUNEO0FBQ0RDLGtCQUFjSixHQUFkOztBQUVBO0FBQ0FJLDBEQUFzREosR0FBdEQsNkJBQStFQSxHQUEvRTs7QUFFQSxNQUFJWSxvQkFBb0IsSUFBeEI7QUFDQSxPQUFLLElBQU1KLFlBQVgsSUFBeUJOLE1BQXpCLEVBQWlDO0FBQy9CLFFBQUksQ0FBQ1UsaUJBQUwsRUFBd0JSLFNBQVMsS0FBVDtBQUN4QlEs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O0FBQ3JEQyxrQkFBWUosR0FBWixHQUFrQkEsR0FBbEIsR0FBd0JBLEdBQXhCLEdBQThCQSxHQUE5QixrQ0FBK0RpQixNQUFNRixJQUFyRTtBQUNBWCxhQUFTc0Qsc0JBQVQ7QUFDRDs7QUFFRCxTQUFPdEQsY0FBWUosR0FBWixHQUFrQkEsR0FBbEIsR0FBd0JBLEdBQXhCLFdBQWlDQSxHQUFqQyxHQUF1Q0EsR0FBdkMsTUFBUDtBQUNEOztBQUVELFNBQVNtQyxnQkFBVCxDQUEwQkMsUUFBMUIsRUFBb0N1QixRQUFwQyxFQUE4QztBQUM1QyxNQUFJdkIsUUFBSixFQUFjO0FBQ1osUUFBSXVCLGFBQWEsT0FBakIsRUFBMEI7QUFDeEIsYUFBTyxxQkFBUDtBQUNEO0FBQ0QsV0FBTyxHQUFQO0FBQ0Q7QUFDRCxTQUFPLEVBQVA7QUFDRDs7QUFFRCxTQUFTdEIsc0JBQVQsQ0FBZ0NDLGNBQWhDLEVBQWdEcUIsUUFBaEQsRUFBMEQ7QUFDeEQsTUFBSXJCLGNBQUosRUFBb0I7QUFDbEIsUUFBSXFCLGFBQWEsT0FBakIsRUFBMEI7QUFDeEIsYUFBTyxrQkFBUDtBQUNEO0FBQ0QsV0FBTyxHQUFQO0FBQ0Q7QUFDRCxTQUFPLEVBQVA7QUFDRDs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQjVELGtCQUFqQixDIiwiZmlsZSI6Im1haW4uODViMTI1MzhiYTI0MjczYjZiZjMuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhYiA9IGAgIGA7XG5cbi8vIEZ1bmN0aW9uIHRoYXQgZXZva2VzIGFsbCBvdGhlciBoZWxwZXIgZnVuY3Rpb25zXG5mdW5jdGlvbiBwYXJzZUdyYXBocWxTZXJ2ZXIodGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSAnJztcbiAgZm9yIChjb25zdCBkYXRhYmFzZSBpbiBkYXRhYmFzZXMpIHsgIFxuICAgIHF1ZXJ5ICs9IGJ1aWxkUmVxdWlyZVN0YXRlbWVudHModGFibGVzLCBkYXRhYmFzZSk7XG4gIH1cbiAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCk7XG4gIFxuXG4gIC8vIEJVSUxEIFRZUEUgU0NIRU1BXG4gIGZvciAoY29uc3QgZGF0YWJhc2UgaW4gZGF0YWJhc2VzKSB7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSh0YWJsZXNbdGFibGVJbmRleF0sIHRhYmxlcywgZGF0YWJhc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEJVSUxEIFJPT1QgUVVFUllcbiAgcXVlcnkgKz0gYGNvbnN0IFJvb3RRdWVyeSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuJHt0YWJ9bmFtZTogJ1Jvb3RRdWVyeVR5cGUnLFxcbiR7dGFifWZpZWxkczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0Um9vdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgaWYgKCFmaXJzdFJvb3RMb29wKSBxdWVyeSArPSAnLFxcbic7XG4gICAgZmlyc3RSb290TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5KHRhYmxlc1t0YWJsZUluZGV4XSwgZGF0YWJhc2UpO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn19XFxufSk7XFxuXFxuYDtcblxuICAvLyBCVUlMRCBNVVRBVElPTlNcbiAgcXVlcnkgKz0gYGNvbnN0IE11dGF0aW9uID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG4ke3RhYn1uYW1lOiAnTXV0YXRpb24nLFxcbiR7dGFifWZpZWxkczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TXV0YXRpb25Mb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgIGlmICghZmlyc3RNdXRhdGlvbkxvb3ApIHF1ZXJ5ICs9ICcsXFxuJztcbiAgICBmaXJzdE11dGF0aW9uTG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSh0YWJsZXNbdGFibGVJbmRleF0sIGRhdGFiYXNlKTtcbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9fVxcbn0pO1xcblxcbmA7XG5cbiAgcXVlcnkgKz0gYG1vZHVsZS5leHBvcnRzID0gbmV3IEdyYXBoUUxTY2hlbWEoe1xcbiR7dGFifXF1ZXJ5OiBSb290UXVlcnksXFxuJHt0YWJ9bXV0YXRpb246IE11dGF0aW9uXFxufSk7YDtcbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gUmVwcmVzZW50cyB0aGUgZGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBBbGwgdGhlIHJlcXVpcmUgc3RhdGVtZW50cyBuZWVkZWQgZm9yIHRoZSBHcmFwaFFMIHNlcnZlci5cbiAqL1xuZnVuY3Rpb24gYnVpbGRSZXF1aXJlU3RhdGVtZW50cyh0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCByZXF1aXJlU3RhdGVtZW50cyA9IFwiY29uc3QgZ3JhcGhxbCA9IHJlcXVpcmUoJ2dyYXBocWwnKTtcXG5cIjtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICAgIHJlcXVpcmVTdGF0ZW1lbnRzICs9IGBjb25zdCAke3RhYmxlc1t0YWJsZUluZGV4XS50eXBlfSA9IHJlcXVpcmUoJy4uL2RiLyR7dGFibGVzW3RhYmxlSW5kZXhdLnR5cGUudG9Mb3dlckNhc2UoKX0uanMnKTtcXG5gO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXF1aXJlU3RhdGVtZW50cyArPSBgY29uc3QgcG9vbCA9IHJlcXVpcmUoJy4uL2RiL3NxbF9wb29sLmpzJyk7XFxuYDtcbiAgfVxuICByZXR1cm4gcmVxdWlyZVN0YXRlbWVudHM7XG59XG5cblxuLyoqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIGFsbCBjb25zdGFudHMgbmVlZGVkIGZvciBhIEdyYXBoUUwgc2VydmVyXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFZhcmlhYmxlcygpIHtcbiAgcmV0dXJuIGBcbmNvbnN0IHsgXG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMU2NoZW1hLFxuICBHcmFwaFFMSUQsXG4gIEdyYXBoUUxTdHJpbmcsIFxuICBHcmFwaFFMSW50LCBcbiAgR3JhcGhRTEJvb2xlYW4sXG4gIEdyYXBoUUxMaXN0LFxuICBHcmFwaFFMTm9uTnVsbFxufSA9IGdyYXBocWw7XG4gIFxcbmBcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGludGVyYXRlZCBvbi4gRWFjaCB0YWJsZSBjb25zaXN0cyBvZiBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbiBvYmplY3Qgb2YgYWxsIHRoZSB0YWJsZXMgY3JlYXRlZCBpbiB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gVGhlIEdyYXBoUUwgdHlwZSBjb2RlIGZvciB0aGUgaW5wdXR0ZWQgdGFibGVcbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBgY29uc3QgJHt0YWJsZS50eXBlfVR5cGUgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn1uYW1lOiAnJHt0YWJsZS50eXBlfScsXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifWZpZWxkczogKCkgPT4gKHtgO1xuICBxdWVyeSArPSBidWlsZEdyYXBoUUxUeXBlRmllbGRzKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgcmV0dXJuIHF1ZXJ5ICs9IGBcXG4ke3RhYn19KVxcbn0pO1xcblxcbmA7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpbnRlcmF0ZWQgb24uIEVhY2ggdGFibGUgY29uc2lzdHMgb2YgZmllbGRzXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGVzIC0gYW4gb2JqZWN0IG9mIGFsbCB0aGUgdGFibGVzIGNyZWF0ZWQgaW4gdGhlIGFwcGxpY2F0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBEYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIGVhY2ggZmllbGQgZm9yIHRoZSBHcmFwaFFMIHR5cGUuIFxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBoUUxUeXBlRmllbGRzKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9ICcnOyBcbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAobGV0IGZpZWxkSW5kZXggaW4gdGFibGUuZmllbGRzKSB7XG4gICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5Kz0gJywnO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0odGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdKX1gO1xuICAgIC8vIGNoZWNrIGlmIHRoZSBmaWVsZCBoYXMgYSByZWxhdGlvbiB0byBhbm90aGVyIGZpZWxkXG4gICAgaWYgKHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS5yZWxhdGlvbi50YWJsZUluZGV4ID4gLTEpIHtcbiAgICAgIHF1ZXJ5ICs9IGNyZWF0ZVN1YlF1ZXJ5KHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XSwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpZWxkIGlzIGEgcmVsYXRpb24gZm9yIGFub3RoZXIgZmllbGRcbiAgICBjb25zdCByZWZCeSA9IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS5yZWZCeTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZWZCeSkpIHtcbiAgICAgIHJlZkJ5LmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICBjb25zdCBwYXJzZWRWYWx1ZSA9IHZhbHVlLnNwbGl0KCcuJyk7XG4gICAgICAgIGNvbnN0IGZpZWxkID0ge1xuICAgICAgICAgIG5hbWU6IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS5uYW1lLFxuICAgICAgICAgIHJlbGF0aW9uOiB7XG4gICAgICAgICAgICB0YWJsZUluZGV4OiBwYXJzZWRWYWx1ZVswXSxcbiAgICAgICAgICAgIGZpZWxkSW5kZXg6IHBhcnNlZFZhbHVlWzFdLFxuICAgICAgICAgICAgcmVmVHlwZTogcGFyc2VkVmFsdWVbMl0sXG4gICAgICAgICAgICB0eXBlOiB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0udHlwZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcXVlcnkgKz0gY3JlYXRlU3ViUXVlcnkoZmllbGQsIHRhYmxlcywgZGF0YWJhc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBxdWVyeTsgXG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gZmllbGQgLSBhbiBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGluZm9ybWF0aW9uIGZvciB0aGUgZmllbGQgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gYSBmaWVsZCBpdGVtIChleDogJ2lkOiB7IHR5cGU6IEdyYXBoUUxJRCB9JylcbiAqL1xuZnVuY3Rpb24gYnVpbGRGaWVsZEl0ZW0oZmllbGQpIHtcbiAgcmV0dXJuICBgJHtmaWVsZC5uYW1lfTogeyB0eXBlOiAke2NoZWNrRm9yUmVxdWlyZWQoZmllbGQucmVxdWlyZWQsICdmcm9udCcpfSR7Y2hlY2tGb3JNdWx0aXBsZVZhbHVlcyhmaWVsZC5tdWx0aXBsZVZhbHVlcywgJ2Zyb250Jyl9JHt0YWJsZVR5cGVUb0dyYXBocWxUeXBlKGZpZWxkLnR5cGUpfSR7Y2hlY2tGb3JNdWx0aXBsZVZhbHVlcyhmaWVsZC5tdWx0aXBsZVZhbHVlcywgJ2JhY2snKX0ke2NoZWNrRm9yUmVxdWlyZWQoZmllbGQucmVxdWlyZWQsICdiYWNrJyl9IH1gO1xufVxuXG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSB0aGUgZmllbGQgdHlwZSAoSUQsIFN0cmluZywgTnVtYmVyLCBCb29sZWFuLCBvciBGbG9hdClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gdGhlIEdyYXBoUUwgdHlwZSBhc3NvY2lhdGVkIHdpdGggdGhlIGZpZWxkIHR5cGUgZW50ZXJlZFxuICovXG5mdW5jdGlvbiB0YWJsZVR5cGVUb0dyYXBocWxUeXBlKHR5cGUpIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnSUQnOlxuICAgICAgcmV0dXJuICdHcmFwaFFMSUQnO1xuICAgIGNhc2UgJ1N0cmluZyc6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxTdHJpbmcnO1xuICAgIGNhc2UgJ051bWJlcic6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxJbnQnO1xuICAgIGNhc2UgJ0Jvb2xlYW4nOlxuICAgICAgcmV0dXJuICdHcmFwaFFMQm9vbGVhbic7XG4gICAgY2FzZSAnRmxvYXQnOlxuICAgICAgcmV0dXJuICdHcmFwaFFMRmxvYXQnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxTdHJpbmcnO1xuICB9XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmVHlwZU5hbWUgLSBBbnkgc3RyaW5nIGlucHV0dGVkXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIFRoZSBzdHJpbmcgaW5wdXR0ZWQsIGJ1dCB3aXRoIHRoZSBmaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWQgYW5kIHRoZSByZXN0IGxvd2VyY2FzZWRcbiAqL1xuZnVuY3Rpb24gdG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpIHtcbiAgbGV0IG5hbWUgPSByZWZUeXBlTmFtZVswXS50b1VwcGVyQ2FzZSgpO1xuICBuYW1lICs9IHJlZlR5cGVOYW1lLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBuYW1lO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGZpZWxkIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGVzIC0gYWxsIHRoZSB0YWJsZXMgbWFkZSBieSB0aGUgdXNlci4gXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBEYXRiYXNlIHNlbGVjdGVkXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIEJ1aWxkcyBhIHN1YiB0eXBlIGZvciBhbnkgZmllbGQgd2l0aCBhIHJlbGF0aW9uLiBcbiAqL1xuZnVuY3Rpb24gY3JlYXRlU3ViUXVlcnkoZmllbGQsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgY29uc3QgcmVmVHlwZU5hbWUgPSB0YWJsZXNbZmllbGQucmVsYXRpb24udGFibGVJbmRleF0udHlwZTtcbiAgY29uc3QgcmVmRmllbGROYW1lID0gdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLmZpZWxkc1tmaWVsZC5yZWxhdGlvbi5maWVsZEluZGV4XS5uYW1lO1xuICBjb25zdCByZWZGaWVsZFR5cGUgPSB0YWJsZXNbZmllbGQucmVsYXRpb24udGFibGVJbmRleF0uZmllbGRzW2ZpZWxkLnJlbGF0aW9uLmZpZWxkSW5kZXhdLnR5cGU7XG4gIGxldCBxdWVyeSA9IGAsXFxuJHt0YWJ9JHt0YWJ9JHtjcmVhdGVTdWJRdWVyeU5hbWUoZmllbGQsIHJlZlR5cGVOYW1lKX06IHtcXG4ke3RhYn0ke3RhYn0ke3RhYn10eXBlOiBgO1xuXG4gIGlmIChmaWVsZC5yZWxhdGlvbi5yZWZUeXBlID09PSAnb25lIHRvIG1hbnknIHx8IGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09ICdtYW55IHRvIG1hbnknKSB7XG4gICAgcXVlcnkgKz0gYG5ldyBHcmFwaFFMTGlzdCgke3JlZlR5cGVOYW1lfVR5cGUpLGA7XG4gIH0gZWxzZSB7XG4gICAgcXVlcnkgKz0gYCR7cmVmVHlwZU5hbWV9VHlwZSxgO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7cmVmVHlwZU5hbWV9LiR7ZmluZERiU2VhcmNoTWV0aG9kKHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCBmaWVsZC5yZWxhdGlvbi5yZWZUeXBlKX1gO1xuICAgIHF1ZXJ5ICs9IGAoJHtjcmVhdGVTZWFyY2hPYmplY3QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIGZpZWxkKX0pO1xcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn19YDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3JlZlR5cGVOYW1lfVwiIFdIRVJFIFwiJHtyZWZGaWVsZE5hbWV9XCIgPSAnXFwke3BhcmVudC4ke2ZpZWxkLm5hbWV9fSc7XFxgXFxuYFxuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUpXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn19YDtcbiAgfVxuICByZXR1cm4gcXVlcnk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlZlR5cGUgLSBUaGUgcmVsYXRpb24gdHlwZSBvZiB0aGUgc3ViIHF1ZXJ5XG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHRoZSBjb2RlIGZvciBhIFNRTCBwb29sIHF1ZXJ5LiBcbiAqL1xuZnVuY3Rpb24gYnVpbGRTUUxQb29sUXVlcnkocmVmVHlwZSkge1xuICBsZXQgcm93cyA9ICcnOyBcbiAgaWYgKHJlZlR5cGUgPT09ICdvbmUgdG8gb25lJyB8fCByZWZUeXBlID09PSAnbWFueSB0byBvbmUnKSByb3dzID0gJ3Jvd3NbMF0nXG4gIGVsc2Ugcm93cyA9ICdyb3dzJ1xuXG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcG9vbC5xdWVyeShzcWwpXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LnRoZW4ocmVzID0+IHJlcy4ke3Jvd3N9KVxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coJ0Vycm9yOiAnLCBlcnIpKVxcbmBcbiAgcmV0dXJuIHF1ZXJ5OyBcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3ViUXVlcnlOYW1lKGZpZWxkLCByZWZUeXBlTmFtZSkge1xuICBzd2l0Y2ggKGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUpIHtcbiAgICBjYXNlICdvbmUgdG8gb25lJzpcbiAgICAgIHJldHVybiBgcmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSAnb25lIHRvIG1hbnknOlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGNhc2UgJ21hbnkgdG8gb25lJzpcbiAgICAgIHJldHVybiBgcmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSAnbWFueSB0byBtYW55JzpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmREYlNlYXJjaE1ldGhvZChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgcmVmVHlwZSkge1xuICBpZiAocmVmRmllbGROYW1lID09PSAnaWQnIHx8IHJlZkZpZWxkVHlwZSA9PT0gJ0lEJykgcmV0dXJuICdmaW5kQnlJZCc7XG4gIGVsc2UgaWYgKHJlZlR5cGUgPT09ICdvbmUgdG8gb25lJykgcmV0dXJuICdmaW5kT25lJztcbiAgZWxzZSByZXR1cm4gJ2ZpbmQnO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTZWFyY2hPYmplY3QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIGZpZWxkKSB7XG4gIGlmIChyZWZGaWVsZE5hbWUgPT09ICdpZCcgfHwgcmVmRmllbGRUeXBlID09PSAnSUQnKSB7XG4gICAgcmV0dXJuIGBwYXJlbnQuJHtmaWVsZC5uYW1lfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGB7ICR7cmVmRmllbGROYW1lfTogcGFyZW50LiR7ZmllbGQubmFtZX0gfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSAnJztcblxuICBxdWVyeSArPSBjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSk7XG5cbiAgaWYgKCEhdGFibGUuZmllbGRzWzBdKSB7XG4gICAgcXVlcnkgKz0gY3JlYXRlRmluZEJ5SWRRdWVyeSh0YWJsZSwgZGF0YWJhc2UpO1xuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9ZXZlcnkke3RvVGl0bGVDYXNlKHRhYmxlLnR5cGUpfToge1xcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6IG5ldyBHcmFwaFFMTGlzdCgke3RhYmxlLnR5cGV9VHlwZSksXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZSgpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmQoe30pO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBTRUxFQ1QgKiBGUk9NIFwiJHt0YWJsZS50eXBlfVwiO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoJ21hbnknKVxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIGRhdGFiYXNlIHNlbGVjdGVkXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHJvb3QgcXVlcnkgY29kZSB0byBmaW5kIGFuIGluZGl2aWR1YWwgdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBjb25zdCBpZEZpZWxkTmFtZSA9IHRhYmxlLmZpZWxkc1swXS5uYW1lO1xuICBsZXQgcXVlcnkgPSBgLFxcbiR7dGFifSR7dGFifSR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfToge1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczogeyAke2lkRmllbGROYW1lfTogeyB0eXBlOiAke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUodGFibGUuZmllbGRzWzBdLnR5cGUpfX19LFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZEJ5SWQoYXJncy5pZCk7XFxuYDtcbiAgfVxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBTRUxFQ1QgKiBGUk9NIFwiJHt0YWJsZS50eXBlfVwiIFdIRVJFICR7aWRGaWVsZE5hbWV9ID0gJ1xcJHthcmdzLmlkfSc7XFxgO1xcbmBcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeSgnb25lIHRvIG9uZScpOyBcbiAgfVxuXG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG5mdW5jdGlvbiBidWlsZEdyYXBocWxNdXRhdGlvblF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgc3RyaW5nID0gYGA7XG4gIHN0cmluZyArPSBgJHthZGRNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpfWA7XG4gIGlmICh0YWJsZS5maWVsZHNbMF0pIHtcbiAgICBzdHJpbmcgKz0gYCxcXG4ke3VwZGF0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9LFxcbmA7XG4gICAgc3RyaW5nICs9IGAke2RlbGV0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9YDtcbiAgfVxuICByZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBidWlsZFNRTFBvb2xNdXRhdGlvbigpIHtcbiAgbGV0IHN0cmluZyA9IGBgO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBwb29sLmNvbm5lY3QoKVxcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihjbGllbnQgPT4ge1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gY2xpZW50LnF1ZXJ5KHNxbClcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LnRoZW4ocmVzID0+IHtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y2xpZW50LnJlbGVhc2UoKTtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHJlcy5yb3dzWzBdO1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn19KVxcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0uY2F0Y2goZXJyID0+IHtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y2xpZW50LnJlbGVhc2UoKTtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc29sZS5sb2coJ0Vycm9yOiAnLCBlcnIpO1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn19KVxcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn19KVxcbmBcbiAgcmV0dXJuIHN0cmluZzsgXG59XG5cbmZ1bmN0aW9uIGFkZE11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9YWRkJHt0YWJsZS50eXBlfToge1xcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHtcXG5gO1xuXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGZpZWxkSW5kZXggaW4gdGFibGUuZmllbGRzKSB7XG4gICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9ICcsXFxuJztcbiAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke2J1aWxkRmllbGRJdGVtKHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XSl9YDtcbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9fSxcXG5gXG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3QgJHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9ID0gbmV3ICR7dGFibGUudHlwZX0oYXJncyk7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9LnNhdmUoKTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3QgY29sdW1ucyA9IE9iamVjdC5rZXlzKGFyZ3MpLm1hcChlbCA9PiBcXGBcIlxcJHtlbH1cIlxcYCk7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKGFyZ3MpLm1hcChlbCA9PiBcXGAnXFwke2VsfSdcXGApO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgSU5TRVJUIElOVE8gXCIke3RhYmxlLnR5cGV9XCIgKFxcJHtjb2x1bW5zfSkgVkFMVUVTIChcXCR7dmFsdWVzfSkgUkVUVVJOSU5HICpcXGA7XFxuYFxuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7IFxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9dXBkYXRlJHt0YWJsZS50eXBlfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbiR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHtcXG5gO1xuXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGZpZWxkSW5kZXggaW4gdGFibGUuZmllbGRzKSB7XG4gICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9ICcsXFxuJztcbiAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke2J1aWxkRmllbGRJdGVtKHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XSl9YFxuICB9XG5cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifX0sXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZEJ5SWRBbmRVcGRhdGUoYXJncy5pZCwgYXJncyk7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1sZXQgdXBkYXRlVmFsdWVzID0gJyc7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1mb3IgKGNvbnN0IHByb3AgaW4gYXJncykge1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9aWYgKHVwZGF0ZVZhbHVlcy5sZW5ndGggPiAwKSB1cGRhdGVWYWx1ZXMgKz0gXFxgLCBcXGA7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn11cGRhdGVWYWx1ZXMgKz0gXFxgXCJcXCR7cHJvcH1cIiA9ICdcXCR7YXJnc1twcm9wXX0nIFxcYDtcXG5gICAgIFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn19XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBVUERBVEUgXCIke3RhYmxlLnR5cGV9XCIgU0VUIFxcJHt1cGRhdGVWYWx1ZXN9IFdIRVJFIGlkID0gJ1xcJHthcmdzLmlkfScgUkVUVVJOSU5HICo7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xNdXRhdGlvbigpOyBcbiAgfVxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IGlkRmllbGROYW1lID0gdGFibGUuZmllbGRzWzBdLm5hbWU7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1kZWxldGUke3RhYmxlLnR5cGV9OiB7XFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczogeyAke2lkRmllbGROYW1lfTogeyB0eXBlOiAke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUodGFibGUuZmllbGRzWzBdLnR5cGUpIH19fSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZEJ5SWRBbmRSZW1vdmUoYXJncy5pZCk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYERFTEVURSBGUk9NIFwiJHt0YWJsZS50eXBlfVwiIFdIRVJFIGlkID0gJ1xcJHthcmdzLmlkfScgUkVUVVJOSU5HICo7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xNdXRhdGlvbigpOyBcbiAgfVxuXG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvclJlcXVpcmVkKHJlcXVpcmVkLCBwb3NpdGlvbikge1xuICBpZiAocmVxdWlyZWQpIHtcbiAgICBpZiAocG9zaXRpb24gPT09ICdmcm9udCcpIHtcbiAgICAgIHJldHVybiAnbmV3IEdyYXBoUUxOb25OdWxsKCc7XG4gICAgfVxuICAgIHJldHVybiAnKSc7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBjaGVja0Zvck11bHRpcGxlVmFsdWVzKG11bHRpcGxlVmFsdWVzLCBwb3NpdGlvbikge1xuICBpZiAobXVsdGlwbGVWYWx1ZXMpIHtcbiAgICBpZiAocG9zaXRpb24gPT09ICdmcm9udCcpIHtcbiAgICAgIHJldHVybiAnbmV3IEdyYXBoUUxMaXN0KCc7XG4gICAgfVxuICAgIHJldHVybiAnKSc7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlR3JhcGhxbFNlcnZlcjtcbiJdLCJzb3VyY2VSb290IjoiIn0=