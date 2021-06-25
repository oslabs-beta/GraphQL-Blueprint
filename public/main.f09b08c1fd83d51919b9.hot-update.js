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


var createDatabaseCopy = function createDatabaseCopy(obj) {
  var databasesCopy = JSON.parse(JSON.stringify(obj));
  for (var key in obj) {
    obj[key].data;
    if (old_key !== new_key) {
      Object.defineProperty(o, new_key, Object.getOwnPropertyDescriptor(o, old_key));
      delete o[old_key];
    }
  }
};

var CodeServerContainer = function CodeServerContainer(_ref) {
  var databases = _ref.databases;

  console.log('databases in CodeServerContainer', databases);
  var serverCode = (0, _graphql_server2.default)(databases);
  console.log('serverCode:', serverCode);
  console.log('buildServerCode:', _graphql_server2.default);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY3JlYXRlRGF0YWJhc2VDb3B5Iiwib2JqIiwiZGF0YWJhc2VzQ29weSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImtleSIsImRhdGEiLCJvbGRfa2V5IiwibmV3X2tleSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwibyIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIkNvZGVTZXJ2ZXJDb250YWluZXIiLCJjb25zb2xlIiwibG9nIiwic2VydmVyQ29kZSIsImJ1aWxkU2VydmVyQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFHQTs7OztBQUVBLElBQU1BLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ0MsS0FBRDtBQUFBLFNBQVk7QUFDbENDLGVBQVdELE1BQU1FLFdBQU4sQ0FBa0JEO0FBREssR0FBWjtBQUFBLENBQXhCOztBQUhBOzs7QUFPQSxJQUFNRSxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFDQyxHQUFELEVBQVM7QUFDbEMsTUFBTUMsZ0JBQWdCQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZUosR0FBZixDQUFYLENBQXRCO0FBQ0EsT0FBSyxJQUFNSyxHQUFYLElBQWtCTCxHQUFsQixFQUF1QjtBQUNyQkEsUUFBSUssR0FBSixFQUFTQyxJQUFUO0FBQ0EsUUFBSUMsWUFBWUMsT0FBaEIsRUFBeUI7QUFDdkJDLGFBQU9DLGNBQVAsQ0FBc0JDLENBQXRCLEVBQXlCSCxPQUF6QixFQUNJQyxPQUFPRyx3QkFBUCxDQUFnQ0QsQ0FBaEMsRUFBbUNKLE9BQW5DLENBREo7QUFFQSxhQUFPSSxFQUFFSixPQUFGLENBQVA7QUFDSDtBQUVGO0FBQ0EsQ0FYRDs7QUFhQSxJQUFNTSxzQkFBc0IsU0FBdEJBLG1CQUFzQixPQUFpQjtBQUFBLE1BQWZoQixTQUFlLFFBQWZBLFNBQWU7O0FBQzNDaUIsVUFBUUMsR0FBUixDQUFZLGtDQUFaLEVBQWdEbEIsU0FBaEQ7QUFDQSxNQUFNbUIsYUFBYSw4QkFBZ0JuQixTQUFoQixDQUFuQjtBQUNBaUIsVUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJDLFVBQTNCO0FBQ0FGLFVBQVFDLEdBQVIsQ0FBWSxrQkFBWixFQUFnQ0Usd0JBQWhDO0FBQ0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFBTUQ7QUFBTjtBQUhGLEdBREY7QUFPRCxDQVpEOztrQkFjZSx5QkFBUXJCLGVBQVIsRUFBeUIsSUFBekIsRUFBK0JrQixtQkFBL0IsQyIsImZpbGUiOiJtYWluLmYwOWIwOGMxZmQ4M2Q1MTkxOWI5LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9ncmFwaHFsX3NlcnZlclwiO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgXCIuLi9jb2RlLmNzc1wiO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RvcmUpID0+ICh7XG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzLFxufSk7XG5cbmNvbnN0IGNyZWF0ZURhdGFiYXNlQ29weSA9IChvYmopID0+IHtcbiAgY29uc3QgZGF0YWJhc2VzQ29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgIG9ialtrZXldLmRhdGFcbiAgICBpZiAob2xkX2tleSAhPT0gbmV3X2tleSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIG5ld19rZXksXG4gICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBvbGRfa2V5KSk7XG4gICAgICBkZWxldGUgb1tvbGRfa2V5XTtcbiAgfVxuICBcbn1cbn1cblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7ZGF0YWJhc2VzfSkgPT4ge1xuICBjb25zb2xlLmxvZygnZGF0YWJhc2VzIGluIENvZGVTZXJ2ZXJDb250YWluZXInLCBkYXRhYmFzZXMpO1xuICBjb25zdCBzZXJ2ZXJDb2RlID0gYnVpbGRTZXJ2ZXJDb2RlKGRhdGFiYXNlcyk7XG4gIGNvbnNvbGUubG9nKCdzZXJ2ZXJDb2RlOicsIHNlcnZlckNvZGUpO1xuICBjb25zb2xlLmxvZygnYnVpbGRTZXJ2ZXJDb2RlOicsIGJ1aWxkU2VydmVyQ29kZSlcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItc2VydmVyXCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkdyYXBoUWwgVHlwZXMsIFJvb3QgUXVlcmllcywgYW5kIE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+e3NlcnZlckNvZGV9PC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZVNlcnZlckNvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9