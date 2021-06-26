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

var CodeClientContainer = function CodeClientContainer(_ref) {
  var tables = _ref.tables;

  console.log('tables in client-code.jsx', tables);
  console.log(createCombinedTables(databases));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL2NsaWVudC1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJ0YWJsZXMiLCJzdG9yZSIsInNjaGVtYSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY3JlYXRlQ29tYmluZWRUYWJsZXMiLCJudW0iLCJ0YWJsZXNDb21iaW5lZCIsImRhdGFiYXNlSW5kZXgiLCJkYXRhYmFzZSIsImluZGV4IiwiZGF0YSIsIkNvZGVDbGllbnRDb250YWluZXIiLCJjb25zb2xlIiwibG9nIiwiY2xpZW50UXVlcmllcyIsImNsaWVudE11dGF0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLFNBQVU7QUFDaENDLFlBQVFDLE1BQU1DLE1BQU4sQ0FBYUYsTUFEVztBQUVoQ0csZUFBV0YsTUFBTUcsV0FBTixDQUFrQkQ7QUFGRyxHQUFWO0FBQUEsQ0FBeEI7O0FBSEE7OztBQVFBLElBQU1FLHVCQUF1QixTQUF2QkEsb0JBQXVCLENBQUNGLFNBQUQsRUFBZTtBQUMxQyxNQUFJRyxNQUFNLENBQVY7QUFDQSxNQUFNQyxpQkFBaUIsRUFBdkI7QUFDQSxPQUFLLElBQU1DLGFBQVgsSUFBNEJMLFNBQTVCLEVBQXVDO0FBQ25DLFFBQU1NLFdBQVdOLFVBQVVLLGFBQVYsQ0FBakI7QUFDQSxTQUFLLElBQU1FLEtBQVgsSUFBb0JELFNBQVNFLElBQTdCLEVBQW1DO0FBQ25DSixxQkFBZUQsR0FBZixJQUFzQkcsU0FBU0UsSUFBVCxDQUFjRCxLQUFkLENBQXRCO0FBQ0FKO0FBQ0Q7QUFDRjtBQUNELFNBQU9DLGNBQVA7QUFDRCxDQVhEOztBQWNBLElBQU1LLHNCQUFzQixTQUF0QkEsbUJBQXNCLE9BQWdCO0FBQUEsTUFBYlosTUFBYSxRQUFiQSxNQUFhOztBQUMxQ2EsVUFBUUMsR0FBUixDQUFZLDJCQUFaLEVBQXlDZCxNQUF6QztBQUNBYSxVQUFRQyxHQUFSLENBQVlULHFCQUFxQkYsU0FBckIsQ0FBWjtBQUNBLE1BQU1ZLGdCQUFnQiw4QkFBbUJmLE1BQW5CLENBQXRCO0FBQ0EsTUFBTWdCLGtCQUFrQixnQ0FBcUJoQixNQUFyQixDQUF4Qjs7QUFFQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUNHZTtBQURILEtBSEY7QUFNRSw2Q0FORjtBQU9FLDZDQVBGO0FBUUU7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQVJGO0FBU0UsNkNBVEY7QUFVRTtBQUFBO0FBQUE7QUFDR0M7QUFESDtBQVZGLEdBREY7QUFnQkQsQ0F0QkQ7O2tCQXdCZSx5QkFBUWpCLGVBQVIsRUFBeUIsSUFBekIsRUFBK0JhLG1CQUEvQixDIiwiZmlsZSI6Im1haW4uMzgzM2UwZjk5ZWNiOTUwY2ZkMTMuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IGJ1aWxkQ2xpZW50UXVlcmllcyBmcm9tICcuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9jbGllbnRfcXVlcmllcyc7XG5pbXBvcnQgYnVpbGRDbGllbnRNdXRhdGlvbnMgZnJvbSAnLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X211dGF0aW9ucyc7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCAnLi4vY29kZS5jc3MnO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBzdG9yZSA9PiAoe1xuICB0YWJsZXM6IHN0b3JlLnNjaGVtYS50YWJsZXMsXG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzXG59KTtcblxuY29uc3QgY3JlYXRlQ29tYmluZWRUYWJsZXMgPSAoZGF0YWJhc2VzKSA9PiB7XG4gIGxldCBudW0gPSAwO1xuICBjb25zdCB0YWJsZXNDb21iaW5lZCA9IHt9XG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXMpIHtcbiAgICAgIGNvbnN0IGRhdGFiYXNlID0gZGF0YWJhc2VzW2RhdGFiYXNlSW5kZXhdO1xuICAgICAgZm9yIChjb25zdCBpbmRleCBpbiBkYXRhYmFzZS5kYXRhKSB7XG4gICAgICB0YWJsZXNDb21iaW5lZFtudW1dID0gZGF0YWJhc2UuZGF0YVtpbmRleF1cbiAgICAgIG51bSsrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFibGVzQ29tYmluZWQ7XG59XG5cblxuY29uc3QgQ29kZUNsaWVudENvbnRhaW5lciA9ICh7IHRhYmxlcyB9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCd0YWJsZXMgaW4gY2xpZW50LWNvZGUuanN4JywgdGFibGVzKVxuICBjb25zb2xlLmxvZyhjcmVhdGVDb21iaW5lZFRhYmxlcyhkYXRhYmFzZXMpKTtcbiAgY29uc3QgY2xpZW50UXVlcmllcyA9IGJ1aWxkQ2xpZW50UXVlcmllcyh0YWJsZXMpO1xuICBjb25zdCBjbGllbnRNdXRhdGlvbnMgPSBidWlsZENsaWVudE11dGF0aW9ucyh0YWJsZXMpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cImNvZGUtY29udGFpbmVyLWNsaWVudFwiPlxuICAgICAgPGg0IGNsYXNzTmFtZT1cImNvZGVIZWFkZXJcIj5DbGllbnQgUXVlcmllczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtjbGllbnRRdWVyaWVzfVxuICAgICAgPC9wcmU+XG4gICAgICA8YnIgLz5cbiAgICAgIDxiciAvPlxuICAgICAgPGg0IGNsYXNzTmFtZT1cImNvZGVIZWFkZXJcIj5DbGllbnQgTXV0YXRpb25zPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT5cbiAgICAgICAge2NsaWVudE11dGF0aW9uc31cbiAgICAgIDwvcHJlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG51bGwpKENvZGVDbGllbnRDb250YWluZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==