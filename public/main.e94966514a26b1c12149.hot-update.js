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
  for (var _databaseIndex2 in datab) {
    for (var _tableIndex in tables) {
      if (!firstRootLoop) query += ',\n';
      firstRootLoop = false;

      query += buildGraphqlRootQuery(tables[_tableIndex], database);
    }
  }query += '\n' + tab + '}\n});\n\n';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwiZGF0YWJhc2VzIiwicXVlcnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2UiLCJidWlsZFJlcXVpcmVTdGF0ZW1lbnRzIiwiZGF0YSIsImRhdGFiYXNlTmFtZSIsImJ1aWxkR3JhcGhxbFZhcmlhYmxlcyIsInRhYmxlcyIsInRhYmxlSW5kZXgiLCJidWlsZEdyYXBocWxUeXBlU2NoZW1hIiwiZmlyc3RSb290TG9vcCIsImRhdGFiIiwiYnVpbGRHcmFwaHFsUm9vdFF1ZXJ5IiwiZmlyc3RNdXRhdGlvbkxvb3AiLCJidWlsZEdyYXBocWxNdXRhdGlvblF1ZXJ5IiwicmVxdWlyZVN0YXRlbWVudHMiLCJ0eXBlIiwidG9Mb3dlckNhc2UiLCJ0YWJsZSIsImJ1aWxkR3JhcGhRTFR5cGVGaWVsZHMiLCJmaXJzdExvb3AiLCJmaWVsZEluZGV4IiwiYnVpbGRGaWVsZEl0ZW0iLCJmaWVsZHMiLCJyZWxhdGlvbiIsImNyZWF0ZVN1YlF1ZXJ5IiwicmVmQnkiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwicGFyc2VkVmFsdWUiLCJ2YWx1ZSIsInNwbGl0IiwiZmllbGQiLCJuYW1lIiwicmVmVHlwZSIsImNoZWNrRm9yUmVxdWlyZWQiLCJyZXF1aXJlZCIsImNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMiLCJtdWx0aXBsZVZhbHVlcyIsInRhYmxlVHlwZVRvR3JhcGhxbFR5cGUiLCJ0b1RpdGxlQ2FzZSIsInJlZlR5cGVOYW1lIiwidG9VcHBlckNhc2UiLCJzbGljZSIsInJlZkZpZWxkTmFtZSIsInJlZkZpZWxkVHlwZSIsImNyZWF0ZVN1YlF1ZXJ5TmFtZSIsImZpbmREYlNlYXJjaE1ldGhvZCIsImNyZWF0ZVNlYXJjaE9iamVjdCIsImJ1aWxkU1FMUG9vbFF1ZXJ5Iiwicm93cyIsImNyZWF0ZUZpbmRBbGxSb290UXVlcnkiLCJjcmVhdGVGaW5kQnlJZFF1ZXJ5IiwiaWRGaWVsZE5hbWUiLCJzdHJpbmciLCJhZGRNdXRhdGlvbiIsInVwZGF0ZU11dGF0aW9uIiwiZGVsZXRlTXV0YXRpb24iLCJidWlsZFNRTFBvb2xNdXRhdGlvbiIsInBvc2l0aW9uIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsVUFBTjs7QUFFQTtBQUNBLFNBQVNDLGtCQUFULENBQTRCQyxTQUE1QixFQUF1QztBQUNyQyxNQUFJQyxRQUFRLEVBQVo7QUFDQSxPQUFLLElBQU1DLGFBQVgsSUFBNEJGLFNBQTVCLEVBQXVDO0FBQ3JDLFFBQU1HLFlBQVdILFVBQVVFLGFBQVYsQ0FBakI7QUFDQTtBQUNBRCxhQUFTRyx1QkFBdUJELFVBQVNFLElBQWhDLEVBQXNDRixVQUFTRyxZQUEvQyxDQUFUO0FBQ0Q7QUFDREwsV0FBU00sdUJBQVQ7O0FBRUE7QUFDQSxPQUFLLElBQU1MLGNBQVgsSUFBNEJGLFNBQTVCLEVBQXVDO0FBQ3JDLFFBQU1RLFVBQVNMLFNBQVNELGNBQVQsRUFBd0JHLElBQXZDO0FBQ0EsUUFBTUMsZUFBZUgsU0FBU0QsY0FBVCxFQUF3QkksWUFBN0M7QUFDQSxTQUFLLElBQU1HLFVBQVgsSUFBeUJELE9BQXpCLEVBQWlDO0FBQy9CUCxlQUFTUyx1QkFBdUJGLFFBQU9DLFVBQVAsQ0FBdkIsRUFBMkNELE9BQTNDLEVBQW1ERixZQUFuRCxDQUFUO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBTCwyREFBdURILEdBQXZELGtDQUFxRkEsR0FBckY7O0FBRUEsTUFBSWEsZ0JBQWdCLElBQXBCO0FBQ0EsT0FBSyxJQUFNVCxlQUFYLElBQTRCVSxLQUE1QjtBQUNBLFNBQUssSUFBTUgsV0FBWCxJQUF5QkQsTUFBekIsRUFBaUM7QUFDL0IsVUFBSSxDQUFDRyxhQUFMLEVBQW9CVixTQUFTLEtBQVQ7QUFDcEJVLHNCQUFnQixLQUFoQjs7QUFFQVYsZUFBU1ksc0JBQXNCTCxPQUFPQyxXQUFQ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QUE4RGQsdUJBQXVCdEIsTUFBTUssTUFBTixDQUFhLENBQWIsRUFBZ0JQLElBQXZDLENBQTlEO0FBQ0FoQixnQkFBWUgsR0FBWixHQUFrQkEsR0FBbEIsR0FBd0JBLEdBQXhCOztBQUVILE1BQUlLLGFBQWEsU0FBakIsRUFBNEI7QUFDMUJGLGtCQUFZSCxHQUFaLEdBQWtCQSxHQUFsQixHQUF3QkEsR0FBeEIsR0FBOEJBLEdBQTlCLGVBQTJDcUIsTUFBTUYsSUFBakQ7QUFDRDs7QUFFRCxNQUFJZCxhQUFhLE9BQWIsSUFBd0JBLGFBQWEsWUFBekMsRUFBdUQ7QUFDckRGLGtCQUFZSCxHQUFaLEdBQWtCQSxHQUFsQixHQUF3QkEsR0FBeEIsR0FBOEJBLEdBQTlCLGtDQUErRHFCLE1BQU1GLElBQXJFO0FBQ0FoQixhQUFTMkQsc0JBQVQ7QUFDRDs7QUFFRCxTQUFPM0QsY0FBWUgsR0FBWixHQUFrQkEsR0FBbEIsR0FBd0JBLEdBQXhCLFdBQWlDQSxHQUFqQyxHQUF1Q0EsR0FBdkMsTUFBUDtBQUNEOztBQUVELFNBQVN1QyxnQkFBVCxDQUEwQkMsUUFBMUIsRUFBb0N1QixRQUFwQyxFQUE4QztBQUM1QyxNQUFJdkIsUUFBSixFQUFjO0FBQ1osUUFBSXVCLGFBQWEsT0FBakIsRUFBMEI7QUFDeEIsYUFBTyxxQkFBUDtBQUNEO0FBQ0QsV0FBTyxHQUFQO0FBQ0Q7QUFDRCxTQUFPLEVBQVA7QUFDRDs7QUFFRCxTQUFTdEIsc0JBQVQsQ0FBZ0NDLGNBQWhDLEVBQWdEcUIsUUFBaEQsRUFBMEQ7QUFDeEQsTUFBSXJCLGNBQUosRUFBb0I7QUFDbEIsUUFBSXFCLGFBQWEsT0FBakIsRUFBMEI7QUFDeEIsYUFBTyxrQkFBUDtBQUNEO0FBQ0QsV0FBTyxHQUFQO0FBQ0Q7QUFDRCxTQUFPLEVBQVA7QUFDRDs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQmhFLGtCQUFqQixDIiwiZmlsZSI6Im1haW4uZTk0OTY2NTE0YTI2YjFjMTIxNDkuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhYiA9IGAgIGA7XG5cbi8vIEZ1bmN0aW9uIHRoYXQgZXZva2VzIGFsbCBvdGhlciBoZWxwZXIgZnVuY3Rpb25zXG5mdW5jdGlvbiBwYXJzZUdyYXBocWxTZXJ2ZXIoZGF0YWJhc2VzKSB7XG4gIGxldCBxdWVyeSA9ICcnO1xuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7ICBcbiAgICBjb25zdCBkYXRhYmFzZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XTtcbiAgICAvLyBkYXRhYmFzZS5kYXRhIGlzIHNhbWUgYXMgZGF0YWJhc2UudGFibGVzXG4gICAgcXVlcnkgKz0gYnVpbGRSZXF1aXJlU3RhdGVtZW50cyhkYXRhYmFzZS5kYXRhLCBkYXRhYmFzZS5kYXRhYmFzZU5hbWUpO1xuICB9XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbFZhcmlhYmxlcygpO1xuICBcbiAgLy8gQlVJTEQgVFlQRSBTQ0hFTUFcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgIGNvbnN0IHRhYmxlcyA9IGRhdGFiYXNlW2RhdGFiYXNlSW5kZXhdLmRhdGE7XG4gICAgY29uc3QgZGF0YWJhc2VOYW1lID0gZGF0YWJhc2VbZGF0YWJhc2VJbmRleF0uZGF0YWJhc2VOYW1lO1xuICAgIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbFR5cGVTY2hlbWEodGFibGVzW3RhYmxlSW5kZXhdLCB0YWJsZXMsIGRhdGFiYXNlTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQlVJTEQgUk9PVCBRVUVSWVxuICBxdWVyeSArPSBgY29uc3QgUm9vdFF1ZXJ5ID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG4ke3RhYn1uYW1lOiAnUm9vdFF1ZXJ5VHlwZScsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RSb290TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYilcbiAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgIGlmICghZmlyc3RSb290TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0Um9vdExvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbFJvb3RRdWVyeSh0YWJsZXNbdGFibGVJbmRleF0sIGRhdGFiYXNlKTtcbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9fVxcbn0pO1xcblxcbmA7XG5cbiAgLy8gQlVJTEQgTVVUQVRJT05TXG4gIHF1ZXJ5ICs9IGBjb25zdCBNdXRhdGlvbiA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuJHt0YWJ9bmFtZTogJ011dGF0aW9uJyxcXG4ke3RhYn1maWVsZHM6IHtcXG5gO1xuXG4gIGxldCBmaXJzdE11dGF0aW9uTG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICBpZiAoIWZpcnN0TXV0YXRpb25Mb29wKSBxdWVyeSArPSAnLFxcbic7XG4gICAgZmlyc3RNdXRhdGlvbkxvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZSk7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIHF1ZXJ5ICs9IGBtb2R1bGUuZXhwb3J0cyA9IG5ldyBHcmFwaFFMU2NoZW1hKHtcXG4ke3RhYn1xdWVyeTogUm9vdFF1ZXJ5LFxcbiR7dGFifW11dGF0aW9uOiBNdXRhdGlvblxcbn0pO2A7XG4gIHJldHVybiBxdWVyeTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIFJlcHJlc2VudHMgdGhlIGRhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQWxsIHRoZSByZXF1aXJlIHN0YXRlbWVudHMgbmVlZGVkIGZvciB0aGUgR3JhcGhRTCBzZXJ2ZXIuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkUmVxdWlyZVN0YXRlbWVudHModGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcmVxdWlyZVN0YXRlbWVudHMgPSBcImNvbnN0IGdyYXBocWwgPSByZXF1aXJlKCdncmFwaHFsJyk7XFxuXCI7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgICByZXF1aXJlU3RhdGVtZW50cyArPSBgY29uc3QgJHt0YWJsZXNbdGFibGVJbmRleF0udHlwZX0gPSByZXF1aXJlKCcuLi9kYi8ke3RhYmxlc1t0YWJsZUluZGV4XS50eXBlLnRvTG93ZXJDYXNlKCl9LmpzJyk7XFxuYDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0IHBvb2wgPSByZXF1aXJlKCcuLi9kYi9zcWxfcG9vbC5qcycpO1xcbmA7XG4gIH1cbiAgcmV0dXJuIHJlcXVpcmVTdGF0ZW1lbnRzO1xufVxuXG5cbi8qKlxuICogQHJldHVybnMge1N0cmluZ30gLSBhbGwgY29uc3RhbnRzIG5lZWRlZCBmb3IgYSBHcmFwaFFMIHNlcnZlclxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxWYXJpYWJsZXMoKSB7XG4gIHJldHVybiBgXG5jb25zdCB7IFxuICBHcmFwaFFMT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFNjaGVtYSxcbiAgR3JhcGhRTElELFxuICBHcmFwaFFMU3RyaW5nLCBcbiAgR3JhcGhRTEludCwgXG4gIEdyYXBoUUxCb29sZWFuLFxuICBHcmFwaFFMTGlzdCxcbiAgR3JhcGhRTE5vbk51bGxcbn0gPSBncmFwaHFsO1xuICBcXG5gXG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpbnRlcmF0ZWQgb24uIEVhY2ggdGFibGUgY29uc2lzdHMgb2YgZmllbGRzXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGVzIC0gYW4gb2JqZWN0IG9mIGFsbCB0aGUgdGFibGVzIGNyZWF0ZWQgaW4gdGhlIGFwcGxpY2F0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBEYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIFRoZSBHcmFwaFFMIHR5cGUgY29kZSBmb3IgdGhlIGlucHV0dGVkIHRhYmxlXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFR5cGVTY2hlbWEodGFibGUsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYGNvbnN0ICR7dGFibGUudHlwZX1UeXBlID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9bmFtZTogJyR7dGFibGUudHlwZX0nLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn1maWVsZHM6ICgpID0+ICh7YDtcbiAgcXVlcnkgKz0gYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSk7XG4gIHJldHVybiBxdWVyeSArPSBgXFxuJHt0YWJ9fSlcXG59KTtcXG5cXG5gO1xufVxuXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBlYWNoIGZpZWxkIGZvciB0aGUgR3JhcGhRTCB0eXBlLiBcbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSAnJzsgXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGxldCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSs9ICcsJztcbiAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke2J1aWxkRmllbGRJdGVtKHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XSl9YDtcbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaGFzIGEgcmVsYXRpb24gdG8gYW5vdGhlciBmaWVsZFxuICAgIGlmICh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ucmVsYXRpb24udGFibGVJbmRleCA+IC0xKSB7XG4gICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0sIHRhYmxlcywgZGF0YWJhc2UpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBmaWVsZCBpcyBhIHJlbGF0aW9uIGZvciBhbm90aGVyIGZpZWxkXG4gICAgY29uc3QgcmVmQnkgPSB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ucmVmQnk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVmQnkpKSB7XG4gICAgICByZWZCeS5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgY29uc3QgcGFyc2VkVmFsdWUgPSB2YWx1ZS5zcGxpdCgnLicpO1xuICAgICAgICBjb25zdCBmaWVsZCA9IHtcbiAgICAgICAgICBuYW1lOiB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ubmFtZSxcbiAgICAgICAgICByZWxhdGlvbjoge1xuICAgICAgICAgICAgdGFibGVJbmRleDogcGFyc2VkVmFsdWVbMF0sXG4gICAgICAgICAgICBmaWVsZEluZGV4OiBwYXJzZWRWYWx1ZVsxXSxcbiAgICAgICAgICAgIHJlZlR5cGU6IHBhcnNlZFZhbHVlWzJdLFxuICAgICAgICAgICAgdHlwZTogdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnR5cGVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXJ5ICs9IGNyZWF0ZVN1YlF1ZXJ5KGZpZWxkLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnk7IFxufVxuXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZpZWxkIC0gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGZpZWxkIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIGEgZmllbGQgaXRlbSAoZXg6ICdpZDogeyB0eXBlOiBHcmFwaFFMSUQgfScpXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkRmllbGRJdGVtKGZpZWxkKSB7XG4gIHJldHVybiAgYCR7ZmllbGQubmFtZX06IHsgdHlwZTogJHtjaGVja0ZvclJlcXVpcmVkKGZpZWxkLnJlcXVpcmVkLCAnZnJvbnQnKX0ke2NoZWNrRm9yTXVsdGlwbGVWYWx1ZXMoZmllbGQubXVsdGlwbGVWYWx1ZXMsICdmcm9udCcpfSR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZShmaWVsZC50eXBlKX0ke2NoZWNrRm9yTXVsdGlwbGVWYWx1ZXMoZmllbGQubXVsdGlwbGVWYWx1ZXMsICdiYWNrJyl9JHtjaGVja0ZvclJlcXVpcmVkKGZpZWxkLnJlcXVpcmVkLCAnYmFjaycpfSB9YDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gdGhlIGZpZWxkIHR5cGUgKElELCBTdHJpbmcsIE51bWJlciwgQm9vbGVhbiwgb3IgRmxvYXQpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHRoZSBHcmFwaFFMIHR5cGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBmaWVsZCB0eXBlIGVudGVyZWRcbiAqL1xuZnVuY3Rpb24gdGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0eXBlKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ0lEJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTElEJztcbiAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgcmV0dXJuICdHcmFwaFFMU3RyaW5nJztcbiAgICBjYXNlICdOdW1iZXInOlxuICAgICAgcmV0dXJuICdHcmFwaFFMSW50JztcbiAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTEJvb2xlYW4nO1xuICAgIGNhc2UgJ0Zsb2F0JzpcbiAgICAgIHJldHVybiAnR3JhcGhRTEZsb2F0JztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICdHcmFwaFFMU3RyaW5nJztcbiAgfVxufVxuXG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlZlR5cGVOYW1lIC0gQW55IHN0cmluZyBpbnB1dHRlZFxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgc3RyaW5nIGlucHV0dGVkLCBidXQgd2l0aCB0aGUgZmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkIGFuZCB0aGUgcmVzdCBsb3dlcmNhc2VkXG4gKi9cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKSB7XG4gIGxldCBuYW1lID0gcmVmVHlwZU5hbWVbMF0udG9VcHBlckNhc2UoKTtcbiAgbmFtZSArPSByZWZUeXBlTmFtZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gbmFtZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gZmllbGQgLSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFsbCB0aGUgdGFibGVzIG1hZGUgYnkgdGhlIHVzZXIuIFxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YmFzZSBzZWxlY3RlZFxuICogQHJldHVybnMge1N0cmluZ30gLSBCdWlsZHMgYSBzdWIgdHlwZSBmb3IgYW55IGZpZWxkIHdpdGggYSByZWxhdGlvbi4gXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN1YlF1ZXJ5KGZpZWxkLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IHJlZlR5cGVOYW1lID0gdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLnR5cGU7XG4gIGNvbnN0IHJlZkZpZWxkTmFtZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0ubmFtZTtcbiAgY29uc3QgcmVmRmllbGRUeXBlID0gdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLmZpZWxkc1tmaWVsZC5yZWxhdGlvbi5maWVsZEluZGV4XS50eXBlO1xuICBsZXQgcXVlcnkgPSBgLFxcbiR7dGFifSR7dGFifSR7Y3JlYXRlU3ViUXVlcnlOYW1lKGZpZWxkLCByZWZUeXBlTmFtZSl9OiB7XFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogYDtcblxuICBpZiAoZmllbGQucmVsYXRpb24ucmVmVHlwZSA9PT0gJ29uZSB0byBtYW55JyB8fCBmaWVsZC5yZWxhdGlvbi5yZWZUeXBlID09PSAnbWFueSB0byBtYW55Jykge1xuICAgIHF1ZXJ5ICs9IGBuZXcgR3JhcGhRTExpc3QoJHtyZWZUeXBlTmFtZX1UeXBlKSxgO1xuICB9IGVsc2Uge1xuICAgIHF1ZXJ5ICs9IGAke3JlZlR5cGVOYW1lfVR5cGUsYDtcbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3JlZlR5cGVOYW1lfS4ke2ZpbmREYlNlYXJjaE1ldGhvZChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQucmVsYXRpb24ucmVmVHlwZSl9YDtcbiAgICBxdWVyeSArPSBgKCR7Y3JlYXRlU2VhcmNoT2JqZWN0KHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCBmaWVsZCl9KTtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9fWA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBTRUxFQ1QgKiBGUk9NIFwiJHtyZWZUeXBlTmFtZX1cIiBXSEVSRSBcIiR7cmVmRmllbGROYW1lfVwiID0gJ1xcJHtwYXJlbnQuJHtmaWVsZC5uYW1lfX0nO1xcYFxcbmBcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeShmaWVsZC5yZWxhdGlvbi5yZWZUeXBlKVxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9fWA7XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWZUeXBlIC0gVGhlIHJlbGF0aW9uIHR5cGUgb2YgdGhlIHN1YiBxdWVyeVxuICogQHJldHVybnMge1N0cmluZ30gLSB0aGUgY29kZSBmb3IgYSBTUUwgcG9vbCBxdWVyeS4gXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbFF1ZXJ5KHJlZlR5cGUpIHtcbiAgbGV0IHJvd3MgPSAnJzsgXG4gIGlmIChyZWZUeXBlID09PSAnb25lIHRvIG9uZScgfHwgcmVmVHlwZSA9PT0gJ21hbnkgdG8gb25lJykgcm93cyA9ICdyb3dzWzBdJ1xuICBlbHNlIHJvd3MgPSAncm93cydcblxuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wucXVlcnkoc3FsKVxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKHJlcyA9PiByZXMuJHtyb3dzfSlcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0uY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKCdFcnJvcjogJywgZXJyKSlcXG5gXG4gIHJldHVybiBxdWVyeTsgXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN1YlF1ZXJ5TmFtZShmaWVsZCwgcmVmVHlwZU5hbWUpIHtcbiAgc3dpdGNoIChmaWVsZC5yZWxhdGlvbi5yZWZUeXBlKSB7XG4gICAgY2FzZSAnb25lIHRvIG9uZSc6XG4gICAgICByZXR1cm4gYHJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGNhc2UgJ29uZSB0byBtYW55JzpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdtYW55IHRvIG9uZSc6XG4gICAgICByZXR1cm4gYHJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGNhc2UgJ21hbnkgdG8gbWFueSc6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kRGJTZWFyY2hNZXRob2QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIHJlZlR5cGUpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gJ2lkJyB8fCByZWZGaWVsZFR5cGUgPT09ICdJRCcpIHJldHVybiAnZmluZEJ5SWQnO1xuICBlbHNlIGlmIChyZWZUeXBlID09PSAnb25lIHRvIG9uZScpIHJldHVybiAnZmluZE9uZSc7XG4gIGVsc2UgcmV0dXJuICdmaW5kJztcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VhcmNoT2JqZWN0KHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCBmaWVsZCkge1xuICBpZiAocmVmRmllbGROYW1lID09PSAnaWQnIHx8IHJlZkZpZWxkVHlwZSA9PT0gJ0lEJykge1xuICAgIHJldHVybiBgcGFyZW50LiR7ZmllbGQubmFtZX1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgeyAke3JlZkZpZWxkTmFtZX06IHBhcmVudC4ke2ZpZWxkLm5hbWV9IH1gO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7XG5cbiAgcXVlcnkgKz0gY3JlYXRlRmluZEFsbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpO1xuXG4gIGlmICghIXRhYmxlLmZpZWxkc1swXSkge1xuICAgIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRCeUlkUXVlcnkodGFibGUsIGRhdGFiYXNlKTtcbiAgfVxuXG4gIHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRmluZEFsbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWV2ZXJ5JHt0b1RpdGxlQ2FzZSh0YWJsZS50eXBlKX06IHtcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiBuZXcgR3JhcGhRTExpc3QoJHt0YWJsZS50eXBlfVR5cGUpLFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUoKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kKHt9KTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KCdtYW55JylcbiAgfVxuXG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBkYXRhYmFzZSBzZWxlY3RlZFxuICogQHJldHVybnMge1N0cmluZ30gLSByb290IHF1ZXJ5IGNvZGUgdG8gZmluZCBhbiBpbmRpdmlkdWFsIHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRmluZEJ5SWRRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgY29uc3QgaWRGaWVsZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX06IHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHsgJHtpZEZpZWxkTmFtZX06IHsgdHlwZTogJHt0YWJsZVR5cGVUb0dyYXBocWxUeXBlKHRhYmxlLmZpZWxkc1swXS50eXBlKX19fSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkKGFyZ3MuaWQpO1xcbmA7XG4gIH1cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIiBXSEVSRSAke2lkRmllbGROYW1lfSA9ICdcXCR7YXJncy5pZH0nO1xcYDtcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoJ29uZSB0byBvbmUnKTsgXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHN0cmluZyA9IGBgO1xuICBzdHJpbmcgKz0gYCR7YWRkTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICBpZiAodGFibGUuZmllbGRzWzBdKSB7XG4gICAgc3RyaW5nICs9IGAsXFxuJHt1cGRhdGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpfSxcXG5gO1xuICAgIHN0cmluZyArPSBgJHtkZWxldGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpfWA7XG4gIH1cbiAgcmV0dXJuIHN0cmluZztcbn1cblxuZnVuY3Rpb24gYnVpbGRTUUxQb29sTXV0YXRpb24oKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcG9vbC5jb25uZWN0KClcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LnRoZW4oY2xpZW50ID0+IHtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIGNsaWVudC5xdWVyeShzcWwpXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKHJlcyA9PiB7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNsaWVudC5yZWxlYXNlKCk7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiByZXMucm93c1swXTtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LmNhdGNoKGVyciA9PiB7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNsaWVudC5yZWxlYXNlKCk7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnNvbGUubG9nKCdFcnJvcjogJywgZXJyKTtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gXG4gIHJldHVybiBzdHJpbmc7IFxufVxuXG5mdW5jdGlvbiBhZGRNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWFkZCR7dGFibGUudHlwZX06IHtcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLFxcbic7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifX0sXFxuYFxuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0ICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfSA9IG5ldyAke3RhYmxlLnR5cGV9KGFyZ3MpO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfS5zYXZlKCk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IGNvbHVtbnMgPSBPYmplY3Qua2V5cyhhcmdzKS5tYXAoZWwgPT4gXFxgXCJcXCR7ZWx9XCJcXGApO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhhcmdzKS5tYXAoZWwgPT4gXFxgJ1xcJHtlbH0nXFxgKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYElOU0VSVCBJTlRPIFwiJHt0YWJsZS50eXBlfVwiIChcXCR7Y29sdW1uc30pIFZBTFVFUyAoXFwke3ZhbHVlc30pIFJFVFVSTklORyAqXFxgO1xcbmBcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xNdXRhdGlvbigpOyBcbiAgfVxuXG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifXVwZGF0ZSR7dGFibGUudHlwZX06IHtcXG4ke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLFxcbic7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWBcbiAgfVxuXG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn19LFxcbiR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkQW5kVXBkYXRlKGFyZ3MuaWQsIGFyZ3MpO1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9bGV0IHVwZGF0ZVZhbHVlcyA9ICcnO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Zm9yIChjb25zdCBwcm9wIGluIGFyZ3MpIHtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWlmICh1cGRhdGVWYWx1ZXMubGVuZ3RoID4gMCkgdXBkYXRlVmFsdWVzICs9IFxcYCwgXFxgO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9dXBkYXRlVmFsdWVzICs9IFxcYFwiXFwke3Byb3B9XCIgPSAnXFwke2FyZ3NbcHJvcF19JyBcXGA7XFxuYCAgICBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgVVBEQVRFIFwiJHt0YWJsZS50eXBlfVwiIFNFVCBcXCR7dXBkYXRlVmFsdWVzfSBXSEVSRSBpZCA9ICdcXCR7YXJncy5pZH0nIFJFVFVSTklORyAqO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTsgXG4gIH1cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSkge1xuICBjb25zdCBpZEZpZWxkTmFtZSA9IHRhYmxlLmZpZWxkc1swXS5uYW1lO1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9ZGVsZXRlJHt0YWJsZS50eXBlfToge1xcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHsgJHtpZEZpZWxkTmFtZX06IHsgdHlwZTogJHt0YWJsZVR5cGVUb0dyYXBocWxUeXBlKHRhYmxlLmZpZWxkc1swXS50eXBlKSB9fX0sXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkQW5kUmVtb3ZlKGFyZ3MuaWQpO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBERUxFVEUgRlJPTSBcIiR7dGFibGUudHlwZX1cIiBXSEVSRSBpZCA9ICdcXCR7YXJncy5pZH0nIFJFVFVSTklORyAqO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTsgXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JSZXF1aXJlZChyZXF1aXJlZCwgcG9zaXRpb24pIHtcbiAgaWYgKHJlcXVpcmVkKSB7XG4gICAgaWYgKHBvc2l0aW9uID09PSAnZnJvbnQnKSB7XG4gICAgICByZXR1cm4gJ25ldyBHcmFwaFFMTm9uTnVsbCgnO1xuICAgIH1cbiAgICByZXR1cm4gJyknO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JNdWx0aXBsZVZhbHVlcyhtdWx0aXBsZVZhbHVlcywgcG9zaXRpb24pIHtcbiAgaWYgKG11bHRpcGxlVmFsdWVzKSB7XG4gICAgaWYgKHBvc2l0aW9uID09PSAnZnJvbnQnKSB7XG4gICAgICByZXR1cm4gJ25ldyBHcmFwaFFMTGlzdCgnO1xuICAgIH1cbiAgICByZXR1cm4gJyknO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUdyYXBocWxTZXJ2ZXI7XG4iXSwic291cmNlUm9vdCI6IiJ9