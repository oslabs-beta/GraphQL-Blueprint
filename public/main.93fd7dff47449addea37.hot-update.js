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
    for (var index in database.tables) {
      tablesCombined[num] = database.tables[index];
      console.log(database.tables[index]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL2NsaWVudC1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJ0YWJsZXMiLCJzdG9yZSIsInNjaGVtYSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY3JlYXRlQ29tYmluZWRUYWJsZXMiLCJudW0iLCJjb25zb2xlIiwibG9nIiwidGFibGVzQ29tYmluZWQiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2UiLCJpbmRleCIsIkNvZGVDbGllbnRDb250YWluZXIiLCJjbGllbnRRdWVyaWVzIiwiY2xpZW50TXV0YXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsU0FBVTtBQUNoQ0MsWUFBUUMsTUFBTUMsTUFBTixDQUFhRixNQURXO0FBRWhDRyxlQUFXRixNQUFNRyxXQUFOLENBQWtCRDtBQUZHLEdBQVY7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBUUEsSUFBTUUsdUJBQXVCLFNBQXZCQSxvQkFBdUIsQ0FBQ0YsU0FBRCxFQUFlO0FBQzFDLE1BQUlHLE1BQU0sQ0FBVjtBQUNBQyxVQUFRQyxHQUFSLENBQVksWUFBWixFQUEwQkwsU0FBMUI7QUFDQSxNQUFNTSxpQkFBaUIsRUFBdkI7QUFDQSxPQUFLLElBQU1DLGFBQVgsSUFBNEJQLFNBQTVCLEVBQXVDO0FBQ25DLFFBQU1RLFdBQVdSLFVBQVVPLGFBQVYsQ0FBakI7QUFDQSxTQUFLLElBQU1FLEtBQVgsSUFBb0JELFNBQVNYLE1BQTdCLEVBQXFDO0FBQ25DUyxxQkFBZUgsR0FBZixJQUFzQkssU0FBU1gsTUFBVCxDQUFnQlksS0FBaEIsQ0FBdEI7QUFDQUwsY0FBUUMsR0FBUixDQUFZRyxTQUFTWCxNQUFULENBQWdCWSxLQUFoQixDQUFaO0FBQ0FOO0FBQ0Y7QUFFSDtBQUNELFNBQU9HLGNBQVA7QUFDRCxDQWREOztBQWlCQSxJQUFNSSxzQkFBc0IsU0FBdEJBLG1CQUFzQixPQUFtQjtBQUFBLE1BQWhCVixTQUFnQixRQUFoQkEsU0FBZ0I7O0FBQzdDLE1BQU1ILFNBQVNLLHFCQUFxQkYsU0FBckIsQ0FBZjtBQUNBSSxVQUFRQyxHQUFSLENBQVksMkJBQVosRUFBeUNSLE1BQXpDO0FBQ0EsTUFBTWMsZ0JBQWdCLDhCQUFtQmQsTUFBbkIsQ0FBdEI7QUFDQSxNQUFNZSxrQkFBa0IsZ0NBQXFCZixNQUFyQixDQUF4Qjs7QUFFQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUNHYztBQURILEtBSEY7QUFNRSw2Q0FORjtBQU9FLDZDQVBGO0FBUUU7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQVJGO0FBU0UsNkNBVEY7QUFVRTtBQUFBO0FBQUE7QUFDR0M7QUFESDtBQVZGLEdBREY7QUFnQkQsQ0F0QkQ7O2tCQXdCZSx5QkFBUWhCLGVBQVIsRUFBeUIsSUFBekIsRUFBK0JjLG1CQUEvQixDIiwiZmlsZSI6Im1haW4uOTNmZDdkZmY0NzQ0OWFkZGVhMzcuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IGJ1aWxkQ2xpZW50UXVlcmllcyBmcm9tICcuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9jbGllbnRfcXVlcmllcyc7XG5pbXBvcnQgYnVpbGRDbGllbnRNdXRhdGlvbnMgZnJvbSAnLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X211dGF0aW9ucyc7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCAnLi4vY29kZS5jc3MnO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBzdG9yZSA9PiAoe1xuICB0YWJsZXM6IHN0b3JlLnNjaGVtYS50YWJsZXMsXG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzXG59KTtcblxuY29uc3QgY3JlYXRlQ29tYmluZWRUYWJsZXMgPSAoZGF0YWJhc2VzKSA9PiB7XG4gIGxldCBudW0gPSAwO1xuICBjb25zb2xlLmxvZygnZGF0YWJhc2VzOicsIGRhdGFiYXNlcylcbiAgY29uc3QgdGFibGVzQ29tYmluZWQgPSB7fVxuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzKSB7XG4gICAgICBjb25zdCBkYXRhYmFzZSA9IGRhdGFiYXNlc1tkYXRhYmFzZUluZGV4XTtcbiAgICAgIGZvciAoY29uc3QgaW5kZXggaW4gZGF0YWJhc2UudGFibGVzKSB7XG4gICAgICAgIHRhYmxlc0NvbWJpbmVkW251bV0gPSBkYXRhYmFzZS50YWJsZXNbaW5kZXhdXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGFiYXNlLnRhYmxlc1tpbmRleF0pXG4gICAgICAgIG51bSsrO1xuICAgICB9XG5cbiAgfVxuICByZXR1cm4gdGFibGVzQ29tYmluZWQ7XG59XG5cblxuY29uc3QgQ29kZUNsaWVudENvbnRhaW5lciA9ICh7IGRhdGFiYXNlcyB9KSA9PiB7XG4gIGNvbnN0IHRhYmxlcyA9IGNyZWF0ZUNvbWJpbmVkVGFibGVzKGRhdGFiYXNlcyk7XG4gIGNvbnNvbGUubG9nKCd0YWJsZXMgaW4gY2xpZW50LWNvZGUuanN4JywgdGFibGVzKVxuICBjb25zdCBjbGllbnRRdWVyaWVzID0gYnVpbGRDbGllbnRRdWVyaWVzKHRhYmxlcyk7XG4gIGNvbnN0IGNsaWVudE11dGF0aW9ucyA9IGJ1aWxkQ2xpZW50TXV0YXRpb25zKHRhYmxlcyk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItY2xpZW50XCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkNsaWVudCBRdWVyaWVzPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT5cbiAgICAgICAge2NsaWVudFF1ZXJpZXN9XG4gICAgICA8L3ByZT5cbiAgICAgIDxiciAvPlxuICAgICAgPGJyIC8+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkNsaWVudCBNdXRhdGlvbnM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPlxuICAgICAgICB7Y2xpZW50TXV0YXRpb25zfVxuICAgICAgPC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZUNsaWVudENvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9