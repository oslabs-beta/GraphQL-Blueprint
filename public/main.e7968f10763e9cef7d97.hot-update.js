webpackHotUpdate("main",{

/***/ "./components/code/code-containers/server-code.jsx":
/*!*********************************************************!*\
  !*** ./components/code/code-containers/server-code.jsx ***!
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

var _graphql_server = __webpack_require__(/*! ../../../../utl/create_file_func/graphql_server */ "../utl/create_file_func/graphql_server.js");

var _graphql_server2 = _interopRequireDefault(_graphql_server);

__webpack_require__(/*! ../code.css */ "./components/code/code.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(store) {
  return {
    databases: store.multiSchema.databases
  };
};

// styling


var convertTablesToData = function convertTablesToData(obj) {
  var databasesCopy = JSON.parse(JSON.stringify(obj));
  for (var databaseIndex in databasesCopy) {
    databasesCopy[databaseIndex].data = databasesCopy[databaseIndex].tables;
    databasesCopy[databaseIndex].databaseName = databasesCopy[database];
  }
  return databasesCopy;
};

var CodeServerContainer = function CodeServerContainer(_ref) {
  var databases = _ref.databases;

  console.log('databases in CodeServerContainer: ', databases);
  var databasesCopy = convertTablesToData(databases);
  var serverCode = (0, _graphql_server2.default)(databasesCopy);
  return _react2.default.createElement(
    "div",
    { id: "code-container-server" },
    _react2.default.createElement(
      "h4",
      { className: "codeHeader" },
      "GraphQl Types, Root Queries, and Mutations"
    ),
    _react2.default.createElement("hr", null),
    _react2.default.createElement(
      "pre",
      null,
      serverCode
    )
  );
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, null)(CodeServerContainer);

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY29udmVydFRhYmxlc1RvRGF0YSIsIm9iaiIsImRhdGFiYXNlc0NvcHkiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YSIsInRhYmxlcyIsImRhdGFiYXNlTmFtZSIsImRhdGFiYXNlIiwiQ29kZVNlcnZlckNvbnRhaW5lciIsImNvbnNvbGUiLCJsb2ciLCJzZXJ2ZXJDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUdBOzs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxLQUFEO0FBQUEsU0FBWTtBQUNsQ0MsZUFBV0QsTUFBTUUsV0FBTixDQUFrQkQ7QUFESyxHQUFaO0FBQUEsQ0FBeEI7O0FBSEE7OztBQU9BLElBQU1FLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQUNDLEdBQUQsRUFBUztBQUNuQyxNQUFNQyxnQkFBZ0JDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsU0FBTCxDQUFlSixHQUFmLENBQVgsQ0FBdEI7QUFDQSxPQUFLLElBQU1LLGFBQVgsSUFBNEJKLGFBQTVCLEVBQTJDO0FBQ3pDQSxrQkFBY0ksYUFBZCxFQUE2QkMsSUFBN0IsR0FBb0NMLGNBQWNJLGFBQWQsRUFBNkJFLE1BQWpFO0FBQ0FOLGtCQUFjSSxhQUFkLEVBQTZCRyxZQUE3QixHQUE0Q1AsY0FBY1EsUUFBZCxDQUE1QztBQUNEO0FBQ0QsU0FBT1IsYUFBUDtBQUNELENBUEQ7O0FBVUEsSUFBTVMsc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBaUI7QUFBQSxNQUFmYixTQUFlLFFBQWZBLFNBQWU7O0FBQzNDYyxVQUFRQyxHQUFSLENBQVksb0NBQVosRUFBa0RmLFNBQWxEO0FBQ0EsTUFBTUksZ0JBQWdCRixvQkFBb0JGLFNBQXBCLENBQXRCO0FBQ0EsTUFBTWdCLGFBQWEsOEJBQWdCWixhQUFoQixDQUFuQjtBQUNBLFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBRyx1QkFBUjtBQUNFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FERjtBQUVFLDZDQUZGO0FBR0U7QUFBQTtBQUFBO0FBQU1ZO0FBQU47QUFIRixHQURGO0FBT0QsQ0FYRDs7a0JBYWUseUJBQVFsQixlQUFSLEVBQXlCLElBQXpCLEVBQStCZSxtQkFBL0IsQyIsImZpbGUiOiJtYWluLmU3OTY4ZjEwNzYzZTljZWY3ZDk3LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9ncmFwaHFsX3NlcnZlclwiO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgXCIuLi9jb2RlLmNzc1wiO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RvcmUpID0+ICh7XG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzLFxufSk7XG5cbmNvbnN0IGNvbnZlcnRUYWJsZXNUb0RhdGEgPSAob2JqKSA9PiB7XG4gIGNvbnN0IGRhdGFiYXNlc0NvcHkgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpXG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXNDb3B5KSB7XG4gICAgZGF0YWJhc2VzQ29weVtkYXRhYmFzZUluZGV4XS5kYXRhID0gZGF0YWJhc2VzQ29weVtkYXRhYmFzZUluZGV4XS50YWJsZXM7XG4gICAgZGF0YWJhc2VzQ29weVtkYXRhYmFzZUluZGV4XS5kYXRhYmFzZU5hbWUgPSBkYXRhYmFzZXNDb3B5W2RhdGFiYXNlXVxuICB9XG4gIHJldHVybiBkYXRhYmFzZXNDb3B5XG59XG5cblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7ZGF0YWJhc2VzfSkgPT4ge1xuICBjb25zb2xlLmxvZygnZGF0YWJhc2VzIGluIENvZGVTZXJ2ZXJDb250YWluZXI6ICcsIGRhdGFiYXNlcylcbiAgY29uc3QgZGF0YWJhc2VzQ29weSA9IGNvbnZlcnRUYWJsZXNUb0RhdGEoZGF0YWJhc2VzKTtcbiAgY29uc3Qgc2VydmVyQ29kZSA9IGJ1aWxkU2VydmVyQ29kZShkYXRhYmFzZXNDb3B5KTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItc2VydmVyXCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkdyYXBoUWwgVHlwZXMsIFJvb3QgUXVlcmllcywgYW5kIE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+e3NlcnZlckNvZGV9PC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZVNlcnZlckNvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9