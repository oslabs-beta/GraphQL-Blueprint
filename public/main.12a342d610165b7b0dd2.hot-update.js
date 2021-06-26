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


var tablesCombined = {};
for (var databaseIndex in databases) {}
var CodeClientContainer = function CodeClientContainer(_ref) {
  var tables = _ref.tables;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X211dGF0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X3F1ZXJpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9jb2RlL2NvZGUtY29udGFpbmVycy9jbGllbnQtY29kZS5qc3giXSwibmFtZXMiOlsidGFiIiwicGFyc2VDbGllbnRNdXRhdGlvbnMiLCJ0YWJsZXMiLCJxdWVyeSIsImV4cG9ydE5hbWVzIiwidGFibGVJZCIsImJ1aWxkTXV0YXRpb25QYXJhbXMiLCJidWlsZFR5cGVQYXJhbXMiLCJidWlsZFJldHVyblZhbHVlcyIsInB1c2giLCJ0eXBlIiwiZmllbGRzIiwiYnVpbGREZWxldGVNdXRhdGlvblBhcmFtcyIsImVuZFN0cmluZyIsImZvckVhY2giLCJuYW1lIiwiaSIsInRhYmxlIiwibXV0YXRpb25UeXBlIiwiZmlyc3RMb29wIiwiZmllbGRJZCIsImNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMiLCJtdWx0aXBsZVZhbHVlcyIsImNoZWNrRmllbGRUeXBlIiwiY2hlY2tGb3JSZXF1aXJlZCIsInJlcXVpcmVkIiwiZmllbGRUeXBlIiwiaWROYW1lIiwicG9zaXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwicGFyc2VDbGllbnRRdWVyaWVzIiwiYnVpbGRDbGllbnRRdWVyeUFsbCIsImJ1aWxkQ2xpZW50UXVlcnlCeUlkIiwic3RyaW5nIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0b3JlIiwic2NoZW1hIiwiZGF0YWJhc2VzIiwibXVsdGlTY2hlbWEiLCJ0YWJsZXNDb21iaW5lZCIsImRhdGFiYXNlSW5kZXgiLCJDb2RlQ2xpZW50Q29udGFpbmVyIiwiY29uc29sZSIsImxvZyIsImNsaWVudFF1ZXJpZXMiLCJjbGll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NUIsRUFBdUMsQ0FFdEM7QUFDRCxJQUFNSSxzQkFBc0IsU0FBdEJBLG1CQUFzQixPQUFnQjtBQUFBLE1BQWI3QyxNQUFhLFFBQWJBLE1BQWE7O0FBQzFDOEMsVUFBUUMsR0FBUixDQUFZLDJCQUFaLEVBQXlDL0MsTUFBekM7QUFDQSxNQUFNZ0QsZ0JBQWdCLDhCQUFtQmhELE1BQW5CLENBQXRCO0FBQ0EsTUFBTWlELGtCQUFrQixnQ0FBcUJqRCxNQUFyQixDQUF4Qjs7QUFFQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUNHZ0Q7QUFESCxLQUhGO0FBTUUsNkNBTkY7QUFPRSw2Q0FQRjtBQVFFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FSRjtBQVNFLDZDQVRGO0FBVUU7QUFBQTtBQUFBO0FBQ0dDO0FBREg7QUFWRixHQURGO0FBZ0JELENBckJEOztrQkF1QmUseUJBQVFYLGVBQVIsRUFBeUIsSUFBekIsRUFBK0JPLG1CQUEvQixDIiwiZmlsZSI6Im1haW4uMTJhMzQyZDYxMDE2NWI3YjBkZDIuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhYiA9IGAgIGA7XG5cbmZ1bmN0aW9uIHBhcnNlQ2xpZW50TXV0YXRpb25zKHRhYmxlcykge1xuICBsZXQgcXVlcnkgPSBcImltcG9ydCB7IGdxbCB9IGZyb20gXFwnYXBvbGxvLWJvb3N0XFwnO1xcblxcblwiO1xuICBjb25zdCBleHBvcnROYW1lcyA9IFtdO1xuXG4gIC8vIEJ1aWxkIG11dGF0aW9uc1xuICBmb3IgKGNvbnN0IHRhYmxlSWQgaW4gdGFibGVzKSB7XG4gICAgLy8gQnVpbGQgYWRkIG11dGF0aW9uc1xuICAgIHF1ZXJ5ICs9IGJ1aWxkTXV0YXRpb25QYXJhbXModGFibGVzW3RhYmxlSWRdLCAnYWRkJyk7XG4gICAgcXVlcnkgKz0gYnVpbGRUeXBlUGFyYW1zKHRhYmxlc1t0YWJsZUlkXSwgJ2FkZCcpO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkUmV0dXJuVmFsdWVzKHRhYmxlc1t0YWJsZUlkXSk7XG4gICAgZXhwb3J0TmFtZXMucHVzaChgYWRkJHt0YWJsZXNbdGFibGVJZF0udHlwZX1NdXRhdGlvbmApO1xuXG4gICAgLy8gQnVpbGQgZGVsZXRlIGFuZCB1cGRhdGUgbXV0YXRpb25zIGlmIHRoZXJlIGlzIGFuIHVuaXF1ZSBpZFxuICAgIGlmICh0YWJsZXNbdGFibGVJZF0uZmllbGRzWzBdKSB7XG4gICAgICAvLyB1cGRhdGUgbXV0YXRpb25zXG4gICAgICBxdWVyeSArPSBidWlsZE11dGF0aW9uUGFyYW1zKHRhYmxlc1t0YWJsZUlkXSwgJ3VwZGF0ZScpO1xuICAgICAgcXVlcnkgKz0gYnVpbGRUeXBlUGFyYW1zKHRhYmxlc1t0YWJsZUlkXSwgJ3VwZGF0ZScpO1xuICAgICAgcXVlcnkgKz0gYnVpbGRSZXR1cm5WYWx1ZXModGFibGVzW3RhYmxlSWRdKTtcbiAgICAgIGV4cG9ydE5hbWVzLnB1c2goYHVwZGF0ZSR7dGFibGVzW3RhYmxlSWRdLnR5cGV9TXV0YXRpb25gKTtcbiAgICAgIC8vIGRlbGV0ZSBtdXRhdGlvbnNcbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkRGVsZXRlTXV0YXRpb25QYXJhbXModGFibGVzW3RhYmxlSWRdKTtcbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkUmV0dXJuVmFsdWVzKHRhYmxlc1t0YWJsZUlkXSk7XG4gICAgICBleHBvcnROYW1lcy5wdXNoKGBkZWxldGUke3RhYmxlc1t0YWJsZUlkXS50eXBlfU11dGF0aW9uYCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IGVuZFN0cmluZyA9IGBleHBvcnQge1xcbmA7XG4gIGV4cG9ydE5hbWVzLmZvckVhY2goKG5hbWUsIGkpID0+IHtcbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgZW5kU3RyaW5nICs9IGAke3RhYn0ke25hbWV9LFxcbmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZFN0cmluZyArPSBgJHt0YWJ9JHtuYW1lfSxcXG5gO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke2VuZFN0cmluZyAgfX07YDtcbn1cblxuLy8gYnVpbGRzIHBhcmFtcyBmb3IgZWl0aGVyIGFkZCBvciB1cGRhdGUgbXV0YXRpb25zXG5mdW5jdGlvbiBidWlsZE11dGF0aW9uUGFyYW1zKHRhYmxlLCBtdXRhdGlvblR5cGUpIHtcbiAgbGV0IHF1ZXJ5ID0gYGNvbnN0ICR7bXV0YXRpb25UeXBlfSR7dGFibGUudHlwZX1NdXRhdGlvbiA9IGdxbFxcYFxcbiR7dGFifW11dGF0aW9uKGA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJZCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICAvLyBpZiB0aGVyZSdzIGFuIHVuaXF1ZSBpZCBhbmQgY3JlYXRpbmcgYW4gdXBkYXRlIG11dGF0aW9uLCB0aGVuIHRha2UgaW4gSURcbiAgICBpZiAoZmllbGRJZCA9PT0gJzAnICYmIG11dGF0aW9uVHlwZSA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLCAnO1xuICAgICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICAgIHF1ZXJ5ICs9IGAkJHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX06ICR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLnR5cGV9IWA7XG4gICAgfVxuICAgIGlmIChmaWVsZElkICE9PSAnMCcpIHtcbiAgICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLCAnO1xuICAgICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICAgIHF1ZXJ5ICs9IGAkJHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX06ICR7Y2hlY2tGb3JNdWx0aXBsZVZhbHVlcyh0YWJsZS5maWVsZHNbZmllbGRJZF0ubXVsdGlwbGVWYWx1ZXMsICdmcm9udCcpfWA7XG4gICAgICBxdWVyeSArPSBgJHtjaGVja0ZpZWxkVHlwZSh0YWJsZS5maWVsZHNbZmllbGRJZF0udHlwZSl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKHRhYmxlLmZpZWxkc1tmaWVsZElkXS5tdWx0aXBsZVZhbHVlcywgJ2JhY2snKX1gO1xuICAgICAgcXVlcnkgKz0gYCR7Y2hlY2tGb3JSZXF1aXJlZCh0YWJsZS5maWVsZHNbZmllbGRJZF0ucmVxdWlyZWQpfWA7XG4gICAgfVxuICB9XG4gIHJldHVybiBxdWVyeSArPSBgKSB7XFxuJHt0YWJ9YDtcbn1cblxuLy8gaW4gY2FzZSB0aGUgaW5wdXRlZCBmaWVsZCB0eXBlIGlzIE51bWJlciwgdHVybiB0byBJbnQgdG8gd29yayB3aXRoIEdyYXBoUUxcbmZ1bmN0aW9uIGNoZWNrRmllbGRUeXBlKGZpZWxkVHlwZSkge1xuICBpZiAoZmllbGRUeXBlID09PSAnTnVtYmVyJykgcmV0dXJuICdJbnQnO1xuICBlbHNlIHJldHVybiBmaWVsZFR5cGU7XG59XG5cblxuZnVuY3Rpb24gYnVpbGREZWxldGVNdXRhdGlvblBhcmFtcyh0YWJsZSkge1xuICBjb25zdCBpZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYGNvbnN0IGRlbGV0ZSR7dGFibGUudHlwZX1NdXRhdGlvbiA9IGdxbFxcYFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn1tdXRhdGlvbigkJHtpZE5hbWV9OiAke3RhYmxlLmZpZWxkc1swXS50eXBlfSEpe1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn1kZWxldGUke3RhYmxlLnR5cGV9KCR7aWROYW1lfTogJCR7aWROYW1lfSl7XFxuYDtcbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG5mdW5jdGlvbiBjaGVja0Zvck11bHRpcGxlVmFsdWVzKG11bHRpcGxlVmFsdWVzLCBwb3NpdGlvbikge1xuICBpZiAobXVsdGlwbGVWYWx1ZXMpIHtcbiAgICBpZiAocG9zaXRpb24gPT09ICdmcm9udCcpIHtcbiAgICAgIHJldHVybiAnWyc7XG4gICAgfVxuICAgIHJldHVybiAnXSc7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvclJlcXVpcmVkKHJlcXVpcmVkKSB7XG4gIGlmIChyZXF1aXJlZCkge1xuICAgIHJldHVybiAnISc7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBidWlsZFR5cGVQYXJhbXModGFibGUsIG11dGF0aW9uVHlwZSkge1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHttdXRhdGlvblR5cGV9JHt0YWJsZS50eXBlfShgO1xuXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGZpZWxkSWQgaW4gdGFibGUuZmllbGRzKSB7XG4gICAgLy8gaWYgdGhlcmUncyBhbiB1bmlxdWUgaWQgYW5kIGNyZWF0aW5nIGFuIHVwZGF0ZSBtdXRhdGlvbiwgdGhlbiB0YWtlIGluIElEXG4gICAgaWYgKGZpZWxkSWQgPT09ICcwJyAmJiBtdXRhdGlvblR5cGUgPT09ICd1cGRhdGUnKSB7XG4gICAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJywgJztcbiAgICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuICAgICAgcXVlcnkgKz0gYCR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLm5hbWV9OiAkJHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX1gO1xuICAgIH1cbiAgICBpZiAoZmllbGRJZCAhPT0gJzAnKSB7XG4gICAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJywgJztcbiAgICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgICBxdWVyeSArPSBgJHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX06ICQke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfWA7XG4gICAgfVxuICB9XG4gIHJldHVybiBxdWVyeSArPSBgKSB7XFxuYDtcbn1cblxuZnVuY3Rpb24gYnVpbGRSZXR1cm5WYWx1ZXModGFibGUpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7XG5cbiAgZm9yIChjb25zdCBmaWVsZElkIGluIHRhYmxlLmZpZWxkcykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfVxcbmA7XG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifX1cXG4ke3RhYn19XFxuXFxgXFxuXFxuYDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUNsaWVudE11dGF0aW9ucztcbiIsImNvbnN0IHRhYiA9IGAgIGA7XG5cbmZ1bmN0aW9uIHBhcnNlQ2xpZW50UXVlcmllcyh0YWJsZXMpIHtcbiAgbGV0IHF1ZXJ5ID0gXCJpbXBvcnQgeyBncWwgfSBmcm9tIFxcJ2Fwb2xsby1ib29zdFxcJztcXG5cXG5cIjtcbiAgY29uc3QgZXhwb3J0TmFtZXMgPSBbXTtcblxuICAvLyB0YWJsZXMgaXMgc3RhdGUudGFibGVzIGZyb20gc2NoZW1hUmVkdWNlclxuICBmb3IgKGNvbnN0IHRhYmxlSWQgaW4gdGFibGVzKSB7XG4gICAgcXVlcnkgKz0gYnVpbGRDbGllbnRRdWVyeUFsbCh0YWJsZXNbdGFibGVJZF0pO1xuICAgIGV4cG9ydE5hbWVzLnB1c2goYHF1ZXJ5RXZlcnkke3RhYmxlc1t0YWJsZUlkXS50eXBlfWApO1xuXG4gICAgaWYgKCEhdGFibGVzW3RhYmxlSWRdLmZpZWxkc1swXSkge1xuICAgICAgcXVlcnkgKz0gYnVpbGRDbGllbnRRdWVyeUJ5SWQodGFibGVzW3RhYmxlSWRdKTtcbiAgICAgIGV4cG9ydE5hbWVzLnB1c2goYHF1ZXJ5JHt0YWJsZXNbdGFibGVJZF0udHlwZX1CeUlkIGApO1xuICAgIH1cbiAgfVxuXG4gIGxldCBlbmRTdHJpbmcgPSAnZXhwb3J0IHsnO1xuICBleHBvcnROYW1lcy5mb3JFYWNoKChuYW1lLCBpKSA9PiB7XG4gICAgaWYgKGkpIHtcbiAgICAgIGVuZFN0cmluZyArPSBgLCAke25hbWV9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kU3RyaW5nICs9IGAgJHtuYW1lfWA7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcXVlcnkgKz0gYCR7ZW5kU3RyaW5nICB9fTtgO1xufVxuXG5mdW5jdGlvbiBidWlsZENsaWVudFF1ZXJ5QWxsKHRhYmxlKSB7XG4gIGxldCBzdHJpbmcgPSBgY29uc3QgcXVlcnlFdmVyeSR7dGFibGUudHlwZX0gPSBncWxcXGBcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifXtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifWV2ZXJ5JHt0b1RpdGxlQ2FzZSh0YWJsZS50eXBlKX0ge1xcbmA7XG5cbiAgZm9yIChjb25zdCBmaWVsZElkIGluIHRhYmxlLmZpZWxkcykge1xuICAgIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX1cXG5gO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9fVxcbiR7dGFifX1cXG5cXGBcXG5cXG5gO1xufVxuXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSkge1xuICBsZXQgbmFtZSA9IHJlZlR5cGVOYW1lWzBdLnRvVXBwZXJDYXNlKCk7XG4gIG5hbWUgKz0gcmVmVHlwZU5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIG5hbWU7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ2xpZW50UXVlcnlCeUlkKHRhYmxlKSB7XG4gIGxldCBzdHJpbmcgPSBgY29uc3QgcXVlcnkke3RhYmxlLnR5cGV9QnlJZCA9IGdxbFxcYFxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9cXVlcnkoJCR7dGFibGUuZmllbGRzWzBdLm5hbWV9OiAke3RhYmxlLmZpZWxkc1swXS50eXBlfSEpIHtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfSgke3RhYmxlLmZpZWxkc1swXS5uYW1lfTogJCR7dGFibGUuZmllbGRzWzBdLm5hbWV9KSB7XFxuYDtcbiAgXG4gIGZvciAoY29uc3QgZmllbGRJZCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLm5hbWV9XFxuYDtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmcgKz0gYCR7dGFifSR7dGFifX1cXG4ke3RhYn19XFxuXFxgXFxuXFxuYDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUNsaWVudFF1ZXJpZXM7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBidWlsZENsaWVudFF1ZXJpZXMgZnJvbSAnLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X3F1ZXJpZXMnO1xuaW1wb3J0IGJ1aWxkQ2xpZW50TXV0YXRpb25zIGZyb20gJy4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2NsaWVudF9tdXRhdGlvbnMnO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgJy4uL2NvZGUuY3NzJztcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gc3RvcmUgPT4gKHtcbiAgdGFibGVzOiBzdG9yZS5zY2hlbWEudGFibGVzLFxuICBkYXRhYmFzZXM6IHN0b3JlLm11bHRpU2NoZW1hLmRhdGFiYXNlc1xufSk7XG5cbmNvbnN0IHRhYmxlc0NvbWJpbmVkID0ge31cbmZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXMpIHtcbiAgXG59XG5jb25zdCBDb2RlQ2xpZW50Q29udGFpbmVyID0gKHsgdGFibGVzIH0pID0+IHtcbiAgY29uc29sZS5sb2coJ3RhYmxlcyBpbiBjbGllbnQtY29kZS5qc3gnLCB0YWJsZXMpXG4gIGNvbnN0IGNsaWVudFF1ZXJpZXMgPSBidWlsZENsaWVudFF1ZXJpZXModGFibGVzKTtcbiAgY29uc3QgY2xpZW50TXV0YXRpb25zID0gYnVpbGRDbGllbnRNdXRhdGlvbnModGFibGVzKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1jbGllbnRcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IFF1ZXJpZXM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPlxuICAgICAgICB7Y2xpZW50UXVlcmllc31cbiAgICAgIDwvcHJlPlxuICAgICAgPGJyIC8+XG4gICAgICA8YnIgLz5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtjbGllbnRNdXRhdGlvbnN9XG4gICAgICA8L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlQ2xpZW50Q29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=