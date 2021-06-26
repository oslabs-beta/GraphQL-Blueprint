webpackHotUpdate("main",{

/***/ "../utl/create_file_func/client_mutations.js":
/*!***************************************************!*\
  !*** ../utl/create_file_func/client_mutations.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tab = '  ';

function parseClientMutations(tables) {
  var query = "import { gql } from \'apollo-boost\';\n\n";
  var exportNames = [];

  // Build mutations
  for (var tableId in tables) {
    // Build add mutations
    query += buildMutationParams(tables[tableId], 'add');
    query += buildTypeParams(tables[tableId], 'add');
    query += buildReturnValues(tables[tableId]);
    exportNames.push('add' + tables[tableId].type + 'Mutation');

    // Build delete and update mutations if there is an unique id
    if (tables[tableId].fields[0]) {
      // update mutations
      query += buildMutationParams(tables[tableId], 'update');
      query += buildTypeParams(tables[tableId], 'update');
      query += buildReturnValues(tables[tableId]);
      exportNames.push('update' + tables[tableId].type + 'Mutation');
      // delete mutations
      query += buildDeleteMutationParams(tables[tableId]);
      query += buildReturnValues(tables[tableId]);
      exportNames.push('delete' + tables[tableId].type + 'Mutation');
    }
  }

  var endString = 'export {\n';
  exportNames.forEach(function (name, i) {
    if (i === 0) {
      endString += '' + tab + name + ',\n';
    } else {
      endString += '' + tab + name + ',\n';
    }
  });

  return query += endString + '};';
}

// builds params for either add or update mutations
function buildMutationParams(table, mutationType) {
  var query = 'const ' + mutationType + table.type + 'Mutation = gql`\n' + tab + 'mutation(';

  var firstLoop = true;
  for (var fieldId in table.fields) {
    // if there's an unique id and creating an update mutation, then take in ID
    if (fieldId === '0' && mutationType === 'update') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += '$' + table.fields[fieldId].name + ': ' + table.fields[fieldId].type + '!';
    }
    if (fieldId !== '0') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += '$' + table.fields[fieldId].name + ': ' + checkForMultipleValues(table.fields[fieldId].multipleValues, 'front');
      query += '' + checkFieldType(table.fields[fieldId].type) + checkForMultipleValues(table.fields[fieldId].multipleValues, 'back');
      query += '' + checkForRequired(table.fields[fieldId].required);
    }
  }
  return query += ') {\n' + tab;
}

// in case the inputed field type is Number, turn to Int to work with GraphQL
function checkFieldType(fieldType) {
  if (fieldType === 'Number') return 'Int';else return fieldType;
}

function buildDeleteMutationParams(table) {
  var idName = table.fields[0].name;
  var query = 'const delete' + table.type + 'Mutation = gql`\n';
  query += tab + 'mutation($' + idName + ': ' + table.fields[0].type + '!){\n';
  query += '' + tab + tab + 'delete' + table.type + '(' + idName + ': $' + idName + '){\n';
  return query;
}

function checkForMultipleValues(multipleValues, position) {
  if (multipleValues) {
    if (position === 'front') {
      return '[';
    }
    return ']';
  }
  return '';
}

function checkForRequired(required) {
  if (required) {
    return '!';
  }
  return '';
}

function buildTypeParams(table, mutationType) {
  var query = '' + tab + mutationType + table.type + '(';

  var firstLoop = true;
  for (var fieldId in table.fields) {
    // if there's an unique id and creating an update mutation, then take in ID
    if (fieldId === '0' && mutationType === 'update') {
      if (!firstLoop) query += ', ';
      firstLoop = false;
      query += table.fields[fieldId].name + ': $' + table.fields[fieldId].name;
    }
    if (fieldId !== '0') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += table.fields[fieldId].name + ': $' + table.fields[fieldId].name;
    }
  }
  return query += ') {\n';
}

function buildReturnValues(table) {
  var query = '';

  for (var fieldId in table.fields) {
    query += '' + tab + tab + tab + table.fields[fieldId].name + '\n';
  }

  return query += '' + tab + tab + '}\n' + tab + '}\n`\n\n';
}

module.exports = parseClientMutations;

/***/ }),

/***/ "../utl/create_file_func/client_queries.js":
/*!*************************************************!*\
  !*** ../utl/create_file_func/client_queries.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tab = "  ";

function parseClientQueries(tables) {
  var query = "import { gql } from \'apollo-boost\';\n\n";
  var exportNames = [];

  // tables is state.tables from schemaReducer
  for (var tableId in tables) {
    query += buildClientQueryAll(tables[tableId]);
    exportNames.push("queryEvery" + tables[tableId].type);

    if (!!tables[tableId].fields[0]) {
      query += buildClientQueryById(tables[tableId]);
      exportNames.push("query" + tables[tableId].type + "ById ");
    }
  }

  var endString = 'export {';
  exportNames.forEach(function (name, i) {
    if (i) {
      endString += ", " + name;
    } else {
      endString += " " + name;
    }
  });

  return query += endString + "};";
}

function buildClientQueryAll(table) {
  var string = "const queryEvery" + table.type + " = gql`\n";
  string += tab + "{\n";
  string += "" + tab + tab + "every" + toTitleCase(table.type) + " {\n";

  for (var fieldId in table.fields) {
    string += "" + tab + tab + tab + table.fields[fieldId].name + "\n";
  }

  return string += "" + tab + tab + "}\n" + tab + "}\n`\n\n";
}

function toTitleCase(refTypeName) {
  var name = refTypeName[0].toUpperCase();
  name += refTypeName.slice(1).toLowerCase();
  return name;
}

function buildClientQueryById(table) {
  var string = "const query" + table.type + "ById = gql`\n";
  string += tab + "query($" + table.fields[0].name + ": " + table.fields[0].type + "!) {\n";
  string += "" + tab + tab + table.type.toLowerCase() + "(" + table.fields[0].name + ": $" + table.fields[0].name + ") {\n";

  for (var fieldId in table.fields) {
    string += "" + tab + tab + tab + table.fields[fieldId].name + "\n";
  }

  return string += "" + tab + tab + "}\n" + tab + "}\n`\n\n";
}

module.exports = parseClientQueries;

/***/ }),

/***/ "./components/code/code-containers/client-code.jsx":
/*!*********************************************************!*\
  !*** ./components/code/code-containers/client-code.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(/*! react */ "../node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _client_queries = __webpack_require__(/*! ../../../../utl/create_file_func/client_queries */ "../utl/create_file_func/client_queries.js");

var _client_queries2 = _interopRequireDefault(_client_queries);

var _client_mutations = __webpack_require__(/*! ../../../../utl/create_file_func/client_mutations */ "../utl/create_file_func/client_mutations.js");

var _client_mutations2 = _interopRequireDefault(_client_mutations);

__webpack_require__(/*! ../code.css */ "./components/code/code.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(store) {
  return {
    tables: store.schema.tables,
    databases: store.multiSchema.databases
  };
};

// styling


var createCombinedTables = function createCombinedTables(_ref) {
  var databases = _ref.databases;

  var num = 0;
  var tablesCombined = {};
  for (var databaseIndex in databases) {
    var database = databases[databaseIndex];
    for (var index in database.data) {
      tablesCombined[num] = database.data[index];
      num++;
    }
  }
  return tablesCombined;
};

console.log(tablesCombined);
var CodeClientContainer = function CodeClientContainer(_ref2) {
  var tables = _ref2.tables;

  console.log('tables in client-code.jsx', tables);
  var clientQueries = (0, _client_queries2.default)(tables);
  var clientMutations = (0, _client_mutations2.default)(tables);

  return _react2.default.createElement(
    'div',
    { id: 'code-container-client' },
    _react2.default.createElement(
      'h4',
      { className: 'codeHeader' },
      'Client Queries'
    ),
    _react2.default.createElement('hr', null),
    _react2.default.createElement(
      'pre',
      null,
      clientQueries
    ),
    _react2.default.createElement('br', null),
    _react2.default.createElement('br', null),
    _react2.default.createElement(
      'h4',
      { className: 'codeHeader' },
      'Client Mutations'
    ),
    _react2.default.createElement('hr', null),
    _react2.default.createElement(
      'pre',
      null,
      clientMutations
    )
  );
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, null)(CodeClientContainer);

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X211dGF0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X3F1ZXJpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9jb2RlL2NvZGUtY29udGFpbmVycy9jbGllbnQtY29kZS5qc3giXSwibmFtZXMiOlsidGFiIiwicGFyc2VDbGllbnRNdXRhdGlvbnMiLCJ0YWJsZXMiLCJxdWVyeSIsImV4cG9ydE5hbWVzIiwidGFibGVJZCIsImJ1aWxkTXV0YXRpb25QYXJhbXMiLCJidWlsZFR5cGVQYXJhbXMiLCJidWlsZFJldHVyblZhbHVlcyIsInB1c2giLCJ0eXBlIiwiZmllbGRzIiwiYnVpbGREZWxldGVNdXRhdGlvblBhcmFtcyIsImVuZFN0cmluZyIsImZvckVhY2giLCJuYW1lIiwiaSIsInRhYmxlIiwibXV0YXRpb25UeXBlIiwiZmlyc3RMb29wIiwiZmllbGRJZCIsImNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMiLCJtdWx0aXBsZVZhbHVlcyIsImNoZWNrRmllbGRUeXBlIiwiY2hlY2tGb3JSZXF1aXJlZCIsInJlcXVpcmVkIiwiZmllbGRUeXBlIiwiaWROYW1lIiwicG9zaXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwicGFyc2VDbGllbnRRdWVyaWVzIiwiYnVpbGRDbGllbnRRdWVyeUFsbCIsImJ1aWxkQ2xpZW50UXVlcnlCeUlkIiwic3RyaW5nIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0b3JlIiwic2NoZW1hIiwiZGF0YWJhc2VzIiwibXVsdGlTY2hlbWEiLCJjcmVhdGVDb21iaW5lZFRhYmxlcyIsIm51bSIsInRhYmxlc0NvbWJpbmVkIiwiZGF0YWJhc2VJbmRleCIsImRhdGFiYXNlIiwiaW5kZXgiLCJkYXRhIiwiY29uc29sZSIsImxvZyIsIkNvZGVDbGllbnRDb250YWluZXIiLCJjbGllbnRRdWVyaWVzIiwiY2xpZW50TXV0YXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxVQUFOOztBQUVBLFNBQVNDLG9CQUFULENBQThCQyxNQUE5QixFQUFzQztBQUNwQyxNQUFJQyxRQUFRLDJDQUFaO0FBQ0EsTUFBTUMsY0FBYyxFQUFwQjs7QUFFQTtBQUNBLE9BQUssSUFBTUMsT0FBWCxJQUFzQkgsTUFBdEIsRUFBOEI7QUFDNUI7QUFDQUMsYUFBU0csb0JBQW9CSixPQUFPRyxPQUFQLENBQXBCLEVBQXFDLEtBQXJDLENBQVQ7QUFDQUYsYUFBU0ksZ0JBQWdCTCxPQUFPRyxPQUFQLENBQWhCLEVBQWlDLEtBQWpDLENBQVQ7QUFDQUYsYUFBU0ssa0JBQWtCTixPQUFPRyxPQUFQLENBQWxCLENBQVQ7QUFDQUQsZ0JBQVlLLElBQVosU0FBdUJQLE9BQU9HLE9BQVAsRUFBZ0JLLElBQXZDOztBQUVBO0FBQ0EsUUFBSVIsT0FBT0csT0FBUCxFQUFnQk0sTUFBaEIsQ0FBdUIsQ0FBdkIsQ0FBSixFQUErQjtBQUM3QjtBQUNBUixlQUFTRyxvQkFBb0JKLE9BQU9HLE9BQVAsQ0FBcEIsRUFBcUMsUUFBckMsQ0FBVDtBQUNBRixlQUFTSSxnQkFBZ0JMLE9BQU9HLE9BQVAsQ0FBaEIsRUFBaUMsUUFBakMsQ0FBVDtBQUNBRixlQUFTSyxrQkFBa0JOLE9BQU9HLE9BQVAsQ0FBbEIsQ0FBVDtBQUNBRCxrQkFBWUssSUFBWixZQUEwQlAsT0FBT0csT0FBUCxFQUFnQkssSUFBMUM7QUFDQTtBQUNBUCxlQUFTUywwQkFBMEJWLE9BQU9HLE9BQVAsQ0FBMUIsQ0FBVDtBQUNBRixlQUFTSyxrQkFBa0JOLE9BQU9HLE9BQVAsQ0FBbEIsQ0FBVDtBQUNBRCxrQkFBWUssSUFBWixZQUEwQlAsT0FBT0csT0FBUCxFQUFnQkssSUFBMUM7QUFDRDtBQUNGOztBQUVELE1BQUlHLHdCQUFKO0FBQ0FULGNBQVlVLE9BQVosQ0FBb0IsVUFBQ0MsSUFBRCxFQUFPQyxDQUFQLEVBQWE7QUFDL0IsUUFBSUEsTUFBTSxDQUFWLEVBQWE7QUFDWEgsd0JBQWdCYixHQUFoQixHQUFzQmUsSUFBdEI7QUFDRCxLQUZELE1BRU87QUFDTEYsd0JBQWdCYixHQUFoQixHQUFzQmUsSUFBdEI7QUFDRDtBQUNGLEdBTkQ7O0FBUUEsU0FBT1osU0FBWVUsU0FBWixPQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxTQUFTUCxtQkFBVCxDQUE2QlcsS0FBN0IsRUFBb0NDLFlBQXBDLEVBQWtEO0FBQ2hELE1BQUlmLG1CQUFpQmUsWUFBakIsR0FBZ0NELE1BQU1QLElBQXRDLHlCQUErRFYsR0FBL0QsY0FBSjs7QUFFQSxNQUFJbUIsWUFBWSxJQUFoQjtBQUNBLE9BQUssSUFBTUMsT0FBWCxJQUFzQkgsTUFBTU4sTUFBNUIsRUFBb0M7QUFDbEM7QUFDQSxRQUFJUyxZQUFZLEdBQVosSUFBbUJGLGlCQUFpQixRQUF4QyxFQUFrRDtBQUNoRCxVQUFJLENBQUNDLFNBQUwsRUFBZ0JoQixTQUFTLElBQVQ7QUFDaEJnQixrQkFBWSxLQUFaOztBQUVBaEIscUJBQWFjLE1BQU1OLE1BQU4sQ0FBYVMsT0FBYixFQUFzQkwsSUFBbkMsVUFBNENFLE1BQU1OLE1BQU4sQ0FBYVMsT0FBYixFQUFzQlYsSUFBbEU7QUFDRDtBQUNELFFBQUlVLFlBQVksR0FBaEIsRUFBcUI7QUFDbkIsVUFBSSxDQUFDRCxTQUFMLEVBQWdCaEIsU0FBUyxJQUFUO0FBQ2hCZ0Isa0JBQVksS0FBWjs7QUFFQWhCLHFCQUFhYyxNQUFNTixNQUFOLENBQWFTLE9BQWIsRUFBc0JMLElBQW5DLFVBQTRDTSx1QkFBdUJKLE1BQU1OLE1BQU4sQ0FBYVMsT0FBYixFQUFzQkUsY0FBN0MsRUFBNkQsT0FBN0QsQ0FBNUM7QUFDQW5CLG9CQUFZb0IsZUFBZU4sTUFBTU4sTUFBTixDQUFhUyxPQUFiLEVBQXNCVixJQUFyQyxDQUFaLEdBQXlEVyx1QkFBdUJKLE1BQU1OLE1BQU4sQ0FBYVMsT0FBYixFQUFzQkUsY0FBN0MsRUFBNkQsTUFBN0QsQ0FBekQ7QUFDQW5CLG9CQUFZcUIsaUJBQWlCUCxNQUFNTixNQUFOLENBQWFTLE9BQWIsRUFBc0JLLFFBQXZDLENBQVo7QUFDRDtBQUNGO0FBQ0QsU0FBT3RCLG1CQUFpQkgsR0FBeEI7QUFDRDs7QUFFRDtBQUNBLFNBQVN1QixjQUFULENBQXdCRyxTQUF4QixFQUFtQztBQUNqQyxNQUFJQSxjQUFjLFFBQWxCLEVBQTRCLE9BQU8sS0FBUCxDQUE1QixLQUNLLE9BQU9BLFNBQVA7QUFDTjs7QUFHRCxTQUFTZCx5QkFBVCxDQUFtQ0ssS0FBbkMsRUFBMEM7QUFDeEMsTUFBTVUsU0FBU1YsTUFBTU4sTUFBTixDQUFhLENBQWIsRUFBZ0JJLElBQS9CO0FBQ0EsTUFBSVoseUJBQXVCYyxNQUFNUCxJQUE3QixzQkFBSjtBQUNBUCxXQUFZSCxHQUFaLGtCQUE0QjJCLE1BQTVCLFVBQXVDVixNQUFNTixNQUFOLENBQWEsQ0FBYixFQUFnQkQsSUFBdkQ7QUFDQVAsZ0JBQVlILEdBQVosR0FBa0JBLEdBQWxCLGNBQThCaUIsTUFBTVAsSUFBcEMsU0FBNENpQixNQUE1QyxXQUF3REEsTUFBeEQ7QUFDQSxTQUFPeEIsS0FBUDtBQUNEOztBQUVELFNBQVNrQixzQkFBVCxDQUFnQ0MsY0FBaEMsRUFBZ0RNLFFBQWhELEVBQTBEO0FBQ3hELE1BQUlOLGNBQUosRUFBb0I7QUFDbEIsUUFBSU0sYUFBYSxPQUFqQixFQUEwQjtBQUN4QixhQUFPLEdBQVA7QUFDRDtBQUNELFdBQU8sR0FBUDtBQUNEO0FBQ0QsU0FBTyxFQUFQO0FBQ0Q7O0FBRUQsU0FBU0osZ0JBQVQsQ0FBMEJDLFFBQTFCLEVBQW9DO0FBQ2xDLE1BQUlBLFFBQUosRUFBYztBQUNaLFdBQU8sR0FBUDtBQUNEO0FBQ0QsU0FBTyxFQUFQO0FBQ0Q7O0FBRUQsU0FBU2xCLGVBQVQsQ0FBeUJVLEtBQXpCLEVBQWdDQyxZQUFoQyxFQUE4QztBQUM1QyxNQUFJZixhQUFXSCxHQUFYLEdBQWlCa0IsWUFBakIsR0FBZ0NELE1BQU1QLElBQXRDLE1BQUo7O0FBRUEsTUFBSVMsWUFBWSxJQUFoQjtBQUNBLE9BQUssSUFBTUMsT0FBWCxJQUFzQkgsTUFBTU4sTUFBNUIsRUFBb0M7QUFDbEM7QUFDQSxRQUFJUyxZQUFZLEdBQVosSUFBbUJGLGlCQUFpQixRQUF4QyxFQUFrRDtBQUNoRCxVQUFJLENBQUNDLFNBQUwsRUFBZ0JoQixTQUFTLElBQVQ7QUFDaEJnQixrQkFBWSxLQUFaO0FBQ0FoQixlQUFZYyxNQUFNTixNQUFOLENBQWFTLE9BQWIsRUFBc0JMLElBQWxDLFdBQTRDRSxNQUFNTixNQUFOLENBQWFTLE9BQWIsRUFBc0JMLElBQWxFO0FBQ0Q7QUFDRCxRQUFJSyxZQUFZLEdBQWhCLEVBQXFCO0FBQ25CLFVBQUksQ0FBQ0QsU0FBTCxFQUFnQmhCLFNBQVMsSUFBVDtBQUNoQmdCLGtCQUFZLEtBQVo7O0FBRUFoQixlQUFZYyxNQUFNTixNQUFOLENBQWFTLE9BQWIsRUFBc0JMLElBQWxDLFdBQTRDRSxNQUFNTixNQUFOLENBQWFTLE9BQWIsRUFBc0JMLElBQWxFO0FBQ0Q7QUFDRjtBQUNELFNBQU9aLGdCQUFQO0FBQ0Q7O0FBRUQsU0FBU0ssaUJBQVQsQ0FBMkJTLEtBQTNCLEVBQWtDO0FBQ2hDLE1BQUlkLFFBQVEsRUFBWjs7QUFFQSxPQUFLLElBQU1pQixPQUFYLElBQXNCSCxNQUFNTixNQUE1QixFQUFvQztBQUNsQ1Isa0JBQVlILEdBQVosR0FBa0JBLEdBQWxCLEdBQXdCQSxHQUF4QixHQUE4QmlCLE1BQU1OLE1BQU4sQ0FBYVMsT0FBYixFQUFzQkwsSUFBcEQ7QUFDRDs7QUFFRCxTQUFPWixjQUFZSCxHQUFaLEdBQWtCQSxHQUFsQixXQUEyQkEsR0FBM0IsYUFBUDtBQUNEOztBQUVENkIsT0FBT0MsT0FBUCxHQUFpQjdCLG9CQUFqQixDOzs7Ozs7Ozs7Ozs7OztBQ2hJQSxJQUFNRCxVQUFOOztBQUVBLFNBQVMrQixrQkFBVCxDQUE0QjdCLE1BQTVCLEVBQW9DO0FBQ2xDLE1BQUlDLFFBQVEsMkNBQVo7QUFDQSxNQUFNQyxjQUFjLEVBQXBCOztBQUVBO0FBQ0EsT0FBSyxJQUFNQyxPQUFYLElBQXNCSCxNQUF0QixFQUE4QjtBQUM1QkMsYUFBUzZCLG9CQUFvQjlCLE9BQU9HLE9BQVAsQ0FBcEIsQ0FBVDtBQUNBRCxnQkFBWUssSUFBWixnQkFBOEJQLE9BQU9HLE9BQVAsRUFBZ0JLLElBQTlDOztBQUVBLFFBQUksQ0FBQyxDQUFDUixPQUFPRyxPQUFQLEVBQWdCTSxNQUFoQixDQUF1QixDQUF2QixDQUFOLEVBQWlDO0FBQy9CUixlQUFTOEIscUJBQXFCL0IsT0FBT0csT0FBUCxDQUFyQixDQUFUO0FBQ0FELGtCQUFZSyxJQUFaLFdBQXlCUCxPQUFPRyxPQUFQLEVBQWdCSyxJQUF6QztBQUNEO0FBQ0Y7O0FBRUQsTUFBSUcsWUFBWSxVQUFoQjtBQUNBVCxjQUFZVSxPQUFaLENBQW9CLFVBQUNDLElBQUQsRUFBT0MsQ0FBUCxFQUFhO0FBQy9CLFFBQUlBLENBQUosRUFBTztBQUNMSCwwQkFBa0JFLElBQWxCO0FBQ0QsS0FGRCxNQUVPO0FBQ0xGLHlCQUFpQkUsSUFBakI7QUFDRDtBQUNGLEdBTkQ7O0FBUUEsU0FBT1osU0FBWVUsU0FBWixPQUFQO0FBQ0Q7O0FBRUQsU0FBU21CLG1CQUFULENBQTZCZixLQUE3QixFQUFvQztBQUNsQyxNQUFJaUIsOEJBQTRCakIsTUFBTVAsSUFBbEMsY0FBSjtBQUNBd0IsWUFBYWxDLEdBQWI7QUFDQWtDLGlCQUFhbEMsR0FBYixHQUFtQkEsR0FBbkIsYUFBOEJtQyxZQUFZbEIsTUFBTVAsSUFBbEIsQ0FBOUI7O0FBRUEsT0FBSyxJQUFNVSxPQUFYLElBQXNCSCxNQUFNTixNQUE1QixFQUFvQztBQUNsQ3VCLG1CQUFhbEMsR0FBYixHQUFtQkEsR0FBbkIsR0FBeUJBLEdBQXpCLEdBQStCaUIsTUFBTU4sTUFBTixDQUFhUyxPQUFiLEVBQXNCTCxJQUFyRDtBQUNEOztBQUVELFNBQU9tQixlQUFhbEMsR0FBYixHQUFtQkEsR0FBbkIsV0FBNEJBLEdBQTVCLGFBQVA7QUFDRDs7QUFFRCxTQUFTbUMsV0FBVCxDQUFxQkMsV0FBckIsRUFBa0M7QUFDaEMsTUFBSXJCLE9BQU9xQixZQUFZLENBQVosRUFBZUMsV0FBZixFQUFYO0FBQ0F0QixVQUFRcUIsWUFBWUUsS0FBWixDQUFrQixDQUFsQixFQUFxQkMsV0FBckIsRUFBUjtBQUNBLFNBQU94QixJQUFQO0FBQ0Q7O0FBRUQsU0FBU2tCLG9CQUFULENBQThCaEIsS0FBOUIsRUFBcUM7QUFDbkMsTUFBSWlCLHlCQUF1QmpCLE1BQU1QLElBQTdCLGtCQUFKO0FBQ0F3QixZQUFhbEMsR0FBYixlQUEwQmlCLE1BQU1OLE1BQU4sQ0FBYSxDQUFiLEVBQWdCSSxJQUExQyxVQUFtREUsTUFBTU4sTUFBTixDQUFhLENBQWIsRUFBZ0JELElBQW5FO0FBQ0F3QixpQkFBYWxDLEdBQWIsR0FBbUJBLEdBQW5CLEdBQXlCaUIsTUFBTVAsSUFBTixDQUFXNkIsV0FBWCxFQUF6QixTQUFxRHRCLE1BQU1OLE1BQU4sQ0FBYSxDQUFiLEVBQWdCSSxJQUFyRSxXQUErRUUsTUFBTU4sTUFBTixDQUFhLENBQWIsRUFBZ0JJLElBQS9GOztBQUVBLE9BQUssSUFBTUssT0FBWCxJQUFzQkgsTUFBTU4sTUFBNUIsRUFBb0M7QUFDbEN1QixtQkFBYWxDLEdBQWIsR0FBbUJBLEdBQW5CLEdBQXlCQSxHQUF6QixHQUErQmlCLE1BQU1OLE1BQU4sQ0FBYVMsT0FBYixFQUFzQkwsSUFBckQ7QUFDRDs7QUFFRCxTQUFPbUIsZUFBYWxDLEdBQWIsR0FBbUJBLEdBQW5CLFdBQTRCQSxHQUE1QixhQUFQO0FBQ0Q7O0FBRUQ2QixPQUFPQyxPQUFQLEdBQWlCQyxrQkFBakIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0RBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBRUEsSUFBTVMsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLFNBQVU7QUFDaEN0QyxZQUFRdUMsTUFBTUMsTUFBTixDQUFheEMsTUFEVztBQUVoQ3lDLGVBQVdGLE1BQU1HLFdBQU4sQ0FBa0JEO0FBRkcsR0FBVjtBQUFBLENBQXhCOztBQUhBOzs7QUFRQSxJQUFNRSx1QkFBdUIsU0FBdkJBLG9CQUF1QixPQUFpQjtBQUFBLE1BQWZGLFNBQWUsUUFBZkEsU0FBZTs7QUFDNUMsTUFBSUcsTUFBTSxDQUFWO0FBQ0EsTUFBTUMsaUJBQWlCLEVBQXZCO0FBQ0EsT0FBSyxJQUFNQyxhQUFYLElBQTRCTCxTQUE1QixFQUF1QztBQUNuQyxRQUFNTSxXQUFXTixVQUFVSyxhQUFWLENBQWpCO0FBQ0EsU0FBSyxJQUFNRSxLQUFYLElBQW9CRCxTQUFTRSxJQUE3QixFQUFtQztBQUNuQ0oscUJBQWVELEdBQWYsSUFBc0JHLFNBQVNFLElBQVQsQ0FBY0QsS0FBZCxDQUF0QjtBQUNBSjtBQUNEO0FBQ0Y7QUFDRCxTQUFPQyxjQUFQO0FBQ0QsQ0FYRDs7QUFhQUssUUFBUUMsR0FBUixDQUFZTixjQUFaO0FBQ0EsSUFBTU8sc0JBQXNCLFNBQXRCQSxtQkFBc0IsUUFBZ0I7QUFBQSxNQUFicEQsTUFBYSxTQUFiQSxNQUFhOztBQUMxQ2tELFVBQVFDLEdBQVIsQ0FBWSwyQkFBWixFQUF5Q25ELE1BQXpDO0FBQ0EsTUFBTXFELGdCQUFnQiw4QkFBbUJyRCxNQUFuQixDQUF0QjtBQUNBLE1BQU1zRCxrQkFBa0IsZ0NBQXFCdEQsTUFBckIsQ0FBeEI7O0FBRUEsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFDR3FEO0FBREgsS0FIRjtBQU1FLDZDQU5GO0FBT0UsNkNBUEY7QUFRRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBUkY7QUFTRSw2Q0FURjtBQVVFO0FBQUE7QUFBQTtBQUNHQztBQURIO0FBVkYsR0FERjtBQWdCRCxDQXJCRDs7a0JBdUJlLHlCQUFRaEIsZUFBUixFQUF5QixJQUF6QixFQUErQmMsbUJBQS9CLEMiLCJmaWxlIjoibWFpbi42YzdhYzAyMjg1OTc1NmJlYWU0Mi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGFiID0gYCAgYDtcblxuZnVuY3Rpb24gcGFyc2VDbGllbnRNdXRhdGlvbnModGFibGVzKSB7XG4gIGxldCBxdWVyeSA9IFwiaW1wb3J0IHsgZ3FsIH0gZnJvbSBcXCdhcG9sbG8tYm9vc3RcXCc7XFxuXFxuXCI7XG4gIGNvbnN0IGV4cG9ydE5hbWVzID0gW107XG5cbiAgLy8gQnVpbGQgbXV0YXRpb25zXG4gIGZvciAoY29uc3QgdGFibGVJZCBpbiB0YWJsZXMpIHtcbiAgICAvLyBCdWlsZCBhZGQgbXV0YXRpb25zXG4gICAgcXVlcnkgKz0gYnVpbGRNdXRhdGlvblBhcmFtcyh0YWJsZXNbdGFibGVJZF0sICdhZGQnKTtcbiAgICBxdWVyeSArPSBidWlsZFR5cGVQYXJhbXModGFibGVzW3RhYmxlSWRdLCAnYWRkJyk7XG4gICAgcXVlcnkgKz0gYnVpbGRSZXR1cm5WYWx1ZXModGFibGVzW3RhYmxlSWRdKTtcbiAgICBleHBvcnROYW1lcy5wdXNoKGBhZGQke3RhYmxlc1t0YWJsZUlkXS50eXBlfU11dGF0aW9uYCk7XG5cbiAgICAvLyBCdWlsZCBkZWxldGUgYW5kIHVwZGF0ZSBtdXRhdGlvbnMgaWYgdGhlcmUgaXMgYW4gdW5pcXVlIGlkXG4gICAgaWYgKHRhYmxlc1t0YWJsZUlkXS5maWVsZHNbMF0pIHtcbiAgICAgIC8vIHVwZGF0ZSBtdXRhdGlvbnNcbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkTXV0YXRpb25QYXJhbXModGFibGVzW3RhYmxlSWRdLCAndXBkYXRlJyk7XG4gICAgICBxdWVyeSArPSBidWlsZFR5cGVQYXJhbXModGFibGVzW3RhYmxlSWRdLCAndXBkYXRlJyk7XG4gICAgICBxdWVyeSArPSBidWlsZFJldHVyblZhbHVlcyh0YWJsZXNbdGFibGVJZF0pO1xuICAgICAgZXhwb3J0TmFtZXMucHVzaChgdXBkYXRlJHt0YWJsZXNbdGFibGVJZF0udHlwZX1NdXRhdGlvbmApO1xuICAgICAgLy8gZGVsZXRlIG11dGF0aW9uc1xuICAgICAgcXVlcnkgKz0gYnVpbGREZWxldGVNdXRhdGlvblBhcmFtcyh0YWJsZXNbdGFibGVJZF0pO1xuICAgICAgcXVlcnkgKz0gYnVpbGRSZXR1cm5WYWx1ZXModGFibGVzW3RhYmxlSWRdKTtcbiAgICAgIGV4cG9ydE5hbWVzLnB1c2goYGRlbGV0ZSR7dGFibGVzW3RhYmxlSWRdLnR5cGV9TXV0YXRpb25gKTtcbiAgICB9XG4gIH1cblxuICBsZXQgZW5kU3RyaW5nID0gYGV4cG9ydCB7XFxuYDtcbiAgZXhwb3J0TmFtZXMuZm9yRWFjaCgobmFtZSwgaSkgPT4ge1xuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBlbmRTdHJpbmcgKz0gYCR7dGFifSR7bmFtZX0sXFxuYDtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kU3RyaW5nICs9IGAke3RhYn0ke25hbWV9LFxcbmA7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcXVlcnkgKz0gYCR7ZW5kU3RyaW5nICB9fTtgO1xufVxuXG4vLyBidWlsZHMgcGFyYW1zIGZvciBlaXRoZXIgYWRkIG9yIHVwZGF0ZSBtdXRhdGlvbnNcbmZ1bmN0aW9uIGJ1aWxkTXV0YXRpb25QYXJhbXModGFibGUsIG11dGF0aW9uVHlwZSkge1xuICBsZXQgcXVlcnkgPSBgY29uc3QgJHttdXRhdGlvblR5cGV9JHt0YWJsZS50eXBlfU11dGF0aW9uID0gZ3FsXFxgXFxuJHt0YWJ9bXV0YXRpb24oYDtcblxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBmaWVsZElkIGluIHRhYmxlLmZpZWxkcykge1xuICAgIC8vIGlmIHRoZXJlJ3MgYW4gdW5pcXVlIGlkIGFuZCBjcmVhdGluZyBhbiB1cGRhdGUgbXV0YXRpb24sIHRoZW4gdGFrZSBpbiBJRFxuICAgIGlmIChmaWVsZElkID09PSAnMCcgJiYgbXV0YXRpb25UeXBlID09PSAndXBkYXRlJykge1xuICAgICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9ICcsICc7XG4gICAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgICAgcXVlcnkgKz0gYCQke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfTogJHt0YWJsZS5maWVsZHNbZmllbGRJZF0udHlwZX0hYDtcbiAgICB9XG4gICAgaWYgKGZpZWxkSWQgIT09ICcwJykge1xuICAgICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9ICcsICc7XG4gICAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgICAgcXVlcnkgKz0gYCQke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfTogJHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKHRhYmxlLmZpZWxkc1tmaWVsZElkXS5tdWx0aXBsZVZhbHVlcywgJ2Zyb250Jyl9YDtcbiAgICAgIHF1ZXJ5ICs9IGAke2NoZWNrRmllbGRUeXBlKHRhYmxlLmZpZWxkc1tmaWVsZElkXS50eXBlKX0ke2NoZWNrRm9yTXVsdGlwbGVWYWx1ZXModGFibGUuZmllbGRzW2ZpZWxkSWRdLm11bHRpcGxlVmFsdWVzLCAnYmFjaycpfWA7XG4gICAgICBxdWVyeSArPSBgJHtjaGVja0ZvclJlcXVpcmVkKHRhYmxlLmZpZWxkc1tmaWVsZElkXS5yZXF1aXJlZCl9YDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5ICs9IGApIHtcXG4ke3RhYn1gO1xufVxuXG4vLyBpbiBjYXNlIHRoZSBpbnB1dGVkIGZpZWxkIHR5cGUgaXMgTnVtYmVyLCB0dXJuIHRvIEludCB0byB3b3JrIHdpdGggR3JhcGhRTFxuZnVuY3Rpb24gY2hlY2tGaWVsZFR5cGUoZmllbGRUeXBlKSB7XG4gIGlmIChmaWVsZFR5cGUgPT09ICdOdW1iZXInKSByZXR1cm4gJ0ludCc7XG4gIGVsc2UgcmV0dXJuIGZpZWxkVHlwZTtcbn1cblxuXG5mdW5jdGlvbiBidWlsZERlbGV0ZU11dGF0aW9uUGFyYW1zKHRhYmxlKSB7XG4gIGNvbnN0IGlkTmFtZSA9IHRhYmxlLmZpZWxkc1swXS5uYW1lO1xuICBsZXQgcXVlcnkgPSBgY29uc3QgZGVsZXRlJHt0YWJsZS50eXBlfU11dGF0aW9uID0gZ3FsXFxgXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifW11dGF0aW9uKCQke2lkTmFtZX06ICR7dGFibGUuZmllbGRzWzBdLnR5cGV9ISl7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifWRlbGV0ZSR7dGFibGUudHlwZX0oJHtpZE5hbWV9OiAkJHtpZE5hbWV9KXtcXG5gO1xuICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMobXVsdGlwbGVWYWx1ZXMsIHBvc2l0aW9uKSB7XG4gIGlmIChtdWx0aXBsZVZhbHVlcykge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2Zyb250Jykge1xuICAgICAgcmV0dXJuICdbJztcbiAgICB9XG4gICAgcmV0dXJuICddJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yUmVxdWlyZWQocmVxdWlyZWQpIHtcbiAgaWYgKHJlcXVpcmVkKSB7XG4gICAgcmV0dXJuICchJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkVHlwZVBhcmFtcyh0YWJsZSwgbXV0YXRpb25UeXBlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke211dGF0aW9uVHlwZX0ke3RhYmxlLnR5cGV9KGA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJZCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICAvLyBpZiB0aGVyZSdzIGFuIHVuaXF1ZSBpZCBhbmQgY3JlYXRpbmcgYW4gdXBkYXRlIG11dGF0aW9uLCB0aGVuIHRha2UgaW4gSURcbiAgICBpZiAoZmllbGRJZCA9PT0gJzAnICYmIG11dGF0aW9uVHlwZSA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLCAnO1xuICAgICAgZmlyc3RMb29wID0gZmFsc2U7XG4gICAgICBxdWVyeSArPSBgJHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX06ICQke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfWA7XG4gICAgfVxuICAgIGlmIChmaWVsZElkICE9PSAnMCcpIHtcbiAgICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLCAnO1xuICAgICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICAgIHF1ZXJ5ICs9IGAke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfTogJCR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLm5hbWV9YDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5ICs9IGApIHtcXG5gO1xufVxuXG5mdW5jdGlvbiBidWlsZFJldHVyblZhbHVlcyh0YWJsZSkge1xuICBsZXQgcXVlcnkgPSAnJztcblxuICBmb3IgKGNvbnN0IGZpZWxkSWQgaW4gdGFibGUuZmllbGRzKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLm5hbWV9XFxuYDtcbiAgfVxuXG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9fVxcbiR7dGFifX1cXG5cXGBcXG5cXG5gO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlQ2xpZW50TXV0YXRpb25zO1xuIiwiY29uc3QgdGFiID0gYCAgYDtcblxuZnVuY3Rpb24gcGFyc2VDbGllbnRRdWVyaWVzKHRhYmxlcykge1xuICBsZXQgcXVlcnkgPSBcImltcG9ydCB7IGdxbCB9IGZyb20gXFwnYXBvbGxvLWJvb3N0XFwnO1xcblxcblwiO1xuICBjb25zdCBleHBvcnROYW1lcyA9IFtdO1xuXG4gIC8vIHRhYmxlcyBpcyBzdGF0ZS50YWJsZXMgZnJvbSBzY2hlbWFSZWR1Y2VyXG4gIGZvciAoY29uc3QgdGFibGVJZCBpbiB0YWJsZXMpIHtcbiAgICBxdWVyeSArPSBidWlsZENsaWVudFF1ZXJ5QWxsKHRhYmxlc1t0YWJsZUlkXSk7XG4gICAgZXhwb3J0TmFtZXMucHVzaChgcXVlcnlFdmVyeSR7dGFibGVzW3RhYmxlSWRdLnR5cGV9YCk7XG5cbiAgICBpZiAoISF0YWJsZXNbdGFibGVJZF0uZmllbGRzWzBdKSB7XG4gICAgICBxdWVyeSArPSBidWlsZENsaWVudFF1ZXJ5QnlJZCh0YWJsZXNbdGFibGVJZF0pO1xuICAgICAgZXhwb3J0TmFtZXMucHVzaChgcXVlcnkke3RhYmxlc1t0YWJsZUlkXS50eXBlfUJ5SWQgYCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IGVuZFN0cmluZyA9ICdleHBvcnQgeyc7XG4gIGV4cG9ydE5hbWVzLmZvckVhY2goKG5hbWUsIGkpID0+IHtcbiAgICBpZiAoaSkge1xuICAgICAgZW5kU3RyaW5nICs9IGAsICR7bmFtZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmRTdHJpbmcgKz0gYCAke25hbWV9YDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBxdWVyeSArPSBgJHtlbmRTdHJpbmcgIH19O2A7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ2xpZW50UXVlcnlBbGwodGFibGUpIHtcbiAgbGV0IHN0cmluZyA9IGBjb25zdCBxdWVyeUV2ZXJ5JHt0YWJsZS50eXBlfSA9IGdxbFxcYFxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9e1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9ZXZlcnkke3RvVGl0bGVDYXNlKHRhYmxlLnR5cGUpfSB7XFxuYDtcblxuICBmb3IgKGNvbnN0IGZpZWxkSWQgaW4gdGFibGUuZmllbGRzKSB7XG4gICAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfVxcbmA7XG4gIH1cblxuICByZXR1cm4gc3RyaW5nICs9IGAke3RhYn0ke3RhYn19XFxuJHt0YWJ9fVxcblxcYFxcblxcbmA7XG59XG5cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKSB7XG4gIGxldCBuYW1lID0gcmVmVHlwZU5hbWVbMF0udG9VcHBlckNhc2UoKTtcbiAgbmFtZSArPSByZWZUeXBlTmFtZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gbmFtZTtcbn1cblxuZnVuY3Rpb24gYnVpbGRDbGllbnRRdWVyeUJ5SWQodGFibGUpIHtcbiAgbGV0IHN0cmluZyA9IGBjb25zdCBxdWVyeSR7dGFibGUudHlwZX1CeUlkID0gZ3FsXFxgXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn1xdWVyeSgkJHt0YWJsZS5maWVsZHNbMF0ubmFtZX06ICR7dGFibGUuZmllbGRzWzBdLnR5cGV9ISkge1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9KCR7dGFibGUuZmllbGRzWzBdLm5hbWV9OiAkJHt0YWJsZS5maWVsZHNbMF0ubmFtZX0pIHtcXG5gO1xuICBcbiAgZm9yIChjb25zdCBmaWVsZElkIGluIHRhYmxlLmZpZWxkcykge1xuICAgIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX1cXG5gO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9fVxcbiR7dGFifX1cXG5cXGBcXG5cXG5gO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlQ2xpZW50UXVlcmllcztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IGJ1aWxkQ2xpZW50UXVlcmllcyBmcm9tICcuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9jbGllbnRfcXVlcmllcyc7XG5pbXBvcnQgYnVpbGRDbGllbnRNdXRhdGlvbnMgZnJvbSAnLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X211dGF0aW9ucyc7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCAnLi4vY29kZS5jc3MnO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBzdG9yZSA9PiAoe1xuICB0YWJsZXM6IHN0b3JlLnNjaGVtYS50YWJsZXMsXG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzXG59KTtcblxuY29uc3QgY3JlYXRlQ29tYmluZWRUYWJsZXMgPSAoe2RhdGFiYXNlc30pID0+IHtcbiAgbGV0IG51bSA9IDA7XG4gIGNvbnN0IHRhYmxlc0NvbWJpbmVkID0ge31cbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICAgICAgY29uc3QgZGF0YWJhc2UgPSBkYXRhYmFzZXNbZGF0YWJhc2VJbmRleF07XG4gICAgICBmb3IgKGNvbnN0IGluZGV4IGluIGRhdGFiYXNlLmRhdGEpIHtcbiAgICAgIHRhYmxlc0NvbWJpbmVkW251bV0gPSBkYXRhYmFzZS5kYXRhW2luZGV4XVxuICAgICAgbnVtKys7XG4gICAgfVxuICB9XG4gIHJldHVybiB0YWJsZXNDb21iaW5lZDtcbn1cblxuY29uc29sZS5sb2codGFibGVzQ29tYmluZWQpO1xuY29uc3QgQ29kZUNsaWVudENvbnRhaW5lciA9ICh7IHRhYmxlcyB9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCd0YWJsZXMgaW4gY2xpZW50LWNvZGUuanN4JywgdGFibGVzKVxuICBjb25zdCBjbGllbnRRdWVyaWVzID0gYnVpbGRDbGllbnRRdWVyaWVzKHRhYmxlcyk7XG4gIGNvbnN0IGNsaWVudE11dGF0aW9ucyA9IGJ1aWxkQ2xpZW50TXV0YXRpb25zKHRhYmxlcyk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItY2xpZW50XCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkNsaWVudCBRdWVyaWVzPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT5cbiAgICAgICAge2NsaWVudFF1ZXJpZXN9XG4gICAgICA8L3ByZT5cbiAgICAgIDxiciAvPlxuICAgICAgPGJyIC8+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkNsaWVudCBNdXRhdGlvbnM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPlxuICAgICAgICB7Y2xpZW50TXV0YXRpb25zfVxuICAgICAgPC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZUNsaWVudENvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9