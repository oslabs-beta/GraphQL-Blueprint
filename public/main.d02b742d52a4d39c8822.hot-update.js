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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X211dGF0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X3F1ZXJpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9jb2RlL2NvZGUtY29udGFpbmVycy9jbGllbnQtY29kZS5qc3giXSwibmFtZXMiOlsidGFiIiwicGFyc2VDbGllbnRNdXRhdGlvbnMiLCJ0YWJsZXMiLCJxdWVyeSIsImV4cG9ydE5hbWVzIiwidGFibGVJZCIsImJ1aWxkTXV0YXRpb25QYXJhbXMiLCJidWlsZFR5cGVQYXJhbXMiLCJidWlsZFJldHVyblZhbHVlcyIsInB1c2giLCJ0eXBlIiwiZmllbGRzIiwiYnVpbGREZWxldGVNdXRhdGlvblBhcmFtcyIsImVuZFN0cmluZyIsImZvckVhY2giLCJuYW1lIiwiaSIsInRhYmxlIiwibXV0YXRpb25UeXBlIiwiZmlyc3RMb29wIiwiZmllbGRJZCIsImNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMiLCJtdWx0aXBsZVZhbHVlcyIsImNoZWNrRmllbGRUeXBlIiwiY2hlY2tGb3JSZXF1aXJlZCIsInJlcXVpcmVkIiwiZmllbGRUeXBlIiwiaWROYW1lIiwicG9zaXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwicGFyc2VDbGllbnRRdWVyaWVzIiwiYnVpbGRDbGllbnRRdWVyeUFsbCIsImJ1aWxkQ2xpZW50UXVlcnlCeUlkIiwic3RyaW5nIiwidG9UaXRsZUNhc2UiLCJyZWZUeXBlTmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJ0b0xvd2VyQ2FzZSIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0b3JlIiwic2NoZW1hIiwiZGF0YWJhc2VzIiwibXVsdGlTY2hlbWEiLCJDb2RlQ2xpZW50Q29udGFpbmVyIiwiY29uc29sZSIsImxvZyIsImNsaWVudFF1ZXJpZXMiLCJjbGllbnRNdXRhdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7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QVksMkJBQVosRUFBeUM3QyxNQUF6QztBQUNBLE1BQU04QyxnQkFBZ0IsOEJBQW1COUMsTUFBbkIsQ0FBdEI7QUFDQSxNQUFNK0Msa0JBQWtCLGdDQUFxQi9DLE1BQXJCLENBQXhCOztBQUVBLFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBRyx1QkFBUjtBQUNFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FERjtBQUVFLDZDQUZGO0FBR0U7QUFBQTtBQUFBO0FBQ0c4QztBQURILEtBSEY7QUFNRSw2Q0FORjtBQU9FLDZDQVBGO0FBUUU7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQVJGO0FBU0UsNkNBVEY7QUFVRTtBQUFBO0FBQUE7QUFDR0M7QUFESDtBQVZGLEdBREY7QUFnQkQsQ0FyQkQ7O2tCQXVCZSx5QkFBUVQsZUFBUixFQUF5QixJQUF6QixFQUErQkssbUJBQS9CLEMiLCJmaWxlIjoibWFpbi5kMDJiNzQyZDUyYTRkMzljODgyMi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGFiID0gYCAgYDtcblxuZnVuY3Rpb24gcGFyc2VDbGllbnRNdXRhdGlvbnModGFibGVzKSB7XG4gIGxldCBxdWVyeSA9IFwiaW1wb3J0IHsgZ3FsIH0gZnJvbSBcXCdhcG9sbG8tYm9vc3RcXCc7XFxuXFxuXCI7XG4gIGNvbnN0IGV4cG9ydE5hbWVzID0gW107XG5cbiAgLy8gQnVpbGQgbXV0YXRpb25zXG4gIGZvciAoY29uc3QgdGFibGVJZCBpbiB0YWJsZXMpIHtcbiAgICAvLyBCdWlsZCBhZGQgbXV0YXRpb25zXG4gICAgcXVlcnkgKz0gYnVpbGRNdXRhdGlvblBhcmFtcyh0YWJsZXNbdGFibGVJZF0sICdhZGQnKTtcbiAgICBxdWVyeSArPSBidWlsZFR5cGVQYXJhbXModGFibGVzW3RhYmxlSWRdLCAnYWRkJyk7XG4gICAgcXVlcnkgKz0gYnVpbGRSZXR1cm5WYWx1ZXModGFibGVzW3RhYmxlSWRdKTtcbiAgICBleHBvcnROYW1lcy5wdXNoKGBhZGQke3RhYmxlc1t0YWJsZUlkXS50eXBlfU11dGF0aW9uYCk7XG5cbiAgICAvLyBCdWlsZCBkZWxldGUgYW5kIHVwZGF0ZSBtdXRhdGlvbnMgaWYgdGhlcmUgaXMgYW4gdW5pcXVlIGlkXG4gICAgaWYgKHRhYmxlc1t0YWJsZUlkXS5maWVsZHNbMF0pIHtcbiAgICAgIC8vIHVwZGF0ZSBtdXRhdGlvbnNcbiAgICAgIHF1ZXJ5ICs9IGJ1aWxkTXV0YXRpb25QYXJhbXModGFibGVzW3RhYmxlSWRdLCAndXBkYXRlJyk7XG4gICAgICBxdWVyeSArPSBidWlsZFR5cGVQYXJhbXModGFibGVzW3RhYmxlSWRdLCAndXBkYXRlJyk7XG4gICAgICBxdWVyeSArPSBidWlsZFJldHVyblZhbHVlcyh0YWJsZXNbdGFibGVJZF0pO1xuICAgICAgZXhwb3J0TmFtZXMucHVzaChgdXBkYXRlJHt0YWJsZXNbdGFibGVJZF0udHlwZX1NdXRhdGlvbmApO1xuICAgICAgLy8gZGVsZXRlIG11dGF0aW9uc1xuICAgICAgcXVlcnkgKz0gYnVpbGREZWxldGVNdXRhdGlvblBhcmFtcyh0YWJsZXNbdGFibGVJZF0pO1xuICAgICAgcXVlcnkgKz0gYnVpbGRSZXR1cm5WYWx1ZXModGFibGVzW3RhYmxlSWRdKTtcbiAgICAgIGV4cG9ydE5hbWVzLnB1c2goYGRlbGV0ZSR7dGFibGVzW3RhYmxlSWRdLnR5cGV9TXV0YXRpb25gKTtcbiAgICB9XG4gIH1cblxuICBsZXQgZW5kU3RyaW5nID0gYGV4cG9ydCB7XFxuYDtcbiAgZXhwb3J0TmFtZXMuZm9yRWFjaCgobmFtZSwgaSkgPT4ge1xuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBlbmRTdHJpbmcgKz0gYCR7dGFifSR7bmFtZX0sXFxuYDtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kU3RyaW5nICs9IGAke3RhYn0ke25hbWV9LFxcbmA7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcXVlcnkgKz0gYCR7ZW5kU3RyaW5nICB9fTtgO1xufVxuXG4vLyBidWlsZHMgcGFyYW1zIGZvciBlaXRoZXIgYWRkIG9yIHVwZGF0ZSBtdXRhdGlvbnNcbmZ1bmN0aW9uIGJ1aWxkTXV0YXRpb25QYXJhbXModGFibGUsIG11dGF0aW9uVHlwZSkge1xuICBsZXQgcXVlcnkgPSBgY29uc3QgJHttdXRhdGlvblR5cGV9JHt0YWJsZS50eXBlfU11dGF0aW9uID0gZ3FsXFxgXFxuJHt0YWJ9bXV0YXRpb24oYDtcblxuICBsZXQgZmlyc3RMb29wID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBmaWVsZElkIGluIHRhYmxlLmZpZWxkcykge1xuICAgIC8vIGlmIHRoZXJlJ3MgYW4gdW5pcXVlIGlkIGFuZCBjcmVhdGluZyBhbiB1cGRhdGUgbXV0YXRpb24sIHRoZW4gdGFrZSBpbiBJRFxuICAgIGlmIChmaWVsZElkID09PSAnMCcgJiYgbXV0YXRpb25UeXBlID09PSAndXBkYXRlJykge1xuICAgICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9ICcsICc7XG4gICAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgICAgcXVlcnkgKz0gYCQke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfTogJHt0YWJsZS5maWVsZHNbZmllbGRJZF0udHlwZX0hYDtcbiAgICB9XG4gICAgaWYgKGZpZWxkSWQgIT09ICcwJykge1xuICAgICAgaWYgKCFmaXJzdExvb3ApIHF1ZXJ5ICs9ICcsICc7XG4gICAgICBmaXJzdExvb3AgPSBmYWxzZTtcblxuICAgICAgcXVlcnkgKz0gYCQke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfTogJHtjaGVja0Zvck11bHRpcGxlVmFsdWVzKHRhYmxlLmZpZWxkc1tmaWVsZElkXS5tdWx0aXBsZVZhbHVlcywgJ2Zyb250Jyl9YDtcbiAgICAgIHF1ZXJ5ICs9IGAke2NoZWNrRmllbGRUeXBlKHRhYmxlLmZpZWxkc1tmaWVsZElkXS50eXBlKX0ke2NoZWNrRm9yTXVsdGlwbGVWYWx1ZXModGFibGUuZmllbGRzW2ZpZWxkSWRdLm11bHRpcGxlVmFsdWVzLCAnYmFjaycpfWA7XG4gICAgICBxdWVyeSArPSBgJHtjaGVja0ZvclJlcXVpcmVkKHRhYmxlLmZpZWxkc1tmaWVsZElkXS5yZXF1aXJlZCl9YDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5ICs9IGApIHtcXG4ke3RhYn1gO1xufVxuXG4vLyBpbiBjYXNlIHRoZSBpbnB1dGVkIGZpZWxkIHR5cGUgaXMgTnVtYmVyLCB0dXJuIHRvIEludCB0byB3b3JrIHdpdGggR3JhcGhRTFxuZnVuY3Rpb24gY2hlY2tGaWVsZFR5cGUoZmllbGRUeXBlKSB7XG4gIGlmIChmaWVsZFR5cGUgPT09ICdOdW1iZXInKSByZXR1cm4gJ0ludCc7XG4gIGVsc2UgcmV0dXJuIGZpZWxkVHlwZTtcbn1cblxuXG5mdW5jdGlvbiBidWlsZERlbGV0ZU11dGF0aW9uUGFyYW1zKHRhYmxlKSB7XG4gIGNvbnN0IGlkTmFtZSA9IHRhYmxlLmZpZWxkc1swXS5uYW1lO1xuICBsZXQgcXVlcnkgPSBgY29uc3QgZGVsZXRlJHt0YWJsZS50eXBlfU11dGF0aW9uID0gZ3FsXFxgXFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifW11dGF0aW9uKCQke2lkTmFtZX06ICR7dGFibGUuZmllbGRzWzBdLnR5cGV9ISl7XFxuYDtcbiAgcXVlcnkgKz0gYCR7dGFifSR7dGFifWRlbGV0ZSR7dGFibGUudHlwZX0oJHtpZE5hbWV9OiAkJHtpZE5hbWV9KXtcXG5gO1xuICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yTXVsdGlwbGVWYWx1ZXMobXVsdGlwbGVWYWx1ZXMsIHBvc2l0aW9uKSB7XG4gIGlmIChtdWx0aXBsZVZhbHVlcykge1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ2Zyb250Jykge1xuICAgICAgcmV0dXJuICdbJztcbiAgICB9XG4gICAgcmV0dXJuICddJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yUmVxdWlyZWQocmVxdWlyZWQpIHtcbiAgaWYgKHJlcXVpcmVkKSB7XG4gICAgcmV0dXJuICchJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkVHlwZVBhcmFtcyh0YWJsZSwgbXV0YXRpb25UeXBlKSB7XG4gIGxldCBxdWVyeSA9IGAke3RhYn0ke211dGF0aW9uVHlwZX0ke3RhYmxlLnR5cGV9KGA7XG5cbiAgbGV0IGZpcnN0TG9vcCA9IHRydWU7XG4gIGZvciAoY29uc3QgZmllbGRJZCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICAvLyBpZiB0aGVyZSdzIGFuIHVuaXF1ZSBpZCBhbmQgY3JlYXRpbmcgYW4gdXBkYXRlIG11dGF0aW9uLCB0aGVuIHRha2UgaW4gSURcbiAgICBpZiAoZmllbGRJZCA9PT0gJzAnICYmIG11dGF0aW9uVHlwZSA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLCAnO1xuICAgICAgZmlyc3RMb29wID0gZmFsc2U7XG4gICAgICBxdWVyeSArPSBgJHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX06ICQke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfWA7XG4gICAgfVxuICAgIGlmIChmaWVsZElkICE9PSAnMCcpIHtcbiAgICAgIGlmICghZmlyc3RMb29wKSBxdWVyeSArPSAnLCAnO1xuICAgICAgZmlyc3RMb29wID0gZmFsc2U7XG5cbiAgICAgIHF1ZXJ5ICs9IGAke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfTogJCR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLm5hbWV9YDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5ICs9IGApIHtcXG5gO1xufVxuXG5mdW5jdGlvbiBidWlsZFJldHVyblZhbHVlcyh0YWJsZSkge1xuICBsZXQgcXVlcnkgPSAnJztcblxuICBmb3IgKGNvbnN0IGZpZWxkSWQgaW4gdGFibGUuZmllbGRzKSB7XG4gICAgcXVlcnkgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLm5hbWV9XFxuYDtcbiAgfVxuXG4gIHJldHVybiBxdWVyeSArPSBgJHt0YWJ9JHt0YWJ9fVxcbiR7dGFifX1cXG5cXGBcXG5cXG5gO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlQ2xpZW50TXV0YXRpb25zO1xuIiwiY29uc3QgdGFiID0gYCAgYDtcblxuZnVuY3Rpb24gcGFyc2VDbGllbnRRdWVyaWVzKHRhYmxlcykge1xuICBsZXQgcXVlcnkgPSBcImltcG9ydCB7IGdxbCB9IGZyb20gXFwnYXBvbGxvLWJvb3N0XFwnO1xcblxcblwiO1xuICBjb25zdCBleHBvcnROYW1lcyA9IFtdO1xuXG4gIC8vIHRhYmxlcyBpcyBzdGF0ZS50YWJsZXMgZnJvbSBzY2hlbWFSZWR1Y2VyXG4gIGZvciAoY29uc3QgdGFibGVJZCBpbiB0YWJsZXMpIHtcbiAgICBxdWVyeSArPSBidWlsZENsaWVudFF1ZXJ5QWxsKHRhYmxlc1t0YWJsZUlkXSk7XG4gICAgZXhwb3J0TmFtZXMucHVzaChgcXVlcnlFdmVyeSR7dGFibGVzW3RhYmxlSWRdLnR5cGV9YCk7XG5cbiAgICBpZiAoISF0YWJsZXNbdGFibGVJZF0uZmllbGRzWzBdKSB7XG4gICAgICBxdWVyeSArPSBidWlsZENsaWVudFF1ZXJ5QnlJZCh0YWJsZXNbdGFibGVJZF0pO1xuICAgICAgZXhwb3J0TmFtZXMucHVzaChgcXVlcnkke3RhYmxlc1t0YWJsZUlkXS50eXBlfUJ5SWQgYCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IGVuZFN0cmluZyA9ICdleHBvcnQgeyc7XG4gIGV4cG9ydE5hbWVzLmZvckVhY2goKG5hbWUsIGkpID0+IHtcbiAgICBpZiAoaSkge1xuICAgICAgZW5kU3RyaW5nICs9IGAsICR7bmFtZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmRTdHJpbmcgKz0gYCAke25hbWV9YDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBxdWVyeSArPSBgJHtlbmRTdHJpbmcgIH19O2A7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ2xpZW50UXVlcnlBbGwodGFibGUpIHtcbiAgbGV0IHN0cmluZyA9IGBjb25zdCBxdWVyeUV2ZXJ5JHt0YWJsZS50eXBlfSA9IGdxbFxcYFxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9e1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9ZXZlcnkke3RvVGl0bGVDYXNlKHRhYmxlLnR5cGUpfSB7XFxuYDtcblxuICBmb3IgKGNvbnN0IGZpZWxkSWQgaW4gdGFibGUuZmllbGRzKSB7XG4gICAgc3RyaW5nICs9IGAke3RhYn0ke3RhYn0ke3RhYn0ke3RhYmxlLmZpZWxkc1tmaWVsZElkXS5uYW1lfVxcbmA7XG4gIH1cblxuICByZXR1cm4gc3RyaW5nICs9IGAke3RhYn0ke3RhYn19XFxuJHt0YWJ9fVxcblxcYFxcblxcbmA7XG59XG5cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHJlZlR5cGVOYW1lKSB7XG4gIGxldCBuYW1lID0gcmVmVHlwZU5hbWVbMF0udG9VcHBlckNhc2UoKTtcbiAgbmFtZSArPSByZWZUeXBlTmFtZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gbmFtZTtcbn1cblxuZnVuY3Rpb24gYnVpbGRDbGllbnRRdWVyeUJ5SWQodGFibGUpIHtcbiAgbGV0IHN0cmluZyA9IGBjb25zdCBxdWVyeSR7dGFibGUudHlwZX1CeUlkID0gZ3FsXFxgXFxuYDtcbiAgc3RyaW5nICs9IGAke3RhYn1xdWVyeSgkJHt0YWJsZS5maWVsZHNbMF0ubmFtZX06ICR7dGFibGUuZmllbGRzWzBdLnR5cGV9ISkge1xcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJsZS50eXBlLnRvTG93ZXJDYXNlKCl9KCR7dGFibGUuZmllbGRzWzBdLm5hbWV9OiAkJHt0YWJsZS5maWVsZHNbMF0ubmFtZX0pIHtcXG5gO1xuICBcbiAgZm9yIChjb25zdCBmaWVsZElkIGluIHRhYmxlLmZpZWxkcykge1xuICAgIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX1cXG5gO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9fVxcbiR7dGFifX1cXG5cXGBcXG5cXG5gO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlQ2xpZW50UXVlcmllcztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IGJ1aWxkQ2xpZW50UXVlcmllcyBmcm9tICcuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9jbGllbnRfcXVlcmllcyc7XG5pbXBvcnQgYnVpbGRDbGllbnRNdXRhdGlvbnMgZnJvbSAnLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X211dGF0aW9ucyc7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCAnLi4vY29kZS5jc3MnO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBzdG9yZSA9PiAoe1xuICB0YWJsZXM6IHN0b3JlLnNjaGVtYS50YWJsZXMsXG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzXG59KTtcblxuXG5jb25zdCBDb2RlQ2xpZW50Q29udGFpbmVyID0gKHsgdGFibGVzIH0pID0+IHtcbiAgY29uc29sZS5sb2coJ3RhYmxlcyBpbiBjbGllbnQtY29kZS5qc3gnLCB0YWJsZXMpXG4gIGNvbnN0IGNsaWVudFF1ZXJpZXMgPSBidWlsZENsaWVudFF1ZXJpZXModGFibGVzKTtcbiAgY29uc3QgY2xpZW50TXV0YXRpb25zID0gYnVpbGRDbGllbnRNdXRhdGlvbnModGFibGVzKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1jbGllbnRcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IFF1ZXJpZXM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPlxuICAgICAgICB7Y2xpZW50UXVlcmllc31cbiAgICAgIDwvcHJlPlxuICAgICAgPGJyIC8+XG4gICAgICA8YnIgLz5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtjbGllbnRNdXRhdGlvbnN9XG4gICAgICA8L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlQ2xpZW50Q29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=