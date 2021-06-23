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
function parseGraphqlServer(tables, multiDatabases) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VHcmFwaHFsU2VydmVyIiwidGFibGVzIiwibXVsdGlEYXRhYmFzZXMiLCJxdWVyeSIsImJ1aWxkUmVxdWlyZVN0YXRlbWVudHMiLCJkYXRhYmFzZSIsImJ1aWxkR3JhcGhxbFZhcmlhYmxlcyIsInRhYmxlSW5kZXgiLCJidWlsZEdyYXBocWxUeXBlU2NoZW1hIiwiZmlyc3RSb290TG9vcCIsImJ1aWxkR3JhcGhxbFJvb3RRdWVyeSIsImZpcnN0TXV0YXRpb25Mb29wIiwiYnVpbGRHcmFwaHFsTXV0YXRpb25RdWVyeSIsInJlcXVpcmVTdGF0ZW1lbnRzIiwidHlwZSIsInRvTG93ZXJDYXNlIiwidGFibGUiLCJidWlsZEdyYXBoUUxUeXBlRmllbGRzIiwiZmlyc3RMb29wIiwiZmllbGRJbmRleCIsImJ1aWxkRmllbGRJdGVtIiwiZmllbGRzIiwicmVsYXRpb24iLCJjcmVhdGVTdWJRdWVyeSIsInJlZkJ5IiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsInBhcnNlZFZhbHVlIiwidmFsdWUiLCJzcGxpdCIsImZpZWxkIiwibmFtZSIsInJlZlR5cGUiLCJjaGVja0ZvclJlcXVpcmVkIiwicmVxdWlyZWQiLCJjaGVja0Zvck11bHRpcGxlVmFsdWVzIiwibXVsdGlwbGVWYWx1ZXMiLCJ0YWJsZVR5cGVUb0dyYXBocWxUeXBlIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJyZWZGaWVsZE5hbWUiLCJyZWZGaWVsZFR5cGUiLCJjcmVhdGVTdWJRdWVyeU5hbWUiLCJmaW5kRGJTZWFyY2hNZXRob2QiLCJjcmVhdGVTZWFyY2hPYmplY3QiLCJidWlsZFNRTFBvb2xRdWVyeSIsInJvd3MiLCJjcmVhdGVGaW5kQWxsUm9vdFF1ZXJ5IiwiY3JlYXRlRmluZEJ5SWRRdWVyeSIsImlkRmllbGROYW1lIiwic3RyaW5nIiwiYWRkTXV0YXRpb24iLCJ1cGRhdGVNdXRhdGlvbiIsImRlbGV0ZU11dGF0aW9uIiwiYnVpbGRTUUxQb29sTXV0YXRpb24iLCJwb3NpdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLFVBQU47O0FBRUE7QUFDQSxTQUFTQyxrQkFBVCxDQUE0QkMsTUFBNUIsRUFBb0NDLGNBQXBDLEVBQW9EO0FBQ2xELE1BQUlDLFFBQVEsRUFBWjtBQUNBQSxXQUFTQyx1QkFBdUJILE1BQXZCLEVBQStCSSxRQUEvQixDQUFUO0FBQ0FGLFdBQVNHLHVCQUFUOztBQUVBO0FBQ0EsT0FBSyxJQUFNQyxVQUFYLElBQXlCTixNQUF6QixFQUFpQztBQUMvQkUsYUFBU0ssdUJBQXVCUCxPQUFPTSxVQUFQLENBQXZCLEVBQTJDTixNQUEzQyxFQUFtREksUUFBbkQsQ0FBVDtBQUNEOztBQUVEO0FBQ0FGLDJEQUF1REosR0FBdkQsa0NBQXFGQSxHQUFyRjs7QUFFQSxNQUFJVSxnQkFBZ0IsSUFBcEI7QUFDQSxPQUFLLElBQU1GLFdBQVgsSUFBeUJOLE1BQXpCLEVBQWlDO0FBQy9CLFFBQUksQ0FBQ1EsYUFBTCxFQUFvQk4sU0FBUyxLQUFUO0FBQ3BCTSxvQkFBZ0IsS0FBaEI7O0FBRUFOLGFBQVNPLHNCQUFzQlQsT0FBT00sV0FBUCxDQUF0QixFQUEwQ0YsUUFBMUMsQ0FBVDtBQUNEO0FBQ0RGLGtCQUFjSixHQUFkOztBQUVBO0FBQ0FJLDBEQUFzREosR0FBdEQsNkJBQStFQSxHQUEvRTs7QUFFQSxNQUFJWSxvQkFBb0IsSUFBeEI7QUFDQSxPQUFLLElBQU1KLFlBQVgsSUFBeUJOLE1BQXpCLEVBQWlDO0FBQy9CLFFBQUksQ0FBQ1UsaUJBQUwsRUFBd0JSLFNBQVMsS0FBVDtBQUN4QlEsd0JBQW9CLEtBQXBCOztBQUVBUixhQUFTUywwQkFBMEJYLE9BQU9NLFlBQVAsQ0FBMUIsRUFBOENGLFFBQTlDLENBQVQ7QUFDRDtBQUNERixrQkFBY0os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QVNzRCxzQkFBVDtBQUNEOztBQUVELFNBQU90RCxjQUFZSixHQUFaLEdBQWtCQSxHQUFsQixHQUF3QkEsR0FBeEIsV0FBaUNBLEdBQWpDLEdBQXVDQSxHQUF2QyxNQUFQO0FBQ0Q7O0FBRUQsU0FBU21DLGdCQUFULENBQTBCQyxRQUExQixFQUFvQ3VCLFFBQXBDLEVBQThDO0FBQzVDLE1BQUl2QixRQUFKLEVBQWM7QUFDWixRQUFJdUIsYUFBYSxPQUFqQixFQUEwQjtBQUN4QixhQUFPLHFCQUFQO0FBQ0Q7QUFDRCxXQUFPLEdBQVA7QUFDRDtBQUNELFNBQU8sRUFBUDtBQUNEOztBQUVELFNBQVN0QixzQkFBVCxDQUFnQ0MsY0FBaEMsRUFBZ0RxQixRQUFoRCxFQUEwRDtBQUN4RCxNQUFJckIsY0FBSixFQUFvQjtBQUNsQixRQUFJcUIsYUFBYSxPQUFqQixFQUEwQjtBQUN4QixhQUFPLGtCQUFQO0FBQ0Q7QUFDRCxXQUFPLEdBQVA7QUFDRDtBQUNELFNBQU8sRUFBUDtBQUNEOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCNUQsa0JBQWpCLEMiLCJmaWxlIjoibWFpbi5lNDYyYWQ4NDE5MmVmMTRhN2MxYy5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGFiID0gYCAgYDtcblxuLy8gRnVuY3Rpb24gdGhhdCBldm9rZXMgYWxsIG90aGVyIGhlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIHBhcnNlR3JhcGhxbFNlcnZlcih0YWJsZXMsIG11bHRpRGF0YWJhc2VzKSB7XG4gIGxldCBxdWVyeSA9ICcnO1xuICBxdWVyeSArPSBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKHRhYmxlcywgZGF0YWJhc2UpO1xuICBxdWVyeSArPSBidWlsZEdyYXBocWxWYXJpYWJsZXMoKTtcblxuICAvLyBCVUlMRCBUWVBFIFNDSEVNQVxuICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgcXVlcnkgKz0gYnVpbGRHcmFwaHFsVHlwZVNjaGVtYSh0YWJsZXNbdGFibGVJbmRleF0sIHRhYmxlcywgZGF0YWJhc2UpO1xuICB9XG5cbiAgLy8gQlVJTEQgUk9PVCBRVUVSWVxuICBxdWVyeSArPSBgY29uc3QgUm9vdFF1ZXJ5ID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcXG4ke3RhYn1uYW1lOiAnUm9vdFF1ZXJ5VHlwZScsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RSb290TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgdGFibGVJbmRleCBpbiB0YWJsZXMpIHtcbiAgICBpZiAoIWZpcnN0Um9vdExvb3ApIHF1ZXJ5ICs9ICcsXFxuJztcbiAgICBmaXJzdFJvb3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGVzW3RhYmxlSW5kZXhdLCBkYXRhYmFzZSk7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifX1cXG59KTtcXG5cXG5gO1xuXG4gIC8vIEJVSUxEIE1VVEFUSU9OU1xuICBxdWVyeSArPSBgY29uc3QgTXV0YXRpb24gPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xcbiR7dGFifW5hbWU6ICdNdXRhdGlvbicsXFxuJHt0YWJ9ZmllbGRzOiB7XFxuYDtcblxuICBsZXQgZmlyc3RNdXRhdGlvbkxvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IHRhYmxlSW5kZXggaW4gdGFibGVzKSB7XG4gICAgaWYgKCFmaXJzdE11dGF0aW9uTG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TXV0YXRpb25Mb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBidWlsZEdyYXBocWxNdXRhdGlvblF1ZXJ5KHRhYmxlc1t0YWJsZUluZGV4XSwgZGF0YWJhc2UpO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn19XFxufSk7XFxuXFxuYDtcblxuICBxdWVyeSArPSBgbW9kdWxlLmV4cG9ydHMgPSBuZXcgR3JhcGhRTFNjaGVtYSh7XFxuJHt0YWJ9cXVlcnk6IFJvb3RRdWVyeSxcXG4ke3RhYn1tdXRhdGlvbjogTXV0YXRpb25cXG59KTtgO1xuICByZXR1cm4gcXVlcnk7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgLSBSZXByZXNlbnRzIHRoZSBkYXRhYmFzZSBzZWxlY3RlZCAoTW9uZ29EQiwgTXlTUUwsIG9yIFBvc3RncmVTUUwpXG4gKiBAcmV0dXJucyB7U3RyaW5nfSAtIEFsbCB0aGUgcmVxdWlyZSBzdGF0ZW1lbnRzIG5lZWRlZCBmb3IgdGhlIEdyYXBoUUwgc2VydmVyLlxuICovXG5mdW5jdGlvbiBidWlsZFJlcXVpcmVTdGF0ZW1lbnRzKHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHJlcXVpcmVTdGF0ZW1lbnRzID0gXCJjb25zdCBncmFwaHFsID0gcmVxdWlyZSgnZ3JhcGhxbCcpO1xcblwiO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ01vbmdvREInKSB7XG4gICAgZm9yIChjb25zdCB0YWJsZUluZGV4IGluIHRhYmxlcykge1xuICAgICAgcmVxdWlyZVN0YXRlbWVudHMgKz0gYGNvbnN0ICR7dGFibGVzW3RhYmxlSW5kZXhdLnR5cGV9ID0gcmVxdWlyZSgnLi4vZGIvJHt0YWJsZXNbdGFibGVJbmRleF0udHlwZS50b0xvd2VyQ2FzZSgpfS5qcycpO1xcbmA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcXVpcmVTdGF0ZW1lbnRzICs9IGBjb25zdCBwb29sID0gcmVxdWlyZSgnLi4vZGIvc3FsX3Bvb2wuanMnKTtcXG5gO1xuICB9XG4gIHJldHVybiByZXF1aXJlU3RhdGVtZW50cztcbn1cblxuXG4vKipcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gYWxsIGNvbnN0YW50cyBuZWVkZWQgZm9yIGEgR3JhcGhRTCBzZXJ2ZXJcbiAqL1xuZnVuY3Rpb24gYnVpbGRHcmFwaHFsVmFyaWFibGVzKCkge1xuICByZXR1cm4gYFxuY29uc3QgeyBcbiAgR3JhcGhRTE9iamVjdFR5cGUsXG4gIEdyYXBoUUxTY2hlbWEsXG4gIEdyYXBoUUxJRCxcbiAgR3JhcGhRTFN0cmluZywgXG4gIEdyYXBoUUxJbnQsIFxuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTExpc3QsXG4gIEdyYXBoUUxOb25OdWxsXG59ID0gZ3JhcGhxbDtcbiAgXFxuYFxufVxuXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlIC0gdGFibGUgYmVpbmcgaW50ZXJhdGVkIG9uLiBFYWNoIHRhYmxlIGNvbnNpc3RzIG9mIGZpZWxkc1xuICogQHBhcmFtIHtPYmplY3R9IHRhYmxlcyAtIGFuIG9iamVjdCBvZiBhbGwgdGhlIHRhYmxlcyBjcmVhdGVkIGluIHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gRGF0YWJhc2Ugc2VsZWN0ZWQgKE1vbmdvREIsIE15U1FMLCBvciBQb3N0Z3JlU1FMKVxuICogQHJldHVybnMge1N0cmluZ30gLSBUaGUgR3JhcGhRTCB0eXBlIGNvZGUgZm9yIHRoZSBpbnB1dHRlZCB0YWJsZVxuICovXG5mdW5jdGlvbiBidWlsZEdyYXBocWxUeXBlU2NoZW1hKHRhYmxlLCB0YWJsZXMsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGBjb25zdCAke3RhYmxlLnR5cGV9VHlwZSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifW5hbWU6ICcke3RhYmxlLnR5cGV9JyxcXG5gO1xuICBxdWVyeSArPSBgJHt0YWJ9ZmllbGRzOiAoKSA9PiAoe2A7XG4gIHF1ZXJ5ICs9IGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpO1xuICByZXR1cm4gcXVlcnkgKz0gYFxcbiR7dGFifX0pXFxufSk7XFxuXFxuYDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZSAtIHRhYmxlIGJlaW5nIGludGVyYXRlZCBvbi4gRWFjaCB0YWJsZSBjb25zaXN0cyBvZiBmaWVsZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbiBvYmplY3Qgb2YgYWxsIHRoZSB0YWJsZXMgY3JlYXRlZCBpbiB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGFiYXNlIHNlbGVjdGVkIChNb25nb0RCLCBNeVNRTCwgb3IgUG9zdGdyZVNRTClcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gZWFjaCBmaWVsZCBmb3IgdGhlIEdyYXBoUUwgdHlwZS4gXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhRTFR5cGVGaWVsZHModGFibGUsIHRhYmxlcywgZGF0YWJhc2UpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7IFxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChsZXQgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkrPSAnLCc7XG4gICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHtidWlsZEZpZWxkSXRlbSh0YWJsZS5maWVsZHNbZmllbGRJbmRleF0pfWA7XG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpZWxkIGhhcyBhIHJlbGF0aW9uIHRvIGFub3RoZXIgZmllbGRcbiAgICBpZiAodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlbGF0aW9uLnRhYmxlSW5kZXggPiAtMSkge1xuICAgICAgcXVlcnkgKz0gY3JlYXRlU3ViUXVlcnkodGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLCB0YWJsZXMsIGRhdGFiYXNlKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgZmllbGQgaXMgYSByZWxhdGlvbiBmb3IgYW5vdGhlciBmaWVsZFxuICAgIGNvbnN0IHJlZkJ5ID0gdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLnJlZkJ5O1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJlZkJ5KSkge1xuICAgICAgcmVmQnkuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFZhbHVlID0gdmFsdWUuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgZmllbGQgPSB7XG4gICAgICAgICAgbmFtZTogdGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdLm5hbWUsXG4gICAgICAgICAgcmVsYXRpb246IHtcbiAgICAgICAgICAgIHRhYmxlSW5kZXg6IHBhcnNlZFZhbHVlWzBdLFxuICAgICAgICAgICAgZmllbGRJbmRleDogcGFyc2VkVmFsdWVbMV0sXG4gICAgICAgICAgICByZWZUeXBlOiBwYXJzZWRWYWx1ZVsyXSxcbiAgICAgICAgICAgIHR5cGU6IHRhYmxlLmZpZWxkc1tmaWVsZEluZGV4XS50eXBlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBxdWVyeSArPSBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5OyBcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZCAtIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgaW5mb3JtYXRpb24gZm9yIHRoZSBmaWVsZCBiZWluZyBpdGVyYXRlZCBvblxuICogQHJldHVybnMge1N0cmluZ30gLSBhIGZpZWxkIGl0ZW0gKGV4OiAnaWQ6IHsgdHlwZTogR3JhcGhRTElEIH0nKVxuICovXG5mdW5jdGlvbiBidWlsZEZpZWxkSXRlbShmaWVsZCkge1xuICByZXR1cm4gIGAke2ZpZWxkLm5hbWV9OiB7IHR5cGU6ICR7Y2hlY2tGb3JSZXF1aXJlZChmaWVsZC5yZXF1aXJlZCwgJ2Zyb250Jyl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKGZpZWxkLm11bHRpcGxlVmFsdWVzLCAnZnJvbnQnKX0ke3RhYmxlVHlwZVRvR3JhcGhxbFR5cGUoZmllbGQudHlwZSl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKGZpZWxkLm11bHRpcGxlVmFsdWVzLCAnYmFjaycpfSR7Y2hlY2tGb3JSZXF1aXJlZChmaWVsZC5yZXF1aXJlZCwgJ2JhY2snKX0gfWA7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIHRoZSBmaWVsZCB0eXBlIChJRCwgU3RyaW5nLCBOdW1iZXIsIEJvb2xlYW4sIG9yIEZsb2F0KVxuICogQHJldHVybnMge1N0cmluZ30gLSB0aGUgR3JhcGhRTCB0eXBlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZmllbGQgdHlwZSBlbnRlcmVkXG4gKi9cbmZ1bmN0aW9uIHRhYmxlVHlwZVRvR3JhcGhxbFR5cGUodHlwZSkge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdJRCc6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxJRCc7XG4gICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTFN0cmluZyc7XG4gICAgY2FzZSAnTnVtYmVyJzpcbiAgICAgIHJldHVybiAnR3JhcGhRTEludCc7XG4gICAgY2FzZSAnQm9vbGVhbic6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxCb29sZWFuJztcbiAgICBjYXNlICdGbG9hdCc6XG4gICAgICByZXR1cm4gJ0dyYXBoUUxGbG9hdCc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnR3JhcGhRTFN0cmluZyc7XG4gIH1cbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWZUeXBlTmFtZSAtIEFueSBzdHJpbmcgaW5wdXR0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gVGhlIHN0cmluZyBpbnB1dHRlZCwgYnV0IHdpdGggdGhlIGZpcnN0IGxldHRlciBjYXBpdGFsaXplZCBhbmQgdGhlIHJlc3QgbG93ZXJjYXNlZFxuICovXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSkge1xuICBsZXQgbmFtZSA9IHJlZlR5cGVOYW1lWzBdLnRvVXBwZXJDYXNlKCk7XG4gIG5hbWUgKz0gcmVmVHlwZU5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIG5hbWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGZpZWxkIC0gZmllbGQgYmVpbmcgaXRlcmF0ZWQgb25cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YWJsZXMgLSBhbGwgdGhlIHRhYmxlcyBtYWRlIGJ5IHRoZSB1c2VyLiBcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhYmFzZSAtIERhdGJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gQnVpbGRzIGEgc3ViIHR5cGUgZm9yIGFueSBmaWVsZCB3aXRoIGEgcmVsYXRpb24uIFxuICovXG5mdW5jdGlvbiBjcmVhdGVTdWJRdWVyeShmaWVsZCwgdGFibGVzLCBkYXRhYmFzZSkge1xuICBjb25zdCByZWZUeXBlTmFtZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS50eXBlO1xuICBjb25zdCByZWZGaWVsZE5hbWUgPSB0YWJsZXNbZmllbGQucmVsYXRpb24udGFibGVJbmRleF0uZmllbGRzW2ZpZWxkLnJlbGF0aW9uLmZpZWxkSW5kZXhdLm5hbWU7XG4gIGNvbnN0IHJlZkZpZWxkVHlwZSA9IHRhYmxlc1tmaWVsZC5yZWxhdGlvbi50YWJsZUluZGV4XS5maWVsZHNbZmllbGQucmVsYXRpb24uZmllbGRJbmRleF0udHlwZTtcbiAgbGV0IHF1ZXJ5ID0gYCxcXG4ke3RhYn0ke3RhYn0ke2NyZWF0ZVN1YlF1ZXJ5TmFtZShmaWVsZCwgcmVmVHlwZU5hbWUpfToge1xcbiR7dGFifSR7dGFifSR7dGFifXR5cGU6IGA7XG5cbiAgaWYgKGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUgPT09ICdvbmUgdG8gbWFueScgfHwgZmllbGQucmVsYXRpb24ucmVmVHlwZSA9PT0gJ21hbnkgdG8gbWFueScpIHtcbiAgICBxdWVyeSArPSBgbmV3IEdyYXBoUUxMaXN0KCR7cmVmVHlwZU5hbWV9VHlwZSksYDtcbiAgfSBlbHNlIHtcbiAgICBxdWVyeSArPSBgJHtyZWZUeXBlTmFtZX1UeXBlLGA7XG4gIH1cbiAgcXVlcnkgKz0gYFxcbiR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHtyZWZUeXBlTmFtZX0uJHtmaW5kRGJTZWFyY2hNZXRob2QocmVmRmllbGROYW1lLCByZWZGaWVsZFR5cGUsIGZpZWxkLnJlbGF0aW9uLnJlZlR5cGUpfWA7XG4gICAgcXVlcnkgKz0gYCgke2NyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpfSk7XFxuYDtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifX1gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgU0VMRUNUICogRlJPTSBcIiR7cmVmVHlwZU5hbWV9XCIgV0hFUkUgXCIke3JlZkZpZWxkTmFtZX1cIiA9ICdcXCR7cGFyZW50LiR7ZmllbGQubmFtZX19JztcXGBcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sUXVlcnkoZmllbGQucmVsYXRpb24ucmVmVHlwZSlcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbmA7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifX1gO1xuICB9XG4gIHJldHVybiBxdWVyeTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVmVHlwZSAtIFRoZSByZWxhdGlvbiB0eXBlIG9mIHRoZSBzdWIgcXVlcnlcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gdGhlIGNvZGUgZm9yIGEgU1FMIHBvb2wgcXVlcnkuIFxuICovXG5mdW5jdGlvbiBidWlsZFNRTFBvb2xRdWVyeShyZWZUeXBlKSB7XG4gIGxldCByb3dzID0gJyc7IFxuICBpZiAocmVmVHlwZSA9PT0gJ29uZSB0byBvbmUnIHx8IHJlZlR5cGUgPT09ICdtYW55IHRvIG9uZScpIHJvd3MgPSAncm93c1swXSdcbiAgZWxzZSByb3dzID0gJ3Jvd3MnXG5cbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBwb29sLnF1ZXJ5KHNxbClcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4gcmVzLiR7cm93c30pXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9LmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycikpXFxuYFxuICByZXR1cm4gcXVlcnk7IFxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdWJRdWVyeU5hbWUoZmllbGQsIHJlZlR5cGVOYW1lKSB7XG4gIHN3aXRjaCAoZmllbGQucmVsYXRpb24ucmVmVHlwZSkge1xuICAgIGNhc2UgJ29uZSB0byBvbmUnOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdvbmUgdG8gbWFueSc6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gICAgY2FzZSAnbWFueSB0byBvbmUnOlxuICAgICAgcmV0dXJuIGByZWxhdGVkJHt0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSl9YDtcbiAgICBjYXNlICdtYW55IHRvIG1hbnknOlxuICAgICAgcmV0dXJuIGBldmVyeVJlbGF0ZWQke3RvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKX1gO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYGV2ZXJ5UmVsYXRlZCR7dG9UaXRsZUNhc2UocmVmVHlwZU5hbWUpfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZERiU2VhcmNoTWV0aG9kKHJlZkZpZWxkTmFtZSwgcmVmRmllbGRUeXBlLCByZWZUeXBlKSB7XG4gIGlmIChyZWZGaWVsZE5hbWUgPT09ICdpZCcgfHwgcmVmRmllbGRUeXBlID09PSAnSUQnKSByZXR1cm4gJ2ZpbmRCeUlkJztcbiAgZWxzZSBpZiAocmVmVHlwZSA9PT0gJ29uZSB0byBvbmUnKSByZXR1cm4gJ2ZpbmRPbmUnO1xuICBlbHNlIHJldHVybiAnZmluZCc7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlYXJjaE9iamVjdChyZWZGaWVsZE5hbWUsIHJlZkZpZWxkVHlwZSwgZmllbGQpIHtcbiAgaWYgKHJlZkZpZWxkTmFtZSA9PT0gJ2lkJyB8fCByZWZGaWVsZFR5cGUgPT09ICdJRCcpIHtcbiAgICByZXR1cm4gYHBhcmVudC4ke2ZpZWxkLm5hbWV9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYHsgJHtyZWZGaWVsZE5hbWV9OiBwYXJlbnQuJHtmaWVsZC5uYW1lfSB9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZEdyYXBocWxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9ICcnO1xuXG4gIHF1ZXJ5ICs9IGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKTtcblxuICBpZiAoISF0YWJsZS5maWVsZHNbMF0pIHtcbiAgICBxdWVyeSArPSBjcmVhdGVGaW5kQnlJZFF1ZXJ5KHRhYmxlLCBkYXRhYmFzZSk7XG4gIH1cblxuICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRBbGxSb290UXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1ldmVyeSR7dG9UaXRsZUNhc2UodGFibGUudHlwZSl9OiB7XFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogbmV3IEdyYXBoUUxMaXN0KCR7dGFibGUudHlwZX1UeXBlKSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKCkge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuICR7dGFibGUudHlwZX0uZmluZCh7fSk7XFxuYDtcbiAgfVxuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3RhYmxlLnR5cGV9XCI7XFxgXFxuYDtcbiAgICBxdWVyeSArPSBidWlsZFNRTFBvb2xRdWVyeSgnbWFueScpXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFibGUgLSB0YWJsZSBiZWluZyBpdGVyYXRlZCBvblxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFiYXNlIC0gZGF0YWJhc2Ugc2VsZWN0ZWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IC0gcm9vdCBxdWVyeSBjb2RlIHRvIGZpbmQgYW4gaW5kaXZpZHVhbCB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZpbmRCeUlkUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGNvbnN0IGlkRmllbGROYW1lID0gdGFibGUuZmllbGRzWzBdLm5hbWU7XG4gIGxldCBxdWVyeSA9IGAsXFxuJHt0YWJ9JHt0YWJ9JHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9OiB7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXR5cGU6ICR7dGFibGUudHlwZX1UeXBlLFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0YWJsZS5maWVsZHNbMF0udHlwZSl9fX0sXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZChhcmdzLmlkKTtcXG5gO1xuICB9XG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFNFTEVDVCAqIEZST00gXCIke3RhYmxlLnR5cGV9XCIgV0hFUkUgJHtpZEZpZWxkTmFtZX0gPSAnXFwke2FyZ3MuaWR9JztcXGA7XFxuYFxuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbFF1ZXJ5KCdvbmUgdG8gb25lJyk7IFxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGhxbE11dGF0aW9uUXVlcnkodGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBzdHJpbmcgPSBgYDtcbiAgc3RyaW5nICs9IGAke2FkZE11dGF0aW9uKHRhYmxlLCBkYXRhYmFzZSl9YDtcbiAgaWYgKHRhYmxlLmZpZWxkc1swXSkge1xuICAgIHN0cmluZyArPSBgLFxcbiR7dXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX0sXFxuYDtcbiAgICBzdHJpbmcgKz0gYCR7ZGVsZXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKX1gO1xuICB9XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU1FMUG9vbE11dGF0aW9uKCkge1xuICBsZXQgc3RyaW5nID0gYGA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9cmV0dXJuIHBvb2wuY29ubmVjdCgpXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS50aGVuKGNsaWVudCA9PiB7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiBjbGllbnQucXVlcnkoc3FsKVxcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0udGhlbihyZXMgPT4ge1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jbGllbnQucmVsZWFzZSgpO1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gcmVzLnJvd3NbMF07XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifS5jYXRjaChlcnIgPT4ge1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jbGllbnQucmVsZWFzZSgpO1xcbmBcbiAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifX0pXFxuYFxuICByZXR1cm4gc3RyaW5nOyBcbn1cblxuZnVuY3Rpb24gYWRkTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn1hZGQke3RhYmxlLnR5cGV9OiB7XFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuYFxuICAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0odGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdKX1gO1xuICB9XG4gIHF1ZXJ5ICs9IGBcXG4ke3RhYn0ke3RhYn0ke3RhYn19LFxcbmBcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCAke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX0gPSBuZXcgJHt0YWJsZS50eXBlfShhcmdzKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifXJldHVybiAke3RhYmxlLnR5cGUudG9Mb3dlckNhc2UoKX0uc2F2ZSgpO1xcbmA7XG4gIH1cblxuICBpZiAoZGF0YWJhc2UgPT09ICdNeVNRTCcgfHwgZGF0YWJhc2UgPT09ICdQb3N0Z3JlU1FMJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBjb2x1bW5zID0gT2JqZWN0LmtleXMoYXJncykubWFwKGVsID0+IFxcYFwiXFwke2VsfVwiXFxgKTtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoYXJncykubWFwKGVsID0+IFxcYCdcXCR7ZWx9J1xcYCk7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1jb25zdCBzcWwgPSBcXGBJTlNFUlQgSU5UTyBcIiR7dGFibGUudHlwZX1cIiAoXFwke2NvbHVtbnN9KSBWQUxVRVMgKFxcJHt2YWx1ZXN9KSBSRVRVUk5JTkcgKlxcYDtcXG5gXG4gICAgcXVlcnkgKz0gYnVpbGRTUUxQb29sTXV0YXRpb24oKTsgXG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifX1cXG4ke3RhYn0ke3RhYn19YDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTXV0YXRpb24odGFibGUsIGRhdGFiYXNlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke3RhYn11cGRhdGUke3RhYmxlLnR5cGV9OiB7XFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9dHlwZTogJHt0YWJsZS50eXBlfVR5cGUsXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9YXJnczoge1xcbmA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJbmRleCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJyxcXG4nO1xuICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7YnVpbGRGaWVsZEl0ZW0odGFibGUuZmllbGRzW2ZpZWxkSW5kZXhdKX1gXG4gIH1cblxuICBxdWVyeSArPSBgXFxuJHt0YWJ9JHt0YWJ9JHt0YWJ9fSxcXG4ke3RhYn0ke3RhYn0ke3RhYn1yZXNvbHZlKHBhcmVudCwgYXJncykge1xcbmA7XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTW9uZ29EQicpIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFVwZGF0ZShhcmdzLmlkLCBhcmdzKTtcXG5gO1xuXG4gIGlmIChkYXRhYmFzZSA9PT0gJ015U1FMJyB8fCBkYXRhYmFzZSA9PT0gJ1Bvc3RncmVTUUwnKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWxldCB1cGRhdGVWYWx1ZXMgPSAnJztcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWZvciAoY29uc3QgcHJvcCBpbiBhcmdzKSB7XFxuYFxuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1pZiAodXBkYXRlVmFsdWVzLmxlbmd0aCA+IDApIHVwZGF0ZVZhbHVlcyArPSBcXGAsIFxcYDtcXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifSR7dGFifXVwZGF0ZVZhbHVlcyArPSBcXGBcIlxcJHtwcm9wfVwiID0gJ1xcJHthcmdzW3Byb3BdfScgXFxgO1xcbmAgICAgXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifX1cXG5gXG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFifWNvbnN0IHNxbCA9IFxcYFVQREFURSBcIiR7dGFibGUudHlwZX1cIiBTRVQgXFwke3VwZGF0ZVZhbHVlc30gV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7IFxuICB9XG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9fVxcbiR7dGFifSR7dGFifX1gO1xufVxuXG5mdW5jdGlvbiBkZWxldGVNdXRhdGlvbih0YWJsZSwgZGF0YWJhc2UpIHtcbiAgY29uc3QgaWRGaWVsZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYCR7dGFifSR7dGFifWRlbGV0ZSR7dGFibGUudHlwZX06IHtcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn10eXBlOiAke3RhYmxlLnR5cGV9VHlwZSxcXG5gXG4gICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn1hcmdzOiB7ICR7aWRGaWVsZE5hbWV9OiB7IHR5cGU6ICR7dGFibGVUeXBlVG9HcmFwaHFsVHlwZSh0YWJsZS5maWVsZHNbMF0udHlwZSkgfX19LFxcbmBcbiAgICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifXJlc29sdmUocGFyZW50LCBhcmdzKSB7XFxuYDtcblxuICBpZiAoZGF0YWJhc2UgPT09ICdNb25nb0RCJykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYn1yZXR1cm4gJHt0YWJsZS50eXBlfS5maW5kQnlJZEFuZFJlbW92ZShhcmdzLmlkKTtcXG5gO1xuICB9XG5cbiAgaWYgKGRhdGFiYXNlID09PSAnTXlTUUwnIHx8IGRhdGFiYXNlID09PSAnUG9zdGdyZVNRTCcpIHtcbiAgICBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJ9Y29uc3Qgc3FsID0gXFxgREVMRVRFIEZST00gXCIke3RhYmxlLnR5cGV9XCIgV0hFUkUgaWQgPSAnXFwke2FyZ3MuaWR9JyBSRVRVUk5JTkcgKjtcXGBcXG5gO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkU1FMUG9vbE11dGF0aW9uKCk7IFxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn19XFxuJHt0YWJ9JHt0YWJ9fWA7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yUmVxdWlyZWQocmVxdWlyZWQsIHBvc2l0aW9uKSB7XG4gIGlmIChyZXF1aXJlZCkge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2Zyb250Jykge1xuICAgICAgcmV0dXJuICduZXcgR3JhcGhRTE5vbk51bGwoJztcbiAgICB9XG4gICAgcmV0dXJuICcpJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMobXVsdGlwbGVWYWx1ZXMsIHBvc2l0aW9uKSB7XG4gIGlmIChtdWx0aXBsZVZhbHVlcykge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2Zyb250Jykge1xuICAgICAgcmV0dXJuICduZXcgR3JhcGhRTExpc3QoJztcbiAgICB9XG4gICAgcmV0dXJuICcpJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VHcmFwaHFsU2VydmVyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==