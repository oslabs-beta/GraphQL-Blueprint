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
    tables: store.schema.tables
  };
};

// styling

console.log('tables in client-code.jsx', { tables: tables });
var CodeClientContainer = function CodeClientContainer(_ref) {
  var tables = _ref.tables;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X211dGF0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X3F1ZXJpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9jb2RlL2NvZGUtY29udGFpbmVycy9jbGllbnQtY29kZS5qc3giXSwibmFtZXMiOlsidGFiIiwicGFyc2VDbGllbnRNdXRhdGlvbnMiLCJ0YWJsZXMiLCJxdWVyeSIsImV4cG9ydE5hbWVzIiwidGFibGVJZCIsImJ1aWxkTXV0YXRpb25QYXJhbXMiLCJidWlsZFR5cGVQYXJhbXMiLCJidWlsZFJldHVyblZhbHVlcyIsInB1c2giLCJ0eXBlIiwiZmllbGRzIiwiYnVpbGREZWxldGVNdXRhdGlvblBhcmFtcyIsImVuZFN0cmluZyIsImZvckVhY2giLCJuYW1lIiwiaSIsInRhYmxlIiwibXV0YXRpb25UeXBlIiwiZmlyc3RMb29wIiwiZmllbGRJZCIsImNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMiLCJtdWx0aXBsZVZhbHVlcyIsImNoZWNrRmllbGRUeXBlIiwiY2hlY2tGb3JSZXF1aXJlZCIsInJlcXVpcmVkIiwiZmllbGRUeXBlIiwiaWROYW1lIiwicG9zaXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwicGFyc2VDbGllbnRRdWVyaWVzIiwiYnVpbGRDbGllbnRRdWVyeUFsbCIsImJ1aWxkQ2xpZW50UXVlcnlCeUlkIiwic3RyaW5nIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0b3JlIiwic2NoZW1hIiwiY29uc29sZSIsImxvZyIsIkNvZGVDbGllbnRDb250YWluZXIiLCJjbGllbnRRdWVyaWVzIiwiY2xpZW50TXV0YXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxVQUFOOztBQUVB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QW5CLENBQXRCO0FBQ0EsTUFBTTZDLGtCQUFrQixnQ0FBcUI3QyxNQUFyQixDQUF4Qjs7QUFFQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUNHNEM7QUFESCxLQUhGO0FBTUUsNkNBTkY7QUFPRSw2Q0FQRjtBQVFFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FSRjtBQVNFLDZDQVRGO0FBVUU7QUFBQTtBQUFBO0FBQ0dDO0FBREg7QUFWRixHQURGO0FBZ0JELENBcEJEOztrQkFzQmUseUJBQVFQLGVBQVIsRUFBeUIsSUFBekIsRUFBK0JLLG1CQUEvQixDIiwiZmlsZSI6Im1haW4uOTQ5YTg3ODVhNWEyYjJkYmZhOTIuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhYiA9IGAgIGA7XG5cbmZ1bmN0aW9uIHBhcnNlQ2xpZW50TXV0YXRpb25zKHRhYmxlcykge1xuICBsZXQgcXVlcnkgPSBcImltcG9ydCB7IGdxbCB9IGZyb20gXFwnYXBvbGxvLWJvb3N0XFwnO1xcblxcblwiO1xuICBjb25zdCBleHBvcnROYW1lcyA9IFtdO1xuXG4gIC8vIEJ1aWxkIG11dGF0aW9uc1xuICBmb3IgKGNvbnN0IHRhYmxlSWQgaW4gdGFibGVzKSB7XG4gICAgLy8gQnVpbGQgYWRkIG11dGF0aW9uc1xuICAgIHF1ZXJ5ICs9IGJ1aWxkTXV0YXRpb25QYXJhbXModGFibGVzW3RhYmxlSWRdLCAnYWRkJyk7XG4gICAgcXVlcnkgKz0gYnVpbGRUeXBlUGFyYW1zKHRhYmxlc1t0YWJsZUlkXSwgJ2FkZCcpO1xuICAgIHF1ZXJ5ICs9IGJ1aWxkUmV0dXJuVmFsdWVzKHRhYmxlc1t0YWJsZUlkXSk7XG4gICAgZXhwb3J0TmFtZXMucHVzaChgYWRkJHt0YWJsZXNbdGFibGVJZF0udHlwZX1NdXRhdGlvbmApO1xuXG4gICAgLy8gQnVpbGQgZGVsZXRlIGFuZCB1cGRhdGUgbXV0YXRpb25zIGlmIHRoZXJlIGlzIGFuIHVuaXF1ZSBpZFxuICAgIGlmICh0YWJsZXNbdGFibGVJZF0uZmllbGRzWzBdKSB7XG4gICAgICAvLyB1cGRhdGUgbXV0YXRpb25zXG4gICAgICBxdWVyeSArPSBidWlsZE11dGF0aW9uUGFyYW1zKHRhYmxlc1t0YWJsZUlkXSwgJ3VwZGF0ZScpO1xuICAgICAgcXVlcnkgKz0gYnVpbGRUeXBlUGFyYW1zKHRhYmxlc1t0YWJsZUlkXSwgJ3VwZGF0ZScpO1xuICAgICAgcXVlcnkgKz0gYnVpbGRSZXR1cm5WYWx1ZXModGFibGVzW3RhYmxlSWRdKTtcbiAgICAgIGV4cG9ydE5hbWVzLnB1c2goYHVwZGF0ZSR7dGFibGVzW3RhYmxlSWRdLnR5cGV9TXV0YXRpb25gKTtcbiAgICAgIC8vIGRlbGV0ZSBtdXRhdGlvbnNcbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkRGVsZXRlTXV0YXRpb25QYXJhbXModGFibGVzW3RhYmxlSWRdKTtcbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkUmV0dXJuVmFsdWVzKHRhYmxlc1t0YWJsZUlkXSk7XG4gICAgICBleHBvcnROYW1lcy5wdXNoKGBkZWxldGUke3RhYmxlc1t0YWJsZUlkXS50eXBlfU11dGF0aW9uYCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IGVuZFN0cmluZyA9IGBleHBvcnQge1xcbmA7XG4gIGV4cG9ydE5hbWVzLmZvckVhY2goKG5hbWUsIGkpID0+IHtcbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgZW5kU3RyaW5nICs9IGAke3RhYn0ke25hbWV9LFxcbmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZFN0cmluZyArPSBgJHt0YWJ9JHtuYW1lfSxcXG5gO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHF1ZXJ5ICs9IGAke2VuZFN0cmluZyAgfX07YDtcbn1cblxuLy8gYnVpbGRzIHBhcmFtcyBmb3IgZWl0aGVyIGFkZCBvciB1cGRhdGUgbXV0YXRpb25zXG5mdW5jdGlvbiBidWlsZE11dGF0aW9uUGFyYW1zKHRhYmxlLCBtdXRhdGlvblR5cGUpIHtcbiAgbGV0IHF1ZXJ5ID0gYGNvbnN0ICR7bXV0YXRpb25UeXBlfSR7dGFibGUudHlwZX1NdXRhdGlvbiA9IGdxbFxcYFxcbiR7dGFifW11dGF0aW9uKGA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJZCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICAvLyBpZiB0aGVyZSdzIGFuIHVuaXF1ZSBpZCBhbmQgY3JlYXRpbmcgYW4gdXBkYXRlIG11dGF0aW9uLCB0aGVuIHRha2UgaW4gSURcbiAgICBpZiAoZmllbGRJZCA9PT0gJzAnICYmIG11dGF0aW9uVHlwZSA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLCAnO1xuICAgICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICAgIHF1ZXJ5ICs9IGAkJHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX06ICR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLnR5cGV9IWA7XG4gICAgfVxuICAgIGlmIChmaWVsZElkICE9PSAnMCcpIHtcbiAgICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLCAnO1xuICAgICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICAgIHF1ZXJ5ICs9IGAkJHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX06ICR7Y2hlY2tGb3JNdWx0aXBsZVZhbHVlcyh0YWJsZS5maWVsZHNbZmllbGRJZF0ubXVsdGlwbGVWYWx1ZXMsICdmcm9udCcpfWA7XG4gICAgICBxdWVyeSArPSBgJHtjaGVja0ZpZWxkVHlwZSh0YWJsZS5maWVsZHNbZmllbGRJZF0udHlwZSl9JHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKHRhYmxlLmZpZWxkc1tmaWVsZElkXS5tdWx0aXBsZVZhbHVlcywgJ2JhY2snKX1gO1xuICAgICAgcXVlcnkgKz0gYCR7Y2hlY2tGb3JSZXF1aXJlZCh0YWJsZS5maWVsZHNbZmllbGRJZF0ucmVxdWlyZWQpfWA7XG4gICAgfVxuICB9XG4gIHJldHVybiBxdWVyeSArPSBgKSB7XFxuJHt0YWJ9YDtcbn1cblxuLy8gaW4gY2FzZSB0aGUgaW5wdXRlZCBmaWVsZCB0eXBlIGlzIE51bWJlciwgdHVybiB0byBJbnQgdG8gd29yayB3aXRoIEdyYXBoUUxcbmZ1bmN0aW9uIGNoZWNrRmllbGRUeXBlKGZpZWxkVHlwZSkge1xuICBpZiAoZmllbGRUeXBlID09PSAnTnVtYmVyJykgcmV0dXJuICdJbnQnO1xuICBlbHNlIHJldHVybiBmaWVsZFR5cGU7XG59XG5cblxuZnVuY3Rpb24gYnVpbGREZWxldGVNdXRhdGlvblBhcmFtcyh0YWJsZSkge1xuICBjb25zdCBpZE5hbWUgPSB0YWJsZS5maWVsZHNbMF0ubmFtZTtcbiAgbGV0IHF1ZXJ5ID0gYGNvbnN0IGRlbGV0ZSR7dGFibGUudHlwZX1NdXRhdGlvbiA9IGdxbFxcYFxcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn1tdXRhdGlvbigkJHtpZE5hbWV9OiAke3RhYmxlLmZpZWxkc1swXS50eXBlfSEpe1xcbmA7XG4gIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn1kZWxldGUke3RhYmxlLnR5cGV9KCR7aWROYW1lfTogJCR7aWROYW1lfSl7XFxuYDtcbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG5mdW5jdGlvbiBjaGVja0Zvck11bHRpcGxlVmFsdWVzKG11bHRpcGxlVmFsdWVzLCBwb3NpdGlvbikge1xuICBpZiAobXVsdGlwbGVWYWx1ZXMpIHtcbiAgICBpZiAocG9zaXRpb24gPT09ICdmcm9udCcpIHtcbiAgICAgIHJldHVybiAnWyc7XG4gICAgfVxuICAgIHJldHVybiAnXSc7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvclJlcXVpcmVkKHJlcXVpcmVkKSB7XG4gIGlmIChyZXF1aXJlZCkge1xuICAgIHJldHVybiAnISc7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBidWlsZFR5cGVQYXJhbXModGFibGUsIG11dGF0aW9uVHlwZSkge1xuICBsZXQgcXVlcnkgPSBgJHt0YWJ9JHttdXRhdGlvblR5cGV9JHt0YWJsZS50eXBlfShgO1xuXG4gIGxldCBmaXJzdExvb3AgPSB0cnVlO1xuICBmb3IgKGNvbnN0IGZpZWxkSWQgaW4gdGFibGUuZmllbGRzKSB7XG4gICAgLy8gaWYgdGhlcmUncyBhbiB1bmlxdWUgaWQgYW5kIGNyZWF0aW5nIGFuIHVwZGF0ZSBtdXRhdGlvbiwgdGhlbiB0YWtlIGluIElEXG4gICAgaWYgKGZpZWxkSWQgPT09ICcwJyAmJiBtdXRhdGlvblR5cGUgPT09ICd1cGRhdGUnKSB7XG4gICAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJywgJztcbiAgICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuICAgICAgcXVlcnkgKz0gYCR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLm5hbWV9OiAkJHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX1gO1xuICAgIH1cbiAgICBpZiAoZmllbGRJZCAhPT0gJzAnKSB7XG4gICAgICBpZiAoIWZpcnN0TG9vcCkgcXVlcnkgKz0gJywgJztcbiAgICAgIGZpcnN0TG9vcCA9IGZhbHNlO1xuXG4gICAgICBxdWVyeSArPSBgJHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX06ICQke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfWA7XG4gICAgfVxuICB9XG4gIHJldHVybiBxdWVyeSArPSBgKSB7XFxuYDtcbn1cblxuZnVuY3Rpb24gYnVpbGRSZXR1cm5WYWx1ZXModGFibGUpIHtcbiAgbGV0IHF1ZXJ5ID0gJyc7XG5cbiAgZm9yIChjb25zdCBmaWVsZElkIGluIHRhYmxlLmZpZWxkcykge1xuICAgIHF1ZXJ5ICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfVxcbmA7XG4gIH1cblxuICByZXR1cm4gcXVlcnkgKz0gYCR7dGFifSR7dGFifX1cXG4ke3RhYn19XFxuXFxgXFxuXFxuYDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUNsaWVudE11dGF0aW9ucztcbiIsImNvbnN0IHRhYiA9IGAgIGA7XG5cbmZ1bmN0aW9uIHBhcnNlQ2xpZW50UXVlcmllcyh0YWJsZXMpIHtcbiAgbGV0IHF1ZXJ5ID0gXCJpbXBvcnQgeyBncWwgfSBmcm9tIFxcJ2Fwb2xsby1ib29zdFxcJztcXG5cXG5cIjtcbiAgY29uc3QgZXhwb3J0TmFtZXMgPSBbXTtcblxuICAvLyB0YWJsZXMgaXMgc3RhdGUudGFibGVzIGZyb20gc2NoZW1hUmVkdWNlclxuICBmb3IgKGNvbnN0IHRhYmxlSWQgaW4gdGFibGVzKSB7XG4gICAgcXVlcnkgKz0gYnVpbGRDbGllbnRRdWVyeUFsbCh0YWJsZXNbdGFibGVJZF0pO1xuICAgIGV4cG9ydE5hbWVzLnB1c2goYHF1ZXJ5RXZlcnkke3RhYmxlc1t0YWJsZUlkXS50eXBlfWApO1xuXG4gICAgaWYgKCEhdGFibGVzW3RhYmxlSWRdLmZpZWxkc1swXSkge1xuICAgICAgcXVlcnkgKz0gYnVpbGRDbGllbnRRdWVyeUJ5SWQodGFibGVzW3RhYmxlSWRdKTtcbiAgICAgIGV4cG9ydE5hbWVzLnB1c2goYHF1ZXJ5JHt0YWJsZXNbdGFibGVJZF0udHlwZX1CeUlkIGApO1xuICAgIH1cbiAgfVxuXG4gIGxldCBlbmRTdHJpbmcgPSAnZXhwb3J0IHsnO1xuICBleHBvcnROYW1lcy5mb3JFYWNoKChuYW1lLCBpKSA9PiB7XG4gICAgaWYgKGkpIHtcbiAgICAgIGVuZFN0cmluZyArPSBgLCAke25hbWV9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kU3RyaW5nICs9IGAgJHtuYW1lfWA7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcXVlcnkgKz0gYCR7ZW5kU3RyaW5nICB9fTtgO1xufVxuXG5mdW5jdGlvbiBidWlsZENsaWVudFF1ZXJ5QWxsKHRhYmxlKSB7XG4gIGxldCBzdHJpbmcgPSBgY29uc3QgcXVlcnlFdmVyeSR7dGFibGUudHlwZX0gPSBncWxcXGBcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifXtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifWV2ZXJ5JHt0b1RpdGxlQ2FzZSh0YWJsZS50eXBlKX0ge1xcbmA7XG5cbiAgZm9yIChjb25zdCBmaWVsZElkIGluIHRhYmxlLmZpZWxkcykge1xuICAgIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX1cXG5gO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9fVxcbiR7dGFifX1cXG5cXGBcXG5cXG5gO1xufVxuXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSkge1xuICBsZXQgbmFtZSA9IHJlZlR5cGVOYW1lWzBdLnRvVXBwZXJDYXNlKCk7XG4gIG5hbWUgKz0gcmVmVHlwZU5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIG5hbWU7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ2xpZW50UXVlcnlCeUlkKHRhYmxlKSB7XG4gIGxldCBzdHJpbmcgPSBgY29uc3QgcXVlcnkke3RhYmxlLnR5cGV9QnlJZCA9IGdxbFxcYFxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9cXVlcnkoJCR7dGFibGUuZmllbGRzWzBdLm5hbWV9OiAke3RhYmxlLmZpZWxkc1swXS50eXBlfSEpIHtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfSgke3RhYmxlLmZpZWxkc1swXS5uYW1lfTogJCR7dGFibGUuZmllbGRzWzBdLm5hbWV9KSB7XFxuYDtcbiAgXG4gIGZvciAoY29uc3QgZmllbGRJZCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLm5hbWV9XFxuYDtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmcgKz0gYCR7dGFifSR7dGFifX1cXG4ke3RhYn19XFxuXFxgXFxuXFxuYDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUNsaWVudFF1ZXJpZXM7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBidWlsZENsaWVudFF1ZXJpZXMgZnJvbSAnLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X3F1ZXJpZXMnO1xuaW1wb3J0IGJ1aWxkQ2xpZW50TXV0YXRpb25zIGZyb20gJy4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2NsaWVudF9tdXRhdGlvbnMnO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgJy4uL2NvZGUuY3NzJztcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gc3RvcmUgPT4gKHtcbiAgdGFibGVzOiBzdG9yZS5zY2hlbWEudGFibGVzLFxufSk7XG5jb25zb2xlLmxvZygndGFibGVzIGluIGNsaWVudC1jb2RlLmpzeCcsIHt0YWJsZXN9KVxuY29uc3QgQ29kZUNsaWVudENvbnRhaW5lciA9ICh7IHRhYmxlcyB9KSA9PiB7XG4gIGNvbnN0IGNsaWVudFF1ZXJpZXMgPSBidWlsZENsaWVudFF1ZXJpZXModGFibGVzKTtcbiAgY29uc3QgY2xpZW50TXV0YXRpb25zID0gYnVpbGRDbGllbnRNdXRhdGlvbnModGFibGVzKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1jbGllbnRcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IFF1ZXJpZXM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPlxuICAgICAgICB7Y2xpZW50UXVlcmllc31cbiAgICAgIDwvcHJlPlxuICAgICAgPGJyIC8+XG4gICAgICA8YnIgLz5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtjbGllbnRNdXRhdGlvbnN9XG4gICAgICA8L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlQ2xpZW50Q29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=