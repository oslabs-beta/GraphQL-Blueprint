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
  var database = databases[databaseIndex];
  for (var index in database.data) {
    tablesCombined[num] = database.data[index];
    num++;
  }
}
console.log(tablesCombined);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL2NsaWVudC1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJ0YWJsZXMiLCJzdG9yZSIsInNjaGVtYSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwibnVtIiwidGFibGVzQ29tYmluZWQiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2UiLCJpbmRleCIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwiQ29kZUNsaWVudENvbnRhaW5lciIsImNsaWVudFF1ZXJpZXMiLCJjbGllbnRNdXRhdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUVBLElBQU1BLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxTQUFVO0FBQ2hDQyxZQUFRQyxNQUFNQyxNQUFOLENBQWFGLE1BRFc7QUFFaENHLGVBQVdGLE1BQU1HLFdBQU4sQ0FBa0JEO0FBRkcsR0FBVjtBQUFBLENBQXhCOztBQUhBOztBQU9BLElBQUlFLE1BQU0sQ0FBVjtBQUNBLElBQU1DLGlCQUFpQixFQUF2QjtBQUNBLEtBQUssSUFBTUMsYUFBWCxJQUE0QkosU0FBNUIsRUFBdUM7QUFDckMsTUFBTUssV0FBV0wsVUFBVUksYUFBVixDQUFqQjtBQUNBLE9BQUssSUFBTUUsS0FBWCxJQUFvQkQsU0FBU0UsSUFBN0IsRUFBbUM7QUFDakNKLG1CQUFlRCxHQUFmLElBQXNCRyxTQUFTRSxJQUFULENBQWNELEtBQWQsQ0FBdEI7QUFDQUo7QUFDRDtBQUNGO0FBQ0RNLFFBQVFDLEdBQVIsQ0FBWU4sY0FBWjtBQUNBLElBQU1PLHNCQUFzQixTQUF0QkEsbUJBQXNCLE9BQWdCO0FBQUEsTUFBYmIsTUFBYSxRQUFiQSxNQUFhOztBQUMxQ1csVUFBUUMsR0FBUixDQUFZLDJCQUFaLEVBQXlDWixNQUF6QztBQUNBLE1BQU1jLGdCQUFnQiw4QkFBbUJkLE1BQW5CLENBQXRCO0FBQ0EsTUFBTWUsa0JBQWtCLGdDQUFxQmYsTUFBckIsQ0FBeEI7O0FBRUEsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFDR2M7QUFESCxLQUhGO0FBTUUsNkNBTkY7QUFPRSw2Q0FQRjtBQVFFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FSRjtBQVNFLDZDQVRGO0FBVUU7QUFBQTtBQUFBO0FBQ0dDO0FBREg7QUFWRixHQURGO0FBZ0JELENBckJEOztrQkF1QmUseUJBQVFoQixlQUFSLEVBQXlCLElBQXpCLEVBQStCYyxtQkFBL0IsQyIsImZpbGUiOiJtYWluLjBjMjIxMjIyYjllNTMxNmQyMDhjLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBidWlsZENsaWVudFF1ZXJpZXMgZnJvbSAnLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X3F1ZXJpZXMnO1xuaW1wb3J0IGJ1aWxkQ2xpZW50TXV0YXRpb25zIGZyb20gJy4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2NsaWVudF9tdXRhdGlvbnMnO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgJy4uL2NvZGUuY3NzJztcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gc3RvcmUgPT4gKHtcbiAgdGFibGVzOiBzdG9yZS5zY2hlbWEudGFibGVzLFxuICBkYXRhYmFzZXM6IHN0b3JlLm11bHRpU2NoZW1hLmRhdGFiYXNlc1xufSk7XG5sZXQgbnVtID0gMDtcbmNvbnN0IHRhYmxlc0NvbWJpbmVkID0ge31cbmZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXMpIHtcbiAgY29uc3QgZGF0YWJhc2UgPSBkYXRhYmFzZXNbZGF0YWJhc2VJbmRleF07XG4gIGZvciAoY29uc3QgaW5kZXggaW4gZGF0YWJhc2UuZGF0YSkge1xuICAgIHRhYmxlc0NvbWJpbmVkW251bV0gPSBkYXRhYmFzZS5kYXRhW2luZGV4XVxuICAgIG51bSsrO1xuICB9XG59XG5jb25zb2xlLmxvZyh0YWJsZXNDb21iaW5lZClcbmNvbnN0IENvZGVDbGllbnRDb250YWluZXIgPSAoeyB0YWJsZXMgfSkgPT4ge1xuICBjb25zb2xlLmxvZygndGFibGVzIGluIGNsaWVudC1jb2RlLmpzeCcsIHRhYmxlcylcbiAgY29uc3QgY2xpZW50UXVlcmllcyA9IGJ1aWxkQ2xpZW50UXVlcmllcyh0YWJsZXMpO1xuICBjb25zdCBjbGllbnRNdXRhdGlvbnMgPSBidWlsZENsaWVudE11dGF0aW9ucyh0YWJsZXMpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cImNvZGUtY29udGFpbmVyLWNsaWVudFwiPlxuICAgICAgPGg0IGNsYXNzTmFtZT1cImNvZGVIZWFkZXJcIj5DbGllbnQgUXVlcmllczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtjbGllbnRRdWVyaWVzfVxuICAgICAgPC9wcmU+XG4gICAgICA8YnIgLz5cbiAgICAgIDxiciAvPlxuICAgICAgPGg0IGNsYXNzTmFtZT1cImNvZGVIZWFkZXJcIj5DbGllbnQgTXV0YXRpb25zPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT5cbiAgICAgICAge2NsaWVudE11dGF0aW9uc31cbiAgICAgIDwvcHJlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG51bGwpKENvZGVDbGllbnRDb250YWluZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==