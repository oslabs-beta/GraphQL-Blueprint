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

var num = 0;
var tablesCombined = {};
for (var databaseIndex in databases) {
  var database = databases;
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL2NsaWVudC1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJ0YWJsZXMiLCJzdG9yZSIsInNjaGVtYSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwibnVtIiwidGFibGVzQ29tYmluZWQiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2UiLCJDb2RlQ2xpZW50Q29udGFpbmVyIiwiY29uc29sZSIsImxvZyIsImNsaWVudFF1ZXJpZXMiLCJjbGllbnRNdXRhdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUVBLElBQU1BLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxTQUFVO0FBQ2hDQyxZQUFRQyxNQUFNQyxNQUFOLENBQWFGLE1BRFc7QUFFaENHLGVBQVdGLE1BQU1HLFdBQU4sQ0FBa0JEO0FBRkcsR0FBVjtBQUFBLENBQXhCOztBQUhBOztBQU9BLElBQUlFLE1BQU0sQ0FBVjtBQUNBLElBQU1DLGlCQUFpQixFQUF2QjtBQUNBLEtBQUssSUFBTUMsYUFBWCxJQUE0QkosU0FBNUIsRUFBdUM7QUFDckMsTUFBTUssV0FBV0wsU0FBakI7QUFDRDtBQUNELElBQU1NLHNCQUFzQixTQUF0QkEsbUJBQXNCLE9BQWdCO0FBQUEsTUFBYlQsTUFBYSxRQUFiQSxNQUFhOztBQUMxQ1UsVUFBUUMsR0FBUixDQUFZLDJCQUFaLEVBQXlDWCxNQUF6QztBQUNBLE1BQU1ZLGdCQUFnQiw4QkFBbUJaLE1BQW5CLENBQXRCO0FBQ0EsTUFBTWEsa0JBQWtCLGdDQUFxQmIsTUFBckIsQ0FBeEI7O0FBRUEsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFDR1k7QUFESCxLQUhGO0FBTUUsNkNBTkY7QUFPRSw2Q0FQRjtBQVFFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FSRjtBQVNFLDZDQVRGO0FBVUU7QUFBQTtBQUFBO0FBQ0dDO0FBREg7QUFWRixHQURGO0FBZ0JELENBckJEOztrQkF1QmUseUJBQVFkLGVBQVIsRUFBeUIsSUFBekIsRUFBK0JVLG1CQUEvQixDIiwiZmlsZSI6Im1haW4uNWZjZDhjYmRhOGNkMzkzNzllMGMuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IGJ1aWxkQ2xpZW50UXVlcmllcyBmcm9tICcuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9jbGllbnRfcXVlcmllcyc7XG5pbXBvcnQgYnVpbGRDbGllbnRNdXRhdGlvbnMgZnJvbSAnLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X211dGF0aW9ucyc7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCAnLi4vY29kZS5jc3MnO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBzdG9yZSA9PiAoe1xuICB0YWJsZXM6IHN0b3JlLnNjaGVtYS50YWJsZXMsXG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzXG59KTtcbmxldCBudW0gPSAwO1xuY29uc3QgdGFibGVzQ29tYmluZWQgPSB7fVxuZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlcykge1xuICBjb25zdCBkYXRhYmFzZSA9IGRhdGFiYXNlc1xufVxuY29uc3QgQ29kZUNsaWVudENvbnRhaW5lciA9ICh7IHRhYmxlcyB9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCd0YWJsZXMgaW4gY2xpZW50LWNvZGUuanN4JywgdGFibGVzKVxuICBjb25zdCBjbGllbnRRdWVyaWVzID0gYnVpbGRDbGllbnRRdWVyaWVzKHRhYmxlcyk7XG4gIGNvbnN0IGNsaWVudE11dGF0aW9ucyA9IGJ1aWxkQ2xpZW50TXV0YXRpb25zKHRhYmxlcyk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItY2xpZW50XCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkNsaWVudCBRdWVyaWVzPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT5cbiAgICAgICAge2NsaWVudFF1ZXJpZXN9XG4gICAgICA8L3ByZT5cbiAgICAgIDxiciAvPlxuICAgICAgPGJyIC8+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkNsaWVudCBNdXRhdGlvbnM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPlxuICAgICAgICB7Y2xpZW50TXV0YXRpb25zfVxuICAgICAgPC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZUNsaWVudENvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9