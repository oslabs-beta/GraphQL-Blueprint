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


var createCombinedTables = function createCombinedTables(databases) {
  var num = 0;
  console.log('databases:', databases);
  var tablesCombined = {};
  for (var databaseIndex in databases) {
    var database = databases[databaseIndex];
    for (var index in database.data) {
      tablesCombined[num] = database.data[index];
      console.log(database.data[index]);
      num++;
    }
  }
  return tablesCombined;
};

var CodeClientContainer = function CodeClientContainer(_ref) {
  var databases = _ref.databases;

  var tables = createCombinedTables(databases);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL2NsaWVudC1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJ0YWJsZXMiLCJzdG9yZSIsInNjaGVtYSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY3JlYXRlQ29tYmluZWRUYWJsZXMiLCJudW0iLCJjb25zb2xlIiwibG9nIiwidGFibGVzQ29tYmluZWQiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2UiLCJpbmRleCIsImRhdGEiLCJDb2RlQ2xpZW50Q29udGFpbmVyIiwiY2xpZW50UXVlcmllcyIsImNsaWVudE11dGF0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLFNBQVU7QUFDaENDLFlBQVFDLE1BQU1DLE1BQU4sQ0FBYUYsTUFEVztBQUVoQ0csZUFBV0YsTUFBTUcsV0FBTixDQUFrQkQ7QUFGRyxHQUFWO0FBQUEsQ0FBeEI7O0FBSEE7OztBQVFBLElBQU1FLHVCQUF1QixTQUF2QkEsb0JBQXVCLENBQUNGLFNBQUQsRUFBZTtBQUMxQyxNQUFJRyxNQUFNLENBQVY7QUFDQUMsVUFBUUMsR0FBUixDQUFZLFlBQVosRUFBMEJMLFNBQTFCO0FBQ0EsTUFBTU0saUJBQWlCLEVBQXZCO0FBQ0EsT0FBSyxJQUFNQyxhQUFYLElBQTRCUCxTQUE1QixFQUF1QztBQUNuQyxRQUFNUSxXQUFXUixVQUFVTyxhQUFWLENBQWpCO0FBQ0EsU0FBSyxJQUFNRSxLQUFYLElBQW9CRCxTQUFTRSxJQUE3QixFQUFtQztBQUNqQ0oscUJBQWVILEdBQWYsSUFBc0JLLFNBQVNFLElBQVQsQ0FBY0QsS0FBZCxDQUF0QjtBQUNBTCxjQUFRQyxHQUFSLENBQVlHLFNBQVNFLElBQVQsQ0FBY0QsS0FBZCxDQUFaO0FBQ0FOO0FBQ0Y7QUFFSDtBQUNELFNBQU9HLGNBQVA7QUFDRCxDQWREOztBQWlCQSxJQUFNSyxzQkFBc0IsU0FBdEJBLG1CQUFzQixPQUFtQjtBQUFBLE1BQWhCWCxTQUFnQixRQUFoQkEsU0FBZ0I7O0FBQzdDLE1BQU1ILFNBQVNLLHFCQUFxQkYsU0FBckIsQ0FBZjtBQUNBSSxVQUFRQyxHQUFSLENBQVksMkJBQVosRUFBeUNSLE1BQXpDO0FBQ0EsTUFBTWUsZ0JBQWdCLDhCQUFtQmYsTUFBbkIsQ0FBdEI7QUFDQSxNQUFNZ0Isa0JBQWtCLGdDQUFxQmhCLE1BQXJCLENBQXhCOztBQUVBLFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBRyx1QkFBUjtBQUNFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FERjtBQUVFLDZDQUZGO0FBR0U7QUFBQTtBQUFBO0FBQ0dlO0FBREgsS0FIRjtBQU1FLDZDQU5GO0FBT0UsNkNBUEY7QUFRRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBUkY7QUFTRSw2Q0FURjtBQVVFO0FBQUE7QUFBQTtBQUNHQztBQURIO0FBVkYsR0FERjtBQWdCRCxDQXRCRDs7a0JBd0JlLHlCQUFRakIsZUFBUixFQUF5QixJQUF6QixFQUErQmUsbUJBQS9CLEMiLCJmaWxlIjoibWFpbi41NTkyODJlNGQwNmY0ZjQyMjNmYy5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgYnVpbGRDbGllbnRRdWVyaWVzIGZyb20gJy4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2NsaWVudF9xdWVyaWVzJztcbmltcG9ydCBidWlsZENsaWVudE11dGF0aW9ucyBmcm9tICcuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9jbGllbnRfbXV0YXRpb25zJztcblxuLy8gc3R5bGluZ1xuaW1wb3J0ICcuLi9jb2RlLmNzcyc7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IHN0b3JlID0+ICh7XG4gIHRhYmxlczogc3RvcmUuc2NoZW1hLnRhYmxlcyxcbiAgZGF0YWJhc2VzOiBzdG9yZS5tdWx0aVNjaGVtYS5kYXRhYmFzZXNcbn0pO1xuXG5jb25zdCBjcmVhdGVDb21iaW5lZFRhYmxlcyA9IChkYXRhYmFzZXMpID0+IHtcbiAgbGV0IG51bSA9IDA7XG4gIGNvbnNvbGUubG9nKCdkYXRhYmFzZXM6JywgZGF0YWJhc2VzKVxuICBjb25zdCB0YWJsZXNDb21iaW5lZCA9IHt9XG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXMpIHtcbiAgICAgIGNvbnN0IGRhdGFiYXNlID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdO1xuICAgICAgZm9yIChjb25zdCBpbmRleCBpbiBkYXRhYmFzZS5kYXRhKSB7XG4gICAgICAgIHRhYmxlc0NvbWJpbmVkW251bV0gPSBkYXRhYmFzZS5kYXRhW2luZGV4XVxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhYmFzZS5kYXRhW2luZGV4XSlcbiAgICAgICAgbnVtKys7XG4gICAgIH1cblxuICB9XG4gIHJldHVybiB0YWJsZXNDb21iaW5lZDtcbn1cblxuXG5jb25zdCBDb2RlQ2xpZW50Q29udGFpbmVyID0gKHsgZGF0YWJhc2VzIH0pID0+IHtcbiAgY29uc3QgdGFibGVzID0gY3JlYXRlQ29tYmluZWRUYWJsZXMoZGF0YWJhc2VzKTtcbiAgY29uc29sZS5sb2coJ3RhYmxlcyBpbiBjbGllbnQtY29kZS5qc3gnLCB0YWJsZXMpXG4gIGNvbnN0IGNsaWVudFF1ZXJpZXMgPSBidWlsZENsaWVudFF1ZXJpZXModGFibGVzKTtcbiAgY29uc3QgY2xpZW50TXV0YXRpb25zID0gYnVpbGRDbGllbnRNdXRhdGlvbnModGFibGVzKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1jbGllbnRcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IFF1ZXJpZXM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPlxuICAgICAgICB7Y2xpZW50UXVlcmllc31cbiAgICAgIDwvcHJlPlxuICAgICAgPGJyIC8+XG4gICAgICA8YnIgLz5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtjbGllbnRNdXRhdGlvbnN9XG4gICAgICA8L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlQ2xpZW50Q29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=