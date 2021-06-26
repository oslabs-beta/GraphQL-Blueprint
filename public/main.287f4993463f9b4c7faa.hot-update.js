webpackHotUpdate("main",{

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

var CodeClientContainer = function CodeClientContainer(_ref2) {
  var tables = _ref2.tables;

  console.log('tables in client-code.jsx', tables);
  console.log(createCombinedTables());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL2NsaWVudC1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJ0YWJsZXMiLCJzdG9yZSIsInNjaGVtYSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY3JlYXRlQ29tYmluZWRUYWJsZXMiLCJudW0iLCJ0YWJsZXNDb21iaW5lZCIsImRhdGFiYXNlSW5kZXgiLCJkYXRhYmFzZSIsImluZGV4IiwiZGF0YSIsIkNvZGVDbGllbnRDb250YWluZXIiLCJjb25zb2xlIiwibG9nIiwiY2xpZW50UXVlcmllcyIsImNsaWVudE11dGF0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLFNBQVU7QUFDaENDLFlBQVFDLE1BQU1DLE1BQU4sQ0FBYUYsTUFEVztBQUVoQ0csZUFBV0YsTUFBTUcsV0FBTixDQUFrQkQ7QUFGRyxHQUFWO0FBQUEsQ0FBeEI7O0FBSEE7OztBQVFBLElBQU1FLHVCQUF1QixTQUF2QkEsb0JBQXVCLE9BQWlCO0FBQUEsTUFBZkYsU0FBZSxRQUFmQSxTQUFlOztBQUM1QyxNQUFJRyxNQUFNLENBQVY7QUFDQSxNQUFNQyxpQkFBaUIsRUFBdkI7QUFDQSxPQUFLLElBQU1DLGFBQVgsSUFBNEJMLFNBQTVCLEVBQXVDO0FBQ25DLFFBQU1NLFdBQVdOLFVBQVVLLGFBQVYsQ0FBakI7QUFDQSxTQUFLLElBQU1FLEtBQVgsSUFBb0JELFNBQVNFLElBQTdCLEVBQW1DO0FBQ25DSixxQkFBZUQsR0FBZixJQUFzQkcsU0FBU0UsSUFBVCxDQUFjRCxLQUFkLENBQXRCO0FBQ0FKO0FBQ0Q7QUFDRjtBQUNELFNBQU9DLGNBQVA7QUFDRCxDQVhEOztBQWNBLElBQU1LLHNCQUFzQixTQUF0QkEsbUJBQXNCLFFBQWdCO0FBQUEsTUFBYlosTUFBYSxTQUFiQSxNQUFhOztBQUMxQ2EsVUFBUUMsR0FBUixDQUFZLDJCQUFaLEVBQXlDZCxNQUF6QztBQUNBYSxVQUFRQyxHQUFSLENBQVlULHNCQUFaO0FBQ0EsTUFBTVUsZ0JBQWdCLDhCQUFtQmYsTUFBbkIsQ0FBdEI7QUFDQSxNQUFNZ0Isa0JBQWtCLGdDQUFxQmhCLE1BQXJCLENBQXhCOztBQUVBLFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBRyx1QkFBUjtBQUNFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FERjtBQUVFLDZDQUZGO0FBR0U7QUFBQTtBQUFBO0FBQ0dlO0FBREgsS0FIRjtBQU1FLDZDQU5GO0FBT0UsNkNBUEY7QUFRRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBUkY7QUFTRSw2Q0FURjtBQVVFO0FBQUE7QUFBQTtBQUNHQztBQURIO0FBVkYsR0FERjtBQWdCRCxDQXRCRDs7a0JBd0JlLHlCQUFRakIsZUFBUixFQUF5QixJQUF6QixFQUErQmEsbUJBQS9CLEMiLCJmaWxlIjoibWFpbi4yODdmNDk5MzQ2M2Y5YjRjN2ZhYS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgYnVpbGRDbGllbnRRdWVyaWVzIGZyb20gJy4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2NsaWVudF9xdWVyaWVzJztcbmltcG9ydCBidWlsZENsaWVudE11dGF0aW9ucyBmcm9tICcuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9jbGllbnRfbXV0YXRpb25zJztcblxuLy8gc3R5bGluZ1xuaW1wb3J0ICcuLi9jb2RlLmNzcyc7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IHN0b3JlID0+ICh7XG4gIHRhYmxlczogc3RvcmUuc2NoZW1hLnRhYmxlcyxcbiAgZGF0YWJhc2VzOiBzdG9yZS5tdWx0aVNjaGVtYS5kYXRhYmFzZXNcbn0pO1xuXG5jb25zdCBjcmVhdGVDb21iaW5lZFRhYmxlcyA9ICh7ZGF0YWJhc2VzfSkgPT4ge1xuICBsZXQgbnVtID0gMDtcbiAgY29uc3QgdGFibGVzQ29tYmluZWQgPSB7fVxuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7XG4gICAgICBjb25zdCBkYXRhYmFzZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XTtcbiAgICAgIGZvciAoY29uc3QgaW5kZXggaW4gZGF0YWJhc2UuZGF0YSkge1xuICAgICAgdGFibGVzQ29tYmluZWRbbnVtXSA9IGRhdGFiYXNlLmRhdGFbaW5kZXhdXG4gICAgICBudW0rKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhYmxlc0NvbWJpbmVkO1xufVxuXG5cbmNvbnN0IENvZGVDbGllbnRDb250YWluZXIgPSAoeyB0YWJsZXMgfSkgPT4ge1xuICBjb25zb2xlLmxvZygndGFibGVzIGluIGNsaWVudC1jb2RlLmpzeCcsIHRhYmxlcylcbiAgY29uc29sZS5sb2coY3JlYXRlQ29tYmluZWRUYWJsZXMoKSk7XG4gIGNvbnN0IGNsaWVudFF1ZXJpZXMgPSBidWlsZENsaWVudFF1ZXJpZXModGFibGVzKTtcbiAgY29uc3QgY2xpZW50TXV0YXRpb25zID0gYnVpbGRDbGllbnRNdXRhdGlvbnModGFibGVzKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1jbGllbnRcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IFF1ZXJpZXM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPlxuICAgICAgICB7Y2xpZW50UXVlcmllc31cbiAgICAgIDwvcHJlPlxuICAgICAgPGJyIC8+XG4gICAgICA8YnIgLz5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtjbGllbnRNdXRhdGlvbnN9XG4gICAgICA8L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlQ2xpZW50Q29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=