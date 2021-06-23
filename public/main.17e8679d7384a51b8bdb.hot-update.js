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
  query += buildRequireStatements(tables, database);
  query += buildGraphqlVariables();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwidGFibGVzIiwiZGF0YWJhc2UiLCJxdWVyeSIsImJ1aWxkUmVxdWlyZVN0YXRlbWVudHMiLCJidWlsZEdyYXBocWxWYXJpYWJsZXMiLCJ0YWJsZUluZGV4IiwiYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSIsImZpcnN0Um9vdExvb3AiLCJidWlsZEdyYXBocWxSb290UXVlcnkiLCJmaXJzdE11dGF0aW9uTG9vcCIsImJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkiLCJyZXF1aXJlU3RhdGVtZW50cyIsInR5cGUiLCJ0b0xvd2VyQ2FzZSIsInRhYmxlIiwiYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyIsImZpcnN0TG9vcCIsImZpZWxkSW5kZXgiLCJidWlsZEZpZWxkSXRlbSIsImZpZWxkcyIsInJlbGF0aW9uIiwiY3JlYXRlU3ViUXVlcnkiLCJyZWZCeSIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJwYXJzZWRWYWx1ZSIsInZhbHVlIiwic3BsaXQiLCJmaWVsZCIsIm5hbWUiLCJyZWZUeXBlIiwiY2hlY2tGb3JSZXF1aXJlZCIsInJlcXVpcmVkIiwiY2hlY2tGb3JNdWx0aXBsZVZhbHVlcyIsIm11bHRpcGxlVmFsdWVzIiwidGFibGVUeXBlVG9HcmFwaHFsVHlwZSIsInRvVGl0bGVDYXNlIiwicmVmVHlwZU5hbWUiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwicmVmRmllbGROYW1lIiwicmVmRmllbGRUeXBlIiwiY3JlYXRlU3ViUXVlcnlOYW1lIiwiZmluZERiU2VhcmNoTWV0aG9kIiwiY3JlYXRlU2VhcmNoT2JqZWN0IiwiYnVpbGRTUUxQb29sUXVlcnkiLCJyb3dzIiwiY3JlYXRlRmluZEFsbFJvb3RRdWVyeSIsImNyZWF0ZUZpbmRCeUlkUXVlcnkiLCJpZEZpZWxkTmFtZSIsInN0cmluZyIsImFkZE11dGF0aW9uIiwidXBkYXRlTXV0YXRpb24iLCJkZWxldGVNdXRhdGlvbiIsImJ1aWxkU1FMUG9vbE11dGF0aW9uIiwicG9zaXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxVQUFOOztBQUVBO0FBQ0EsU0FBU0Msa0JBQVQsQ0FBNEJDLE1BQTVCLEVBQW9DQyxRQUFwQyxFQUE4QztBQUM1QyxNQUFJQyxRQUFRLEVBQVo7QUFDQUEsV0FBU0MsdUJBQXVCSCxNQUF2QixFQUErQkMsUUFBL0IsQ0FBVDtBQUNBQyxXQUFTRSx1QkFBVDs7QUFFQTtBQUNBLE9BQUssSUFBTUMsVUFBWCxJQUF5QkwsTUFBekIsRUFBaUM7QUFDL0JFLGFBQVNJLHVCQUF1Qk4sT0FBT0ssVUFBUCxDQUF2QixFQUEyQ0wsTUFBM0MsRUFBbURDLFFBQW5ELENBQVQ7QUFDRDs7QUFFRDtBQUNBQywyREFBdURKLEdBQXZELGtDQUFxRkEsR0FBckY7O0FBRUEsTUFBSVMsZ0JBQWdCLElBQXBCO0FBQ0EsT0FBSyxJQUFNRixXQUFYLElBQXlCTCxNQUF6QixFQUFpQztBQUMvQixRQUFJLENBQUNPLGFBQUwsRUFBb0JMLFNBQVMsS0FBVDtBQUNwQkssb0JBQWdCLEtBQWhCOztBQUVBTCxhQUFTTSxzQkFBc0JSLE9BQU9LLFdBQVAsQ0FBdEIsRUFBMENKLFFBQTFDLENBQVQ7QUFDRDtBQUNEQyxrQkFBY0osR0FBZDs7QUFFQTtBQUNBSSwwREFBc0RKLEdBQXRELDZCQUErRUEsR0FBL0U7O0FBRUEsTUFBSVcsb0JBQW9CLElBQXhCO0FBQ0EsT0FBSyxJQUFNSixZQUFYLElBQXlCTCxNQUF6QixFQUFpQztBQUMvQixRQUFJLENBQUNTLGlCQUFMLEVBQXdCUCxTQUFTLEtBQVQ7QUFDeEJPLHdCQUFvQixLQUFwQjs7QUFFQVAsYUFBU1EsMEJBQTBCVixPQUFPSyxZQUFQLENBQTFCLEVBQThDSixRQUE5QyxDQUFUO0FBQ0Q7QUFDREMsa0JBQWNKLEdBQWQ7O0FBRUFJLHNEQUFr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RUQsU0FBT3JELGNBQVlKLEdBQVosR0FBa0JBLEdBQWxCLEdBQXdCQSxHQUF4QixXQUFpQ0EsR0FBakMsR0FBdUNBLEdBQXZDLE1BQVA7QUFDRDs7QUFFRCxTQUFTa0MsZ0JBQVQsQ0FBMEJDLFFBQTFCLEVBQW9DdUIsUUFBcEMsRUFBOEM7QUFDNUMsTUFBSXZCLFFBQUosRUFBYztBQUNaLFFBQUl1QixhQUFhLE9BQWpCLEVBQTBCO0FBQ3hCLGFBQU8scUJBQVA7QUFDRDtBQUNELFdBQU8sR0FBUDtBQUNEO0FBQ0QsU0FBTyxFQUFQO0FBQ0Q7O0FBRUQsU0FBU3RCLHNCQUFULENBQWdDQyxjQUFoQyxFQUFnRHFCLFFBQWhELEVBQTBEO0FBQ3hELE1BQUlyQixjQUFKLEVBQW9CO0FBQ2xCLFFBQUlxQixhQUFhLE9BQWpCLEVBQTBCO0FBQ3hCLGFBQU8sa0JBQVA7QUFDRDtBQUNELFdBQU8sR0FBUDtBQUNEO0FBQ0QsU0FBTyxFQUFQO0FBQ0Q7O0FBRURDLE9BQU9DLE9BQVAsR0FBaUIzRCxrQkFBakIsQyIsImZpbGUiOiJtYWluLjE3ZTg2NzlkNzM4NGE1MWI4YmRiLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0YWIgPSBgICBgO1xuXG4vLyBGdW5jdGlvbiB0aGF0IGV2b2tlcyBhbGwgb3RoZXIgaGVscGVyIGZ1bmN0aW9uc1xuZnVuY3Rpb24gcGFyc2VHcmFwaHFsU2VydmVyKHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7XG4gIHF1ZXJ5ICs9IGJ1aWxkUmVxdWlyZVN0YXRlbWVudHModGFibGVzLCBkYXRhYmFzZSk7XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbFZhcmlhYmxlcygpO1xuXG4gIC8vIEJVSUxEIFRZUEUgU0NIRU1BXG4gIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICBxdWVyeSArPSBidWlsZEdyYXBocWxUeXBlU2NoZW1hKHRhYmxlc1t0YWJsZUluZGV4XSwgdGFibGVzLCBkYXRhYmFzZSk7XG4gIH1cblxuICAvLyBCVUlMRCBST09UIFFVRVJZXG4gIHF1ZXJ5ICs9IGBjb25zdCBSb290UXVlcnkgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdSb290UXVlcnlUeXBlJyxcXG4ke3RhYn1maWVsZHM6IHtcXG5gO1xuXG4gIGxldCBmaXJzdFJvb3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgIGlmICghZmlyc3RSb290TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0Um9vdExvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbFJvb3RRdWVyeSh0YWJsZXNbdGFibGVJbmRleF0sIGRhdGFiYXNlKTtcbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9fVxcbn0pO1xcblxcbmA7XG5cbiAgLy8gQlVJTEQgTVVUQVRJT05TXG4gIHF1ZXJ5ICs9IGBjb25zdCBNdXRhdGlvbiA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuJHt0YWJ9bmFtZTogJ011dGF0aW9uJyxcXG4ke3RhYn1maWVsZHM6IHtcXG5gO1xuXG4gIGxldCBmaXJzdE11dGF0aW9uTG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICBpZiAoIWZpcnN0TXV0YXRpb25Mb29wKSBxdWVyeSArPSAnLFxcbic7XG4gICAgZmlyc3RNdXRhdGlvbkxvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZSk7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIHF1ZXJ5ICs9IGBtb2R1bGUuZXhwb3J0cyA9IG5ldyBHcmFwaFFMU2NoZW1hKHtcXG4ke3RhYn1xdWVyeTogUm9vdFF1ZXJ5LFxcbiR7dGFifW11dGF0aW9uOiBNdXRhdGlvblxcbn0pO2A7XG4gIHJldHVybiBxdWVyeTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIFJlcHJlc2VudHMgdGhlIGRhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQWxsIHRoZSByZXF1aXJlIHN0YXRlbWVudHMgbmVlZGVkIGZvciB0aGUgR3JhcGhRTCBzZXJ2ZXIuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkUmVxdWlyZVN0YXRlbWVudHModGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcmVxdWlyZVN0YXRlbWVudHMgPSBcImNvbnN0IGdyYXBocWwgPSByZXF1aXJlKCdncmFwaHFsJyk7XFxuXCI7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgICByZXF1aXJlU3RhdGVtZW50cyArPSBgY29uc3QgJHt0YWJsZXNbdGFibGVJbmRleF0udHlwZX0gPSByZXF1aXJlKCcuLi9kYi8ke3RhYmxlc1t0YWJsZUluZGV4XS50eXBlLnRvTG93ZXJDYXNlKCl9LmpzJyk7XFxuYDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0IHBvb2wgPSByZXF1aXJlKCcuLi9kYi9zcWxfcG9vbC5qcycpO1xcbmA7XG4gIH1cbiAgcmV0dXJuIHJlcXVpcmVTdGF0ZW1lbnRzO1xufVxuXG5cbi8qKlxuICogQHJldHVybnMge1N0cmluZ30gLSBhbGwgY29uc3RhbnRzIG5lZWRlZCBmb3IgYSBHcmFwaFFMIHNlcnZlclxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxWYXJpYWJsZXMoKSB7XG4gIHJldHVybiBgXG5jb25zdCB7IFxuICBHcmFwaFFMT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFNjaGVtYSxcbiAgR3JhcGhRTElELFxuICBHcmFwaFFMU3RyaW5nLCBcbiAgR3JhcGhRTEludCwgXG4gIEdyYXBoUUxCb29sZWFuLFxuICBHcmFwaFFMTGlzdCxcbiAgR3JhcGhRTE5vbk51bGxcbn0gPSBncmFwaHFsO1xuICBcXG5gXG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpbnRlcmF0ZWQgb24uIEVhY2ggdGFibGUgY29uc2lzdHMgb2YgZmllbGRzXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGVzIC0gYW4gb2JqZWN0IG9mIGFsbCB0aGUgdGFibGVzIGNyZWF0ZWQgaW4gdGhlIGFwcGxpY2F0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBEYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIFRoZSBHcmFwaFFMIHR5cGUgY29kZSBmb3IgdGhlIGlucHV0dGVkIHRhYmxlXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFR5cGVTY2hlbWEodGFibGUsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYGNvbnN0ICR7dGFibGUudHlwZX1UeXBlID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9bmFtZTogJyR7dGFibGUudHlwZX0nLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn1maWVsZHM6ICgpID0+ICh7YDtcbiAgcXVlcnkgKz0gYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSk7XG4gIHJldHVybiBxdWVyeSArPSBgXFxuJHt0YWJ9fSlcXG59KTtcXG5cXG5gO1xufVxuXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBlYWNoIGZpZWxkIGZvciB0aGUgR3JhcGhRTCB0eXBlLiBcbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaFFMVHlwZUZpZWxkcyh0YWJsZSwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBsZXQgcXVlcnkgPSAnJzsgXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGxldCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSs9ICcsJztcbiAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke2J1aWxkRmllbGRJdGVtKHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XSl9YDtcbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaGFzIGEgcmVsYXRpb24gdG8gYW5vdGhlciBmaWVsZFxuICAgIGlmICh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ucmVsYXRpb24udGFibGVJbmRleCA+IC0xKSB7XG4gICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0sIHRhYmxlcywgZGF0YWJhc2UpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBmaWVsZCBpcyBhIHJlbGF0aW9uIGZvciBhbm90aGVyIGZpZWxkXG4gICAgY29uc3QgcmVmQnkgPSB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ucmVmQnk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVmQnkpKSB7XG4gICAgICByZWZCeS5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgY29uc3QgcGFyc2VkVmFsdWUgPSB2YWx1ZS5zcGxpdCgnLicpO1xuICAgICAgICBjb25zdCBmaWVsZCA9IHtcbiAgICAgICAgICBuYW1lOiB0YWJsZS5maWVsZHNbZmllbGRJbmRleF0ubmFtZSxcbiAgICAgICAgICByZWxhdGlvbjoge1xuICAgICAgICAgICAgdGFibGVJbmRleDogcGFyc2VkVmFsdWVbMF0sXG4gICAgICAgICAgICBmaWVsZEluZGV4OiBwYXJzZWRWYWx1ZVsxXSxcbiAgICAgICAgICAgIHJlZlR5cGU6IHBhcnNlZFZhbHVlWzJdLFxuICAgICAgICAgICAgdHlwZTogdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnR5cGVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHF1ZXJ5ICs9IGNyZWF0ZVN1YlF1ZXJ5KGZpZWxkLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnk7IFxufVxuXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZpZWxkIC0gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGZpZWxkIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIGEgZmllbGQgaXRlbSAoZXg6ICdpZDogeyB0eXBlOiBHcmFwaFFMSUQgfScpXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkRmllbGRJdGVtKGZpZWxkKSB7XG4gIHJldHVybiAgYCR7ZmllbGQubmFtZX06IHsgdHlwZTogJHtjaGVja0ZvclJlcXVpcmVkKGZpZWxkLnJlcXVpcmVkLCAnZnJvbnQnKX0ke2NoZWNrRm9yTXVsdGlwbGVWYWx1ZXMoZmllbGQubXVsdGlwbGVWYWx1ZXMsICdmcm9udCcpfSR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZShmaWVsZC50eXBlKX0ke2NoZWNrRm9yTXVsdGlwbGVWYWx1ZXMoZmllbGQubXVsdGlwbGVWYWx1ZXMsICdiYWNrJyl9JHtjaGVja0ZvclJlcXVpcmVkKGZpZWxkLnJlcXVpcmVkLCAnYmFjaycpfSB9YDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gdGhlIGZpZWxkIHR5cGUgKElELCBTdHJpbmcsIE51bWJlciwgQm9vbGVhbiwgb3IgRmxvYXQpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIHRoZSBHcmFwaFFMIHR5cGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBmaWVsZCB0eXBlIGVudGVyZWRcbiAqL1xuZnVuY3Rpb24gdGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0eXBlKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ0lEJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTElEJztcbiAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgcmV0dXJuICdHcmFwaFFMU3RyaW5nJztcbiAgICBjYXNlICdOdW1iZXInOlxuICAgICAgcmV0dXJuICdHcmFwaFFMSW50JztcbiAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTEJvb2xlYW4nO1xuICAgIGNhc2UgJ0Zsb2F0JzpcbiAgICAgIHJldHVybiAnR3JhcGhRTEZsb2F0JztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICdHcmFwaFFMU3RyaW5nJztcbiAgfVxufVxuXG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlZlR5cGVOYW1lIC0gQW55IHN0cmluZyBpbnB1dHRlZFxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgc3RyaW5nIGlucHV0dGVkLCBidXQgd2l0aCB0aGUgZmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkIGFuZCB0aGUgcmVzdCBsb3dlcmNhc2VkXG4gKi9cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKSB7XG4gIGxldCBuYW1lID0gcmVmVHlwZU5hbWVbMF0udG9VcHBlckNhc2UoKTtcbiAgbmFtZSArPSByZWZUeXBlTmFtZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gbmFtZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gZmllbGQgLSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFsbCB0aGUgdGFibGVzIG1hZGUgYnkgdGhlIHVzZXIuIFxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YmFzZSBzZWxlY3RlZFxuICogQHJldHVybnMge1N0cmluZ30gLSBCdWlsZHMgYSBzdWIgdHlwZSBmb3IgYW55IGZpZWxkIHdpdGggYSByZWxhdGlvbi4gXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN1YlF1ZXJ5KGZpZWxkLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IHJlZlR5cGVOYW1lID0gdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLnR5cGU7XG4gIGNvbnN0IHJlZkZpZWxkTmFtZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0ubmFtZTtcbiAgY29uc3QgcmVmRmllbGRUeXBlID0gdGFibGVzW2ZpZWxkLnJlbGF0aW9uLnRhYmxlSW5kZXhdLmZpZWxkc1tmaWVsZC5yZWxhdGlvbi5maWVsZEluZGV4XS50eXBlO1xuICBsZXQgcXVlcnkgPSBgLFxcbiR7dGFifSR7dGFifSR7Y3JlYXRlU3ViUXVlcnlOYW1lKGZpZWxkLCByZWZUeXBlTmFtZSl9OiB7XFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogYDtcblxuICBpZiAoZmllbGQucmVsYXRpb24ucmVmVHlwZSA9PT0gJ29uZSB0byBtYW55JyB8fCBmaWVsZC5yZWxhdGlvbi5yZWZUeXBlID09PSAnbWFueSB0byBtYW55Jykge1xuICAgIHF1ZXJ5ICs9IGBuZXcgR3JhcGhRTExpc3QoJHtyZWZUeXBlTmFtZX1UeXBlKSxgO1xuICB9IGVsc2Uge1xuICAgIHF1ZXJ5ICs9IGAke3JlZlR5cGVOYW1lfVR5cGUsYDtcbiAgfVxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3JlZlR5cGVOYW1lfS4ke2ZpbmREYlNlYXJjaE1ldGhvZChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQucmVsYXRpb24ucmVmVHlwZSl9YDtcbiAgICBxdWVyeSArPSBgKCR7Y3JlYXRlU2VhcmNoT2JqZWN0KHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCBmaWVsZCl9KTtcXG5gO1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9fWA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBTRUxFQ1QgKiBGUk9NIFwiJHtyZWZUeXBlTmFtZX1cIiBXSEVSRSBcIiR7cmVmRmllbGROYW1lfVwiID0gJ1xcJHtwYXJlbnQuJHtmaWVsZC5uYW1lfX0nO1xcYFxcbmBcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeShmaWVsZC5yZWxhdGlvbi5yZWZUeXBlKVxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9fWA7XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWZUeXBlIC0gVGhlIHJlbGF0aW9uIHR5cGUgb2YgdGhlIHN1YiBxdWVyeVxuICogQHJldHVybnMge1N0cmluZ30gLSB0aGUgY29kZSBmb3IgYSBTUUwgcG9vbCBxdWVyeS4gXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbFF1ZXJ5KHJlZlR5cGUpIHtcbiAgbGV0IHJvd3MgPSAnJzsgXG4gIGlmIChyZWZUeXBlID09PSAnb25lIHRvIG9uZScgfHwgcmVmVHlwZSA9PT0gJ21hbnkgdG8gb25lJykgcm93cyA9ICdyb3dzWzBdJ1xuICBlbHNlIHJvd3MgPSAncm93cydcblxuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wucXVlcnkoc3FsKVxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKHJlcyA9PiByZXMuJHtyb3dzfSlcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0uY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKCdFcnJvcjogJywgZXJyKSlcXG5gXG4gIHJldHVybiBxdWVyeTsgXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN1YlF1ZXJ5TmFtZShmaWVsZCwgcmVmVHlwZU5hbWUpIHtcbiAgc3dpdGNoIChmaWVsZC5yZWxhdGlvbi5yZWZUeXBlKSB7XG4gICAgY2FzZSAnb25lIHRvIG9uZSc6XG4gICAgICByZXR1cm4gYHJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGNhc2UgJ29uZSB0byBtYW55JzpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdtYW55IHRvIG9uZSc6XG4gICAgICByZXR1cm4gYHJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGNhc2UgJ21hbnkgdG8gbWFueSc6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgZXZlcnlSZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kRGJTZWFyY2hNZXRob2QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIHJlZlR5cGUpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gJ2lkJyB8fCByZWZGaWVsZFR5cGUgPT09ICdJRCcpIHJldHVybiAnZmluZEJ5SWQnO1xuICBlbHNlIGlmIChyZWZUeXBlID09PSAnb25lIHRvIG9uZScpIHJldHVybiAnZmluZE9uZSc7XG4gIGVsc2UgcmV0dXJuICdmaW5kJztcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VhcmNoT2JqZWN0KHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCBmaWVsZCkge1xuICBpZiAocmVmRmllbGROYW1lID09PSAnaWQnIHx8IHJlZkZpZWxkVHlwZSA9PT0gJ0lEJykge1xuICAgIHJldHVybiBgcGFyZW50LiR7ZmllbGQubmFtZX1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgeyAke3JlZkZpZWxkTmFtZX06IHBhcmVudC4ke2ZpZWxkLm5hbWV9IH1gO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7XG5cbiAgcXVlcnkgKz0gY3JlYXRlRmluZEFsbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpO1xuXG4gIGlmICghIXRhYmxlLmZpZWxkc1swXSkge1xuICAgIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRCeUlkUXVlcnkodGFibGUsIGRhdGFiYXNlKTtcbiAgfVxuXG4gIHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRmluZEFsbFJvb3RRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWV2ZXJ5JHt0b1RpdGxlQ2FzZSh0YWJsZS50eXBlKX06IHtcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiBuZXcgR3JhcGhRTExpc3QoJHt0YWJsZS50eXBlfVR5cGUpLFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUoKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kKHt9KTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KCdtYW55JylcbiAgfVxuXG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGl0ZXJhdGVkIG9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBkYXRhYmFzZSBzZWxlY3RlZFxuICogQHJldHVybnMge1N0cmluZ30gLSByb290IHF1ZXJ5IGNvZGUgdG8gZmluZCBhbiBpbmRpdmlkdWFsIHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRmluZEJ5SWRRdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgY29uc3QgaWRGaWVsZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX06IHtcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHsgJHtpZEZpZWxkTmFtZX06IHsgdHlwZTogJHt0YWJsZVR5cGVUb0dyYXBocWxUeXBlKHRhYmxlLmZpZWxkc1swXS50eXBlKX19fSxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkKGFyZ3MuaWQpO1xcbmA7XG4gIH1cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7dGFibGUudHlwZX1cIiBXSEVSRSAke2lkRmllbGROYW1lfSA9ICdcXCR7YXJncy5pZH0nO1xcYDtcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoJ29uZSB0byBvbmUnKTsgXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSh0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHN0cmluZyA9IGBgO1xuICBzdHJpbmcgKz0gYCR7YWRkTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICBpZiAodGFibGUuZmllbGRzWzBdKSB7XG4gICAgc3RyaW5nICs9IGAsXFxuJHt1cGRhdGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpfSxcXG5gO1xuICAgIHN0cmluZyArPSBgJHtkZWxldGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpfWA7XG4gIH1cbiAgcmV0dXJuIHN0cmluZztcbn1cblxuZnVuY3Rpb24gYnVpbGRTUUxQb29sTXV0YXRpb24oKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcG9vbC5jb25uZWN0KClcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LnRoZW4oY2xpZW50ID0+IHtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIGNsaWVudC5xdWVyeShzcWwpXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKHJlcyA9PiB7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNsaWVudC5yZWxlYXNlKCk7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiByZXMucm93c1swXTtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LmNhdGNoKGVyciA9PiB7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNsaWVudC5yZWxlYXNlKCk7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnNvbGUubG9nKCdFcnJvcjogJywgZXJyKTtcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gXG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fSlcXG5gXG4gIHJldHVybiBzdHJpbmc7IFxufVxuXG5mdW5jdGlvbiBhZGRNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWFkZCR7dGFibGUudHlwZX06IHtcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLFxcbic7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifX0sXFxuYFxuICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0ICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfSA9IG5ldyAke3RhYmxlLnR5cGV9KGFyZ3MpO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfS5zYXZlKCk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IGNvbHVtbnMgPSBPYmplY3Qua2V5cyhhcmdzKS5tYXAoZWwgPT4gXFxgXCJcXCR7ZWx9XCJcXGApO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhhcmdzKS5tYXAoZWwgPT4gXFxgJ1xcJHtlbH0nXFxgKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYElOU0VSVCBJTlRPIFwiJHt0YWJsZS50eXBlfVwiIChcXCR7Y29sdW1uc30pIFZBTFVFUyAoXFwke3ZhbHVlc30pIFJFVFVSTklORyAqXFxgO1xcbmBcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xNdXRhdGlvbigpOyBcbiAgfVxuXG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifXVwZGF0ZSR7dGFibGUudHlwZX06IHtcXG4ke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBmaWVsZEluZGV4IGluIHRhYmxlLmZpZWxkcykge1xuICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLFxcbic7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWBcbiAgfVxuXG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn19LFxcbiR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkQW5kVXBkYXRlKGFyZ3MuaWQsIGFyZ3MpO1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9bGV0IHVwZGF0ZVZhbHVlcyA9ICcnO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Zm9yIChjb25zdCBwcm9wIGluIGFyZ3MpIHtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifWlmICh1cGRhdGVWYWx1ZXMubGVuZ3RoID4gMCkgdXBkYXRlVmFsdWVzICs9IFxcYCwgXFxgO1xcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9dXBkYXRlVmFsdWVzICs9IFxcYFwiXFwke3Byb3B9XCIgPSAnXFwke2FyZ3NbcHJvcF19JyBcXGA7XFxuYCAgICBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmBcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgVVBEQVRFIFwiJHt0YWJsZS50eXBlfVwiIFNFVCBcXCR7dXBkYXRlVmFsdWVzfSBXSEVSRSBpZCA9ICdcXCR7YXJncy5pZH0nIFJFVFVSTklORyAqO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTsgXG4gIH1cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZU11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSkge1xuICBjb25zdCBpZEZpZWxkTmFtZSA9IHRhYmxlLmZpZWxkc1swXS5uYW1lO1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHt0YWJ9ZGVsZXRlJHt0YWJsZS50eXBlfToge1xcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifWFyZ3M6IHsgJHtpZEZpZWxkTmFtZX06IHsgdHlwZTogJHt0YWJsZVR5cGVUb0dyYXBocWxUeXBlKHRhYmxlLmZpZWxkc1swXS50eXBlKSB9fX0sXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9cmVzb2x2ZShwYXJlbnQsIGFyZ3MpIHtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGV9LmZpbmRCeUlkQW5kUmVtb3ZlKGFyZ3MuaWQpO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBERUxFVEUgRlJPTSBcIiR7dGFibGUudHlwZX1cIiBXSEVSRSBpZCA9ICdcXCR7YXJncy5pZH0nIFJFVFVSTklORyAqO1xcYFxcbmA7XG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTsgXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JSZXF1aXJlZChyZXF1aXJlZCwgcG9zaXRpb24pIHtcbiAgaWYgKHJlcXVpcmVkKSB7XG4gICAgaWYgKHBvc2l0aW9uID09PSAnZnJvbnQnKSB7XG4gICAgICByZXR1cm4gJ25ldyBHcmFwaFFMTm9uTnVsbCgnO1xuICAgIH1cbiAgICByZXR1cm4gJyknO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JNdWx0aXBsZVZhbHVlcyhtdWx0aXBsZVZhbHVlcywgcG9zaXRpb24pIHtcbiAgaWYgKG11bHRpcGxlVmFsdWVzKSB7XG4gICAgaWYgKHBvc2l0aW9uID09PSAnZnJvbnQnKSB7XG4gICAgICByZXR1cm4gJ25ldyBHcmFwaFFMTGlzdCgnO1xuICAgIH1cbiAgICByZXR1cm4gJyknO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUdyYXBocWxTZXJ2ZXI7XG4iXSwic291cmNlUm9vdCI6IiJ9